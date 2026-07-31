#!/usr/bin/env node
/** Assert-based self-check for attribution.ts — no test framework. */
import assert from 'node:assert/strict';
import {
  captureAttributionFromContext,
  getAttributionFields,
} from '../src/lib/attribution.ts';

function memStorage() {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, v),
  };
}

// 1. Paid click captures utm + gclid and freezes first touch
{
  const s = memStorage();
  captureAttributionFromContext(
    s,
    { search: '?utm_source=google&utm_medium=cpc&gclid=abc123', pathname: '/contact', hostname: 'www.omgcargo.tech' },
    '',
  );
  const fields = getAttributionFields(s);
  assert.equal(fields.first_touch?.utm_source, 'google');
  assert.equal(fields.first_touch?.gclid, 'abc123');
  assert.equal(fields.last_touch?.utm_medium, 'cpc');

  captureAttributionFromContext(
    s,
    { search: '?utm_source=facebook&utm_medium=paid-social', pathname: '/services', hostname: 'www.omgcargo.tech' },
    '',
  );
  const again = getAttributionFields(s);
  assert.equal(again.first_touch?.utm_source, 'google', 'first touch must not overwrite');
  assert.equal(again.last_touch?.utm_source, 'facebook');
}

// 2. Internal navigation preserves last touch
{
  const s = memStorage();
  captureAttributionFromContext(
    s,
    { search: '?utm_source=newsletter&utm_medium=email', pathname: '/', hostname: 'www.omgcargo.tech' },
    '',
  );
  captureAttributionFromContext(
    s,
    { search: '', pathname: '/services', hostname: 'www.omgcargo.tech' },
    'https://www.omgcargo.tech/',
  );
  const fields = getAttributionFields(s);
  assert.equal(fields.last_touch?.utm_source, 'newsletter');
}

// 3. External referrer refreshes last touch, not first
{
  const s = memStorage();
  captureAttributionFromContext(
    s,
    { search: '?utm_source=google&utm_medium=cpc', pathname: '/', hostname: 'www.omgcargo.tech' },
    '',
  );
  captureAttributionFromContext(
    s,
    { search: '', pathname: '/about', hostname: 'www.omgcargo.tech' },
    'https://www.linkedin.com/feed/',
  );
  const fields = getAttributionFields(s);
  assert.equal(fields.first_touch?.utm_source, 'google');
  assert.equal(fields.last_touch?.referrer_host, 'www.linkedin.com');
}

// 4. Direct traffic produces no undefined strings
{
  const s = memStorage();
  captureAttributionFromContext(
    s,
    { search: '', pathname: '/contact', hostname: 'www.omgcargo.tech' },
    '',
  );
  const fields = getAttributionFields(s);
  assert.deepEqual(fields, {});
  const raw = JSON.stringify(fields);
  assert.ok(!raw.includes('undefined'));
}

console.log('OK: attribution self-check (4 cases)');
