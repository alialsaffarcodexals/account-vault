export function generatePassword(opts: { length: number; digits?: boolean; symbols?: boolean; avoidAmbiguous?: boolean }) {
  const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  const symbols = '!@#$%^&*()-_=+[]{};:,.?/';
  const ambiguous = 'Il1O0';
  let pool = letters + (opts.digits ? digits : '') + (opts.symbols ? symbols : '');
  if (opts.avoidAmbiguous) pool = pool.split('').filter(c => !ambiguous.includes(c)).join('');
  let out = '';
  for (let i=0;i<opts.length;i++) out += pool.charAt(Math.floor(Math.random()*pool.length));
  return out;
}
