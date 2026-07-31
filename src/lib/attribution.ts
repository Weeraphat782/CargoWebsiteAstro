/** ponytail: localStorage attribution — upgrade path: server-side session cookie for cross-device */

const FIRST_KEY = 'omgexp_attr_first';
const LAST_KEY = 'omgexp_attr_last';

const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const;

const CLICK_KEYS = [
  'gclid',
  'gbraid',
  'wbraid',
  'fbclid',
  'msclkid',
  'ttclid',
  'li_fat_id',
] as const;

const ALL_KEYS = [...UTM_KEYS, ...CLICK_KEYS] as const;

export type AttributionTouch = Partial<Record<(typeof ALL_KEYS)[number], string>> & {
  referrer_host?: string;
  landing_path?: string;
  captured_at?: string;
};

export type AttributionPayload = {
  first_touch?: AttributionTouch;
  last_touch?: AttributionTouch;
};

export interface AttributionStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

type Loc = { search: string; pathname: string; hostname: string };

function parseParams(search: string): AttributionTouch {
  const out: AttributionTouch = {};
  if (!search || search === '?') return out;
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  for (const key of ALL_KEYS) {
    const v = params.get(key)?.trim();
    if (v) out[key] = v.slice(0, 500);
  }
  return out;
}

function externalReferrerHost(referrer: string, hostname: string): string | undefined {
  if (!referrer) return undefined;
  try {
    const host = new URL(referrer).hostname;
    if (!host || host === hostname) return undefined;
    return host.slice(0, 253);
  } catch {
    return undefined;
  }
}

function hasSignal(touch: AttributionTouch, refHost?: string): boolean {
  return ALL_KEYS.some((k) => Boolean(touch[k])) || Boolean(refHost);
}

function readTouch(storage: AttributionStorage, key: string): AttributionTouch | null {
  try {
    const raw = storage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AttributionTouch;
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

function writeTouch(storage: AttributionStorage, key: string, touch: AttributionTouch): void {
  storage.setItem(key, JSON.stringify(touch));
}

/** Pure capture — testable without DOM. Updates last touch only when params or external referrer present. */
export function captureAttributionFromContext(
  storage: AttributionStorage,
  loc: Loc,
  referrer: string,
): void {
  const params = parseParams(loc.search);
  const refHost = externalReferrerHost(referrer, loc.hostname);
  if (!hasSignal(params, refHost)) return;

  const touch: AttributionTouch = {
    ...params,
    ...(refHost ? { referrer_host: refHost } : {}),
    landing_path: loc.pathname || '/',
    captured_at: new Date().toISOString(),
  };

  if (!readTouch(storage, FIRST_KEY)) writeTouch(storage, FIRST_KEY, touch);
  writeTouch(storage, LAST_KEY, touch);
}

export function getAttributionFields(storage: AttributionStorage): AttributionPayload {
  const first = readTouch(storage, FIRST_KEY);
  const last = readTouch(storage, LAST_KEY);
  const out: AttributionPayload = {};
  if (first && Object.keys(first).length) out.first_touch = first;
  if (last && Object.keys(last).length) out.last_touch = last;
  return out;
}

export function initAttributionCapture(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  captureAttributionFromContext(localStorage, window.location, document.referrer);
}

export function attributionFields(): AttributionPayload {
  if (typeof window === 'undefined' || !window.localStorage) return {};
  return getAttributionFields(localStorage);
}
