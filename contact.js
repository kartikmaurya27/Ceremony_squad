/* ================================================================
   LUMIÈRE EVENTS — contact.js
   All interactions for the contact page
================================================================ */
'use strict';

/* ──────────────────────────────────────
   1. CUSTOM CURSOR
────────────────────────────────────── */
const cursorDot  = document.querySelector('.c-dot');
const cursorRing = document.querySelector('.c-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursorDot.style.left = mx + 'px';
  cursorDot.style.top  = my + 'px';
});
(function ringLoop() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top  = ry + 'px';
  requestAnimationFrame(ringLoop);
})();
document.querySelectorAll(
  'a, button, .is-card, .stab, .fo-item, .soc-btn, .wa-cta-card, .faq-q, .chip'
).forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hov'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hov'));
});

/* ──────────────────────────────────────
   2. PARTICLE CANVAS
────────────────────────────────────── */
const canvas = document.getElementById('pc');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const ptCount = 75;
const palette = [
  'rgba(201,168,76,',
  'rgba(123,47,247,',
  'rgba(232,108,44,',
  'rgba(37,211,102,',
];

const pts = Array.from({ length: ptCount }, () => {
  const a = Math.random() * 0.45 + 0.08;
  return {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.38,
    vy: (Math.random() - 0.5) * 0.38,
    r: Math.random() * 1.8 + 0.3,
    c: palette[Math.floor(Math.random() * palette.length)] + a + ')',
  };
});

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Connecting lines
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const dx = pts[i].x - pts[j].x;
      const dy = pts[i].y - pts[j].y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 115) {
        ctx.beginPath();
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[j].x, pts[j].y);
        ctx.strokeStyle = `rgba(201,168,76,${0.04 * (1 - d / 115)})`;
        ctx.lineWidth   = 0.5;
        ctx.stroke();
      }
    }
  }

  pts.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.c;
    ctx.fill();
  });

  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ──────────────────────────────────────
   3. SCROLL PROGRESS BAR
────────────────────────────────────── */
const sp = document.getElementById('sp');
window.addEventListener('scroll', () => {
  const s = window.scrollY;
  const h = document.documentElement.scrollHeight - window.innerHeight;
  sp.style.width = (h > 0 ? (s / h) * 100 : 0) + '%';
}, { passive: true });

/* ──────────────────────────────────────
   4. NAVBAR SCROLL BEHAVIOUR
────────────────────────────────────── */
const navEl    = document.getElementById('nav');
const hbg      = document.getElementById('hbg');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navEl.classList.toggle('sc', window.scrollY > 60);
  toggleBackTop();
}, { passive: true });

hbg.addEventListener('click', () => {
  hbg.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hbg.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ──────────────────────────────────────
   5. BACK TO TOP
────────────────────────────────────── */
const btt = document.getElementById('btt');
function toggleBackTop() {
  btt.classList.toggle('show', window.scrollY > 500);
}
btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ──────────────────────────────────────
   6. WHATSAPP BUBBLE — hide on scroll up, show on scroll down
────────────────────────────────────── */
const waBubble = document.getElementById('waBubble');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const curr = window.scrollY;
  if (curr > 200) {
    waBubble.style.opacity = '1';
    waBubble.style.transform = curr > lastScroll ? 'scale(.92)' : 'scale(1)';
  }
  lastScroll = curr;
}, { passive: true });

/* ──────────────────────────────────────
   7. SMOOTH ANCHOR SCROLL
────────────────────────────────────── */
document.querySelectorAll('.scroll-to').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.dataset.target;
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      window.scrollTo({ top: el.offsetTop - 88, behavior: 'smooth' });
    }
  });
});

/* ──────────────────────────────────────
   8. SCROLL REVEAL
────────────────────────────────────── */
const srObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const siblings = [...entry.target.parentElement.children];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('vis'), idx * 80);
      srObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.sr').forEach(el => srObs.observe(el));

