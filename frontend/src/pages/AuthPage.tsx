import { useState } from 'react';
import FloatingBg    from '../components/auth/FloatingBg';
import LoginForm     from '../components/auth/LoginForm';
import RegisterForm  from '../components/auth/RegisterForm';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <div className="relative min-h-screen flex items-center justify-center p-5 overflow-hidden"
      style={{ background:'linear-gradient(160deg,#090914 0%,#12102a 50%,#1a0f2e 100%)' }}>

      {/* Radial glows */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div style={{ position:'absolute', width:600, height:600, top:'-180px', left:'-200px', borderRadius:'50%', background:'radial-gradient(circle,rgba(91,92,246,.18) 0%,transparent 68%)', filter:'blur(48px)' }}/>
        <div style={{ position:'absolute', width:420, height:420, bottom:'-100px', right:'-120px', borderRadius:'50%', background:'radial-gradient(circle,rgba(168,85,247,.13) 0%,transparent 68%)', filter:'blur(40px)' }}/>
      </div>

      <FloatingBg/>

      {/* Card */}
      <div className="relative z-10 w-full max-w-[390px] animate-fade-up">

        {/* Brand */}
        <div className="flex items-center gap-3 mb-8">
          <div style={{ width:40, height:40, borderRadius:12, background:'linear-gradient(135deg,#5b5cf6,#a855f7)', boxShadow:'0 6px 20px rgba(91,92,246,.45)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <CalendarTodayIcon sx={{ fontSize:18, color:'white' }}/>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Planner</span>
        </div>

        <h1 className="text-3xl font-extrabold text-white leading-tight mb-1">
          {mode === 'login' ? 'Welcome back.' : 'Start planning.'}
        </h1>
        <p className="text-sm mb-7" style={{ color:'rgba(255,255,255,.38)' }}>
          {mode === 'login' ? 'Sign in to your daily planner.' : 'Create a free account.'}
        </p>

        {/* Glass card */}
        <div style={{ background:'rgba(255,255,255,.05)', backdropFilter:'blur(24px) saturate(150%)', WebkitBackdropFilter:'blur(24px) saturate(150%)', border:'1px solid rgba(255,255,255,.10)', borderRadius:18, padding:'28px 26px 30px', boxShadow:'0 20px 60px rgba(0,0,0,.45)' }}>

          {/* Tabs */}
          <div className="flex p-0.5 rounded-xl mb-6" style={{ background:'rgba(255,255,255,.06)' }}>
            {(['login','register'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className="flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 border-0 cursor-pointer"
                style={{ background: mode===m ? 'rgba(91,92,246,.8)':'transparent', color: mode===m ? 'white':'rgba(255,255,255,.38)', boxShadow: mode===m ? '0 3px 10px rgba(91,92,246,.4)':'none' }}>
                {m === 'login' ? 'Sign in' : 'Register'}
              </button>
            ))}
          </div>

          {mode === 'login'
            ? <LoginForm    onSwitch={() => setMode('register')}/>
            : <RegisterForm onSwitch={() => setMode('login')}/>
          }
        </div>

        <p className="text-center text-xs mt-5" style={{ color:'rgba(255,255,255,.18)' }}>
          Your data is stored securely. No tracking.
        </p>
      </div>
    </div>
  );
}
