export const t = (key: string) => strings[key] ?? key;
export const strings: Record<string, string> = {
  'app.title': 'Accounts Vault',
  'auth.login': 'Login',
  'auth.register': 'Register'
};
