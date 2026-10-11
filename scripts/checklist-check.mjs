import { createHash } from 'node:crypto';

// Independent acceptance values transcribed from the client's latest PDF.
// Do not derive these from application data: missing client content must fail.
const overview = [
  'R. K. Njogu & Company Advocates is a Kenyan law firm providing practical, commercially sound and responsive legal solutions to individuals, businesses and organizations.',
  'We translate legal issues into clear, workable solutions, taking into account the legal, commercial and practical realities of each matter.',
  'Our practice covers commercial and corporate law, land and property, family law, dispute resolution, litigation and debt recovery, with an approach that uses negotiation, alternative dispute resolution or litigation according to the circumstances and objectives of each matter.',
  'The Firm is committed to clarity, responsiveness, confidentiality and professional integrity, and serves clients in Nairobi, Machakos and across Kenya from its office in Kamulu.',
  'To turn legal challenges into practical solutions that serve our clients’ interests.',
  'To build a respected and trusted Kenyan law firm recognized for practical legal solutions, professional integrity and dependable client service.',
];
const practices = [
  [
    'Personal and Workplace Injury Claims',
    [
      'road traffic accidents',
      'workplace injuries',
      'other personal injur',
      'assessment',
      'negotiations',
      'defence',
      'settlement',
      'court proceedings',
    ],
  ],
  [
    'General Legal Services & Advisory',
    [
      'legal consultations',
      'affidavits',
      'statutory declarations',
      'document preparation',
      'advisory services',
    ],
  ],
  [
    'Land, Property & Conveyancing',
    [
      'sale and purchase',
      'sale agreements',
      'leases',
      'transfers',
      'charges',
      'property documentation',
      'land searches',
      'due diligence',
      'subdivisions',
      'consents',
      'registration',
      'land-related disputes',
    ],
  ],
  [
    'Criminal Law & Defence',
    [
      'investigations',
      'proceedings',
      'defence of accused persons',
      'watching brief',
      'complainants and victims',
      'related criminal law matters',
    ],
  ],
  [
    'Family Law',
    [
      'divorce',
      'matrimonial property',
      'child custody and maintenance',
      'separation',
      'other family-related legal matters',
    ],
  ],
  [
    'Corporate & Company Secretarial Services',
    [
      'company incorporation',
      'ecitizen services',
      'statutory filings',
      'changes in company particulars',
      'corporate documentation',
      'compliance',
      'insolvency-related services',
    ],
  ],
  [
    'Employment & Labour Law',
    [
      'employment contracts',
      'workplace policies',
      'disciplinary matters',
      'termination',
      'employment disputes',
      'general employment advisory services',
    ],
  ],
  [
    'Succession, Probate & Estate Planning',
    [
      'wills',
      'probate',
      'letters of administration',
      'succession proceedings',
      'estate administration',
      'related advisory services',
    ],
  ],
  [
    'Debt Recovery & Commercial Disputes',
    [
      'demand letters',
      'negotiated settlements',
      'debt recovery proceedings',
      'enforcement of judgments',
      'commercial disputes',
    ],
  ],
];
const contactLinks = [
  'tel:+254704652614',
  'tel:+254797096733',
  'https://wa.me/254704652614',
  'https://wa.me/254797096733',
  'mailto:rknjoguadvocate@gmail.com',
  'mailto:info@rknjoguadvocates.co.ke',
  'https://www.google.com/maps/search/?api=1&query=P397%2B2G%20Kamulu',
];
const socialLinks = [
  'https://www.facebook.com/profile.php?id=61561070055399&sk=directory_links',
  'https://ke.linkedin.com/in/r-k-njogu-advocates-680524276',
  'https://x.com/RKNjoguAdv',
  'https://share.google/ylvoiONkW36RoPiQF',
];
const normalize = (value) => value.toLowerCase().replace(/\s+/g, ' ').trim();

