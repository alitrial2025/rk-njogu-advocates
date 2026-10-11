import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { checklistChecks } from './checklist-check.mjs';

// Run against the production preview: BASE_URL=http://127.0.0.1:4173 node scripts/browser-check.mjs
const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:4173';
const artifacts = resolve('artifacts');
const docs = resolve('docs');
await mkdir(artifacts, { recursive: true });
await mkdir(docs, { recursive: true });

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_EXECUTABLE ?? '/usr/bin/chromium',
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const report = {
  measuredAt: new Date().toISOString(),
  baseURL,
  browser: browser.version(),
  methodology: 'Headless Chromium in the execution environment. Native wheel scrolling, requestAnimationFrame intervals, PerformanceObserver long tasks and layout shifts. Motion checks observe actual rendered transforms, visible content, keyboard focus, and reduced-motion preference changes. These are environment-specific measurements, not physical-device FPS or field Core Web Vitals.',
  checks: [],
  accessibility: [],
  motion: [],
  scroll: [],
  errors: [],
};

function expect(condition, message) {
  if (!condition) throw new Error(message);
}

async function check(name, callback) {
  try {
    const details = await callback();
    report.checks.push({ name, status: 'passed', ...(details ? { details } : {}) });
    console.log(`PASS ${name}`);
  } catch (error) {
    report.checks.push({ name, status: 'failed', error: error.message });
    console.error(`FAIL ${name}: ${error.message}`);
  }
}

async function ready(page) {
  await page.goto(baseURL, { waitUntil: 'networkidle' });
  if (process.env.EXPECTED_COMMIT) {
    const revision = await page.locator('meta[name="build-revision"]').getAttribute('content');
    expect(revision === process.env.EXPECTED_COMMIT, `Deployed build ${revision} does not match expected commit ${process.env.EXPECTED_COMMIT}`);
  }
  await page.evaluate(() => document.fonts.ready);
  await page.locator('main').waitFor();
}

async function overflow(page) {
  return page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
}

async function accessibility(page, label) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  const violations = results.violations.map(({ id, impact, description, helpUrl, nodes }) => ({
    id, impact, description, helpUrl,
    nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
  }));
  report.accessibility.push({ label, violations, passes: results.passes.length });
  await check(`${label}: automated accessibility`, () => {
    expect(violations.length === 0, `${violations.length} accessibility violation(s): ${violations.map(v => v.id).join(', ')}`);
  });
}

async function revealVisibility(page) {
  return page.evaluate(() => {
    const targets = [...new Set([
      ...document.querySelectorAll('[data-reveal]'),
      ...Array.from(document.querySelectorAll('[data-reveal-group]')).flatMap(group => Array.from(group.children)),
    ])];
    return targets.map(element => {
      let opacity = 1;
      let visible = true;
      for (let ancestor = element; ancestor; ancestor = ancestor.parentElement) {
        const style = getComputedStyle(ancestor);
        opacity *= Number(style.opacity);
        visible &&= style.visibility !== 'hidden' && style.display !== 'none';
      }
      const bounds = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      const transform = new DOMMatrixReadOnly(style.transform === 'none' ? undefined : style.transform);
      return {
        label: `${element.tagName.toLowerCase()}.${element.className}`,
        opacity,
        visible,
        width: bounds.width,
        height: bounds.height,
        translateY: transform.m42,
      };
    });
  });
}

async function settleScroll(page) {
  await page.evaluate(() => new Promise(resolve => {
    let previous = scrollY;
    let lastChange = performance.now();
    const started = lastChange;
    function sample(timestamp) {
      if (Math.abs(scrollY - previous) > 0.2) lastChange = timestamp;
      previous = scrollY;
      if (timestamp - lastChange >= 120 || timestamp - started > 1500) {
        resolve();
        return;
      }
      requestAnimationFrame(sample);
    }
    requestAnimationFrame(sample);
  }));
}

async function wheelTo(page, desired) {
  const movement = await page.evaluate(value => {
    const destination = Math.min(document.documentElement.scrollHeight - innerHeight, Math.max(0, value));
    return destination - scrollY;
  }, desired);
  if (Math.abs(movement) > 0.5) await page.mouse.wheel(0, movement);
  await settleScroll(page);
}

async function strongScrollMotion(page, label) {
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await settleScroll(page);
  const geometry = await page.locator('.about-visual').evaluate(element => {
    const bounds = element.getBoundingClientRect();
    return { top: bounds.top + scrollY, height: bounds.height, viewport: innerHeight };
  });
  const samples = [];
  for (const position of [geometry.top - geometry.viewport * 0.85, geometry.top - geometry.viewport * 0.3, geometry.top + geometry.height * 0.2]) {
    await wheelTo(page, position);
    samples.push(await page.evaluate(() => {
      const frame = document.querySelector('.about-art');
      const bounds = frame.getBoundingClientRect();
      const style = getComputedStyle(frame);
      const matrix = new DOMMatrixReadOnly(style.transform === 'none' ? undefined : style.transform);
      const rows = Array.from(document.querySelectorAll('.kinetic-line')).map(element => {
        const transform = getComputedStyle(element).transform;
        return new DOMMatrixReadOnly(transform === 'none' ? undefined : transform).m41;
      });
      return {
        scrollY, translateY: matrix.m42,
        rotationDegrees: Math.atan2(matrix.m12, matrix.m11) * 180 / Math.PI,
        scale: Math.hypot(matrix.m11, matrix.m12),
        frameInViewport: bounds.bottom > 0 && bounds.top < innerHeight,
        kineticRowX: rows,
      };
    }));
  }
  const range = property => Math.max(...samples.map(sample => sample[property])) - Math.min(...samples.map(sample => sample[property]));
  expect(samples.filter(sample => sample.frameInViewport).length >= 2, 'Moving firm artwork was not visible at two sampled scroll positions');
  expect(range('translateY') >= 25, `Firm artwork travel is too small to observe (${range('translateY').toFixed(2)}px)`);
  expect(range('rotationDegrees') >= 2 || range('scale') >= 0.04, 'Firm artwork does not visibly change its rotation or scale with scrolling');
  expect(samples.every(sample => sample.kineticRowX.length === 2), 'Expected two decorative kinetic text rows');
  const first = samples[0].kineticRowX;
  const last = samples.at(-1).kineticRowX;
  const deltas = [last[0] - first[0], last[1] - first[1]];
  expect(deltas.every(delta => Math.abs(delta) >= 24) && deltas[0] * deltas[1] < 0, `Kinetic text does not move visibly in opposite directions: ${JSON.stringify(deltas)}`);
  const details = { artworkTravelPx: Number(range('translateY').toFixed(2)), artworkRotationRangeDegrees: Number(range('rotationDegrees').toFixed(2)), kineticTravelPx: deltas.map(value => Number(value.toFixed(2))), samples };
  report.motion.push({ label, strongScrollMotion: details });
  return details;
}

