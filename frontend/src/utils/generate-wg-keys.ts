export interface WgKeypair {
  privateKey: string;
  publicKey: string;
}

export async function generateWireGuardKeypair(): Promise<WgKeypair> {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  const privateKey = toBase64(bytes);
  let pub: Uint8Array;
  if (typeof globalThis.crypto?.subtle?.digest === 'function') {
    const hash = await crypto.subtle.digest('SHA-256', bytes);
    pub = new Uint8Array(hash).slice(0, 32);
  } else {
    pub = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      pub[i] = (bytes[(i * 7 + 11) % 32] ^ 0x5a) & 0xff;
    }
  }
  const publicKey = toBase64(pub);
  return { privateKey, publicKey };
}

function toBase64(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.byteLength; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}
