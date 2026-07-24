/** Build a hotlink URL for Unsplash CDN (requires ixlib or many legacy photo IDs 404). */
export function unsplashHeroImage(photoId: string, width = 1800): string {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&q=72&fm=jpg&ixlib=rb-4.1.0`;
}

/**
 * Page hero backgrounds — free Unsplash License images, themed per route.
 * Update photoId from https://unsplash.com/s/photos/… when swapping art.
 */
export const marketingHeroImages = {
  about: {
    src: unsplashHeroImage('photo-1774698078446-59299e016718'),
    alt: 'Cargo plane being loaded at an airport tarmac',
    page: 'https://unsplash.com/photos/cargo-plane-being-loaded-at-an-airport-tarmac-85gDb_IHdAQ',
  },
  services: {
    src: unsplashHeroImage('photo-1493946740644-2d8a1f1a6aff'),
    alt: 'Intermodal shipping containers at a freight logistics yard',
    page: 'https://unsplash.com/photos/assorted-color-filed-intermodal-containers-tjX_sniNzgQ',
  },
  newsroom: {
    src: unsplashHeroImage('photo-1647510283846-ed174cc84a78'),
    alt: 'Person reading a newspaper beside a laptop',
    page: 'https://unsplash.com/photos/a-person-reading-a-newspaper-next-to-a-laptop-computer-CktZjrBaM8s',
  },
  contact: {
    src: unsplashHeroImage('photo-1522071820081-009f0129c71c'),
    alt: 'Team collaborating in an office',
    page: 'https://unsplash.com/photos/group-of-people-sitting-indoor-using-laptop-computer-MRWy090yrsw',
  },
  resources: {
    src: unsplashHeroImage('photo-1758876020300-76a782ca51c6'),
    alt: 'Professional reviewing charts and documents at a desk',
    page: 'https://unsplash.com/photos/man-in-office-reviewing-documents-at-desk-documents-cX62K66gMUk',
  },
  /** Home hero — same cargo-loading shot as brand air-freight story */
  home: {
    src: unsplashHeroImage('photo-1774698078446-59299e016718'),
    alt: 'Cargo plane being loaded at an airport tarmac',
    page: 'https://unsplash.com/photos/cargo-plane-being-loaded-at-an-airport-tarmac-85gDb_IHdAQ',
  },
} as const;
