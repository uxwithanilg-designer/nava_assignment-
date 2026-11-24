/** Which check the "Results by hour" chart shows (02: inspection, 02b: disinfection). */
export type HourChartKind = 'inspection' | 'disinfection';

/** Gate dashboard URL: /gate, /gate?chart=disinfection (02b), /gate?hour=07 (03), or both. */
export function gateHref({ hour, chart }: { hour?: string; chart?: HourChartKind }) {
  const params = new URLSearchParams();
  if (chart === 'disinfection') params.set('chart', 'disinfection');
  if (hour) params.set('hour', hour);
  const query = params.toString();
  return query ? `/gate?${query}` : '/gate';
}
