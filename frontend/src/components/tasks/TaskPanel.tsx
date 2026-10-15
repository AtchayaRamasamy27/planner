import { useMemo, useState, useRef, useCallback } from 'react';
import CheckCircleOutlineIcon   from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import WhatshotIcon             from '@mui/icons-material/Whatshot';
import FormatListBulletedIcon   from '@mui/icons-material/FormatListBulleted';
import { useApp } from '../../context/AppContext';
import TaskItem   from './TaskItem';
import AddTaskRow from './AddTaskRow';
import type { FilterType, Task } from '../../types';

const FILTERS: { key:FilterType; label:string; Icon:React.ElementType }[] = [
  { key:'all',     label:'All',     Icon:FormatListBulletedIcon    },
  { key:'pending', label:'Pending', Icon:RadioButtonUncheckedIcon  },
  { key:'done',    label:'Done',    Icon:CheckCircleOutlineIcon    },
  { key:'high',    label:'High',    Icon:WhatshotIcon              },
];

export default function TaskPanel() {
  const { tasks, filter, setFilter, reorderTasks } = useApp();
  const done  = tasks.filter(t=>t.done).length;
  const total = tasks.length;
  const pct   = total>0 ? Math.round((done/total)*100) : 0;

  const filtered: Task[] = useMemo(() => {
    const sorted = [...tasks].sort((a,b)=>(a.time||'99:99').localeCompare(b.time||'99:99'));
    switch(filter){
      case 'pending': return sorted.filter(t=>!t.done);
      case 'done':    return sorted.filter(t=> t.done);
      case 'high':    return sorted.filter(t=> t.priority==='high');
      default:        return sorted;
    }
  },[tasks, filter]);

  const dragIndexRef = useRef<number|null>(null);
  const [dropTarget, setDropTarget] = useState<{index:number;position:'above'|'below'}|null>(null);

  const handleDragStart = useCallback((i:number) => { dragIndexRef.current = i; },[]);

  const handleDragOver = useCallback((e:React.DragEvent, i:number) => {
    e.preventDefault(); e.dataTransfer.dropEffect='move';
    if(dragIndexRef.current===null) return;
    if(dragIndexRef.current===i){ setDropTarget(null); return; }
    const rect=(e.currentTarget as HTMLElement).getBoundingClientRect();
    setDropTarget({ index:i, position: e.clientY < rect.top+rect.height/2 ? 'above':'below' });
  },[]);

  const handleDrop = useCallback((e:React.DragEvent, dropIndex:number) => {
    e.preventDefault();
    const from=dragIndexRef.current;
    if(from===null||from===dropIndex){ setDropTarget(null); return; }
    const rect=(e.currentTarget as HTMLElement).getBoundingClientRect();
    const position = e.clientY < rect.top+rect.height/2 ? 'above':'below';
    const fromId=filtered[from].id; const toId=filtered[dropIndex].id;
    const fromAbs=tasks.findIndex(t=>t.id===fromId);
    let toAbs=tasks.findIndex(t=>t.id===toId);
    if(position==='below') toAbs++;
    reorderTasks(fromAbs, toAbs>fromAbs ? toAbs-1 : toAbs);
    dragIndexRef.current=null; setDropTarget(null);
  },[filtered,tasks,reorderTasks]);

  const handleDragEnd  = useCallback(()=>{ dragIndexRef.current=null; setDropTarget(null); },[]);
  const handleDragLeave= useCallback((e:React.DragEvent)=>{ const r=e.relatedTarget as HTMLElement|null; if(!r||!(e.currentTarget as HTMLElement).contains(r)) setDropTarget(null); },[]);

  return (
    <div className="bg-card rounded-2xl border border-gray-100 shadow-card overflow-hidden">

      {/* Header */}
      <div className="px-4 sm:px-6 pt-5 sm:pt-6 pb-4 sm:pb-5">
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-bold text-ink tracking-tight">Today's plan</h2>
            <p className="text-xs text-ink4 mt-0.5">{done} of {total} {total===1?'task':'tasks'} completed</p>
          </div>
          <RingProgress pct={pct}/>
        </div>
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden mb-5">
          <div className="h-full rounded-full prog-fill" style={{ width:`${pct}%`, background:'linear-gradient(90deg,#5b5cf6,#a855f7)' }}/>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {FILTERS.map(f=>(
            <button key={f.key} onClick={()=>setFilter(f.key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border-0 cursor-pointer"
              style={{ background:filter===f.key?'#5b5cf6':'rgba(91,92,246,.07)', color:filter===f.key?'white':'#7c7a93' }}>
              <f.Icon sx={{ fontSize:13 }}/> {f.label}
            </button>
          ))}
        </div>
      </div>

      <hr className="border-gray-100"/>

      {/* List */}
      <div className="py-2 relative" onDragLeave={handleDragLeave}>
        {filtered.length>0 && <div className="tl-line"/>}

        {filtered.length===0 ? <EmptyState filter={filter} done={done} total={total}/> : (
          filtered.map((task,i)=>{
            const isDragging  = dragIndexRef.current===i;
            const isDropAbove = dropTarget?.index===i && dropTarget.position==='above';
            const isDropBelow = dropTarget?.index===i && dropTarget.position==='below';
            return (
              <div key={task.id} draggable
                onDragStart={()=>handleDragStart(i)} onDragOver={e=>handleDragOver(e,i)}
                onDrop={e=>handleDrop(e,i)} onDragEnd={handleDragEnd}
                className={[isDragging?'task-dragging':'', isDropAbove?'task-drop-above':'', isDropBelow?'task-drop-below':''].filter(Boolean).join(' ')}>
                <TaskItem task={task} index={i} isDragging={isDragging}/>
              </div>
            );
          })
        )}

        {filtered.length>0 && <hr className="border-gray-100 mx-5 my-1"/>}
        <AddTaskRow/>
      </div>
    </div>
  );
}

function RingProgress({ pct }: { pct:number }) {
  const r=19, c=2*Math.PI*r, dash=(pct/100)*c;
  return (
    <svg width={52} height={52} viewBox="0 0 52 52" className="flex-shrink-0" style={{ transform:'rotate(-90deg)' }}>
      <circle cx={26} cy={26} r={r} fill="none" stroke="#f0eefe" strokeWidth={4}/>
      <circle cx={26} cy={26} r={r} fill="none" stroke="url(#rg)" strokeWidth={4}
        strokeDasharray={`${dash} ${c}`} strokeLinecap="round"
        style={{ transition:'stroke-dasharray .9s cubic-bezier(.22,1,.36,1)' }}/>
      <defs><linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#5b5cf6"/><stop offset="100%" stopColor="#a855f7"/></linearGradient></defs>
      <text x={26} y={26} textAnchor="middle" dominantBaseline="central"
        style={{ transform:'rotate(90deg)', transformOrigin:'26px 26px', fontSize:11, fontWeight:700, fill:'#3b3952', fontFamily:'Inter,sans-serif' }}>
        {pct}%
      </text>
    </svg>
  );
}

function EmptyState({ filter, done, total }: { filter:FilterType; done:number; total:number }) {
  let msg='No tasks yet. Add one below.';
  if(filter==='done'    && done===0)                  msg='No completed tasks yet.';
  if(filter==='pending' && done===total && total>0)   msg='All tasks completed.';
  if(filter==='high'    && total>0)                   msg='No high-priority tasks.';
  return (
    <div className="text-center py-12 animate-fade-in">
      <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-3">
        <FormatListBulletedIcon sx={{ fontSize:20, color:'#b3b1c8' }}/>
      </div>
      <p className="text-sm text-ink4">{msg}</p>
    </div>
  );
}