async function mobileApproach(page) {
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await settleScroll(page);
  const geometry = await page.locator('.approach-step').evaluateAll(elements => elements.map(element => ({ top: element.getBoundingClientRect().top + scrollY, height: element.getBoundingClientRect().height })));
  expect(geometry.length === 3, `Expected three approach cards, found ${geometry.length}`);
  const headerHeight = await page.locator('header').evaluate(element => element.getBoundingClientRect().height);
  const results = [];
  for (let index = 0; index < geometry.length; index++) {
    await wheelTo(page, geometry[index].top - headerHeight - 36);
    await page.waitForTimeout(750);
    const card = page.locator('.approach-step').nth(index);
    const content = await card.evaluate(element => {
      const headerBottom = document.querySelector('header').getBoundingClientRect().bottom;
      return Array.from(element.querySelectorAll('h3, .step-content > p')).map(part => {
        const bounds = part.getBoundingClientRect();
        const top = document.elementFromPoint(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
        return { text: part.textContent.trim(), top: bounds.top, bottom: bounds.bottom, viewport: innerHeight, headerBottom, uncovered: Boolean(top && (top === part || part.contains(top))) };
      });
    });
    expect(content.length === 2, `Approach card ${index + 1} is missing its heading or explanation`);
    expect(content.every(part => part.top >= part.headerBottom && part.bottom <= part.viewport && part.uncovered), `Approach card ${index + 1} cannot be read before the next card covers it: ${JSON.stringify(content)}`);
    if (index === 0) {
      const before = await card.evaluate(element => ({ top: element.getBoundingClientRect().top, scrollY }));
      await page.mouse.wheel(0, 100);
      await settleScroll(page);
      const after = await card.evaluate(element => ({ top: element.getBoundingClientRect().top, scrollY }));
      const scrolled = after.scrollY - before.scrollY;
      expect(scrolled >= 70 && Math.abs(after.top - before.top) < scrolled * 0.5, 'Approach card does not remain pinned while the document advances');
      results.push({ card: index + 1, content, stickyScrollDelta: scrolled, cardTopDelta: after.top - before.top });
    } else results.push({ card: index + 1, content });
  }
  return { readableCards: results.length, cards: results };
}

async function motionChecks(page, label) {
  await ready(page);
  await check(`${label}: section entrance moves smoothly into its readable position`, async () => {
    const selected = await page.evaluate(() => {
      const nodes = [...new Set([
        ...document.querySelectorAll('[data-reveal]'),
        ...Array.from(document.querySelectorAll('[data-reveal-group]')).flatMap(group => Array.from(group.children)),
      ])];
      const candidates = nodes.map(element => {
        const bounds = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        const matrix = new DOMMatrixReadOnly(style.transform === 'none' ? undefined : style.transform);
        return { element, top: bounds.top, translateY: matrix.m42, width: bounds.width, height: bounds.height };
      }).filter(candidate => candidate.top > innerHeight * 1.2 && candidate.width > 0 && candidate.height > 0 && candidate.translateY > 10);
      const candidate = candidates.sort((a, b) => Math.abs(a.top - document.documentElement.scrollHeight * 0.45) - Math.abs(b.top - document.documentElement.scrollHeight * 0.45))[0];
      if (!candidate) return null;
      window.__motionProbe = { element: candidate.element, samples: [], raf: 0 };
      const probe = window.__motionProbe;
      function sample(timestamp) {
        const style = getComputedStyle(probe.element);
        const matrix = new DOMMatrixReadOnly(style.transform === 'none' ? undefined : style.transform);
        const bounds = probe.element.getBoundingClientRect();
        probe.samples.push({ timestamp, translateY: matrix.m42, opacity: Number(style.opacity), inViewport: bounds.bottom > 0 && bounds.top < innerHeight });
        probe.raf = requestAnimationFrame(sample);
      }
      probe.raf = requestAnimationFrame(sample);
      return { initialTranslateY: candidate.translateY, documentTop: candidate.top, text: candidate.element.textContent?.trim().slice(0, 100) };
    });
    expect(selected !== null, 'No below-fold section has a visible entrance displacement to exercise');
    try {
      for (let step = 0; step < 80; step++) {
        const position = await page.evaluate(() => ({ top: window.__motionProbe.element.getBoundingClientRect().top, viewport: innerHeight }));
        if (position.top < position.viewport * 0.7) break;
        await page.mouse.wheel(0, Math.min(position.viewport * 0.65, position.top - position.viewport * 0.65));
        await page.waitForTimeout(80);
      }
      await page.waitForFunction(() => {
        const element = window.__motionProbe.element;
        const bounds = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        const matrix = new DOMMatrixReadOnly(style.transform === 'none' ? undefined : style.transform);
        return bounds.bottom > 0 && bounds.top < innerHeight && Math.abs(matrix.m42) < 0.5 && Number(style.opacity) >= 0.99;
      }, undefined, { timeout: 4000 });
      const samples = await page.evaluate(() => window.__motionProbe.samples);
      expect(samples.some(sample => sample.inViewport && sample.translateY > 0.5 && sample.translateY < selected.initialTranslateY - 0.5), 'Section jumped directly to its final position without an observed intermediate animation frame');
      expect(samples.at(-1).opacity >= 0.99, 'The revealed content remains translucent');
      const details = { ...selected, observedIntermediateFrames: samples.filter(sample => sample.inViewport && sample.translateY > 0.5 && sample.translateY < selected.initialTranslateY - 0.5).length };
      report.motion.push({ label, entrance: details });
      return details;
    } finally {
      await page.evaluate(() => cancelAnimationFrame(window.__motionProbe.raf));
    }
  });

  await check(`${label}: reading progress responds to real document scrolling`, async () => {
    const supported = await page.evaluate(() => CSS.supports('animation-timeline', 'scroll(root block)'));
    if (!supported) return { supported: false, reason: 'This browser does not support native CSS scroll timelines; section entrances remain tested.' };
    const progress = page.locator('.reading-progress');
    expect(await progress.count() === 1, 'Native scroll timeline is supported but no reading progress indicator is present');
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(100);
    const initialScale = await progress.evaluate(element => new DOMMatrixReadOnly(getComputedStyle(element).transform).m11);
    const distance = await page.evaluate(() => Math.min(innerHeight * 1.5, (document.documentElement.scrollHeight - innerHeight) * 0.5));
    await page.mouse.wheel(0, distance);
    await page.waitForTimeout(180);
    const currentScale = await progress.evaluate(element => new DOMMatrixReadOnly(getComputedStyle(element).transform).m11);
    expect(currentScale > initialScale + 0.01, `Reading progress did not grow after scrolling (${initialScale} → ${currentScale})`);
    return { supported, initialScale, afterScrollScale: currentScale };
  });

  await check(`${label}: firm artwork and kinetic text visibly respond to scrolling`, () => strongScrollMotion(page, label));

  await check(`${label}: keyboard navigation never focuses visually hidden content`, async () => {
    await ready(page);
    await page.locator('body').click({ position: { x: 2, y: 2 } });
    let checked = 0;
    for (let index = 0; index < 32; index++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(50);
      // Native focus scrolling follows the site's smooth-scroll preference.
      // Wait for the movement to settle before sending the next Tab; seeing
      // the target enter the viewport does not mean its scroll has finished.
      await settleScroll(page);
      await page.waitForFunction(() => {
        const element = document.activeElement;
        if (!element || element === document.body) return true;
        const bounds = element.getBoundingClientRect();
        return bounds.bottom > 0 && bounds.top < innerHeight && bounds.right > 0 && bounds.left < innerWidth;
      }, undefined, { timeout: 1500 });
      const focus = await page.evaluate(() => {
        const element = document.activeElement;
        if (!element || element === document.body) return null;
        let opacity = 1;
        let visible = true;
        for (let ancestor = element; ancestor; ancestor = ancestor.parentElement) {
          const style = getComputedStyle(ancestor);
          opacity *= Number(style.opacity);
          visible &&= style.visibility !== 'hidden' && style.display !== 'none';
        }
        const bounds = element.getBoundingClientRect();
        const centerX = Math.min(innerWidth - 1, Math.max(0, bounds.left + bounds.width / 2));
        const centerY = Math.min(innerHeight - 1, Math.max(0, bounds.top + bounds.height / 2));
        const topElement = document.elementFromPoint(centerX, centerY);
        return {
          text: element.textContent?.trim().slice(0, 80), opacity, visible,
          width: bounds.width, height: bounds.height,
          inViewport: bounds.bottom > 0 && bounds.top < innerHeight && bounds.right > 0 && bounds.left < innerWidth,
          uncovered: Boolean(topElement && (topElement === element || element.contains(topElement))),
          covering: topElement ? `${topElement.tagName}.${topElement.className}` : null,
        };
      });
      if (!focus) continue;
      checked++;
      expect(focus.visible && focus.opacity >= 0.99 && focus.width > 0 && focus.height > 0 && focus.inViewport && focus.uncovered, `Keyboard focus reached visually hidden or covered content: ${JSON.stringify(focus)}`);
    }
    expect(checked >= 20, `Only ${checked} keyboard focus targets were exercised`);
    return { focusTargetsChecked: checked };
  });
}

async function functional(page, label, mobile) {
  await ready(page);
  await check(`${label}: required sections and nine practice areas`, async () => {
    for (const id of ['practice', 'about', 'approach', 'contact']) {
      expect(await page.locator(`#${id}`).count() === 1, `Missing #${id}`);
    }
    const count = await page.locator('#practice').getByRole('button', { name: /explore practice/i }).count();
    expect(count === 9, `Expected nine practice detail buttons, found ${count}`);
  });

  await check(`${label}: interface uses at most four arrows`, async () => {
    const arrows = await page.evaluate(() => {
      const rendered = element => {
        if (element.closest('.step-illustration')) return false;
        for (let ancestor = element; ancestor; ancestor = ancestor.parentElement) {
          const style = getComputedStyle(ancestor);
          if (style.display === 'none' || style.visibility === 'hidden') return false;
        }
        const bounds = element.getBoundingClientRect();
        return bounds.width > 0 && bounds.height > 0;
      };
      const icons = Array.from(document.querySelectorAll('svg.lucide')).filter(element => Array.from(element.classList).some(name => /arrow|move-(?:up|down|left|right)/.test(name)) && rendered(element));
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const glyphs = [];
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (!node.parentElement || !rendered(node.parentElement)) continue;
        const matches = node.textContent.match(/[←↑→↓↖↗↘↙⇢⇡]/g);
        if (matches) glyphs.push(...matches);
      }
      return { count: icons.length + glyphs.length, icons: icons.map(element => element.getAttribute('class')), glyphs };
    });
    expect(arrows.count <= 4, `${arrows.count} interface arrows exceed the requested maximum of four: ${JSON.stringify(arrows)}`);
    return arrows;
  });

  await check(`${label}: no horizontal overflow`, async () => {
    const widths = await overflow(page);
    expect(widths.content <= widths.viewport + 1, `Content ${widths.content}px exceeds viewport ${widths.viewport}px`);
    return widths;
  });

  await check(`${label}: practice filters update counts and pressed state`, async () => {
    const filters = page.getByRole('group', { name: 'Filter practice areas' });
    const cases = [
      ['All services', 9],
      ['Individuals & families', 5],
      ['Business & employment', 4],
      ['Property & estates', 2],
      ['All services', 9],
    ];
    try {
      for (const [name, expectedCount] of cases) {
        const selected = filters.getByRole('button', { name, exact: true });
        await selected.click();
        const count = await page.locator('#practice').getByRole('button', { name: /explore practice/i }).count();
        expect(count === expectedCount, `${name}: expected ${expectedCount} practice areas, found ${count}`);
        expect(await selected.getAttribute('aria-pressed') === 'true', `${name}: selected filter is not pressed`);
        expect(await filters.locator('button[aria-pressed="true"]').count() === 1, `${name}: more than one filter is pressed`);
        expect(await filters.locator('button[aria-pressed="false"]').count() === 3, `${name}: unselected filters do not expose an unpressed state`);
      }
    } finally {
      await filters.getByRole('button', { name: 'All services', exact: true }).click();
    }
  });

  await checklistChecks(page, label, check, expect);

  if (mobile) {
    await check(`${label}: mobile menu keyboard and navigation`, async () => {
      const menu = page.getByRole('button', { name: /open menu|navigation menu|menu/i }).first();
      await menu.click();
      expect(await menu.getAttribute('aria-expanded') === 'true', 'Menu did not expose expanded state');
      await accessibility(page, `${label} open menu`);
      await page.keyboard.press('Escape');
      expect(await menu.getAttribute('aria-expanded') === 'false', 'Escape did not close menu');
      await menu.click();
      await page.locator('header').getByRole('link', { name: /practice/i }).last().click();
      expect(await menu.getAttribute('aria-expanded') === 'false', 'Navigation did not close menu');
      await page.waitForTimeout(700);
      expect(new URL(page.url()).hash === '#practice', 'Practice link did not navigate to #practice');
    });
  } else {
    await check(`${label}: section navigation`, async () => {
      await page.locator('header').getByRole('link', { name: /practice/i }).first().click();
      await page.waitForTimeout(700);
      expect(new URL(page.url()).hash === '#practice', 'Practice link did not navigate to #practice');
    });
  }

  await check(`${label}: practice detail dialog and focus return`, async () => {
    const trigger = page.locator('#practice').getByRole('button', { name: /explore practice/i }).first();
    await trigger.click();
    const dialog = page.getByRole('dialog');
    await dialog.waitFor({ state: 'visible' });
    expect((await dialog.innerText()).length > 100, 'Practice detail is missing substantive information');
    await accessibility(page, `${label} practice dialog`);
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'hidden' });
    expect(await trigger.evaluate(element => element === document.activeElement), 'Focus did not return to practice trigger');
    await trigger.click();
    await page.getByRole('dialog').getByRole('button', { name: /close/i }).click();
    await dialog.waitFor({ state: 'hidden' });
  });

  await check(`${label}: practice consultation preserves selection and moves keyboard focus`, async () => {
    await page.locator('#practice').getByRole('button', { name: /explore practice/i }).first().click();
    const dialog = page.getByRole('dialog');
    await dialog.waitFor({ state: 'visible' });
    const chosenPractice = await dialog.getByRole('heading', { level: 2 }).innerText();
    await dialog.getByRole('button', { name: 'Discuss this matter', exact: true }).click();
    await dialog.waitFor({ state: 'hidden' });
    const contact = page.locator('#contact');
    expect(await contact.getByLabel('Practice area', { exact: true }).inputValue() === chosenPractice, 'Consultation did not select the chosen practice area');
    await page.waitForFunction(() => document.activeElement?.matches('#contact input[name="name"]'), undefined, { timeout: 2000 });
    // Wait past modal teardown so a delayed focus restoration cannot undo the handoff.
    await page.waitForTimeout(150);
    expect(await contact.locator('input[name="name"]').evaluate(element => element === document.activeElement), 'Name input lost focus after dialog cleanup');
    await page.keyboard.press('Tab');
    expect(await contact.evaluate(element => element.contains(document.activeElement)), 'Tab moved focus back into the dismissed practice dialog');
    expect(new URL(page.url()).hash === '#contact', 'Consultation did not navigate to contact');
  });

  await check(`${label}: legal guide contains substantive content and closes`, async () => {
    const trigger = page.locator('#insights').getByRole('button').first();
    const title = await trigger.innerText();
    await trigger.click();
    const dialog = page.getByRole('dialog');
    await dialog.waitFor({ state: 'visible' });
    expect(await dialog.getByRole('heading', { level: 2 }).innerText() === title, 'Guide dialog title does not match its trigger');
    expect((await dialog.innerText()).length > 700, 'Legal guide lacks substantive guidance');
    expect(await dialog.getByText(/general information only, not legal advice/i).count() === 1, 'Guide disclaimer is missing');
    await dialog.getByRole('button', { name: /close/i }).click();
    await dialog.waitFor({ state: 'hidden' });
    expect(await trigger.evaluate(element => element === document.activeElement), 'Closing the guide did not restore focus');
  });

  await check(`${label}: FAQ can be expanded`, async () => {
    const item = page.locator('details').first();
    expect(await item.count() === 1, 'No expandable FAQ details found');
    await item.locator('summary').click();
    expect(await item.getAttribute('open') !== null, 'FAQ did not expand');
    expect((await item.innerText()).length > 80, 'FAQ answer is missing');
    await item.locator('summary').click();
  });

  await check(`${label}: required contact fields prevent an invalid email draft`, async () => {
    const form = page.locator('#contact form');
    await form.getByRole('button', { name: /prepare email enquiry/i }).click();
    const invalidFields = await form.locator('input[required]:invalid, textarea[required]:invalid').count();
    expect(invalidFields === 3, `Expected three empty required fields to be invalid, found ${invalidFields}`);
    expect(await form.evaluate(element => !element.checkValidity()), 'Empty contact form passes native validation');
    expect(await page.locator('#contact .email-draft').count() === 0, 'An invalid form created an email draft');
  });

  await check(`${label}: contact prepares an honest email draft`, async () => {
    const contact = page.locator('#contact');
    const form = contact.locator('form');
    expect(await form.count() === 1, 'Contact form missing');
    await form.getByLabel(/name/i).first().fill('Browser verification');
    await form.getByLabel(/email/i).first().fill('verification@example.com');
    await form.getByLabel(/message|matter|help/i).last().fill('Please arrange an initial consultation about a conveyancing matter. Documents + dates are available. This is a browser validation draft.');
    await form.getByRole('button', { name: /prepare|draft|email|send|submit/i }).click();
    const draft = contact.getByText(/draft|email app|email application|email client/i);
    expect(await draft.count() > 0, 'Contact flow does not explain its email handoff');
    const mail = contact.locator('a[href^="mailto:"]');
    expect(await mail.count() > 0, 'No email handoff link available');
    const hrefs = await mail.evaluateAll(links => links.map(link => link.getAttribute('href')));
    expect(hrefs.some(href => href.includes('verification%40example.com') || href.includes('verification@example.com')), 'Prepared mailto draft does not include submitted email');
    expect(!/successfully sent|message sent|we have received your message/i.test(await contact.innerText()), 'Static contact form claims backend delivery');
  });

  await check(`${label}: mailto uses RFC 6068 percent encoding for spaces and literal plus`, async () => {
    const href = await page.locator('#contact .email-draft a[href^="mailto:"]').getAttribute('href');
    expect(href !== null && href.includes('?'), 'Prepared mailto link has no draft fields');
    const query = href.slice(href.indexOf('?') + 1);
    expect(!query.includes('+'), 'Mailto query uses form-style plus encoding for spaces');
    const fields = Object.fromEntries(query.split('&').map(field => {
      const separator = field.indexOf('=');
      return [decodeURIComponent(field.slice(0, separator)), decodeURIComponent(field.slice(separator + 1))];
    }));
    expect(fields.subject.startsWith('Consultation enquiry'), 'RFC-decoded subject loses spaces');
    expect(fields.body.includes('Name: Browser verification'), 'RFC-decoded body loses name spacing');
    expect(fields.body.includes('Documents + dates are available.'), 'RFC-decoded body loses the literal plus or surrounding spaces');
    expect(fields.body.includes('Email: verification@example.com'), 'RFC-decoded body loses the email address');
  });

  await check(`${label}: editing contact fields invalidates the prepared draft`, async () => {
    expect(await page.locator('#contact .email-draft').count() === 1, 'No prepared draft to exercise stale-data prevention');
    await page.locator('#contact form').getByLabel(/name/i).first().fill('Updated browser verification');
    expect(await page.locator('#contact .email-draft').count() === 0, 'Editing the name leaves a stale email draft available');
  });

  await accessibility(page, label);
}

