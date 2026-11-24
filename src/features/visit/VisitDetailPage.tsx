import { useEffect, useMemo, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { Toast } from '@/components/ui/Toast';
import { assignToastMessage, getVisitDetail, type VisitDetail } from '@/data/visits';
import { useReviewStore } from '@/store/reviewStore';
import { CamerasPanel } from './CamerasPanel';
import { ReviewPanel } from './ReviewPanel';
import { Timeline } from './Timeline';
import { VisitHeader } from './VisitHeader';
import { VisitNav } from './VisitNav';
import { WhichTruckPanel } from './WhichTruckPanel';
import { TOAST_DURATION_MS, visitPath, type VisitLocationState, type VisitToast } from './navigation';
import { demoOverride, resolveVisit } from './resolveVisit';
import styles from './VisitDetailPage.module.css';

/**
 * SH-03 visit page: screens 04 (TV-0412), 06 (?demo=assigned), 07 (?demo=closed), 08 (TV-0431),
 * 09 (TV-0419) and 10 (TV-0438). The assign drawer (05) and the close modal (OV) are child routes
 * rendered through <Outlet/> over this page.
 */
export function VisitDetailPage() {
  const { visitId } = useParams();
  const detail = getVisitDetail(visitId);
  if (!detail) return <Navigate to="/gate" replace />;
  return <VisitDetailContent key={detail.id} detail={detail} />;
}

function VisitDetailContent({ detail }: { detail: VisitDetail }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state, seed, unassign, reopen, confirmLink } = useReviewStore();
  const path = visitPath(detail.id);

  // ?demo=assigned / ?demo=closed seed the visit into the 06 / 07 state.
  const demo = searchParams.get('demo');
  const seeded = useMemo(() => demoOverride(detail, demo), [detail, demo]);
  useEffect(() => {
    if (seeded) seed(detail.id, seeded);
  }, [seeded, seed, detail.id]);

  const view = resolveVisit(detail, seeded ?? state.visits[detail.id]);

  // One-shot toast handed over by the drawer / modal; consumed so Back does not replay it.
  const [toast, setToast] = useState<VisitToast | null>(null);
  const handedToast = (location.state as VisitLocationState | null)?.toast;
  useEffect(() => {
    if (!handedToast) return;
    setToast(handedToast);
    navigate({ pathname: location.pathname, search: location.search }, { replace: true, state: null });
  }, [handedToast, navigate, location.pathname, location.search]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), TOAST_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [toast]);

  // The deep links keep their toast visible (no auto-hide).
  const demoToast: VisitToast | null = !seeded
    ? null
    : seeded.phase === 'assigned' && seeded.ownerId
      ? { message: assignToastMessage(seeded.ownerId, true), undo: true }
      : { message: detail.close.toast };
  const shownToast = demoToast ?? toast;

  const leaveDemo = () => {
    if (seeded) navigate(path, { replace: true });
  };
  const onUndo = () => {
    unassign(detail.id);
    setToast(null);
    leaveDemo();
  };
  const onReopen = () => {
    reopen(detail.id);
    setToast(null);
    leaveDemo();
  };

  return (
    <AppShell active="GateView" breadcrumb={detail.breadcrumb}>
      <VisitNav backTo="/gate" position={detail.position} prevTo={detail.prevTo} nextTo={view.nextTo} />
      <VisitHeader id={detail.id} chips={detail.chips} status={view.status} heading={view.heading} body={view.body} />
      <div className={styles.columns}>
        <Timeline steps={view.steps} banner={detail.banner} footnote={detail.footnote} />
        <div className={styles.side}>
          <ReviewPanel visitId={detail.id} review={view.review} onReopen={onReopen} />
          <WhichTruckPanel
            link={view.link}
            picked={state.links[detail.id]}
            onPick={(truckId) => confirmLink(detail.id, truckId)}
          />
          <CamerasPanel cameras={detail.cameras} />
        </div>
      </div>
      {shownToast && (
        <Toast
          message={shownToast.message}
          actionLabel={shownToast.undo ? 'Undo' : undefined}
          onAction={shownToast.undo ? onUndo : undefined}
        />
      )}
      <Outlet />
    </AppShell>
  );
}
