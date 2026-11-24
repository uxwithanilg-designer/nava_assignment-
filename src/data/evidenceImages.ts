/**
 * Illustrative, AI-generated camera images exported from Figma frame 43:17
 * ("Evidence images — illustrative, AI-generated"). Real clips come from Sakku's cameras.
 */
import hazeSprayInward from '@/assets/images/evidence/haze-spray-inward.png';
import outwardExitNoGuard from '@/assets/images/evidence/outward-exit-no-guard.png';
import cameraBlocked from '@/assets/images/evidence/camera-blocked.png';
import lateSpray from '@/assets/images/evidence/late-spray.png';
import twoTrucksGuard from '@/assets/images/evidence/two-trucks-guard.png';

export type EvidenceImageKey =
  | 'haze-spray-inward' // 43:12 — TV-0412 disinfection frames (mist), evidence viewer
  | 'outward-exit-no-guard' // 43:13 — TV-0419 outward inspection frames
  | 'camera-blocked' // 43:14 — TV-0431 blocked spray camera
  | 'late-spray' // 43:15 — TV-0427 late spray
  | 'two-trucks-guard'; // 43:16 — TV-0438 / TV-0439 approach and inspection frames

export const EVIDENCE_IMAGES: Record<EvidenceImageKey, string> = {
  'haze-spray-inward': hazeSprayInward,
  'outward-exit-no-guard': outwardExitNoGuard,
  'camera-blocked': cameraBlocked,
  'late-spray': lateSpray,
  'two-trucks-guard': twoTrucksGuard,
};
