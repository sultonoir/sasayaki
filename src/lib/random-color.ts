export function getRandomColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Konversi ke 3 channel RGB
  const minBrightness = 160;
  const r = (hash >> 0) & 0xff;
  const g = (hash >> 8) & 0xff;
  const b = (hash >> 16) & 0xff;

  // Tingkatkan brightness
  const brighten = (color: number) =>
    Math.floor((color + minBrightness) / 2)
      .toString(16)
      .padStart(2, "0");

  return `#${brighten(r)}${brighten(g)}${brighten(b)}`;
}
