"use client";
import { useEffect, useRef, useState } from 'react';

interface Item { key: string; title: string; body: string; }

const items: Item[] = [
  { key: 'speed', title: 'High Speed Pathing', body: 'Input shaping plus tuned acceleration & junction settings enable clean geometry at >300mm/s travel. Resonance data guides shaper choice to suppress ghosting.' },
  { key: 'flow', title: 'High Flow Extrusion', body: 'Calibrated volumetric flow curve and pressure advance deliver consistent line width when pushing near melt capacity. Dynamic flow strategies keep walls dimensionally stable.' },
  { key: 'thermal', title: 'Thermal Stability', body: 'PID tuned hotend & bed, insulated build surface, and Beacon mesh drift checks ensure first layer repeatability over long jobs.' },
  { key: 'probe', title: 'Beacon Mesh Strategy', body: 'Adaptive mesh density: coarse daily (5x5), dense after major changes (9x9). Drift deltas >0.05mm trigger mechanical inspection instead of blind compensation.' }
];

export default function FeaturedTabs(){
  const [active, setActive] = useState(0);
  const [height, setHeight] = useState<number|undefined>();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const ROTATE_MS = 7000;

  useEffect(()=>{
    // Measure dynamic height of active panel
    if(wrapperRef.current){
      const el = wrapperRef.current.querySelector('[data-active="true"]');
      if(el instanceof HTMLElement){ setHeight(el.offsetHeight); }
    }
  },[active]);

  useEffect(()=>{
    const id = setInterval(()=> setActive(a=> (a+1)%items.length), ROTATE_MS);
    return ()=> clearInterval(id);
  },[]);

  useEffect(()=>{
    if(!progressRef.current) return;
    progressRef.current.style.transition='none';
    progressRef.current.style.transform='scaleX(0.9)'; // start 90%
    requestAnimationFrame(()=>{
      if(!progressRef.current) return;
      progressRef.current.style.transition=`transform ${ROTATE_MS}ms linear`; 
      progressRef.current.style.transform='scaleX(0)';
    });
  },[active]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap text-xs font-medium">
        {items.map((it,i)=>(
          <button key={it.key} onClick={()=>setActive(i)} className={`pill transition-colors ${i===active? 'border-accent text-gray-200' : ''}`}>{it.title}</button>
        ))}
      </div>
      <div style={{height: height? height: undefined}} className="feature-panel-wrapper transition-all duration-500" ref={wrapperRef}>
        {items.map((it,i)=> (
          <div key={it.key} data-active={i===active} className={`feature-panel ${i===active? 'active':''}`}>
            <h4 className="text-sm font-semibold mb-2 text-white">{it.title}</h4>
            <p className="text-sm text-gray-400 leading-relaxed">{it.body}</p>
          </div>
        ))}
      </div>
      <div className="w-full h-1.5 bg-border/40 rounded overflow-hidden">
        <div ref={progressRef} className="feature-progress origin-right" />
      </div>
    </div>
  );
}
