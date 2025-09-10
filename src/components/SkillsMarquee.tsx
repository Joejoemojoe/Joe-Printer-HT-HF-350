"use client";
import { useEffect, useRef } from 'react';

const skills = [
  'CoreXY', 'High Flow', 'PEEK', 'Carbon Fiber', 'Beacon Probe', 'Input Shaping', 'Volumetric Flow', 'Resonance', 'Klipper', 'Pressure Advance', 'Active Cooling', 'Thermal Modeling', 'Mesh Compensation', 'Gantry Squaring'
];

export default function SkillsMarquee(){
  const trackRef = useRef<HTMLDivElement>(null);
  // Duplicate list to enable seamless loop (CSS handles animation)
  return (
    <div className="skills-marquee border border-border/60 rounded-md glass-card py-2 overflow-hidden">
      <div className="skills-track gap-6 px-4" ref={trackRef}>
        {[...skills, ...skills].map((s,i)=>(
          <span key={i} className="pill whitespace-nowrap">{s}</span>
        ))}
      </div>
    </div>
  );
}
