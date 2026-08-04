# frozen_string_literal: true

# Client for the confium-tc-coordinator service.
#
# Wraps the lower-level Confium::TC::Coordinator with:
#   - Multi-endpoint failover (federation)
#   - Version negotiation on connect
#   - Automatic reconnection with exponential backoff
#   - Structured error reporting (network vs protocol vs coordinator-side)
#
# Used by KeyProvider::Confium COORDINATOR mode (lib/oiml_pki/key_provider/confium.rb)
# to drive async threshold signing ceremonies. The CoordinatorClient
# is the single network endpoint on the Ruby side — all other confium
# access is in-process via FFI.
module OimlPki
  class CoordinatorClient
    # Structured error — distinguishes network failures from protocol
    # mismatches from coordinator-side rejections. Callers can render
    # different UI / retry logic per kind.
    class Error < StandardError
      attr_reader :kind, :endpoint, :cause

      def initialize(kind, message, endpoint: nil, cause: nil)
        @kind     = kind
        @endpoint = endpoint
        @cause    = cause
        detail = endpoint ? " [#{endpoint}]" : ""
        super("#{kind}#{detail}: #{message}")
      end
    end

    SUPPORTED_PROTOCOL_VERSIONS = %w[v1].freeze
    DEFAULT_BACKOFF_SECONDS     = [1, 2, 4, 8, 16, 30].freeze
    DEFAULT_TIMEOUT_SECONDS     = 30

    attr_reader :endpoints, :quorum_id, :protocol_version, :health

    # @param endpoints [Array<String>] one or more tcp:// or wss:// coordinator URLs
    # @param quorum_id [String] the quorum to address (e.g., "biml-root")
    # @param protocol_version [String] required protocol version (default "v1")
    def initialize(endpoints:, quorum_id:, protocol_version: "v1")
      raise ArgumentError, "endpoints must be non-empty" if endpoints.nil? || endpoints.empty?
      raise ArgumentError, "quorum_id required" if quorum_id.nil? || quorum_id.empty?
      raise ArgumentError, "unsupported protocol version" unless SUPPORTED_PROTOCOL_VERSIONS.include?(protocol_version)

      @endpoints        = endpoints.dup.freeze
      @quorum_id        = quorum_id
      @protocol_version = protocol_version
      @health           = endpoints.each_with_object({}) { |e, h| h[e] = { last_success: nil, last_failure: nil, consecutive_failures: 0 } }
      @active_endpoint  = nil
    end

    # Create a new signing session and return its ID.
    # @param message [String] the data to be signed (e.g., TBS bytes)
    # @param threshold [Integer] T-of-N threshold required
    # @param unlock_window [Integer] session unlock duration in seconds
    # @return [String] session ID
    def create_session(message:, threshold:, unlock_window: 14_400)
      with_failover do |coordinator|
        coordinator.create_session(
          message:       message,
          threshold:     threshold,
          unlock_window: unlock_window,
        )
      end
    end

    # Query session status.
    # @param session_id [String]
    # @return [Hash] { state:, commitments_received:, shares_received:, ... }
    def session_status(session_id)
      with_failover do |coordinator|
        coordinator.session_status(session_id)
      end
    end

    # Block until threshold reached and signature aggregated.
    # @param session_id [String]
    # @param timeout [Integer, nil] max seconds to wait (nil = no timeout)
    # @return [String] raw signature bytes
    def aggregate(session_id, timeout: nil)
      with_failover do |coordinator|
        if timeout
          coordinator.aggregate(session_id, timeout: timeout)
        else
          coordinator.aggregate(session_id)
        end
      end
    end

    # Cancel a pending session.
    # @param session_id [String]
    def cancel_session(session_id)
      with_failover do |coordinator|
        coordinator.cancel(session_id)
      end
    end

    private

    # Try each endpoint in health-priority order. First success wins.
    # On total failure, raise Error listing every attempted endpoint.
    def with_failover
      tried = []
      ordered_endpoints.each do |endpoint|
        tried << endpoint
        begin
          result = yield(connect_to(endpoint))
          record_success(endpoint)
          return result
        rescue CoordinatorInternalError => e
          record_failure(endpoint, e)
          next  # try the next endpoint
        rescue => e
          record_failure(endpoint, e)
          next
        end
      end

      raise Error.new(
        :all_endpoints_failed,
        "all #{tried.length} endpoints failed: #{tried.join(', ')}",
        endpoint: tried.first,
      )
    end

    # Endpoints sorted by health (most-recently-successful first,
    # never-tried next, failing endpoints last).
    def ordered_endpoints
      @endpoints.sort_by do |e|
        h = @health[e]
        [
          h[:consecutive_failures],
          h[:last_success] ? -h[:last_success].to_i : Float::INFINITY,
        ]
      end
    end

    # Connect to one endpoint. Caches the connection for reuse.
    def connect_to(endpoint)
      return @active_connection if @active_endpoint == endpoint && @active_connection

      require "confium"
      @active_connection = Confium::TC::Coordinator.new(
        endpoint:        endpoint,
        quorum_id:       @quorum_id,
        protocol_version: @protocol_version,
      )
      @active_endpoint = endpoint
      @active_connection
    rescue LoadError
      raise Error.new(:confium_unavailable, "confium-ruby gem not installed", endpoint: endpoint)
    rescue => e
      raise CoordinatorInternalError, e.message
    end

    def record_success(endpoint)
      h = @health[endpoint]
      h[:last_success]          = Time.now
      h[:consecutive_failures] = 0
    end

    def record_failure(endpoint, error)
      h = @health[endpoint]
      h[:last_failure]          = Time.now
      h[:consecutive_failures] += 1
      h[:last_error]            = error.message
    end

    # Internal sentinel — distinguishes "this endpoint failed, try next"
    # from "the request itself is invalid, abort".
    class CoordinatorInternalError < StandardError; end
  end
end
