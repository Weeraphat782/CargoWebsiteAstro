'use client';

import { useState, type FormEvent } from 'react';
import { trackFormSubmit } from '@/lib/analytics';
import { Button } from '@/components/ui/button';
import { MarketingAlert, SpinnerIcon } from '@/components/ui/marketing-alert';

const CONTACT_API =
  import.meta.env.PUBLIC_CONTACT_API_URL || 'https://cargo.omgexp.com/api/contact';

const fieldClass =
  'mt-1.5 block min-h-[44px] w-full rounded-[var(--radius-sm)] border border-[var(--line-strong)] px-3 py-2.5 text-[15px] disabled:opacity-60';

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;

    setError(null);
    setSuccess(false);
    setLoading(true);

    const fd = new FormData(form);
    try {
      const res = await fetch(CONTACT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(fd.get('name') ?? '').trim(),
          email: String(fd.get('email') ?? '').trim(),
          company: String(fd.get('company') ?? '').trim() || undefined,
          inquiryType: String(fd.get('inquiry') ?? '').trim() || undefined,
          message: String(fd.get('message') ?? '').trim(),
        }),
      });

      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      trackFormSubmit('contact');
      setSuccess(true);
      form.reset();
    } catch {
      setError('Network error. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      {success && (
        <MarketingAlert variant="success" title="Message sent">
          Thanks — our team will respond within one business day.
        </MarketingAlert>
      )}
      {error && (
        <MarketingAlert variant="error" title="Could not send message">
          {error}
        </MarketingAlert>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-[13px] font-semibold" style={{ color: '#2b3138' }}>
          Name
          <input id="name" name="name" type="text" required disabled={loading} autoComplete="name" className={fieldClass} />
        </label>
        <label className="block text-[13px] font-semibold" style={{ color: '#2b3138' }}>
          Email
          <input id="email" name="email" type="email" required disabled={loading} autoComplete="email" className={fieldClass} />
        </label>
        <label className="block text-[13px] font-semibold sm:col-span-1" style={{ color: '#2b3138' }}>
          Company
          <input id="company" name="company" type="text" disabled={loading} className={fieldClass} />
        </label>
        <label className="block text-[13px] font-semibold" style={{ color: '#2b3138' }}>
          Inquiry Type
          <select id="inquiry" name="inquiry" disabled={loading} className={fieldClass}>
            <option value="">Select service…</option>
            <option value="air-freight">Specialized Air Freight</option>
            <option value="customs">Shipping & Customs</option>
            <option value="warehousing">GDP Warehousing</option>
            <option value="controlled-temp">Controlled Temperature Transport</option>
            <option value="qc-lab">QC Lab Testing</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label className="block text-[13px] font-semibold sm:col-span-2" style={{ color: '#2b3138' }}>
          Message
          <textarea id="message" name="message" rows={4} required disabled={loading} className={`${fieldClass} min-h-[120px]`} />
        </label>
      </div>
      <Button type="submit" disabled={loading} size="default">
        {loading ? (
          <>
            <SpinnerIcon /> Sending…
          </>
        ) : (
          <>Submit Request →</>
        )}
      </Button>
    </form>
  );
}
