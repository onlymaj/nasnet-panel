import { simulateLatency } from '../simulate-latency';
import type { BatchJobResult } from '../types';

export const batch = {
  async applyConfig(text: string): Promise<BatchJobResult> {
    await simulateLatency();
    if (!text || !text.trim()) {
      return { status: 'error', appliedLines: 0, errors: [{ line: 0, message: 'Empty script' }] };
    }
    const lines = text.split(/\r?\n/).filter((l) => l.trim() && !l.trim().startsWith('#'));
    return { status: 'ok', appliedLines: lines.length };
  },
};
