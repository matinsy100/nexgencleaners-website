/* ── SLIDESHOW ── */
let currentSlide = 0;
let slideshowTimer = null;

function goToSlide(index) {
  const slides = document.querySelectorAll('.slide');
  const dots   = document.querySelectorAll('.dot');

  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');

  currentSlide = (index + slides.length) % slides.length;

  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');

  // Reset the auto-advance timer whenever the user manually changes slide
  resetTimer();
}

function nextSlide() {
  goToSlide(currentSlide + 1);
}

function resetTimer() {
  if (slideshowTimer) clearInterval(slideshowTimer);
  slideshowTimer = setInterval(nextSlide, 5000);
}

// Kick off auto-advance on load
document.addEventListener('DOMContentLoaded', function () {
  resetTimer();
});


/* ── MODAL ── */
function openQuoteModal(service) {
  const modal = document.getElementById('quoteModal');
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  if (service) {
    const select = document.getElementById('modalServiceSelect');
    if (select) {
      for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].text === service) {
          select.selectedIndex = i;
          break;
        }
      }
    }
  }
}

function closeQuoteModal() {
  const modal = document.getElementById('quoteModal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function handleOverlayClick(e) {
  if (e.target === document.getElementById('quoteModal')) {
    closeQuoteModal();
  }
}

// Close modal on Escape key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeQuoteModal();
});


/* ── MOBILE MENU ── */
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.toggle('active');
}

function closeMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.remove('active');
}


/* ── QUOTE FORM ── */
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
    address:      form.querySelector('input[placeholder="123 Main St, Calgary, AB"]').value.trim(),
    service:      form.querySelector('#modalServiceSelect').value,
    propertyType: form.querySelectorAll('select')[1].value,
    notes:        form.querySelector('textarea').value.trim()
  };

  const SCRIPT_URLS = [
    'https://script.google.com/macros/s/AKfycbz3Kbrk1M4a2iEluopjol9iVHtrnH-m5LNW4XQJ5cpFXJCbehYY1iDstTBxdBEgXo-2sg/exec',
    'https://script.google.com/macros/s/AKfycbx54Goy-rwSCK4Z-fxuPvewl0Ln6bN9g9D_SvEs5kZRm8HTxageimX5q8MnBhhkD2kX/exec'
  ];

  try {
    await Promise.all(SCRIPT_URLS.map(url => {
      const params = new URLSearchParams(data);
      return fetch(url + '?' + params.toString(), { method: 'GET', mode: 'no-cors' });
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
    btn.textContent = 'Send My Request →';
    btn.disabled = false;
    btn.style.background = '';
    alert('Something went wrong. Please call us directly at (587) 839-5484.');
  }
}
