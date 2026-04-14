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

  resetTimer();
}

function nextSlide() {
  goToSlide(currentSlide + 1);
}

function resetTimer() {
  if (slideshowTimer) clearInterval(slideshowTimer);
  slideshowTimer = setInterval(nextSlide, 5000);
}

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

  // Set min date to today
  const today = new Date().toISOString().split('T')[0];
  const d1 = document.getElementById('inspectionDate');
  if (d1) d1.min = today;

  // Phone formatter
  const phoneInput = document.getElementById('phoneInput');
  if (phoneInput && !phoneInput._formatted) {
    phoneInput._formatted = true;
    phoneInput.addEventListener('input', function() {
      let digits = this.value.replace(/\D/g, '').slice(0, 10);
      let formatted = '';
      if (digits.length === 0) {
        formatted = '';
      } else if (digits.length <= 3) {
        formatted = '(' + digits;
      } else if (digits.length <= 6) {
        formatted = '(' + digits.slice(0,3) + ') ' + digits.slice(3);
      } else {
        formatted = '(' + digits.slice(0,3) + ') ' + digits.slice(3,6) + '-' + digits.slice(6);
      }
      this.value = formatted;
    });
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

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeQuoteModal();
});

function selectTime(el, value) {
  document.querySelectorAll('.time-slot').forEach(t => t.classList.remove('selected'));
  el.classList.add('selected');
  document.getElementById('inspectionTime').value = value;
}


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

  btn.innerHTML = 'Sending…';
  btn.disabled = true;

  const data = {
    token:          'nexgen-quote-2026',
    firstName:      firstName,
    lastName:       form.querySelector('input[placeholder="Smith"]').value.trim(),
    email:          email,
    phone:          form.querySelector('input[type="tel"]').value.trim(),
    address:        form.querySelector('input[placeholder="123 Main St, Calgary, AB"]').value.trim(),
    service:        form.querySelector('#modalServiceSelect').value,
    propertyType:   form.querySelectorAll('select')[1].value,
    inspectionDate: document.getElementById('inspectionDate').value,
    inspectionTime: document.getElementById('inspectionTime').value,
    notes:          form.querySelector('textarea').value.trim()
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

    btn.innerHTML = '✓ Inspection Requested!';
    btn.style.background = '#6B7B5E';

    setTimeout(() => {
      form.reset();
      document.querySelectorAll('.time-slot').forEach(t => t.classList.remove('selected'));
      btn.innerHTML = 'Request Inspection <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
      btn.style.background = '';
      btn.disabled = false;
      closeQuoteModal();
    }, 2500);

  } catch (err) {
    btn.innerHTML = 'Request Inspection <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
    btn.disabled = false;
    btn.style.background = '';
    alert('Something went wrong. Please call us directly at (587) 839-5484.');
  }
}
