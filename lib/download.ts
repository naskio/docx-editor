export function download(name: string, content?: string) {
  const blob = new Blob([content || ``], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.style.display = 'none';
  a.download = `${name}.js`;
  document.body.appendChild(a); // Required for this to work in Firefox
  a.click();
  document.body.removeChild(a); // Clean up
  URL.revokeObjectURL(url);
}
