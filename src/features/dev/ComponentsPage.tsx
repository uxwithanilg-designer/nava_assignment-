import { useState, type ReactNode } from 'react';
import { ChartTooltip } from '@/components/charts/ChartTooltip';
import { EvidencePhoto, type EvidencePhotoSize } from '@/components/data/EvidencePhoto';
import { KpiCard } from '@/components/data/KpiCard';
import { ModuleTile } from '@/components/data/ModuleTile';
import { NeedsAttentionItem } from '@/components/data/NeedsAttentionItem';
import { StateBlock } from '@/components/data/StateBlock';
import { VisitTable } from '@/components/data/VisitTable';
import { NavItem } from '@/components/layout/NavItem';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { Avatar } from '@/components/ui/Avatar';
import { Button, type ButtonSize, type ButtonVariant } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { EvidenceQuality, type Quality } from '@/components/ui/EvidenceQuality';
import { Filter } from '@/components/ui/Filter';
import { IconButton } from '@/components/ui/IconButton';
import { LegendItem, type LegendSeries } from '@/components/ui/LegendItem';
import { PersonOption } from '@/components/ui/PersonOption';
import { RadioOption } from '@/components/ui/RadioOption';
import { ReviewTag, type ReviewKind } from '@/components/ui/ReviewTag';
import { Segment } from '@/components/ui/Segment';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { StatusChip, type ChipStatus } from '@/components/ui/StatusChip';
import { Tab } from '@/components/ui/Tab';
import { TextArea } from '@/components/ui/TextArea';
import { Toggle } from '@/components/ui/Toggle';
import { galleryHeader, gallerySamples as S, gallerySections as T } from '@/data/componentsGallery';
import { getGateDashboard } from '@/data/gate';
import { modules } from '@/data/overview';
import { analysingExample, cameraOfflineExample, nothingNeedsYouExample } from '@/data/states';
import navaLogo from '@/assets/logo/nava-logo.svg';
import styles from './ComponentsPage.module.css';

/**
 * /components — developer page (not a Figma screen): every component and variant from board
 * "C-01 — Components" (48:83), in the board's order, to compare with it side by side.
 */
const BUTTONS: [ButtonVariant, ButtonSize][] = [
  ['Primary', 'M'],
  ['Primary', 'S'],
  ['Secondary', 'M'],
  ['Secondary', 'S'],
  ['Ghost', 'M'],
  ['Ghost', 'S'],
];
const STATUSES: ChipStatus[] = [
  'Observed',
  'Not observed',
  'Late',
  'Needs review',
  'Low visibility',
  'Camera blocked',
  'Not required',
  'Phase 2',
];
const REVIEWS: ReviewKind[] = ['No owner', 'Assigned', 'Closed', 'None'];
const QUALITIES: Quality[] = ['Good', 'Partial', 'Low visibility', 'Camera blocked'];
const SERIES: LegendSeries[] = ['Observed', 'Late', 'Not observed', 'Needs review'];
const PHOTO_SIZES: EvidencePhotoSize[] = ['XS', 'S', 'M', 'L'];

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className={styles.section}>
      <header className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        {description && <p className={styles.sectionDescription}>{description}</p>}
      </header>
      {children}
    </section>
  );
}

/** Figma's dashed component-set frame. */
function Variants({ children, column = false }: { children: ReactNode; column?: boolean }) {
  return <div className={column ? styles.variantsColumn : styles.variants}>{children}</div>;
}

