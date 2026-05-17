(function () {
  const STORAGE_KEY = 'joiyn-lang';
  const SUPPORTED = ['en', 'pl'];

  function detectLang() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED.includes(stored)) return stored;
    const nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    return nav.startsWith('pl') ? 'pl' : 'en';
  }

  function t(lang, key) {
    const parts = key.split('.');
    let node = window.JOIYN_TRANSLATIONS[lang];
    for (const p of parts) {
      if (!node || node[p] === undefined) return null;
      node = node[p];
    }
    return node;
  }

  function applyLang(lang) {
    if (!window.JOIYN_TRANSLATIONS || !window.JOIYN_TRANSLATIONS[lang]) return;
    document.documentElement.lang = lang;
    localStorage.setItem(STORAGE_KEY, lang);

    const page = document.body.dataset.page || 'index';
    const meta = window.JOIYN_TRANSLATIONS[lang].meta?.[page];
    if (meta) {
      if (meta.title) document.title = meta.title;
      const desc = document.querySelector('meta[name="description"]');
      if (desc && meta.description) desc.setAttribute('content', meta.description);
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle && meta.ogTitle) ogTitle.setAttribute('content', meta.ogTitle);
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc && meta.ogDescription) ogDesc.setAttribute('content', meta.ogDescription);
    }

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const val = t(lang, key);
      if (val != null) el.textContent = val;
    });

    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      const val = t(lang, key);
      if (val != null) el.innerHTML = val;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      const val = t(lang, key);
      if (val != null) el.setAttribute('placeholder', val);
    });

    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      const key = el.getAttribute('data-i18n-aria');
      const val = t(lang, key);
      if (val != null) el.setAttribute('aria-label', val);
    });

    document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
      const key = el.getAttribute('data-i18n-alt');
      const val = t(lang, key);
      if (val != null) el.setAttribute('alt', val);
    });

    document.querySelectorAll('select[data-i18n-options]').forEach((select) => {
      const key = select.getAttribute('data-i18n-options');
      const opts = t(lang, key);
      if (!opts) return;
      Array.from(select.options).forEach((opt, i) => {
        if (opts[i] !== undefined) opt.textContent = opts[i];
      });
    });

    document.querySelectorAll('.lang-btn').forEach((btn) => {
      const active = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('lang-btn-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    document.dispatchEvent(new CustomEvent('joiyn:langchange', { detail: { lang } }));
  }

  window.JoiynI18n = {
    getLang: detectLang,
    setLang: applyLang,
    t: (key) => t(detectLang(), key),
  };

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.lang-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        if (lang && SUPPORTED.includes(lang)) applyLang(lang);
      });
    });
    applyLang(detectLang());
  });
})();
