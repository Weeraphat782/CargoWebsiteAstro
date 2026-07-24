import { unsplashHeroImage } from '@/data/marketing-hero-images';

const HOME_HERO_ID = 'photo-1774698078446-59299e016718';

export const HERO_VIDEO_SRC = '/video/hero-bg.mp4';
/** Local poster for video LCP (prefer over remote Unsplash). */
export const HERO_POSTER_SRC = '/images/hero-poster.jpg';

export function getHeroBgMode(): 'video' | 'image' {
  return (import.meta.env.PUBLIC_HERO_BG || 'image').toLowerCase() === 'video' ? 'video' : 'image';
}

export const HERO_FALLBACK_IMAGE = unsplashHeroImage(HOME_HERO_ID, 1900);
export const HERO_FALLBACK_SRCSET = `${unsplashHeroImage(HOME_HERO_ID, 640)} 640w, ${unsplashHeroImage(HOME_HERO_ID, 1280)} 1280w, ${HERO_FALLBACK_IMAGE} 1900w`;
