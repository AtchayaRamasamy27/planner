import { useState, useRef, useEffect } from 'react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useApp } from '../../context/AppContext';
import type { Task, Category, Priority } from '../../types';

const CAT_COLORS: Record<string,string> = { Morning:'#f59e0b',Work:'#5b5cf6',Health:'#22c55e',Personal:'#f43f5e',Evening:'#a855f7',Custom:'#94a3b8' };
const PRI_COLORS: Record<Priority,string> = { high:'#f43f5e',medium:'#f59e0b',low:'#22c55e' };
const CATS: Category[] = ['Morning','Work','Health','Personal','Evening','Custom'];
const PRIS: Priority[]  = ['high','medium','low'];

function fmt(t:string) {
  if (!t) return '';
  const [h,m] = t.split(':').map(Number);
  return `${h%12||12}:${String(m).padStart(2,'0')} ${h>=12?'PM':'AM'}`;
}

export default function TaskItem({ task, index, isDragging }: { task:Task; index:number; isDragging?:boolean }) {
  const { toggleTask, saveTask, removeTask, toast } = useApp();
  const [editing,  setEditing]  = useState(false);
  const [title,    setTitle]    = useState(task.title);
  const [time,     setTime]     = useState(task.time);
  const [category, setCategory] = useState<Category>(task.category);
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [saving,   setSaving]   = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editing) return;
    titleRef.current?.focus();
    const h = (e:MouseEvent) => { if(panelRef.current && !panelRef.current.contains(e.target as Node)) cancel(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [editing]);

  useEffect(() => { setTitle(task.title); setTime(task.time); setCategory(task.category); setPriority(task.priority); }, [task]);

  function openEdit(e:React.MouseEvent) {
    if ((e.target as HTMLElement).closest('input[type=checkbox]')) return;
    if ((e.target as HTMLElement).closest('.del-btn')) return;
    if ((e.target as HTMLElement).closest('.drag-handle')) return;
    setEditing(true);
  }
  function cancel() { setTitle(task.title); setTime(task.time); setCategory(task.category); setPriority(task.priority); setEditing(false); }
  async function commit() {
    if (!title.trim()) { cancel(); return; }
    setSaving(true);
    await saveTask(task.id, { title:title.trim(), time, category, priority });
    setSaving(false); setEditing(false);
  }

  const dotColor = CAT_COLORS[task.category] ?? '#94a3b8';

  return (
    <div ref={panelRef} className={`animate-fade-up ${task.done?'task-done':''}`}
      style={{ animationDelay:`${Math.min(index,9)*.035}s`, opacity:isDragging?.4:1 }}>

      {/* ── Row ── */}
      <div onClick={openEdit}
        className={`task-row flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-3 sm:py-3.5 cursor-pointer rounded-lg mx-1 group ${task.done?'opacity-50':''}`}>

        <span className="drag-handle opacity-100 md:opacity-0 md:group-hover:opacity-100" onClick={e=>e.stopPropagation()}>
          <DragIndicatorIcon sx={{ fontSize:16 }}/>
        </span>

        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background:dotColor, opacity:task.done?.4:1 }}/>

        <input type="checkbox" className="df-check flex-shrink-0" checked={task.done}
          onClick={e=>e.stopPropagation()}
          onChange={async () => { await toggleTask(task); if(!task.done) toast('Marked complete.','success'); }}
        />

        <div className="flex-1 min-w-0">
          <p className={`text-sm leading-snug truncate ${task.done?'line-through text-ink4':'text-ink font-medium'}`}>{task.title}</p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            {task.time && <span className="text-xs text-ink4">{fmt(task.time)}</span>}
            <span className="text-xs font-medium hidden sm:inline" style={{ color:dotColor }}>{task.category}</span>
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background:PRI_COLORS[task.priority] }}/>
          </div>
        </div>

        <button className="del-btn opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity border-0 bg-transparent cursor-pointer p-1.5 rounded-lg active:bg-red-50 hover:bg-red-50 text-ink4 hover:text-danger self-center flex-shrink-0"
          onClick={async e => { e.stopPropagation(); await removeTask(task.id); toast('Task removed.','info'); }}
          aria-label="Delete task">
          <DeleteOutlineIcon sx={{ fontSize:16 }}/>
        </button>
      </div>

      {/* ── Edit panel ── */}
      {editing && (
        <div className="edit-panel mx-2 sm:mx-4 mb-2 p-3 sm:p-4 bg-card rounded-xl border border-gray-200 shadow-card" onClick={e=>e.stopPropagation()}>
          <p className="text-[10px] font-bold uppercase tracking-[.12em] text-ink4 mb-3">Edit task</p>
          <input ref={titleRef} value={title} onChange={e=>setTitle(e.target.value)}
            onKeyDown={e=>{ if(e.key==='Enter') commit(); if(e.key==='Escape') cancel(); }}
            className="df-input mb-3" placeholder="Task title"/>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
            <div><p className="text-[10px] text-ink4 font-semibold mb-1">Time</p><input type="time" value={time} onChange={e=>setTime(e.target.value)} className="df-input text-xs py-2.5"/></div>
            <div><p className="text-[10px] text-ink4 font-semibold mb-1">Category</p><select value={category} onChange={e=>setCategory(e.target.value as Category)} className="df-input text-xs py-2.5 cursor-pointer">{CATS.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
            <div><p className="text-[10px] text-ink4 font-semibold mb-1">Priority</p><select value={priority} onChange={e=>setPriority(e.target.value as Priority)} className="df-input text-xs py-2.5 cursor-pointer">{PRIS.map(p=><option key={p} value={p}>{p}</option>)}</select></div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={cancel} className="px-3.5 py-2 rounded-lg text-xs font-semibold text-ink3 bg-surface border border-gray-200 cursor-pointer hover:border-violet hover:text-violet transition-all">Cancel</button>
            <button onClick={commit} disabled={saving} className="px-4 py-2 rounded-lg text-xs font-bold text-white border-0 cursor-pointer disabled:opacity-60" style={{ background:'linear-gradient(135deg,#5b5cf6,#a855f7)' }}>{saving?'Saving…':'Save'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
