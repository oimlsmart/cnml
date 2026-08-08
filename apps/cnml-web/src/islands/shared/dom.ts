/**
 * Shared DOM utilities for browser-interaction patterns.
 *
 * downloadBlob and triggerFileUpload are repeated across multiple
 * island components. Each copy creates the same DOM elements and
 * performs the same ceremony. These functions concentrate the logic
 * so behavior changes (toasts, analytics, cleanup) happen in one place.
 */

/**
 * Create a Blob from content, trigger a browser download, and revoke
 * the object URL. Used by every component that downloads a file
 * (CSR, signed XML, public key PEM, QR SVG, YAML, etc.).
 */
export function downloadBlob(
  content: string | Blob,
  filename: string,
  mimeType: string,
): void {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Create a hidden file input, trigger the OS file picker, and invoke
 * the callback when a file is selected. Used by components that import
 * PEM/cert/key files without a visible <input type="file"> in the template.
 */
export function triggerFileUpload(
  accept: string,
  onFile: (file: File) => void | Promise<void>,
): void {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = accept;
  input.onchange = async () => {
    const file = input.files?.[0];
    if (file) await onFile(file);
  };
  input.click();
}
