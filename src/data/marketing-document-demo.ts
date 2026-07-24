/** Pre-booking document slots for marketing demo (mirrors Tr customer-check-rule slugs). */
import { getHeroBgMode, HERO_VIDEO_SRC } from '@/lib/hero';

export const MARKETING_DEMO_DOC_SLOTS = [
  { type: 'tk-32', label: 'TK-32 Export Permit', hint: 'Required · PDF or image', primary: true },
  { type: 'import-permit', label: 'Import Permit', hint: 'PDF or image' },
  { type: 'tk-31', label: 'TK-31 Export Report', hint: 'PDF or image' },
  { type: 'purchase-order', label: 'Purchase Order', hint: 'Buyer PO with quantities' },
  { type: 'packing-list', label: 'Packing List', hint: 'Net & gross weights per line' },
  { type: 'commercial-invoice', label: 'Commercial Invoice', hint: 'Unit prices & currency' },
] as const;

export type DemoCheckStatus = 'PASS' | 'WARNING' | 'FAIL';

export interface DemoCheckResponse {
  success: boolean;
  overallStatus: DemoCheckStatus;
  checks: Array<{
    name: string;
    status: DemoCheckStatus;
    details: string;
    message: string;
  }>;
  documents: Array<{
    name: string;
    file_name: string;
    critical_issues: string[];
    warnings: string[];
  }>;
  checksRemaining?: number;
  checkedAt?: string;
  error?: string;
}

export const DOCUMENT_DEMO_API_URL =
  import.meta.env.PUBLIC_DOCUMENT_DEMO_API_URL || 'https://cargo.omgexp.com/api/public/document-demo';

export { HERO_VIDEO_SRC };
/** Resolved at build time from `PUBLIC_HERO_BG`. */
export const HERO_BG_MODE = getHeroBgMode();
