import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { SCREENS } from '../src/app/screens';

/**
 * Screenshot every screen route and compare it with the Figma baseline (qa/figma).
 * Writes app screenshots to qa/app, diff images to qa/diff and a summary to qa/diff/report.md.
 * Filter with SCREENS=02,02b (comma-separated screen numbers).
 */
const ROOT = process.cwd();
const DIRS = { figma: path.join(ROOT, 'qa/figma'), app: path.join(ROOT, 'qa/app'), diff: path.join(ROOT, 'qa/diff') };
const TARGET = 2; // % mismatched pixels
const only = process.env.SCREENS?.split(',').map((s) => s.trim());
const selected = SCREENS.filter((s) => !only || only.includes(s.number));

interface Row {
  number: string;
  name: string;
  mismatch: number;
  appHeight: number;
  figmaHeight: number;
}
/*
 * Each screen's result goes to its own JSON file: Playwright restarts the worker after a failed test,
 * so an in-memory list would lose the earlier screens. The report is rebuilt from these files.
 */
const RESULTS = path.join(DIRS.diff, 'results');

test.beforeAll(() => {
  for (const dir of [DIRS.app, DIRS.diff, RESULTS]) fs.mkdirSync(dir, { recursive: true });
});

/** Copy `src` into a canvas of width×height (crop or pad with magenta so size differences count). */
function fit(src: PNG, width: number, height: number): PNG {
  const out = new PNG({ width, height });
  for (let i = 0; i < out.data.length; i += 4) {
    out.data[i] = 255;
    out.data[i + 1] = 0;
    out.data[i + 2] = 255;
    out.data[i + 3] = 255;
  }
  PNG.bitblt(src, out, 0, 0, Math.min(src.width, width), Math.min(src.height, height), 0, 0);
  return out;
}

for (const screen of selected) {
  test(`${screen.number} · ${screen.name}`, async ({ page }) => {
    await page.goto('/screens');
    await page.evaluate(() => sessionStorage.clear());
    await page.goto(screen.route);
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({
      content: '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}',
    });
    await page.waitForLoadState('networkidle');
    await page.evaluate(() =>
      Promise.all(
        Array.from(document.images).map((img) =>
          img.complete ? Promise.resolve() : new Promise((r) => img.addEventListener('load', r, { once: true })),
        ),
      ),
    );
    await page.mouse.move(0, 0);

    const file = screen.baseline;
    const appPath = path.join(DIRS.app, file);
    await page.screenshot({ path: appPath, fullPage: screen.fullPage });

    const figma = PNG.sync.read(fs.readFileSync(path.join(DIRS.figma, file)));
    const appRaw = PNG.sync.read(fs.readFileSync(appPath));
    const app = fit(appRaw, figma.width, figma.height);
    const diff = new PNG({ width: figma.width, height: figma.height });
    const bad = pixelmatch(figma.data, app.data, diff.data, figma.width, figma.height, { threshold: 0.1 });
    fs.writeFileSync(path.join(DIRS.diff, file), PNG.sync.write(diff));

    const mismatch = (bad / (figma.width * figma.height)) * 100;
    const row: Row = {
      number: screen.number,
      name: screen.name,
      mismatch,
      appHeight: appRaw.height,
      figmaHeight: figma.height,
    };
    fs.writeFileSync(path.join(RESULTS, `${screen.number}.json`), JSON.stringify(row));
    expect.soft(mismatch, `${screen.number} mismatch %`).toBeLessThan(TARGET);
  });
}

test.afterAll(() => {
  const results: Row[] = selected
    .map((s) => path.join(RESULTS, `${s.number}.json`))
    .filter((f) => fs.existsSync(f))
    .map((f) => JSON.parse(fs.readFileSync(f, 'utf8')) as Row);
  if (!results.length) return;
  const lines = [
    '# Visual QA report',
    '',
    `Viewport 1440×900 · deviceScaleFactor 1 · pixelmatch threshold 0.1 · target < ${TARGET}% mismatched pixels.`,
    '',
    '| Screen | Name | Mismatch % | App height | Figma height | Result |',
    '|---|---|---|---|---|---|',
    ...results.map(
      (r) =>
        `| ${r.number} | ${r.name} | ${r.mismatch.toFixed(2)} | ${r.appHeight} | ${r.figmaHeight} | ${
          r.mismatch < TARGET ? 'pass' : 'FAIL'
        } |`,
    ),
    '',
  ];
  const name = only ? `report-${only.join('_')}.md` : 'report.md';
  fs.writeFileSync(path.join(DIRS.diff, name), lines.join('\n'));
});
