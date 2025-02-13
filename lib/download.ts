export function download(name: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.style.display = 'none';
  a.download = name;
  document.body.appendChild(a); // Required for this to work in Firefox
  a.click();
  document.body.removeChild(a); // Clean up
  URL.revokeObjectURL(url);
}
