declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

function push(payload: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  try {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push(payload);
  } catch {
    // ponytail: measurement must never break the form
  }
}

export function trackFormSubmit(formName = 'contact', transactionId?: string) {
  push({
    event: 'generate_lead',
    form_name: formName,
    ...(transactionId ? { transaction_id: transactionId } : {}),
  });
}

export function trackCtaClick(label: string, location: string) {
  push({ event: 'cta_click', cta_label: label, cta_location: location });
}

export function trackContactClick(href: string) {
  const method = href.startsWith('tel:') ? 'phone' : 'email';
  const value = href.replace(/^(tel:|mailto:)/, '');
  push({ event: 'contact_click', contact_method: method, contact_value: value });
}
