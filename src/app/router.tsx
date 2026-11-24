import { createBrowserRouter, Navigate } from 'react-router-dom';
import { OverviewPage } from '@/features/overview/OverviewPage';
import { GateDashboardPage } from '@/features/gate/GateDashboardPage';
import { VisitDetailPage } from '@/features/visit/VisitDetailPage';
import { AssignDrawer } from '@/features/visit/AssignDrawer';
import { CloseVisitModal } from '@/features/visit/CloseVisitModal';
import { EvidenceViewerPage } from '@/features/evidence/EvidenceViewerPage';
import { SopSettingsPage } from '@/features/settings/SopSettingsPage';
import { StatesPage } from '@/features/states/StatesPage';
import { ScreensPage } from '@/features/dev/ScreensPage';
import { ComponentsPage } from '@/features/dev/ComponentsPage';

/**
 * Routes for all 15 Figma frames (see src/app/screens.ts).
 * 02 / 02b / 03 share /gate (?chart=disinfection, ?hour=HH).
 * The assign drawer (05) and close modal (OV) are nested routes over the visit page.
 */
export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/gate" replace /> },
  { path: '/overview', element: <OverviewPage /> },
  { path: '/gate', element: <GateDashboardPage /> },
  {
    path: '/gate/visits/:visitId',
    element: <VisitDetailPage />,
    children: [
      { path: 'assign', element: <AssignDrawer /> },
      { path: 'close', element: <CloseVisitModal /> },
    ],
  },
  { path: '/gate/visits/:visitId/evidence/:step', element: <EvidenceViewerPage /> },
  { path: '/settings/sop', element: <SopSettingsPage /> },
  { path: '/states', element: <StatesPage /> },
  { path: '/screens', element: <ScreensPage /> },
  { path: '/components', element: <ComponentsPage /> },
  { path: '*', element: <Navigate to="/gate" replace /> },
], {
  // Opt in to the v7 behaviours now, so React Router logs no future-flag warnings.
  future: {
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  },
});