export async function checklistChecks(page, label, check, expect) {
  await check(
    `${label}: original supplied logo is displayed and used as favicon`,
    async () => {
      const logo = page.locator('header .brand-logo');
      const geometry = await logo.evaluate((image) => ({
        complete: image.complete,
        width: image.naturalWidth,
        height: image.naturalHeight,
        src: image.currentSrc,
      }));
      expect(
        geometry.complete && geometry.width === 291 && geometry.height === 290,
        'Header logo did not load the original checklist image',
      );
      const response = await page.request.get(geometry.src);
      expect(response.ok(), 'Logo asset is unavailable');
      const hash = createHash('sha256')
        .update(await response.body())
        .digest('hex');
      expect(
        hash ===
          'f061ed9d676638b0348965ca3e7d7653413d8473e532d5ad80a126896ba5d2ba',
        'Logo does not match the original JPEG embedded in the checklist',
      );
      expect(
        (await page.locator('footer .brand-logo').count()) === 1,
        'Footer is missing the supplied logo',
      );
      const faviconURL = await page
        .locator('link[rel="icon"]')
        .getAttribute('href');
      const favicon = await page.request.get(
        new URL(faviconURL, page.url()).href,
      );
      expect(
        favicon.ok() &&
          (await favicon.text()).includes(
            (await response.body()).toString('base64'),
          ),
        'Favicon is missing the supplied logo',
      );
      return geometry;
    },
  );

  await check(
    `${label}: complete checklist overview, mission and vision are present`,
    async () => {
      const text = normalize(await page.locator('#about').innerText());
      for (const paragraph of overview)
        expect(
          text.includes(normalize(paragraph)),
          `Missing firm information: ${paragraph}`,
        );
      const tagline = normalize(
        await page.locator('.footer-top').innerText(),
      ).replaceAll('.', '');
      expect(
        tagline.includes('legal solutions made practical'),
        'Checklist tagline is missing',
      );
    },
  );

  await check(
    `${label}: every checklist contact, address and opening time is present`,
    async () => {
      const contact = page.locator('#contact');
      const hrefs = await contact
        .locator('a')
        .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
      for (const href of contactLinks)
        expect(
          hrefs.includes(href),
          `Missing checklist contact route: ${href}`,
        );
      const text = normalize(await contact.innerText());
      for (const value of [
        'Brettonwoods Square (Cooperative Bank Building)',
        '2nd Floor, Suite BW-213',
        'Kamulu',
        'Along Kangundo Road',
        'P.O. Box 2341-00200, Nairobi',
        '0704 652 614',
        '0797 096 733',
        'P397+2G Kamulu',
      ]) {
        expect(
          text.includes(normalize(value)),
          `Missing contact detail: ${value}`,
        );
      }
      const rows = await contact.locator('.office-hours > div').allInnerTexts();
      for (const [index, values] of [
        ['Monday–Friday', '8:00 am–5:00 pm'],
        ['Saturday', '8:00 am–1:00 pm'],
        ['Sunday & public holidays', 'Closed'],
      ].entries()) {
        expect(
          values.every((value) =>
            normalize(rows[index] ?? '').includes(normalize(value)),
          ),
          `Incorrect opening-hours row: ${values.join(' ')}`,
        );
      }
    },
  );

  await check(
    `${label}: all supplied social and Google Business profiles are linked`,
    async () => {
      const hrefs = await page
        .locator('footer a')
        .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
      for (const href of socialLinks)
        expect(hrefs.includes(href), `Missing supplied profile: ${href}`);
    },
  );

  await check(
    `${label}: testimonial section includes all four checklist clients and Google Reviews`,
    async () => {
      const section = page.locator('#testimonials');
      const clients = await section.locator('.client-list li').allInnerTexts();
      expect(
        clients.length === 4,
        'The visible testimonials section is missing client entries',
      );
      for (const name of [
        'Afriavo Orchards Ltd',
        'Apple Orchards Ltd',
        'Femuro Management Ltd',
        'Outrival Human Resource Services Ltd',
      ]) {
        expect(
          clients.some((client) => client.includes(name)),
          `Missing checklist client: ${name}`,
        );
      }
      expect(
        clients.every((client) =>
          normalize(client).includes('testimonial forthcoming'),
        ),
        'Testimonials marked TBA in the PDF are not identified as forthcoming',
      );
      expect(
        (await section
          .getByRole('link', { name: 'Read Google Reviews', exact: true })
          .getAttribute('href')) === 'https://share.google/ylvoiONkW36RoPiQF',
        'Google Reviews does not use the supplied business profile',
      );
    },
  );

  await check(
    `${label}: prominent social profiles include Facebook, LinkedIn and the supplied X handle`,
    async () => {
      const social = page.locator('#social');
      const links = await social
        .locator('a')
        .evaluateAll((elements) =>
          elements.map((element) => element.getAttribute('href')),
        );
      expect(
        links.length === 4 && socialLinks.every((link) => links.includes(link)),
        'Prominent social links do not match all four supplied profiles',
      );
      const text = await social.innerText();
      for (const name of [
        'Facebook',
        'LinkedIn',
        'X / Twitter',
        '@RKNjoguAdv',
        'Google Business',
      ])
        expect(text.includes(name), `Social section is missing ${name}`);
    },
  );

  await check(
    `${label}: Blog and News has readable articles and checklist-grounded firm notices`,
    async () => {
      const menuButton = page.getByRole('button', {
        name: 'Open menu',
        exact: true,
      });
      const mobileMenu = await menuButton.isVisible();
      if (mobileMenu) await menuButton.click();
      expect(
        (await page
          .locator('header')
          .getByRole('link', { name: 'Blog & News', exact: true })
          .getAttribute('href')) === '#insights',
        'Blog and News is not discoverable in navigation',
      );
      if (mobileMenu)
        await page
          .getByRole('button', { name: 'Close menu', exact: true })
          .click();
      const blog = page.locator('#insights');
      expect(
        (await blog.innerText()).includes('BLOG & NEWS'),
        'Blog and News section has no visible label',
      );
      expect(
        (await blog.locator('.insight-card').count()) === 3,
        'Blog articles are missing',
      );
      const notices = await blog.locator('#news').innerText();
      expect(
        notices.includes('Suite BW-213') &&
          notices.includes('8:00 am–5:00 pm') &&
          notices.includes('8:00 am–1:00 pm') &&
          notices.includes('public holidays'),
        'Firm notices are missing the supplied location or hours',
      );
    },
  );

  await check(
    `${label}: special features include a working consultation preparation checklist`,
    async () => {
      const tools = page.locator('#tools');
      expect(
        (await tools.innerText()).includes('SPECIAL FEATURES'),
        'Special features section is not visibly identified',
      );
      const inputs = tools.getByRole('checkbox');
      expect(
        (await inputs.count()) === 5,
        'Consultation preparation is missing checklist items',
      );
      const progress = tools.getByRole('progressbar', {
        name: 'Consultation preparation progress',
      });
      expect(
        (await progress.getAttribute('value')) === '0',
        'Preparation does not start empty',
      );
      for (let index = 0; index < 5; index++) {
        await inputs.nth(index).check();
        expect(
          await inputs.nth(index).isChecked(),
          `Preparation item ${index + 1} cannot be selected`,
        );
        expect(
          (await progress.getAttribute('value')) === String(index + 1),
          'Preparation progress did not update',
        );
      }
      expect(
        (await tools.innerText()).includes('5 / 5 prepared'),
        'Complete preparation is not announced',
      );
      for (let index = 0; index < 5; index++) await inputs.nth(index).uncheck();
      expect(
        (await progress.getAttribute('value')) === '0',
        'Preparation items cannot be cleared',
      );
    },
  );

  await check(
    `${label}: client tool shortcuts reach real services, consultation and directions`,
    async () => {
      const hrefs = await page
        .locator('#tools a')
        .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
      for (const target of [
        '#practice',
        '#contact',
        '#visit',
        'https://wa.me/254704652614',
      ])
        expect(
          hrefs.includes(target),
          `Missing working client-tool destination: ${target}`,
        );
      for (const target of ['#practice', '#contact', '#visit'])
        expect(
          (await page.locator(target).count()) === 1,
          `Client-tool destination ${target} is missing`,
        );
    },
  );

  await check(
    `${label}: all seven Kamulu photos can be viewed and directions use the supplied map location`,
    async () => {
      const visit = page.locator('#visit');
      const buttons = visit
        .getByRole('group', { name: 'Kamulu location photos' })
        .getByRole('button');
      expect(
        (await buttons.count()) === 7,
        'The location gallery is missing supplied photos',
      );
      for (let index = 0; index < 7; index++) {
        await buttons.nth(index).click();
        await visit
          .locator('.visit-photo > img')
          .evaluate((image) => image.decode());
        const photo = await visit
          .locator('.visit-photo > img')
          .evaluate((image) => ({
            src: image.currentSrc,
            width: image.naturalWidth,
            height: image.naturalHeight,
          }));
        expect(
          photo.src.endsWith(
            `kamulu/view-${String(index + 1).padStart(2, '0')}.jpg`,
          ) &&
            photo.width === 1024 &&
            photo.height === 535,
          `Gallery photo ${index + 1} did not load`,
        );
        expect(
          (await buttons.nth(index).getAttribute('aria-pressed')) === 'true',
          'Gallery does not announce the selected photo',
        );
        expect(
          (await visit.locator('button[aria-pressed="true"]').count()) === 1,
          'More than one location photo is selected',
        );
      }
      await buttons.first().click();
      const route = new URL(
        await visit
          .getByRole('link', { name: 'Plan your route', exact: true })
          .getAttribute('href'),
      );
      expect(
        route.hostname === 'www.google.com' &&
          route.pathname === '/maps/dir/' &&
          route.searchParams.get('destination') === 'P397+2G Kamulu',
        'Directions do not use the checklist office map location',
      );
      expect(
        (await visit.innerText()).includes('Suite BW-213'),
        'Location section is missing the office suite',
      );
    },
  );

  for (const [title, terms] of practices) {
    await check(`${label}: checklist service scope — ${title}`, async () => {
      const trigger = page.getByRole('button', {
        name: `Explore practice: ${title}`,
        exact: true,
      });
      const dialog = page.getByRole('dialog');
      try {
        await trigger.click();
        await dialog.waitFor({ state: 'visible' });
        expect(
          (await dialog.getByRole('heading', { level: 2 }).innerText()) ===
            title,
          'Service dialog has the wrong title',
        );
        const text = normalize(await dialog.innerText());
        for (const term of terms)
          expect(
            text.includes(term),
            `Missing supplied scope for ${title}: ${term}`,
          );
      } finally {
        if (await dialog.isVisible()) {
          await page.keyboard.press('Escape');
          await dialog.waitFor({ state: 'hidden' });
        }
      }
    });
  }
}
