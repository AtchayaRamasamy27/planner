/** Planner-themed shapes floating up from the bottom — pure CSS animation */

interface Item { id:number; x:number; size:number; dur:number; delay:number; op:number; rot:number; type:number; }

const ITEMS: Item[] = [
  { id:1,  x:4,   size:38, dur:16, delay:0,   op:.14, rot:-14, type:0 },
  { id:2,  x:12,  size:24, dur:21, delay:2.2, op:.10, rot:10,  type:1 },
  { id:3,  x:22,  size:32, dur:13, delay:.8,  op:.13, rot:18,  type:2 },
  { id:4,  x:33,  size:20, dur:19, delay:3.1, op:.09, rot:-6,  type:3 },
  { id:5,  x:44,  size:44, dur:15, delay:.4,  op:.12, rot:22,  type:0 },
  { id:6,  x:54,  size:26, dur:23, delay:1.6, op:.08, rot:-20, type:4 },
  { id:7,  x:63,  size:30, dur:12, delay:2.8, op:.14, rot:12,  type:1 },
  { id:8,  x:73,  size:22, dur:18, delay:.2,  op:.10, rot:-9,  type:2 },
  { id:9,  x:81,  size:40, dur:14, delay:1.2, op:.12, rot:16,  type:3 },
  { id:10, x:90,  size:28, dur:20, delay:3.6, op:.09, rot:-24, type:0 },
  { id:11, x:96,  size:18, dur:17, delay:0.6, op:.08, rot:8,   type:4 },
  { id:12, x:38,  size:22, dur:22, delay:4.0, op:.07, rot:-12, type:1 },
  { id:13, x:58,  size:34, dur:11, delay:1.8, op:.11, rot:20,  type:2 },
  { id:14, x:8,   size:16, dur:25, delay:3.4, op:.07, rot:-18, type:4 },
  { id:15, x:48,  size:28, dur:14, delay:2.6, op:.10, rot:14,  type:3 },
];

const Cal = ({ s }: { s:number }) => (
  <svg width={s} height={s} viewBox="0 0 44 44" fill="none">
    <rect x="2" y="8" width="40" height="34" rx="6" fill="rgba(255,255,255,.88)"/>
    <rect x="2" y="8" width="40" height="12" rx="6" fill="rgba(91,92,246,.85)"/>
    <rect x="2" y="14" width="40" height="6" fill="rgba(91,92,246,.85)"/>
    <rect x="13" y="2" width="5" height="10" rx="2.5" fill="rgba(255,255,255,.9)"/>
    <rect x="26" y="2" width="5" height="10" rx="2.5" fill="rgba(255,255,255,.9)"/>
    {[0,1,2].map(col=>[0,1,2].map(row=>(
      <rect key={`${col}${row}`} x={9+col*12} y={26+row*7} width={7} height={3} rx="1.5" fill={`rgba(91,92,246,${.35-row*.08})`}/>
    )))}
  </svg>
);

const Check = ({ s }: { s:number }) => (
  <svg width={s} height={s} viewBox="0 0 44 44" fill="none">
    <rect x="2" y="2" width="40" height="40" rx="11" fill="rgba(34,197,94,.85)"/>
    <path d="M11 22 L19 30 L33 14" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Clock = ({ s }: { s:number }) => (
  <svg width={s} height={s} viewBox="0 0 44 44" fill="none">
    <circle cx="22" cy="22" r="20" fill="rgba(255,255,255,.88)"/>
    <circle cx="22" cy="22" r="16" stroke="rgba(91,92,246,.2)" strokeWidth="1.5" fill="none"/>
    <line x1="22" y1="22" x2="22" y2="9"  stroke="rgba(91,92,246,.9)" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="22" y1="22" x2="30" y2="26" stroke="rgba(168,85,247,.8)" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="22" cy="22" r="2.5" fill="#5b5cf6"/>
  </svg>
);

const TaskList = ({ s }: { s:number }) => (
  <svg width={s} height={s} viewBox="0 0 44 44" fill="none">
    <rect x="2" y="2" width="40" height="40" rx="9" fill="rgba(255,255,255,.88)"/>
    {[0,1,2].map(i=>(
      <g key={i}>
        <rect x="9" y={13+i*9} width="5" height="5" rx="1.5" fill={i===1?'rgba(34,197,94,.7)':'rgba(91,92,246,.25)'}/>
        {i===1 && <path d={`M10 ${15.5+i*9} L11.5 ${17+i*9} L14 ${14+i*9}`} stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>}
        <rect x="17" y={14.5+i*9} width={i===2?10:17} height="2" rx="1" fill={`rgba(91,92,246,${.3-i*.07})`}/>
      </g>
    ))}
  </svg>
);

const Dots = ({ s }: { s:number }) => (
  <svg width={s} height={s} viewBox="0 0 44 44" fill="none">
    {[0,1,2,3].map(r=>[0,1,2,3].map(c=>(
      <circle key={`${r}${c}`} cx={8+c*10} cy={8+r*10} r="2.5" fill={`rgba(168,85,247,${.6-(r+c)*.06})`}/>
    )))}
  </svg>
);

const SHAPES = [Cal, Check, Clock, TaskList, Dots];

export default function FloatingBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {ITEMS.map(item => {
        const Shape = SHAPES[item.type];
        return (
          <div key={item.id} className="absolute bottom-0 float-item"
            style={{
              left:`${item.x}%`,
              '--dur':   `${item.dur}s`,
              '--delay': `${item.delay}s`,
              '--rot':   `${item.rot}deg`,
              '--op':    `${item.op}`,
              filter:'drop-shadow(0 2px 6px rgba(0,0,0,.28))',
            } as React.CSSProperties}>
            <Shape s={item.size}/>
          </div>
        );
      })}
    </div>
  );
}
