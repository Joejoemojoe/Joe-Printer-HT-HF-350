"use client";
import dynamic from 'next/dynamic';
import { useEffect } from 'react';

const FeaturedTabs = dynamic(()=> import('../components/FeaturedTabs'), { ssr:false });
const SkillsMarquee = dynamic(()=> import('../components/SkillsMarquee'), { ssr:false });

interface Props { part: 'marquee' | 'featured' | 'reveal-init' | 'reveal-open'; }

export default function ClientHomeEnhancements({ part }: Props){
  useEffect(()=>{
    if(part==='reveal-init'){
      const obs = new IntersectionObserver(entries => {
        for(const e of entries){ if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target);} }
      },{ threshold: 0.15 });
      document.querySelectorAll('.reveal').forEach(el=> obs.observe(el));
      return ()=> obs.disconnect();
    }
  },[part]);

  if(part==='marquee') return <SkillsMarquee />;
  if(part==='featured') return <FeaturedTabs />;
  return null; // reveal-open just reserves a mount point, reveal-init sets up observer
}
