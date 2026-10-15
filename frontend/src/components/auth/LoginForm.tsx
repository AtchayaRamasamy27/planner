import { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const { login, toast } = useApp();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [busy,     setBusy]     = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      await login(email.trim(), password);
      toast('Welcome back.', 'success');
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Sign in failed.');
    } finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      {error && <ErrBanner msg={error}/>}
      <Field label="Email address" type="email"    placeholder="you@example.com" value={email}    onChange={e => setEmail(e.target.value)}    required autoFocus/>
      <Field label="Password"      type="password" placeholder="Your password"    value={password} onChange={e => setPassword(e.target.value)} required/>
      <SubmitBtn busy={busy} label="Sign in"/>
      <p className="text-center text-xs" style={{ color:'rgba(255,255,255,.3)' }}>
        No account?{' '}
        <button type="button" onClick={onSwitch} className="font-semibold cursor-pointer bg-transparent border-0" style={{ color:'rgba(168,85,247,.85)' }}>
          Create one
        </button>
      </p>
    </form>
  );
}

export function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold tracking-wide transition-colors duration-150"
        style={{ color: focused ? 'rgba(168,85,247,.9)' : 'rgba(255,255,255,.42)' }}>
        {label}
      </label>
      <input {...props} className="df-input-dark"
        onFocus={e => { setFocused(true);  (props.onFocus as ((e: React.FocusEvent<HTMLInputElement>) => void) | undefined)?.(e); }}
        onBlur={e  => { setFocused(false); (props.onBlur  as ((e: React.FocusEvent<HTMLInputElement>) => void) | undefined)?.(e); }}
      />
    </div>
  );
}

export function ErrBanner({ msg }: { msg: string }) {
  return (
    <p className="text-xs font-medium px-3.5 py-2.5 rounded-xl"
      style={{ background:'rgba(244,63,94,.13)', color:'#fca5a5', border:'1px solid rgba(244,63,94,.22)' }}>
      {msg}
    </p>
  );
}

export function SubmitBtn({ busy, label }: { busy: boolean; label: string }) {
  return (
    <button type="submit" disabled={busy}
      className="w-full py-3 rounded-xl text-sm font-bold text-white border-0 cursor-pointer mt-1 disabled:opacity-55"
      style={{ background:'linear-gradient(135deg,#5b5cf6,#a855f7)', boxShadow:'0 5px 18px rgba(91,92,246,.42)' }}>
      {busy ? 'Please wait…' : label}
    </button>
  );
}
