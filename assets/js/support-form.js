function handleSubmit(e) {
  e.preventDefault();
  var btn = document.getElementById('submit-btn');
  var status = document.getElementById('form-status');
  var email = document.getElementById('email').value;
  var message = document.getElementById('message').value;
  var t = function (key) {
    return window.JoiynI18n ? window.JoiynI18n.t(key) : key;
  };

  if (!email || !message) {
    status.textContent = t('support.formErrorRequired');
    status.style.color = 'var(--error, #FF6B6B)';
    status.style.display = 'block';
    return;
  }

  btn.disabled = true;
  btn.textContent = t('support.formSending');

  var topic = document.getElementById('topic').value;
  var name = document.getElementById('name').value;
  var subject = encodeURIComponent('Joiyn Support: ' + (topic || t('support.mailSubjectGeneral')));
  var body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);
  window.location.href = 'mailto:shirocoding@gmail.com?subject=' + subject + '&body=' + body;

  status.textContent = t('support.formSuccess');
  status.style.color = 'var(--primary)';
  status.style.display = 'block';
  btn.disabled = false;
  btn.textContent = t('support.formSubmit');
}

document.addEventListener('joiyn:langchange', function () {
  var btn = document.getElementById('submit-btn');
  if (btn && !btn.disabled && window.JoiynI18n) {
    btn.textContent = window.JoiynI18n.t('support.formSubmit');
  }
});
