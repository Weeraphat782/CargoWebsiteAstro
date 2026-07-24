'use client';

import { useEffect, useState } from 'react';
import { unsplashHeroImage } from '@/data/marketing-hero-images';
import { HERO_BG_MODE, HERO_VIDEO_SRC } from '@/data/marketing-document-demo';

const HOME_HERO_ID = 'photo-1774698078446-59299e016718';
const HERO_IMAGE = unsplashHeroImage(HOME_HERO_ID, 1900);
const HERO_SRCSET = `${unsplashHeroImage(HOME_HERO_ID, 640)} 640w, ${unsplashHeroImage(HOME_HERO_ID, 1280)} 1280w, ${HERO_IMAGE} 1900w`;

const heroGradientVideo =
  'linear-gradient(105deg,rgba(13,44,77,.78) 0%,rgba(13,44,77,.55) 42%,rgba(13,44,77,.32) 100%)';

const heroGradientImage =
  'linear-gradient(105deg,rgba(13,44,77,.62) 0%,rgba(13,44,77,.48) 42%,rgba(13,44,77,.28) 100%)';

export function HeroBackground() {
  const [useVideo, setUseVideo] = useState(false);

  useEffect(() => {
    if (HERO_BG_MODE !== 'video') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;
    setUseVideo(true);
  }, []);

  return (
    <>
      {useVideo ? (
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-[0.62]"
          src={HERO_VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={HERO_IMAGE}
          aria-hidden
        />
      ) : (
        <img
          src={HERO_IMAGE}
          srcSet={HERO_SRCSET}
          sizes="100vw"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-60"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          aria-hidden
        />
      )}
      <div
        className="absolute inset-0"
        style={{ background: useVideo ? heroGradientVideo : heroGradientImage }}
      />
    </>
  );
}