/* ──────────────────────────────────────
   9. SERVICE QUICK-SELECT TABS
────────────────────────────────────── */
const stabs  = document.querySelectorAll('.stab');
const cfSvc  = document.getElementById('cf-svc');

stabs.forEach(tab => {
  tab.addEventListener('click', () => {
    stabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const val = tab.dataset.val;
    if (cfSvc) {
      // Set the select to matching option
      for (const opt of cfSvc.options) {
        if (opt.value === val) { cfSvc.value = val; break; }
      }
    }
  });
});

// Sync tab when select changes
if (cfSvc) {
  cfSvc.addEventListener('change', () => {
    stabs.forEach(t => {
      t.classList.toggle('active', t.dataset.val === cfSvc.value);
    });
  });
}

/* ──────────────────────────────────────
   10. CONTACT FORM SUBMISSION
────────────────────────────────────── */
const form      = document.getElementById('contactForm');
const successEl = document.getElementById('cfSuccess');
const submitBtn = document.getElementById('cfSubmit');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();

    // Validate required fields
    const required = ['cf-name', 'cf-phone', 'cf-email', 'cf-msg'];
    let valid = true;

    required.forEach(id => {
      const el   = document.getElementById(id);
      const wrap = el.closest('.cff-wrap');
      if (!el.value.trim()) {
        wrap.classList.add('err');
        setTimeout(() => wrap.classList.remove('err'), 500);
        valid = false;
      }
    });

    // Email format
    const emailEl = document.getElementById('cf-email');
    if (emailEl && emailEl.value && !/\S+@\S+\.\S+/.test(emailEl.value)) {
      emailEl.closest('.cff-wrap').classList.add('err');
      setTimeout(() => emailEl.closest('.cff-wrap').classList.remove('err'), 500);
      valid = false;
    }

    if (!valid) {
      shakeBtn();
      return;
    }

    // Show loading state
    const txtEl = submitBtn.querySelector('.cfs-text');
    const icoEl = submitBtn.querySelector('.cfs-icon');
    const ldrEl = submitBtn.querySelector('.cfs-loader');
    submitBtn.disabled = true;
    txtEl.style.display = 'none';
    icoEl.style.display = 'none';
    ldrEl.style.display = 'inline-flex';

    // Simulate API call
    setTimeout(() => {
      form.style.display = 'none';
      successEl.style.display = 'block';
      showToast('Message sent! We\'ll call you within 4 hours. ✨');

      // Reset for reuse
      submitBtn.disabled = false;
      txtEl.style.display = '';
      icoEl.style.display = '';
      ldrEl.style.display = 'none';
    }, 2000);
  });
}

function shakeBtn() {
  submitBtn.style.animation = 'errShake .35s ease';
  setTimeout(() => submitBtn.style.animation = '', 400);
}

/* ──────────────────────────────────────
   11. FAQ ACCORDION
────────────────────────────────────── */
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item   = q.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ──────────────────────────────────────
   12. FULL MAP — office switcher
────────────────────────────────────── */
const officeMap = document.getElementById('officeMap');
const foItems   = document.querySelectorAll('.fo-item');

const officeSrcs = {
  noida:  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14014.826!2d77.3604!3d28.6198!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cefb6!2sSector%2063%2C%20Noida!5e0!3m2!1sen!2sin!4v1',
  delhi:  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14013.2!2d77.2177!3d28.6328!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd37!2sConnaught%20Place%20New%20Delhi!5e0!3m2!1sen!2sin!4v1',
  mumbai: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15083.5!2d72.8296!3d19.0596!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8e!2sBandra%20West%20Mumbai!5e0!3m2!1sen!2sin!4v1',
  jaipur: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14244.5!2d75.8038!3d26.9124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db!2sC-Scheme%20Jaipur!5e0!3m2!1sen!2sin!4v1',
};

foItems.forEach(item => {
  item.addEventListener('click', () => {
    foItems.forEach(fi => fi.classList.remove('active'));
    item.classList.add('active');
    if (officeMap) {
      officeMap.style.opacity = '0';
      officeMap.style.transition = 'opacity .35s ease';
      setTimeout(() => {
        officeMap.src = officeSrcs[item.dataset.office] || officeSrcs.noida;
        officeMap.style.opacity = '1';
      }, 350);
    }
  });
});

