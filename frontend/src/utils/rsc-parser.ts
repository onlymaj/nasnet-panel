export interface RscPreview {
  sections: string[];
  commands: string[];
  lineCount: number;
  codewords: number;
}

export function parseRsc(text: string): RscPreview {
  const lines = text.split(/\r?\n/);
  const cleaned = lines.map((l) => l.trim()).filter((l) => l.length > 0 && !l.startsWith('#'));
  const sections = new Set<string>();
  for (const line of cleaned) {
    const section = line.match(/^(\/[^\s]+)/)?.[1];
    if (section) sections.add(section);
  }
  return {
    sections: [...sections].sort(),
    commands: cleaned.slice(0, 20),
    lineCount: cleaned.length,
    codewords: cleaned.reduce((acc, l) => acc + l.split(/\s+/).length, 0),
  };
}
