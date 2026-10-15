import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { useApp } from '../../context/AppContext';
import type { Category, Priority } from '../../types';

const CATS: Category[] = ['Morning','Work','Health','Personal','Evening','Custom'];
const PRIS: Priority[]  = ['high','medium','low'];

export default function AddTaskRow() {
  const { addTask, toast } = useApp();
  const [open,     setOpen]     = useState(false);
  const [title,    setTitle]    = useState('');
  const [time,     setTime]     = useState('');
  const [category, setCategory] = useState<Category>('Work');
  const [priority, setPriority] = useState<Priority>('medium');
  const [busy,     setBusy]     = useState(false);

  async function save() {
    if (!title.trim()) { toast('Enter a task title.','error'); return; }
    setBusy(true);
    await addTask({ title:title.trim(), time, category, priority });
    setTitle(''); setTime(''); setBusy(false); setOpen(false);
    toast('Task added.','success');
  }

  if (!open) return (
    <button onClick={() => setOpen(true)} className="add-row">
      <span className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0" style={{ background:'rgba(91,92,246,.10)' }}>
        <AddIcon sx={{ fontSize:15, color:'#5b5cf6' }}/>
      </span>
      New task
    </button>
  );

  return (
    <div className="mx-2 sm:mx-4 mb-4 p-3 sm:p-4 bg-card rounded-xl border border-gray-200 shadow-card edit-panel">
      <p className="text-[10px] font-bold uppercase tracking-[.12em] text-ink4 mb-3">New task</p>
      <input autoFocus value={title} onChange={e=>setTitle(e.target.value)}
        onKeyDown={e=>{ if(e.key==='Enter') save(); if(e.key==='Escape') setOpen(false); }}
        placeholder="What do you need to do?" className="df-input mb-3"/>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
        <div><p className="text-[10px] text-ink4 font-semibold mb-1">Time</p><input type="time" value={time} onChange={e=>setTime(e.target.value)} className="df-input text-xs py-2.5"/></div>
        <div><p className="text-[10px] text-ink4 font-semibold mb-1">Category</p><select value={category} onChange={e=>setCategory(e.target.value as Category)} className="df-input text-xs py-2.5 cursor-pointer">{CATS.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
        <div><p className="text-[10px] text-ink4 font-semibold mb-1">Priority</p><select value={priority} onChange={e=>setPriority(e.target.value as Priority)} className="df-input text-xs py-2.5 cursor-pointer">{PRIS.map(p=><option key={p} value={p}>{p}</option>)}</select></div>
      </div>
      <div className="flex gap-2 justify-end">
        <button onClick={()=>setOpen(false)} className="px-3.5 py-2 rounded-lg text-xs font-semibold text-ink3 bg-surface border border-gray-200 cursor-pointer hover:border-violet hover:text-violet transition-all">Cancel</button>
        <button onClick={save} disabled={busy} className="px-4 py-2 rounded-lg text-xs font-bold text-white border-0 cursor-pointer disabled:opacity-60" style={{ background:'linear-gradient(135deg,#5b5cf6,#a855f7)' }}>{busy?'Adding…':'Add task'}</button>
      </div>
    </div>
  );
}
