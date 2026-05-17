(function () {
  var stored = localStorage.getItem('joiyn-lang');
  var nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
  var lang = stored === 'pl' || stored === 'en' ? stored : nav.startsWith('pl') ? 'pl' : 'en';
  document.documentElement.lang = lang;
})();
