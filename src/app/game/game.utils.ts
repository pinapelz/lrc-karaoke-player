export interface GameLine {
  millisecond: number;
  content: string;
}

export function parseLrcLines(
  lrcText: string,
  options?: { skipBacking?: boolean }
): GameLine[] {
  const result: GameLine[] = [];
  const lineRegex = /\[(\d{2,3}):(\d{2})\.(\d{2,3})\]/g;
  const { skipBacking = false } = options ?? {};

  for (const rawLine of lrcText.split("\n")) {
    const timestamps: number[] = [];
    let match: RegExpExecArray | null;
    let lastIndex = 0;

    lineRegex.lastIndex = 0;
    while ((match = lineRegex.exec(rawLine)) !== null) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const msField = match[3];
      const ms =
        msField.length === 2
          ? parseInt(msField, 10) * 10
          : parseInt(msField, 10);
      timestamps.push(minutes * 60_000 + seconds * 1_000 + ms);
      lastIndex = match.index + match[0].length;
    }

    if (timestamps.length === 0) continue;

    const content = (skipBacking
      ? rawLine.slice(lastIndex).replace(/\([^)]*\)/g, "")
      : rawLine.slice(lastIndex)
    ).trim();

    for (const ms of timestamps) {
      result.push({ millisecond: ms, content });
    }
  }

  result.sort((a, b) => a.millisecond - b.millisecond);
  return result;
}

export function calculateCPSNeeded(text: string, seconds: number): number {
  return text.length / seconds;
}

export function formatTime(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