export function ComponentsPage() {
  const day = getGateDashboard();
  const [segment, setSegment] = useState<'all' | 'inward' | 'outward'>('all');
  const [toggles, setToggles] = useState([true, false]);
  const [checks, setChecks] = useState([true, false]);
  const gateModule = modules[0];
  const first = day.attention.items[0];
  const item = {
    id: first.id,
    meta: first.meta,
    age: first.age,
    title: first.title,
    status: first.status,
    review: first.review,
    image: first.image,
    photoTime: first.photoTime,
  };
  const rows = day.visits.rows.slice(0, 2);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <img src={navaLogo} alt="NAVA" width={100} height={24} className={styles.logo} />
          <span className={styles.spacer} />
          <span className={styles.tag}>{galleryHeader.tag}</span>
        </div>
        <h1 className={styles.title}>{galleryHeader.title}</h1>
        <p className={styles.description}>{galleryHeader.description}</p>
      </header>

      <div className={styles.body}>
        <Section {...T.avatar}>
          <Variants>
            <Avatar initials={S.avatars[1]} size="S" />
            <Avatar initials={S.avatars[1]} size="M" />
            <Avatar initials={S.avatars[1]} size="L" />
          </Variants>
        </Section>

        <Section {...T.button}>
          <Variants>
            {BUTTONS.map(([variant, size]) => (
              <Button
                key={`${variant}-${size}`}
                label="Button"
                variant={variant}
                size={size}
                icon="download"
              />
            ))}
          </Variants>
        </Section>

        <Section {...T.iconButton}>
          <Variants>
            <IconButton icon="bell" variant="Ghost" aria-label="Ghost icon button" />
            <IconButton icon="bell" variant="Outline" aria-label="Outline icon button" />
          </Variants>
        </Section>

        <Section {...T.statusChip}>
          <Variants>
            {STATUSES.map((status) => (
              <StatusChip key={status} status={status} />
            ))}
          </Variants>
        </Section>

        <Section {...T.reviewTag}>
          <Variants>
            {REVIEWS.map((review) => (
              <ReviewTag key={review} review={review} />
            ))}
          </Variants>
        </Section>

        <Section {...T.evidenceQuality}>
          <Variants>
            {QUALITIES.map((quality) => (
              <EvidenceQuality key={quality} quality={quality} />
            ))}
          </Variants>
        </Section>

        <Section {...T.legend}>
          <Variants>
            {SERIES.map((series) => (
              <LegendItem key={series} series={series} />
            ))}
          </Variants>
        </Section>

        <Section {...T.navigation}>
          <div className={styles.navItems}>
            <NavItem label="GateView" icon="gate" state="Default" />
            <NavItem label="GateView" icon="gate" state="Active" />
          </div>
          <Variants>
            <div className={styles.sidebarFrame}>
              <Sidebar active="GateView" />
            </div>
          </Variants>
        </Section>

        <Section {...T.topBar}>
          <Variants>
            <div className={styles.topBarFrame}>
              <TopBar breadcrumb={['Overview', 'Unit 3', 'GateView']} />
            </div>
          </Variants>
        </Section>

        <Section {...T.filter}>
          <Variants>
            <Filter label="Facility" value="Unit 3" state="Default" />
            <Filter label="Facility" value="Unit 3" state="Changed" />
          </Variants>
          <Variants>
            <Segment label="All" selected />
            <Segment label="All" />
          </Variants>
          <SegmentedControl
            aria-label="Direction"
            options={[
              { value: 'all', label: 'All' },
              { value: 'inward', label: 'Inward' },
              { value: 'outward', label: 'Outward' },
            ]}
            value={segment}
            onChange={setSegment}
          />
          <Variants>
            <Tab label="No owner" count={5} selected />
            <Tab label="No owner" count={5} />
          </Variants>
        </Section>

        <Section {...T.kpi}>
          <Variants>
            <KpiCard
              type="Count"
              icon="arrow-down-left"
              className={styles.kpi}
              label={S.kpi.count.label}
              value={S.kpi.count.value}
              unit={S.kpi.count.unit}
              badge={{ text: S.kpi.count.badge }}
              spark={S.kpi.count.spark}
              footnote={S.kpi.count.footnote}
            />
            <KpiCard
              type="Coverage"
              icon="vest"
              className={styles.kpi}
              label={S.kpi.coverage.label}
              value={S.kpi.coverage.value}
              caption={S.kpi.coverage.caption}
              bar={S.kpi.coverage.bar}
              footnote={S.kpi.coverage.footnote}
            />
            <KpiCard
              type="Coverage hidden"
              icon="droplets"
              className={styles.kpi}
              label={S.kpi.hidden.label}
              value={S.kpi.hidden.value}
              unit={S.kpi.hidden.unit}
              badge={{ text: S.kpi.hidden.badge }}
              bar={S.kpi.hidden.bar}
              footnote={S.kpi.hidden.footnote}
            />
            <KpiCard
              type="Review"
              icon="eye"
              className={styles.kpi}
              label={S.kpi.review.label}
              value={S.kpi.review.value}
              unit={S.kpi.review.unit}
              badge={{ text: S.kpi.review.badge }}
              caption={S.kpi.review.caption}
              link={{ label: S.kpi.review.link }}
            />
          </Variants>
        </Section>

        <Section {...T.moduleTile}>
          <Variants>
            <ModuleTile
              className={styles.moduleTile}
              name={gateModule.name}
              description={gateModule.description}
              icon={gateModule.icon}
              status={gateModule.status}
              value={String(gateModule.value)}
              unit={gateModule.unit}
              review={`${gateModule.needReview} need review`}
              noOwner={`${gateModule.noOwner} no owner`}
              link={gateModule.link}
            />
          </Variants>
        </Section>

        <Section {...T.evidencePhoto}>
          <Variants>
            <div className={styles.photos}>
              {PHOTO_SIZES.map((size) => (
                <EvidencePhoto
                  key={size}
                  size={size}
                  image={S.photo.image}
                  time={S.photo.time}
                  camera={S.photo.camera}
                  alt={`${S.photo.camera} at ${S.photo.time}, size ${size}`}
                />
              ))}
            </div>
          </Variants>
        </Section>

        <Section {...T.needsAttention}>
          <Variants>
            <div className={styles.attentionItem}>
              <NeedsAttentionItem {...item} state="Default" chevron={false} />
            </div>
            <div className={styles.attentionItem}>
              <NeedsAttentionItem {...item} state="Hover" />
            </div>
          </Variants>
        </Section>

        <Section {...T.chartTooltip}>
          <Variants>
            <ChartTooltip title={S.tooltip.title} rows={S.tooltip.rows} footer={S.tooltip.footer} />
          </Variants>
        </Section>

        <Section {...T.visitTable}>
          <div className={styles.table}>
            <VisitTable
              caption="Visit rows: Default and Hover"
              restingIndex={1}
              rows={rows.map((visit) => ({ visit }))}
            />
          </div>
        </Section>

        <Section {...T.formControls}>
          <Variants>
            <RadioOption
              className={styles.radio}
              name="g-radio"
              value="a"
              label={S.radio.label}
              helper={S.radio.helper}
              selected
            />
            <RadioOption
              className={styles.radio}
              name="g-radio"
              value="b"
              label={S.radio.label}
              helper={S.radio.helper}
            />
          </Variants>
          <Variants>
            <PersonOption
              className={styles.person}
              name="g-person"
              value="a"
              label={S.person.name}
              initials={S.person.initials}
              role={S.person.role}
              open={S.person.open}
              selected
            />
            <PersonOption
              className={styles.person}
              name="g-person"
              value="b"
              label={S.person.name}
              initials={S.person.initials}
              role={S.person.role}
              open={S.person.open}
            />
          </Variants>
          <Variants>
            {checks.map((checked, i) => (
              <Checkbox
                key={i}
                label={S.checkbox}
                checked={checked}
                onChange={(next) => setChecks((c) => c.map((v, j) => (j === i ? next : v)))}
              />
            ))}
          </Variants>
          <Variants>
            <TextArea className={styles.textArea} label={S.textArea.label} value={S.textArea.value} />
          </Variants>
          <Variants>
            {toggles.map((on, i) => (
              <Toggle
                key={i}
                on={on}
                aria-label={on ? 'Toggle on' : 'Toggle off'}
                onChange={(next) => setToggles((t) => t.map((v, j) => (j === i ? next : v)))}
              />
            ))}
          </Variants>
        </Section>

        <Section {...T.states}>
          <Variants column>
            <div className={styles.statesRow}>
              <div className={styles.quiet}>
                <StateBlock
                  state={nothingNeedsYouExample.state}
                  title={nothingNeedsYouExample.title}
                  description={nothingNeedsYouExample.description}
                  actionLabel={nothingNeedsYouExample.actionLabel}
                />
              </div>
              <StateBlock
                className={styles.wide}
                state={cameraOfflineExample.state}
                title={cameraOfflineExample.title}
                description={cameraOfflineExample.description}
                actionLabel={cameraOfflineExample.actionLabel}
              />
            </div>
            <div className={styles.statesRow}>
              <StateBlock
                className={styles.wide}
                state={analysingExample.state}
                title={analysingExample.title}
                description={analysingExample.description}
              />
              <div className={styles.loading}>
                <StateBlock state="Loading" />
              </div>
            </div>
          </Variants>
        </Section>
      </div>
    </main>
  );
}
