import { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';

const CAT: Record<string,string> = { Morning:'#f59e0b',Work:'#5b5cf6',Health:'#22c55e',Personal:'#f43f5e',Evening:'#a855f7',Custom:'#94a3b8' };
const col = (c:string) => CAT[c] ?? CAT.Custom;

function rr(ctx:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,r:number){
  if(h<=0) return; r=Math.min(r,h/2,w/2);
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h); ctx.lineTo(x,y+h); ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath();
}

function drawDonut(ctx:CanvasRenderingContext2D,W:number,H:number,tasks:{category:string;done:boolean}[],p:number){
  ctx.clearRect(0,0,W,H);
  const cx=W/2,cy=H/2,R=Math.min(cx,cy)-14,r=R*.56;
  const cats=[...new Set(tasks.map(t=>t.category))];
  const done=tasks.filter(t=>t.done).length;
  const segs=[
    ...cats.map(c=>({label:c,val:tasks.filter(t=>t.category===c&&t.done).length,color:col(c)})).filter(s=>s.val>0),
    ...(tasks.length-done>0?[{label:'Remaining',val:tasks.length-done,color:'#ede9fe'}]:[]),
  ];
  if(!segs.length) segs.push({label:'',val:1,color:'#ede9fe'});
  const tot=segs.reduce((s,x)=>s+x.val,0); let ang=-Math.PI/2;
  segs.forEach(seg=>{
    const sw=(seg.val/tot)*Math.PI*2*p;
    ctx.save(); ctx.shadowColor=seg.color+'44'; ctx.shadowBlur=10;
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,R,ang,ang+sw); ctx.closePath();
    ctx.fillStyle=seg.color; ctx.fill(); ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,R,ang,ang+sw); ctx.closePath();
    ctx.strokeStyle='#fff'; ctx.lineWidth=2; ctx.stroke(); ctx.restore();
    ang+=sw;
  });
  ctx.save(); ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fillStyle='#fff'; ctx.fill(); ctx.restore();
  if(p>=.99){
    const pct=tasks.length>0?Math.round((done/tasks.length)*100):0;
    ctx.save(); ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.font=`800 ${Math.round(r*.64)}px Inter,sans-serif`; ctx.fillStyle='#0f0e17'; ctx.fillText(`${pct}%`,cx,cy-6);
    ctx.font=`500 ${Math.round(r*.27)}px Inter,sans-serif`; ctx.fillStyle='#b3b1c8'; ctx.fillText('complete',cx,cy+r*.38); ctx.restore();
  }
}

function drawBar(ctx:CanvasRenderingContext2D,W:number,H:number,tasks:{category:string;done:boolean}[],p:number){
  ctx.clearRect(0,0,W,H);
  const pad={t:16,r:14,b:38,l:26},cH=H-pad.t-pad.b,cW=W-pad.l-pad.r;
  const cats=[...new Set(tasks.map(t=>t.category))];
  const data=cats.map(c=>({label:c,total:tasks.filter(t=>t.category===c).length,done:tasks.filter(t=>t.category===c&&t.done).length,color:col(c)}));
  const max=Math.max(...data.map(d=>d.total),1),sp=cW/data.length,bw=Math.min(sp*.45,38);
  for(let i=0;i<=4;i++){
    const y=pad.t+(cH/4)*i;
    ctx.save(); ctx.strokeStyle='#f0eefe'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(pad.l,y); ctx.lineTo(W-pad.r,y); ctx.stroke();
    ctx.fillStyle='#c8c7dc'; ctx.font='10px Inter,sans-serif'; ctx.textAlign='right'; ctx.textBaseline='middle';
    ctx.fillText(String(Math.round(max-(max/4)*i)),pad.l-5,y); ctx.restore();
  }
  data.forEach((d,i)=>{
    const cx2=pad.l+sp*i+sp/2,x=cx2-bw/2,tH=(d.total/max)*cH*p;
    ctx.save(); ctx.beginPath(); rr(ctx,x,pad.t+cH-tH,bw,tH,5); ctx.fillStyle=d.color+'1f'; ctx.fill(); ctx.restore();
    const dH=(d.done/max)*cH*p;
    if(dH>0){ ctx.save(); ctx.shadowColor=d.color+'44'; ctx.shadowBlur=6; ctx.beginPath(); rr(ctx,x,pad.t+cH-dH,bw,dH,5); ctx.fillStyle=d.color; ctx.fill(); ctx.restore(); }
    if(p>=.99){
      ctx.save(); ctx.fillStyle='#b3b1c8'; ctx.font='10px Inter,sans-serif'; ctx.textAlign='center'; ctx.textBaseline='top'; ctx.fillText(d.label,cx2,H-pad.b+6); ctx.restore();
      if(d.done>0){ ctx.save(); ctx.fillStyle=d.color; ctx.font='bold 11px Inter,sans-serif'; ctx.textAlign='center'; ctx.textBaseline='bottom'; ctx.fillText(`${d.done}/${d.total}`,cx2,pad.t+cH-dH-3); ctx.restore(); }
    }
  });
}

