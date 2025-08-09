import { useEffect, useState } from 'react';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export function PhoneInputBH({ value, onChange }:{ value?: string, onChange: (v?: string)=>void }) {
  const [raw, setRaw] = useState<string>(value || '');
  useEffect(() => setRaw(value || ''), [value]);

  const handleBlur = () => {
    if (!raw) return onChange(undefined);
    const pn = parsePhoneNumberFromString(raw, 'BH');
    if (pn && pn.isValid()) {
      onChange(pn.number); // E.164
    } else {
      onChange(undefined);
      alert('Invalid Bahraini phone number');
      setRaw('');
    }
  };
  return (
    <input
      value={raw}
      onChange={e => setRaw(e.target.value)}
      onBlur={handleBlur}
      placeholder="+973 3XXXXXXX"
      className="w-full rounded-md border px-3 py-2"
    />
  );
}
