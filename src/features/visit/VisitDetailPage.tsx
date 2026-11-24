import { Outlet, useParams } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';

/** Placeholder — replaced when the visit screens are built. Renders the drawer/modal child routes. */
export function VisitDetailPage() {
  const { visitId } = useParams();
  return (
    <AppShell active="GateView" breadcrumb={['Overview', 'Unit 3', 'GateView', visitId ?? '']}>
      <p>{visitId}</p>
      <Outlet />
    </AppShell>
  );
}
