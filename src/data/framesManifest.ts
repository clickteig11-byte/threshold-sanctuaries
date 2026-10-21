export const TOTAL_FRAMES = 240;

export function formatFrameNumber(index: number): string {
  return String(index).padStart(3, '0');
}

export function getFrameFilename(index: number): string {
  return `frame_${formatFrameNumber(index)}.jpg`;
}

export function getFrameUrl(index: number): string {
  return `/frames/${getFrameFilename(index)}?v=240`;
}