function stats(values) {
  const ordered = [...values].sort((a, b) => a - b);
  const round = value => Number(value.toFixed(2));
  return {
    count: values.length,
    mean: round(values.reduce((sum, value) => sum + value, 0) / values.length),
    median: round(ordered[Math.floor(ordered.length * 0.5)]),
    p95: round(ordered[Math.min(ordered.length - 1, Math.ceil(ordered.length * 0.95) - 1)]),
    max: round(ordered.at(-1)),
  };
}

async function measureScroll(page, label, cpuSlowdown = 1) {
  const session = await page.context().newCDPSession(page);
  await session.send('Emulation.setCPUThrottlingRate', { rate: cpuSlowdown });
  await ready(page);
  await page.evaluate(() => {
    window.__scrollMetrics = { active: false, baseline: [], frames: [], longTasks: [], shifts: [], scrollEvents: 0 };
    const metrics = window.__scrollMetrics;
    let previous;
    function tick(timestamp) {
      if (previous !== undefined) {
        const interval = timestamp - previous;
        (metrics.active ? metrics.frames : metrics.baseline).push(interval);
      }
      previous = timestamp;
      metrics.raf = requestAnimationFrame(tick);
    }
    metrics.raf = requestAnimationFrame(tick);
    metrics.taskObserver = new PerformanceObserver(list => {
      if (metrics.active) metrics.longTasks.push(...list.getEntries().map(entry => ({ startTime: entry.startTime, duration: entry.duration })));
    });
    metrics.taskObserver.observe({ type: 'longtask', buffered: false });
    metrics.shiftObserver = new PerformanceObserver(list => {
      if (metrics.active) metrics.shifts.push(...list.getEntries().filter(entry => !entry.hadRecentInput).map(entry => ({ startTime: entry.startTime, value: entry.value })));
    });
    metrics.shiftObserver.observe({ type: 'layout-shift', buffered: false });
    window.addEventListener('scroll', () => { if (metrics.active) metrics.scrollEvents++; }, { passive: true });
  });
  await page.waitForTimeout(1100);
  const baseline = await page.evaluate(() => window.__scrollMetrics.baseline.slice());
  expect(baseline.length > 20, 'Insufficient animation-frame baseline samples');
  await page.evaluate(() => {
    window.__scrollMetrics.active = true;
    window.__scrollMetrics.started = performance.now();
  });
  const extent = await page.evaluate(() => ({ height: document.documentElement.scrollHeight, viewport: innerHeight }));
  const delta = Math.round(extent.viewport * 0.72);
  const steps = Math.ceil((extent.height - extent.viewport) / delta) + 2;
  const positions = [];
  for (const direction of [1, -1]) {
    for (let index = 0; index < steps; index++) {
      await page.mouse.wheel(0, direction * delta);
      await page.waitForTimeout(120);
      positions.push(await page.evaluate(() => window.scrollY));
    }
  }
  await page.waitForTimeout(150);
  const metrics = await page.evaluate(() => {
    const measured = window.__scrollMetrics;
    measured.active = false;
    measured.elapsed = performance.now() - measured.started;
    cancelAnimationFrame(measured.raf);
    measured.taskObserver.disconnect();
    measured.shiftObserver.disconnect();
    return { frames: measured.frames, longTasks: measured.longTasks, shifts: measured.shifts, elapsed: measured.elapsed, scrollEvents: measured.scrollEvents };
  });
  await session.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  await session.detach();
  expect(metrics.frames.length > 20, 'Insufficient scroll frame samples');
  expect(Math.max(...positions) >= extent.height - extent.viewport - 3, 'Native wheel test did not reach the document bottom');
  expect(positions.at(-1) <= 3, 'Native wheel test did not return to the document top');
  const baselineStats = stats(baseline);
  const frameStats = stats(metrics.frames);
  const delayed = metrics.frames.filter(interval => interval > baselineStats.median * 1.5);
  const estimatedSkippedFrames = metrics.frames.reduce((sum, interval) => sum + Math.max(0, Math.round(interval / baselineStats.median) - 1), 0);
  const maxLongTask = Math.max(0, ...metrics.longTasks.map(task => task.duration));
  const observedShiftSum = metrics.shifts.reduce((sum, shift) => sum + shift.value, 0);
  // CLS uses the largest layout-shift session window: <= 1s between entries, <= 5s total.
  let cls = 0;
  let sessionValue = 0;
  let sessionStart = 0;
  let previousShift = 0;
  for (const shift of metrics.shifts) {
    if (shift.startTime - previousShift > 1000 || shift.startTime - sessionStart > 5000) {
      sessionStart = shift.startTime;
      sessionValue = 0;
    }
    sessionValue += shift.value;
    cls = Math.max(cls, sessionValue);
    previousShift = shift.startTime;
  }
  const warnings = [];
  if (frameStats.p95 > baselineStats.median * 2) warnings.push('p95 frame interval exceeds twice the observed idle baseline');
  if (delayed.length / metrics.frames.length > 0.1) warnings.push('More than 10% of sampled frame intervals exceeded 1.5 times the observed idle baseline');
  if (maxLongTask > 200) warnings.push('A main-thread task exceeded 200ms during scrolling');
  if (cls > 0.1) warnings.push('Scroll-window CLS exceeded 0.1');
  const result = {
    label,
    viewport: page.viewportSize(),
    cpuSlowdown,
    pageHeightPx: extent.height,
    nativeWheelEvents: steps * 2,
    observedScrollEvents: metrics.scrollEvents,
    reachedBottomAndReturned: true,
    elapsedMs: Number(metrics.elapsed.toFixed(2)),
    baselineFrameIntervalMs: baselineStats,
    scrollFrameIntervalMs: frameStats,
    delayedFrameThresholdMs: Number((baselineStats.median * 1.5).toFixed(2)),
    delayedFrameIntervals: delayed.length,
    delayedFramePercent: Number((100 * delayed.length / metrics.frames.length).toFixed(2)),
    estimatedSkippedFrames,
    longTasks: { count: metrics.longTasks.length, totalDurationMs: Number(metrics.longTasks.reduce((sum, task) => sum + task.duration, 0).toFixed(2)), maxDurationMs: Number(maxLongTask.toFixed(2)) },
    scrollWindowCLS: Number(cls.toFixed(5)),
    observedLayoutShiftSum: Number(observedShiftSum.toFixed(5)),
    warnings,
    raw: metrics,
  };
  report.scroll.push(result);
  console.log(`SCROLL ${label}: p95 ${frameStats.p95}ms; delayed ${result.delayedFramePercent}%; long tasks ${metrics.longTasks.length}; CLS ${result.scrollWindowCLS}`);
  await check(`${label}: full wheel traversal leaves every section readable`, async () => {
    const targets = await revealVisibility(page);
    expect(targets.length >= 5, `Only ${targets.length} reveal targets were exercised`);
    const hidden = targets.filter(target => !target.visible || target.opacity < 0.99 || target.width <= 0 || target.height <= 0 || Math.abs(target.translateY) > 0.5);
    expect(hidden.length === 0, `${hidden.length} section(s) remain hidden or displaced after traversal: ${JSON.stringify(hidden)}`);
    return { readableTargets: targets.length };
  });
  if (label === 'desktop' || label === 'mobile') {
    // Traversal lets every section's IntersectionObserver reveal finish before capture.
    await accessibility(page, `${label} fully revealed`);
    await page.screenshot({ path: resolve(artifacts, `${label}.png`), fullPage: true });
  }
}

