import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Field, ErrBanner, SubmitBtn } from './LoginForm';

export default function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const { register, toast } = useApp();
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [busy,     setBusy]     = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    setError(''); setBusy(true);
    try {
      await register(name.trim(), email.trim(), password);
      toast('Account created. Sign in to continue.', 'success');
      onSwitch();
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Registration failed.');
    } finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      {error && <ErrBanner msg={error}/>}
      <Field label="Full name"     type="text"     placeholder="Your name"        value={name}     onChange={e => setName(e.target.value)}     required autoFocus/>
      <Field label="Email address" type="email"    placeholder="you@example.com"  value={email}    onChange={e => setEmail(e.target.value)}    required/>
      <Field label="Password"      type="password" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} required/>
      <SubmitBtn busy={busy} label="Create account"/>
      <p className="text-center text-xs" style={{ color:'rgba(255,255,255,.3)' }}>
        Already registered?{' '}
        <button type="button" onClick={onSwitch} className="font-semibold cursor-pointer bg-transparent border-0" style={{ color:'rgba(168,85,247,.85)' }}>
          Sign in
        </button>
      </p>
    </form>
  );
}