/* ──────────────────────────────────────
   13. TOAST NOTIFICATION
────────────────────────────────────── */
function showToast(msg) {
  const existing = document.querySelector('.lm-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'lm-toast';
  toast.innerHTML = `<i class="fas fa-star"></i> ${msg}`;
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '110px',
    right: '32px',
    background: 'linear-gradient(135deg,#1a1500,#2a2200)',
    border: '1px solid rgba(201,168,76,.4)',
    color: '#eae6de',
    padding: '14px 22px',
    borderRadius: '12px',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '.8rem',
    letterSpacing: '.04em',
    zIndex: '99999',
    boxShadow: '0 8px 40px rgba(0,0,0,.5)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    maxWidth: '340px',
    transform: 'translateY(20px)',
    opacity: '0',
    transition: 'all .4s ease',
  });
  toast.querySelector('i').style.color = '#c9a84c';
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity   = '1';
  });

  setTimeout(() => {
    toast.style.transform = 'translateY(20px)';
    toast.style.opacity   = '0';
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}

/* ──────────────────────────────────────
   14. INFO STRIP — tilt on hover
────────────────────────────────────── */
document.querySelectorAll('.is-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top  + r.height / 2;
    const rx2 = ((e.clientY - cy) / (r.height / 2)) * -3;
    const ry2 = ((e.clientX - cx) / (r.width  / 2)) *  3;
    card.style.transform = `perspective(600px) rotateX(${rx2}deg) rotateY(${ry2}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform .5s ease';
  });
});

/* ──────────────────────────────────────
   15. CURSOR TRAIL
────────────────────────────────────── */
const trailDots = Array.from({ length: 6 }, (_, i) => {
  const d = document.createElement('div');
  Object.assign(d.style, {
    position: 'fixed',
    width:  (3.5 - i * 0.4) + 'px',
    height: (3.5 - i * 0.4) + 'px',
    borderRadius: '50%',
    background: `rgba(201,168,76,${0.45 - i * 0.06})`,
    pointerEvents: 'none',
    zIndex: '9990',
    transform: 'translate(-50%,-50%)',
    top: '0', left: '0',
  });
  document.body.appendChild(d);
  return { el: d };
});

document.addEventListener('mousemove', e => {
  trailDots.forEach((t, i) => {
    setTimeout(() => {
      t.el.style.left = e.clientX + 'px';
      t.el.style.top  = e.clientY + 'px';
    }, i * 22);
  });
});

/* ──────────────────────────────────────
   16. ANIMATE HERO CHIPS ON LOAD
────────────────────────────────────── */
window.addEventListener('load', () => {
  document.querySelectorAll('.chip').forEach((chip, i) => {
    chip.style.opacity = '0';
    chip.style.transform = 'translateY(16px)';
    chip.style.transition = `opacity .6s ease ${0.4 + i * 0.12}s, transform .6s ease ${0.4 + i * 0.12}s`;
    requestAnimationFrame(() => {
      chip.style.opacity = '1';
      chip.style.transform = 'translateY(0)';
    });
  });

  // Animate hero title lines
  document.querySelectorAll('.hb-title, .hb-sub, .hb-eyebrow').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity .75s ease ${0.1 + i * 0.15}s, transform .75s ease ${0.1 + i * 0.15}s`;
    requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  });
});

/* ──────────────────────────────────────
   17. CONSOLE BRANDING
────────────────────────────────────── */
console.log(
  '%c LUMIÈRE EVENTS ',
  'background:linear-gradient(135deg,#9a7530,#c9a84c,#f0d080);color:#09090b;font-size:14px;font-weight:bold;padding:6px 16px;border-radius:4px;'
);
console.log('%c Contact page loaded ✨', 'color:#c9a84c;font-size:11px;');
