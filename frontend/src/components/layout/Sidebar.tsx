import { useState } from 'react';
import AddIcon           from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LogoutIcon        from '@mui/icons-material/Logout';
import TodayIcon         from '@mui/icons-material/Today';
import { useApp } from '../../context/AppContext';
import type { Planner } from '../../types';

const COLORS = ['#5b5cf6','#a855f7','#f43f5e','#22c55e','#f59e0b','#06b6d4','#ec4899','#f97316'];

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, planners, active, selectPlanner, addPlanner, removePlanner, logout, toast } = useApp();

  const [adding, setAdding] = useState(false);
  const [name,   setName]   = useState('');
  const [date,   setDate]   = useState(new Date().toISOString().split('T')[0]);
  const [color,  setColor]  = useState(COLORS[0]);
  const [defs,   setDefs]   = useState(true);
  const [busy,   setBusy]   = useState(false);

  function reset() { setName(''); setDate(new Date().toISOString().split('T')[0]); setColor(COLORS[0]); setDefs(true); }

  async function create() {
    if (!name.trim()) { toast('Enter a planner name.','error'); return; }
    setBusy(true);
    try { await addPlanner(name.trim(), date, color, defs); toast(`"${name.trim()}" created.`,'success'); setAdding(false); reset(); onClose(); }
    catch { toast('Could not create planner.','error'); }
    finally { setBusy(false); }
  }

  async function del(e: React.MouseEvent, id: number, n: string) {
    e.stopPropagation();
    if (!confirm(`Delete "${n}" and all its tasks?`)) return;
    await removePlanner(id); toast('Planner removed.','info');
  }

  const initials = (user?.name ?? 'U').split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();

  return (
    <>
      {/* Backdrop */}
      <div className={`fixed inset-0 z-30 md:hidden bg-black/30 transition-opacity duration-300 ${open?'opacity-100 pointer-events-auto':'opacity-0 pointer-events-none'}`} onClick={onClose}/>

      <aside className={`fixed top-0 left-0 bottom-0 z-40 w-60 bg-card border-r border-gray-100 flex flex-col transition-transform duration-300 ease-out ${open?'translate-x-0':'-translate-x-full'} md:translate-x-0`}
        style={{ boxShadow:'2px 0 12px rgba(0,0,0,.06)' }}>

        {/* Brand */}
        <div className="flex items-center gap-3 px-5 pt-6 pb-5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background:'linear-gradient(135deg,#5b5cf6,#a855f7)' }}>
            <CalendarTodayIcon sx={{ fontSize:16, color:'white' }}/>
          </div>
          <span className="font-bold text-sm tracking-tight text-ink">Planner</span>
        </div>
        <hr className="mx-4 border-gray-100"/>

        {/* User */}
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background:'linear-gradient(135deg,#5b5cf6,#f43f5e)' }}>{initials}</div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink truncate leading-tight">{user?.name}</p>
            <p className="text-xs text-ink3 truncate">{user?.email}</p>
          </div>
        </div>
        <hr className="mx-4 border-gray-100"/>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          <p className="text-[10px] font-bold uppercase tracking-[.12em] text-ink4 px-2 mb-2">Planners</p>

          {planners.length === 0 && !adding && <p className="text-xs text-ink4 px-2 py-1">No planners yet.</p>}

          <ul className="flex flex-col gap-0.5">
            {planners.map(p => (
              <li key={p.id}>
                <div onClick={() => { selectPlanner(p); onClose(); }}
                  className={`group flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg cursor-pointer transition-all duration-150 ${active?.id===p.id?'pl-active':'hover:bg-gray-50'}`}>
                  <TodayIcon sx={{ fontSize:15, color: active?.id===p.id ? '#5b5cf6':'#b3b1c8' }}/>
                  <span className={`flex-1 text-sm truncate ${active?.id===p.id?'font-semibold text-violet':'font-medium text-ink2'}`}>{p.name}</span>
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background:p.color }}/>
                  <button onClick={e => del(e, p.id, p.name)} className="opacity-0 group-hover:opacity-100 transition-opacity border-0 bg-transparent cursor-pointer p-0.5 rounded text-ink4 hover:text-danger">
                    <DeleteOutlineIcon sx={{ fontSize:15 }}/>
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Add form */}
          {adding ? (
            <div className="mt-2 p-3 bg-surface rounded-xl border border-gray-200 flex flex-col gap-2.5 animate-scale-in">
              <input autoFocus placeholder="Planner name" value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => { if(e.key==='Enter') create(); if(e.key==='Escape'){setAdding(false);reset();} }}
                className="df-input text-xs py-2 px-3"/>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="df-input text-xs py-2 px-3"/>
              <div className="flex gap-1.5 flex-wrap">
                {COLORS.map(c => (
                  <button key={c} onClick={() => setColor(c)} className="w-5 h-5 rounded-full border-0 cursor-pointer transition-transform duration-150"
                    style={{ background:c, transform:color===c?'scale(1.3)':'scale(1)', outline:color===c?`2px solid ${c}`:'none', outlineOffset:2 }}/>
                ))}
              </div>
              <label className="flex items-center gap-2 text-xs text-ink3 cursor-pointer select-none">
                <input type="checkbox" checked={defs} onChange={e => setDefs(e.target.checked)} className="accent-violet"/> Load 10 default tasks
              </label>
              <div className="flex gap-2">
                <button onClick={() => { setAdding(false); reset(); }} className="flex-1 py-1.5 rounded-lg text-xs font-semibold text-ink3 bg-white border border-gray-200 cursor-pointer hover:border-violet hover:text-violet transition-all">Cancel</button>
                <button onClick={create} disabled={busy} className="flex-1 py-1.5 rounded-lg text-xs font-bold text-white border-0 cursor-pointer disabled:opacity-60" style={{ background:'linear-gradient(135deg,#5b5cf6,#a855f7)' }}>{busy?'…':'Create'}</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setAdding(true)} className="add-row mt-1 gap-2 justify-start">
              <AddIcon sx={{ fontSize:17 }}/> New planner
            </button>
          )}
        </nav>

        <hr className="mx-4 border-gray-100"/>
        <div className="px-3 py-4">
          <button onClick={logout} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-ink3 hover:text-danger hover:bg-red-50 transition-all cursor-pointer border-0 bg-transparent">
            <LogoutIcon sx={{ fontSize:17 }}/> Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
