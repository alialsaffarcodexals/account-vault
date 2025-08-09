import crypto from 'crypto';
import { encryptAead, decryptAead } from './aead';
import { deriveKEK } from './argon';

export type VaultBootstrap = {
  passwordHash: string;
  salt_kek_b64: string;
  vk_enc: string;
  vk_plain_for_session: Buffer;
};

export async function createUserVault(password: string, passwordHash: string): Promise<VaultBootstrap> {
  const salt_kek = crypto.randomBytes(16);
  const kek = await deriveKEK(password, salt_kek);
  const vk = crypto.randomBytes(32);
  const vk_enc = encryptAead(vk, kek);
  return { passwordHash, salt_kek_b64: salt_kek.toString('base64'), vk_enc, vk_plain_for_session: vk };
}

export async function decryptVK(password: string, salt_kek_b64: string, vk_enc: string): Promise<Buffer> {
  const kek = await deriveKEK(password, Buffer.from(salt_kek_b64, 'base64'));
  return decryptAead(vk_enc, kek);
}
