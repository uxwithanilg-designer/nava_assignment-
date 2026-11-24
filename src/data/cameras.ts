import type { Camera, Gate, Unit } from '@/types/domain';

export const units: Unit[] = [
  { id: 'unit-1', name: 'Unit 1', gateIds: [] },
  { id: 'unit-2', name: 'Unit 2', gateIds: [] },
  { id: 'unit-3', name: 'Unit 3', gateIds: ['main', 'feed'] },
];

export const gates: Record<string, Gate> = {
  main: { id: 'main', name: 'Main gate', unitId: 'unit-3', cameraIds: ['cam01-out', 'cam02', 'cam03', 'cam01-in'] },
  feed: { id: 'feed', name: 'Feed gate', unitId: 'unit-3', cameraIds: ['feed-cam-a', 'feed-cam-b'] },
};

/** Unit 3 cameras. CAM 02 (spray arch) has a partial view since 06:00 and was blocked 09:14–09:22. */
export const cameras: Record<string, Camera> = {
  'cam01-out': { id: 'cam01-out', code: 'CAM 01', name: 'Outside gate', gateId: 'main', health: 'Live' },
  cam02: {
    id: 'cam02',
    code: 'CAM 02',
    name: 'Spray arch',
    gateId: 'main',
    health: 'Partial view',
    healthNote: 'Partial view since 06:00 · blocked 09:14–09:22',
  },
  cam03: { id: 'cam03', code: 'CAM 03', name: 'Gate line', gateId: 'main', health: 'Live' },
  'cam01-in': { id: 'cam01-in', code: 'CAM 01', name: 'Inside gate', gateId: 'main', health: 'Live' },
  'feed-cam-a': { id: 'feed-cam-a', code: 'CAM 04', name: 'Feed gate', gateId: 'feed', health: 'Live' },
  'feed-cam-b': { id: 'feed-cam-b', code: 'CAM 05', name: 'Feed gate', gateId: 'feed', health: 'Live' },
};
