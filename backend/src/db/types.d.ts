export interface UserRow {
  id: number;
  username: string;
  password_hash: string;
  salt_kek_b64: string;
  vk_enc: string;
  failed_logins: number;
  locked_until?: number | null;
  createdAt: string;
  updatedAt: string;
}