export default function ProgressChart() {
  const { tasks, chartMode, setChartMode } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number|null>(null);

  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas) return;
    const ctx=canvas.getContext('2d')!;
    if(rafRef.current) cancelAnimationFrame(rafRef.current);
    let prog=0;
    function animate(){
      prog=Math.min(prog+.045,1);
      const W=canvas!.offsetWidth,H=canvas!.offsetHeight;
      if(!W||!H){ rafRef.current=requestAnimationFrame(animate); return; }
      canvas!.width=W; canvas!.height=H;
      if(chartMode==='donut') drawDonut(ctx,W,H,tasks,prog);
      else                    drawBar(ctx,W,H,tasks,prog);
      if(prog<1) rafRef.current=requestAnimationFrame(animate);
    }
    rafRef.current=requestAnimationFrame(animate);
    return ()=>{ if(rafRef.current) cancelAnimationFrame(rafRef.current); };
  },[tasks,chartMode]);

  const cats=[ ...new Set(tasks.map(t=>t.category))];
  const total=tasks.length, done=tasks.filter(t=>t.done).length;
  const totalPct=total>0?Math.round((done/total)*100):0;

  return (
    <div className="bg-card rounded-2xl border border-gray-100 shadow-card p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-bold text-ink">Progress</h3>
        <div className="flex gap-1 p-0.5 bg-surface rounded-lg">
          {(['donut','bar'] as const).map(m=>(
            <button key={m} onClick={()=>setChartMode(m)}
              className="px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 border-0 cursor-pointer"
              style={{ background:chartMode===m?'white':'transparent', color:chartMode===m?'#5b5cf6':'#b3b1c8', boxShadow:chartMode===m?'0 1px 4px rgba(0,0,0,.08)':'none' }}>
              {m==='donut'?'Donut':'Bar'}
            </button>
          ))}
        </div>
      </div>
      <p className="text-xs text-ink4 mb-4">Updates as you check tasks</p>

      <div className="relative w-full h-44 sm:h-52">
        <canvas ref={canvasRef} className="w-full h-full"/>
      </div>

      {cats.length>0 && (
        <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4">
          {cats.map(c=>{
            const catDone=tasks.filter(t=>t.category===c&&t.done).length;
            const catTotal=tasks.filter(t=>t.category===c).length;
            const catPct=total>0?Math.round((catDone/total)*100):0;
            return (
              <div key={c} className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background:col(c) }}/>
                <span className="flex-1 text-xs text-ink3 font-medium">{c}</span>
                <span className="text-xs font-bold text-ink2">{catDone}<span className="text-ink4 font-normal">/{catTotal}</span></span>
                <span className="text-xs text-ink4 w-8 text-right">{catPct}%</span>
              </div>
            );
          })}
          <div className="flex items-center gap-2.5 pt-2 border-t border-gray-100 mt-1">
            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0 bg-violet"/>
            <span className="flex-1 text-xs font-bold text-ink">Total</span>
            <span className="text-xs font-bold text-violet">{done}<span className="text-ink4 font-normal">/{total}</span></span>
            <span className="text-xs font-bold text-violet w-8 text-right">{totalPct}%</span>
          </div>
        </div>
      )}
      {tasks.length===0 && <p className="text-xs text-ink4 text-center py-4">Add tasks to see progress</p>}
    </div>
  );
}
