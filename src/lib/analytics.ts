declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

function push(payload: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);
}

export function trackFormSubmit(formName = 'contact') {
  push({ event: 'generate_lead', form_name: formName });
}

export function trackCtaClick(label: string, location: string) {
  push({ event: 'cta_click', cta_label: label, cta_location: location });
}