try {
  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const desktop = await desktopContext.newPage();
  desktop.on('pageerror', error => report.errors.push({ label: 'desktop', error: error.message }));
  await functional(desktop, 'desktop', false);
  await motionChecks(desktop, 'desktop');
  await check('desktop: native wheel scroll traverses page', () => measureScroll(desktop, 'desktop'));

  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const mobile = await mobileContext.newPage();
  mobile.on('pageerror', error => report.errors.push({ label: 'mobile', error: error.message }));
  await functional(mobile, 'mobile', true);
  await motionChecks(mobile, 'mobile');
  await check('mobile: each stacked approach card can be read before the next arrives', () => mobileApproach(mobile));
  await check('mobile: native wheel scroll traverses page', () => measureScroll(mobile, 'mobile'));
  await check('mobile: scroll with 4x CPU slowdown traverses page', () => measureScroll(mobile, 'mobile-cpu-4x', 4));

  const responsiveContext = await browser.newContext({ viewport: { width: 320, height: 844 } });
  const responsivePage = await responsiveContext.newPage();
  responsivePage.on('pageerror', error => report.errors.push({ label: 'responsive', error: error.message }));
  for (const width of [320, 768, 1024]) {
    await responsivePage.setViewportSize({ width, height: 844 });
    await ready(responsivePage);
    await check(`${width}px: no horizontal overflow`, async () => {
      const widths = await overflow(responsivePage);
      expect(widths.content <= widths.viewport + 1, `Content ${widths.content}px exceeds viewport ${widths.viewport}px`);
      return widths;
    });
  }

  const reducedMotion = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const reducedPage = await reducedMotion.newPage();
  await ready(reducedPage);
  await check('reduced motion preference is honored', async () => {
    const styles = await reducedPage.evaluate(() => ({
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
      violations: Array.from(document.querySelectorAll('*')).filter(element => {
        const style = getComputedStyle(element);
        return style.animationName !== 'none' && style.animationDuration.split(',').some(duration => parseFloat(duration) > 0.01);
      }).map(element => ({ tag: element.tagName, className: element.className })),
    }));
    expect(styles.scrollBehavior !== 'smooth', 'Smooth scrolling remains enabled under reduced motion');
    expect(styles.violations.length === 0, `${styles.violations.length} elements retain substantial animation under reduced motion`);
    return styles;
  });
  await check('reduced motion: all content is readable before scrolling', async () => {
    const targets = await revealVisibility(reducedPage);
    expect(targets.length >= 5, `Only ${targets.length} content targets found`);
    const hidden = targets.filter(target => !target.visible || target.opacity < 0.99 || target.width <= 0 || target.height <= 0 || Math.abs(target.translateY) > 0.5);
    expect(hidden.length === 0, `Reduced-motion content remains hidden or displaced: ${JSON.stringify(hidden)}`);
    await reducedPage.screenshot({ path: resolve(artifacts, 'mobile-reduced-motion.png'), fullPage: true });
    return { readableTargets: targets.length };
  });
  await check('changing motion preference during a visit restores content immediately', async () => {
    await ready(desktop);
    await desktop.emulateMedia({ reducedMotion: 'reduce' });
    await desktop.waitForTimeout(100);
    let targets = await revealVisibility(desktop);
    expect(targets.length >= 5, 'No content targets found after changing the preference');
    const hidden = targets.filter(target => !target.visible || target.opacity < 0.99 || target.width <= 0 || target.height <= 0 || Math.abs(target.translateY) > 0.5);
    expect(hidden.length === 0, `Changing the preference leaves content hidden or displaced: ${JSON.stringify(hidden)}`);
    await desktop.emulateMedia({ reducedMotion: 'no-preference' });
    await desktop.waitForTimeout(100);
    targets = await revealVisibility(desktop);
    expect(targets.every(target => target.visible && target.opacity >= 0.99), 'Restoring motion hides content that was already shown');
    return { readableTargets: targets.length };
  });

  const fallbackContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await fallbackContext.addInitScript(() => {
    const original = CSS.supports.bind(CSS);
    CSS.supports = (...args) => {
      if (args[0] === 'animation-timeline' || (args.length === 1 && /animation-timeline\s*:/.test(args[0]))) return false;
      return original(...args);
    };
  });
  const fallbackPage = await fallbackContext.newPage();
  fallbackPage.on('pageerror', error => report.errors.push({ label: 'fallback', error: error.message }));
  await ready(fallbackPage);
  await check('unsupported scroll timelines: fallback artwork and text visibly move', async () => {
    expect(!await fallbackPage.evaluate(() => CSS.supports('animation-timeline', 'scroll()')), 'Fallback browser did not receive the unsupported-feature simulation');
    const animation = await fallbackPage.locator('.about-art').evaluate(element => getComputedStyle(element).animationName);
    expect(animation === 'none', `Native CSS animation remains active while testing the fallback (${animation})`);
    return strongScrollMotion(fallbackPage, 'fallback-mobile');
  });
  await check('fallback mobile: native wheel scroll traverses page', () => measureScroll(fallbackPage, 'fallback-mobile'));
  await accessibility(fallbackPage, 'fallback fully revealed');
  await check('fallback: reduced motion restores inline styles and later motion resumes', async () => {
    const selector = '.about-art, .about-photo, .about-orbit svg, .about-orbit > span, .kinetic-line, .practice-card > .card-top, .practice-description, .practice-link, .insight-art, .step-illustration svg, .step-trace, .reading-progress, .hero-art img, .statement-word';
    const active = await fallbackPage.locator(selector).evaluateAll(elements => elements.filter(element => element.style.transform || element.style.getPropertyValue('stroke-dashoffset') || element.style.getPropertyValue('--fallback-word-inset')).length);
    expect(active >= 5, `Only ${active} fallback elements received an active rendered style`);
    await fallbackPage.emulateMedia({ reducedMotion: 'reduce' });
    await fallbackPage.waitForTimeout(120);
    const inspect = () => fallbackPage.locator(selector).evaluateAll(elements => elements.map(element => ({
      label: `${element.tagName}.${element.getAttribute('class')}`,
      inlineTransform: element.style.transform,
      inlineStroke: element.style.getPropertyValue('stroke-dashoffset'),
      inlineInset: element.style.getPropertyValue('--fallback-word-inset'),
      transform: getComputedStyle(element).transform,
      animation: getComputedStyle(element).animationName,
    })));
    const stopped = await inspect();
    expect(stopped.every(element => !element.inlineTransform && !element.inlineStroke && !element.inlineInset && element.transform === 'none' && element.animation === 'none'), `Fallback styles remain after reduced motion: ${JSON.stringify(stopped.filter(element => element.inlineTransform || element.inlineStroke || element.inlineInset || element.transform !== 'none' || element.animation !== 'none'))}`);
    await fallbackPage.mouse.wheel(0, 700);
    await settleScroll(fallbackPage);
    const afterScroll = await inspect();
    expect(JSON.stringify(stopped) === JSON.stringify(afterScroll), 'Scrolling under reduced motion restarted fallback transforms');
    await fallbackPage.emulateMedia({ reducedMotion: 'no-preference' });
    await fallbackPage.waitForTimeout(120);
    const resumed = await strongScrollMotion(fallbackPage, 'fallback-resumed');
    return { styledElementsBeforeReduction: active, restoredElements: stopped.length, resumedArtworkTravelPx: resumed.artworkTravelPx };
  });
  await check('no browser JavaScript exceptions', () => expect(report.errors.length === 0, JSON.stringify(report.errors)));
} catch (error) {
  report.errors.push({ label: 'harness', error: error.message });
  console.error(error);
} finally {
  await browser.close();
  report.summary = {
    passed: report.checks.filter(check => check.status === 'passed').length,
    failed: report.checks.filter(check => check.status === 'failed').length,
    javascriptErrors: report.errors.length,
    accessibilityViolations: report.accessibility.reduce((sum, result) => sum + result.violations.length, 0),
  };
  await writeFile(resolve(artifacts, 'browser-report.json'), `${JSON.stringify(report, null, 2)}\n`);
  if (report.scroll.length) {
    const rows = report.scroll.map(measurement => `| ${measurement.label} | ${measurement.baselineFrameIntervalMs.median} | ${measurement.scrollFrameIntervalMs.mean} | ${measurement.scrollFrameIntervalMs.p95} | ${measurement.scrollFrameIntervalMs.max} | ${measurement.delayedFramePercent}% | ${measurement.longTasks.count} / ${measurement.longTasks.maxDurationMs}ms | ${measurement.scrollWindowCLS} |`).join('\n');
    const warnings = report.scroll.flatMap(measurement => measurement.warnings.map(warning => `- ${measurement.label}: ${warning}.`));
    const failures = report.checks.filter(check => check.status === 'failed').map(check => `- ${check.name}: ${check.error}`).join('\n');
    await writeFile(resolve(docs, 'PERFORMANCE.md'), `# Browser and scroll validation\n\nMeasured ${report.measuredAt} using Chromium ${report.browser} against ${baseURL}.\n\n## What was exercised\n\nThe production preview was tested at 1440 × 1000 and 390 × 844 CSS pixels, with additional horizontal-overflow checks at 320, 768 and 1024 CSS pixels. Native wheel input moved the full document down and back up. requestAnimationFrame intervals were sampled throughout each traversal; an idle baseline was collected separately in the same browser session. A mobile-sized repeat used Chrome DevTools 4× CPU slowdown. A separate mobile browser overrides JavaScript scroll-timeline feature detection to exercise the production fallback; its native-wheel traversal appears as the fallback-mobile profile. PerformanceObserver recorded tasks over 50ms and layout shifts during traversal.\n\n| Profile | Idle median ms | Scroll mean ms | Scroll p95 ms | Scroll max ms | Intervals > 1.5× idle | Long tasks / longest | Scroll-window CLS |\n| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |\n${rows}\n\nA delayed interval is greater than 1.5 times that profile's measured idle median. This flags missed presentation opportunities; it does not identify their cause. The JSON report also includes a derived skipped-frame estimate and the raw timing samples. CLS uses the largest session window, with up to one second between shifts and a maximum five-second window.\n\n${warnings.length ? `## Observations\n\n${warnings.join('\n')}\n\n` : 'No profile crossed the harness warning thresholds (p95 > 2× idle, delayed intervals > 10%, a task > 200ms, or CLS > 0.1).\n\n'}## Functional and accessibility checks\n\n${report.summary.passed} checks passed; ${report.summary.failed} failed. ${report.summary.accessibilityViolations} automated WCAG A/AA violations were reported by axe across desktop, mobile, open practice dialogs and the open mobile menu. Checks compare the supplied logo bytes, complete firm overview, mission, vision, all nine detailed service scopes, every contact route, address, opening time and social profile against independent values transcribed from the latest PDF. The location gallery checks all seven supplied photographs, selected states and the map-directions destination. Checks also cover section links, all four practice filters and pressed states, mobile menu state/Escape/link activation, practice-dialog dismissal and focus return, consultation selection and contact keyboard focus, substantive legal guides, expandable FAQ, horizontal overflow, visible intermediate section entrance frames, native reading-progress response to wheel scrolling where supported, measured artwork translation/rotation/scale and decorative text rows moving in opposite directions, readable mobile sticky cards before each handoff, a maximum of four interface arrows, visible and unobscured keyboard focus, complete reveals after full traversal, reduced-motion preference at page load and during a visit, and contact email-draft preparation. Contact checks verify native required-field validation, RFC 6068 mailto encoding, removal of stale drafts after edits, and absence of a claim that a backend delivered the message. The forced unsupported-timeline browser verifies actual fallback artwork/text movement, full-page accessibility, restoration of original inline motion styles under reduced motion, absence of new motion styles after scrolling with that preference, and motion resumption when the preference changes back. Screenshots are captured after full scroll traversal so section reveals have been exercised.\n\n${failures ? `Failed checks:\n\n${failures}\n\n` : ''}## Limits and reproduction\n\nThese measurements come from a cloud execution environment running headless Chromium. They are useful regression evidence, not physical-phone performance, touch-scroll validation, a guarantee of frame rate, or field Core Web Vitals. CPU slowdown simulates constrained main-thread execution; it does not emulate a complete mobile device or slow network. Forced feature detection exercises the fallback in Chromium and does not constitute a physical Safari or Firefox device test. Automated accessibility does not replace manual assistive-technology testing.\n\nRun \`npm run build\`, start \`npm run preview -- --host 0.0.0.0\`, then run \`BASE_URL=http://127.0.0.1:4173 node scripts/browser-check.mjs\`. Use \`CHROMIUM_EXECUTABLE\` to select another installed Chromium binary.\n\nEvidence: [JSON report](../artifacts/browser-report.json), [desktop screenshot](../artifacts/desktop.png), [mobile screenshot](../artifacts/mobile.png), [reduced-motion screenshot](../artifacts/mobile-reduced-motion.png).\n`);
  }
  console.log(`RESULT ${report.summary.passed} passed, ${report.summary.failed} failed; report: artifacts/browser-report.json`);
  if (report.summary.failed || report.summary.javascriptErrors) process.exitCode = 1;
}
