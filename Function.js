async function submitQuote(e) {
  e.preventDefault();
  const form = document.getElementById('quoteForm');
  const btn  = form.querySelector('.form-submit');

  const firstName = form.querySelector('input[placeholder="Jane"]').value.trim();
  const email     = form.querySelector('input[type="email"]').value.trim();
  if (!firstName || !email) {
    alert('Please fill in at least your name and email.');
    return;
  }

  btn.textContent = 'Sending…';
  btn.disabled = true;

  const data = {
    token:        'nexgen-quote-2026',
    firstName:    firstName,
    lastName:     form.querySelector('input[placeholder="Smith"]').value.trim(),
    email:        email,
    phone:        form.querySelector('input[type="tel"]').value.trim(),
    service:      form.querySelector('#modalServiceSelect').value,
    propertyType: form.querySelectorAll('select')[1].value,
    bedrooms:     form.querySelectorAll('select')[2].value,
    bathrooms:    form.querySelectorAll('select')[3].value,
    size:         form.querySelectorAll('select')[4].value,
    notes:        form.querySelector('textarea').value.trim()
  };

  const SCRIPT_URLS = [
    'https://script.google.com/macros/s/AKfycbwJR1h6b_q529IfgltEdYwFYi7IKw7zgvX5CRZsvoqzgzsqqHRxV4fP6SDktFcq6K7NAA/exec',
    'https://script.google.com/macros/s/AKfycbzNvPkbYvntfxMRYLIrGVJgKoaXSxrh4QLFPJMm2qVGkzBbHgpo-w3KL5SBU-bM1AQC/exec'
  ];

  try {
    await Promise.all(SCRIPT_URLS.map(url => {
      const params = new URLSearchParams(data);
      return fetch(url + '?' + params.toString(), {
        method: 'GET',
        mode: 'no-cors'
      });
    }));

    btn.textContent = '✓ Request Sent!';
    btn.style.background = '#6B7B5E';
    setTimeout(() => {
      form.reset();
      btn.textContent = 'Send My Request →';
      btn.style.background = '';
      btn.disabled = false;
      closeQuoteModal();
    }, 2500);
  } catch (err) {
    alert('Something went wrong. Please call us at (587) 839-5484.');
    btn.textContent = 'Send My Request →';
    btn.disabled = false;
  }
}
