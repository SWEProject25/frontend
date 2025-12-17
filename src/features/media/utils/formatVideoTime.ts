export function formatVideoTime(duration: number): string {
  const mins = Math.floor(duration / 60);

  const sec = Math.floor(duration % 60);
  return `${mins}:${sec.toString().padStart(2, '0')}`;
}
