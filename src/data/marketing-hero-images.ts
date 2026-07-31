/** Build a hotlink URL for Unsplash CDN (requires ixlib or many legacy photo IDs 404). */
export function unsplashHeroImage(photoId: string, width = 1600): string {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&q=72&fm=webp&ixlib=rb-4.1.0`;
}

/** OG share crop — 1200×630 jpg for social cards (OC-15). */
export function unsplashOgImage(photoId: string): string {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=1200&h=630&q=72&fm=jpg&ixlib=rb-4.1.0`;
}

const PHOTOS = {
  about: 'photo-1774698078446-59299e016718',
  services: 'photo-1493946740644-2d8a1f1a6aff',
  newsroom: 'photo-1647510283846-ed174cc84a78',
  contact: 'photo-1522071820081-009f0129c71c',
  resources: 'photo-1758876020300-76a782ca51c6',
  home: 'photo-1774698078446-59299e016718',
  cannabis: 'photo-1493946740644-2d8a1f1a6aff',
} as const;

/**
 * Page hero backgrounds — free Unsplash License images, themed per route.
 * Update photoId from https://unsplash.com/s/photos/… when swapping art.
 */
export const marketingHeroImages = {
  about: {
    src: unsplashHeroImage(PHOTOS.about),
    og: unsplashOgImage(PHOTOS.about),
    alt: 'Cargo plane being loaded at an airport tarmac',
    page: 'https://unsplash.com/photos/cargo-plane-being-loaded-at-an-airport-tarmac-85gDb_IHdAQ',
  },
  services: {
    src: unsplashHeroImage(PHOTOS.services),
    og: unsplashOgImage(PHOTOS.services),
    alt: 'Intermodal shipping containers at a freight logistics yard',
    page: 'https://unsplash.com/photos/assorted-color-filed-intermodal-containers-tjX_sniNzgQ',
  },
  newsroom: {
    src: unsplashHeroImage(PHOTOS.newsroom),
    og: unsplashOgImage(PHOTOS.newsroom),
    alt: 'Person reading a newspaper beside a laptop',
    page: 'https://unsplash.com/photos/a-person-reading-a-newspaper-next-to-a-laptop-computer-CktZjrBaM8s',
  },
  contact: {
    src: unsplashHeroImage(PHOTOS.contact),
    og: unsplashOgImage(PHOTOS.contact),
    alt: 'Team collaborating in an office',
    page: 'https://unsplash.com/photos/group-of-people-sitting-indoor-using-laptop-computer-MRWy090yrsw',
  },
  resources: {
    src: unsplashHeroImage(PHOTOS.resources),
    og: unsplashOgImage(PHOTOS.resources),
    alt: 'Professional reviewing charts and documents at a desk',
    page: 'https://unsplash.com/photos/man-in-office-reviewing-documents-at-desk-documents-cX62K66gMUk',
  },
  home: {
    src: unsplashHeroImage(PHOTOS.home),
    og: unsplashOgImage(PHOTOS.home),
    alt: 'Cargo plane being loaded at an airport tarmac',
    page: 'https://unsplash.com/photos/cargo-plane-being-loaded-at-an-airport-tarmac-85gDb_IHdAQ',
  },
  cannabis: {
    src: unsplashHeroImage(PHOTOS.cannabis),
    og: unsplashOgImage(PHOTOS.cannabis),
    alt: 'Air freight logistics for controlled botanical exports',
    page: 'https://unsplash.com/photos/assorted-color-filed-intermodal-containers-tjX_sniNzgQ',
  },
} as const;
