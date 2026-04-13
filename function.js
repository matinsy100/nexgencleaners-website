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
    'https://script.google.com/macros/s/AKfycbz3Kbrk1M4a2iEluopjol9iVHtrnH-m5LNW4XQJ5cpFXJCbehYY1iDstTBxdBEgXo-2sg/exec',
    'https://script.google.com/macros/s/AKfycbx54Goy-rwSCK4Z-fxuPvewl0Ln6bN9g9D_SvEs5kZRm8HTxageimX5q8MnBhhkD2kX/exec'
  ];

  try {
    await Promise.all(SCRIPT_URLS.map(url => {
      const params = new URLSearchParams(data);
      return fetch(url + '?' + params.toString(), {
        method: 'GET',
        mode: 'no-cors'
      });
    }));

    // With no-cors we assume success if no network error
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
    btn.textContent = 'Send My Request →';
    btn.disabled = false;
    btn.style.background = '';
    alert('Something went wrong. Please call us directly at (587) 839-5484.');
  }
}
