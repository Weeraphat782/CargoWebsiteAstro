import { getSupabase } from '@/lib/supabase';
import {
  rowToDisplayItem,
  type CarrierBoardDisplayItem,
  type CarrierBoardRouteRow,
} from '@/types/carrier-board';

const FALLBACK_ROWS: Omit<CarrierBoardRouteRow, 'id' | 'created_at' | 'updated_at'>[] = [
  { country: 'Switzerland', city: 'Zurich', carrier_code: 'TG', sort_order: 0, is_active: true },
  { country: 'Macedonia', city: 'Skopje', carrier_code: 'LH', sort_order: 1, is_active: true },
  { country: 'Germany', city: 'Munich, Frankfurt', carrier_code: 'LH', sort_order: 2, is_active: true },
  { country: 'Australia', city: 'Melbourne, Sydney', carrier_code: 'TG', sort_order: 3, is_active: true },
  { country: 'Czech', city: 'Prague', carrier_code: 'QR', sort_order: 4, is_active: true },
  { country: 'Portugal', city: 'Lisbon', carrier_code: 'QR', sort_order: 5, is_active: true },
  { country: 'New Zealand', city: 'Auckland', carrier_code: 'Qantas', sort_order: 6, is_active: true },
];

function fallbackDisplayItems(): CarrierBoardDisplayItem[] {
  return FALLBACK_ROWS.map((r, i) =>
    rowToDisplayItem({
      ...r,
      id: `fallback-${i}-${r.country}-${r.carrier_code}`,
      created_at: '',
      updated_at: '',
    }),
  );
}

/** Build-time carrier routes for homepage (refreshes on CMS/marketing rebuild). */
export async function getCarrierBoardDisplayItems(): Promise<CarrierBoardDisplayItem[]> {
  const sb = getSupabase();
  if (!sb) return fallbackDisplayItems();

  const { data, error } = await sb
    .from('carrier_board_routes')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error || !data?.length) return fallbackDisplayItems();

  return (data as CarrierBoardRouteRow[]).map(rowToDisplayItem);
}
