/** Content is plain text. Keep layout and styling in HTML/CSS. */
window.portfolioReady = (async () => {
  const text = value => String(value ?? '');
  const escape = value => text(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const url = value => {
    const raw = text(value).trim();
    if (!raw) return '';
    const parsed = new URL(raw, document.baseURI);
    if (!['http:', 'https:', 'mailto:'].includes(parsed.protocol)) throw new Error('Unsupported content URL');
    return raw;
  };
  const image = (src, alt = '', classes = 'icon') => src ? `<img src="${escape(url(src))}" alt="${escape(alt)}" class="${classes}">` : '';
  const icon = name => `<i aria-hidden="true" class="bx ${escape(name)}"></i>`;
  const list = values => values?.length ? `<ul>${values.map(v => `<li>${escape(v)}</li>`).join('')}</ul>` : '';
  const lines = values => (values || []).map(escape).join('<br>');
  const link = (href, label, glyph, external = false, extra = '') => href ? `<a href="${escape(url(href))}" aria-label="${escape(label)}" title="${escape(label)}" ${external ? 'target="_blank" rel="noopener noreferrer"' : ''} ${extra}>${icon(glyph)}</a>` : '';
  const validateContent = data => {
    const object = (value, path) => {
      if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${path} must be an object`);
    };
    const strings = (value, fields, path) => {
      object(value, path);
      fields.forEach(key => { if (typeof value[key] !== 'string') throw new Error(`${path}.${key} must be text`); });
    };
    const array = (value, path, check) => {
      if (!Array.isArray(value)) throw new Error(`${path} must be an array`);
      value.forEach((item, i) => check(item, `${path}[${i}]`));
    };
    const textArray = (value, path) => array(value, path, (item, key) => {
      if (typeof item !== 'string') throw new Error(`${key} must be text`);
    });
    object(data, 'portfolio');
    strings(data.profile, ['firstName', 'lastName', 'greeting', 'rolePrefix', 'email', 'photo', 'photoAlt'], 'profile');
    textArray(data.profile.roles, 'profile.roles');
    array(data.profile.socialLinks, 'profile.socialLinks', (v, k) => strings(v, ['label', 'url', 'icon'], k));
    strings(data.metadata, ['title', 'description', 'keywords', 'favicon'], 'metadata');
    object(data.headings, 'headings');
    Object.entries(data.headings).forEach(([key, value]) => { if (typeof value !== 'string') throw new Error(`headings.${key} must be text`); });
    array(data.navigation, 'navigation', (v, k) => {
      strings(v, ['section', 'label', 'icon'], k);
      if (!document.getElementById(v.section)) throw new Error(`${k}.section does not identify an existing section`);
    });
    array(data.about, 'about', (v, k) => { strings(v, ['title', 'icon'], k); textArray(v.lines, `${k}.lines`); });
    array(data.skillGroups, 'skillGroups', (v, k) => {
      strings(v, ['title'], k);
      array(v.items, `${k}.items`, (item, key) => strings(item, ['name', 'icon'], key));
    });
    array(data.experience, 'experience', (v, k) => {
      strings(v, ['role', 'company', 'period'], k);
      textArray(v.highlights, `${k}.highlights`);
      array(v.projects, `${k}.projects`, (item, key) => { strings(item, ['name'], key); textArray(item.highlights, `${key}.highlights`); });
    });
    array(data.education, 'education', (v, k) => strings(v, ['qualification', 'period', 'score', 'institution'], k));
    array(data.projects, 'projects', (v, k) => strings(v, ['name', 'description', 'image', 'imageAlt', 'liveUrl', 'sourceUrl'], k));
    strings(data.contact, ['title', 'buttonLabel'], 'contact');
    textArray(data.contact.lines, 'contact.lines');
  };
  try {
    const response = await fetch('data/portfolio.json', {cache: 'no-cache'});
    if (!response.ok) throw new Error(`Content request failed (${response.status})`);
    const data = await response.json();
    validateContent(data);
    for (const field of ['navigation','about','skillGroups','experience','education','projects']) {
      if (!Array.isArray(data[field])) throw new Error(`Expected an array: ${field}`);
    }
    const {profile, metadata, contact} = data;
    if (!profile || !metadata || !contact || !Array.isArray(profile.roles) || !Array.isArray(profile.socialLinks)) throw new Error('Missing profile, metadata, or contact fields');
    // Prepare every fragment before changing the page, so invalid data leaves the fallback intact.
    const fragments = {
      '#navbar ul': data.navigation.map((n,i) => `<li><a href="#${escape(n.section)}" class="nav-link scrollto${i === 0 ? ' active' : ''}">${icon(n.icon)} <span>${escape(n.label)}</span></a></li>`).join(''),
      '#hero h1': `<span style="font-weight: lighter;">${escape(profile.firstName)}</span> ${escape(profile.lastName)}`,
      '#hero .social-links': profile.socialLinks.map(s => `<a href="${escape(url(s.url))}" class="${escape(s.className || '')}" aria-label="${escape(s.label)}">${icon(s.icon)}</a>`).join(''),
      '#about .about-containers': data.about.map(a => `<div class="details-container">${image(a.icon)}<h3>${escape(a.title)}</h3><p>${lines(a.lines)}</p></div>`).join(''),
      '#skills .about-containers': data.skillGroups.map(g => `<div class="details-container"><h2 class="experience-sub-title">${escape(g.title)}</h2><div class="article-container">${g.items.map(s => `<article>${image(s.icon)}<div><h3>${escape(s.name)}</h3></div></article>`).join('')}</div></div>`).join(''),
      '#education .row > div': data.education.map(e => `<div class="education-item"><h4>${escape(e.qualification)}</h4><h5>${escape(e.period)}</h5>${e.score ? `<h5>${escape(e.score)}</h5>` : ''}<p><em>${escape(e.institution)}</em></p></div>`).join(''),
      '.portfolio-container': data.projects.map(p => `<div class="col-lg-4 col-md-6 portfolio-item filter-web"><div class="portfolio-wrap">${image(p.image, p.imageAlt || `${p.name} screenshot`, 'img-fluid')}<div class="portfolio-info"><h4>${escape(p.name)}</h4><p>${escape(p.description)}</p><div class="portfolio-links">${link(p.image, `Preview ${p.name}`, 'bx-plus', false, 'class="portfolio-lightbox" data-gallery="portfolioGallery"')}${link(p.liveUrl, 'Open live project', 'bx-link', true)}${link(p.sourceUrl, 'View project source code', 'bx-code-alt', true)}</div></div></div>`).join(''),
      '#contact .row': `<h2>${escape(contact.title)}</h2><div class="d-flex flex-column align-items-center">${lines(contact.lines)}<br><a href="${escape(url('mailto:' + profile.email))}" class="contact-button">${escape(contact.buttonLabel)}</a></div>`
    };
    const experience = data.experience.map(e => `<div><div style="font-weight: bolder;"><h3>${escape(e.role)}</h3><p>${escape(e.company)}</p><p>${escape(e.period)}</p>${e.projects?.length ? `<p>Project: ${escape(e.projects[0].name)}</p>` : ''}</div>${list(e.highlights)}${(e.projects || []).map((p,i) => `${i ? `<b>Project: ${escape(p.name)}</b>` : ''}${list(p.highlights)}`).join('')}</div>`).join('<div class="m-3"></div>');
    const photo = url(profile.photo);
    const favicon = url(metadata.favicon);
    const email = url('mailto:' + profile.email);
    for (const [selector, html] of Object.entries(fragments)) document.querySelector(selector).innerHTML = html;
    const experienceContainer = document.querySelector('#experience .container');
    [...experienceContainer.children].filter(e => e.tagName !== 'BR' && !e.classList.contains('section-title') && !e.classList.contains('section-ending-padding')).forEach(e => e.remove());
    experienceContainer.querySelector('.section-ending-padding').insertAdjacentHTML('beforebegin', experience);
    document.title = text(metadata.title);
    document.querySelector('meta[name="description"]').content = text(metadata.description);
    document.querySelector('meta[name="keywords"]').content = text(metadata.keywords);
    document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]').forEach(e => e.href = favicon);
    document.querySelector('#hero p').textContent = text(profile.greeting);
    const roleLine = document.querySelector('#hero .typed').parentElement;
    roleLine.firstChild.textContent = text(profile.rolePrefix) + ' ';
    document.querySelector('.typed').dataset.typedItems = profile.roles.join(',');
    document.querySelector('.typed').textContent = text(profile.roles[0]);
    const picture = document.querySelector('#dp'); picture.src = photo; picture.alt = text(profile.photoAlt);
    const emailLink = document.querySelector('.email-element a'); emailLink.href = email; emailLink.textContent = text(profile.email);
    for (const [id, heading] of Object.entries(data.headings || {})) {
      const section = document.getElementById(id);
      if (section?.querySelector('.section-title h2')) section.querySelector('.section-title h2').textContent = text(heading);
    }
    return true;
  } catch (error) {
    console.error('Portfolio content could not be loaded; showing the built-in content.', error);
    return false;
  }
})();
