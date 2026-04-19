export const PAGE_SIZE = 10;

export const cx = (...parts: Array<string | undefined | false>) => parts.filter(Boolean).join(' ');
