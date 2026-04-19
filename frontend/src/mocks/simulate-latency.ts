const envLatency = (): number => {
  const globalAny = globalThis as unknown as { process?: { env?: Record<string, string> } };
  const raw = globalAny.process?.env?.MOCK_LATENCY;
  const parsed = raw === undefined ? NaN : Number(raw);
  if (Number.isFinite(parsed)) return parsed;
  return -1;
};

export function simulateLatency(min = 150, max = 400): Promise<void> {
  const override = envLatency();
  const ms = override >= 0 ? override : min + Math.random() * (max - min);
  if (ms <= 0) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, ms));
}
