import { useState } from 'react';

export default function PasswordField(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input {...props} type={show ? 'text' : 'password'} className={"w-full rounded-md border px-3 py-2 pr-10 " + (props.className || '')} />
      <button
        type="button"
        className="absolute right-2 top-1/2 -translate-y-1/2 text-sm opacity-70 hover:opacity-100"
        onClick={() => setShow((s) => !s)}
      >
        {show ? 'Hide' : 'Show'}
      </button>
    </div>
  );
}
