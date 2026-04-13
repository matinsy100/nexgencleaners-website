async function submitQuote(e) {
  e.preventDefault();

  const form = document.getElementById('quoteForm');
  const btn  = form.querySelector('.form-submit');

  // Basic validation
  const firstName = form.querySelector('input[placeholder="Jane"]').value.trim();
  const email     = form.querySelector('input[type="email"]').value.trim();
  if (!firstName || !email) {
    alert('Please fill in at least your name and email.');
    return;
  }

  // Disable button while sending
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
    'https://script.google.com/macros/s/AKfycbwg-LRLUAJahrpZdj6_MoRtp_uFz6YAQZoaGsj6ac6uQb8miaBWkvH9x5bMcdzVHRj5/exec',
    'https://script.google.com/macros/s/AKfycbzsxWqAUjSW7RDSzGUb0ivQ2f5CSKtF4_aoJoXVSuBCwY2JkJyM87C2OpTSSGC3ul9P/exec'
  ];

  try {
    // Send to both Google Apps Script URLs
    await Promise.all(SCRIPT_URLS.map(url =>
      fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
    ));

    // Success
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
