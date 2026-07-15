'use client';

import { useEffect, useRef, useState } from 'react';
import WorldMap from '@/components/react/WorldMap';

const skeleton = <div className="min-h-[400px] animate-pulse rounded-2xl bg-neutral-100" aria-hidden />;

export default function WorldMapDeferred() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, { rootMargin: '200px', threshold: 0.01 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <div ref={ref}>{visible ? <WorldMap /> : skeleton}</div>;
}
