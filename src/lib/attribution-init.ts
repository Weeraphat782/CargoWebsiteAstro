import { initAttributionCapture } from '@/lib/attribution';
import { trackContactClick } from '@/lib/analytics';

/** Run once per page load from BaseLayout. */
export function bootAttribution(): void {
  initAttributionCapture();
  if (typeof document === 'undefined') return;
  document.addEventListener('click', (e) => {
    const a = (e.target as Element | null)?.closest?.('a[href^="tel:"], a[href^="mailto:"]');
    if (!(a instanceof HTMLAnchorElement)) return;
    const href = a.getAttribute('href') || '';
    trackContactClick(href);
  });
}
