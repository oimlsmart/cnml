import { computed, ref, onMounted } from "vue";

export interface SampleEntry<T = unknown> {
  filename: string;
  data: T;
}

export function parseSamples<T = unknown>(raw: string | undefined): SampleEntry<T>[] {
  if (!raw) return [];
  try {
    return JSON.parse(raw) as SampleEntry<T>[];
  } catch {
    return [];
  }
}

export interface UseSampleManagerOptions<T> {
  samplesJson: () => string | undefined;
  loadInto: (data: T) => void;
}

export function useSampleManager<T = unknown>(opts: UseSampleManagerOptions<T>) {
  const allSamples = computed<SampleEntry<T>[]>(() => parseSamples<T>(opts.samplesJson()));
  const currentSampleFilename = ref<string | null>(null);

  function loadByFilename(filename: string): SampleEntry<T> | undefined {
    return allSamples.value.find((s) => s.filename === filename);
  }

  function loadFirst(): SampleEntry<T> | undefined {
    return allSamples.value[0];
  }

  function selectSample(filename: string, updateUrl = true) {
    const found = loadByFilename(filename);
    if (!found) return;
    opts.loadInto(found.data);
    currentSampleFilename.value = filename;
    if (updateUrl && typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("sample", filename);
      window.history.replaceState({}, "", url.toString());
    }
  }

  onMounted(() => {
    if (typeof window === "undefined") return;
    const requested = new URLSearchParams(window.location.search).get("sample");
    if (!requested) return;
    const found = loadByFilename(requested);
    if (!found) {
      console.warn(
        `Sample "${requested}" not found in`,
        allSamples.value.map((s) => s.filename),
      );
      return;
    }
    opts.loadInto(found.data);
    currentSampleFilename.value = found.filename;
  });

  return {
    allSamples,
    currentSampleFilename,
    selectSample,
    loadFirst,
  };
}
