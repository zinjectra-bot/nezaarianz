/* Nezaarianz — Premium interactions */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* Preloader */
  window.addEventListener('load', () => {
    setTimeout(() => $('#preloader')?.classList.add('hide'), 500);
  });

  /* Year */
  $('#year').textContent = new Date().getFullYear();

  /* Theme */
  const body = document.body;
  const savedTheme = localStorage.getItem('nz-theme');
  if (savedTheme) { body.classList.remove('dark','light'); body.classList.add(savedTheme); }
  $('#themeToggle').addEventListener('click', () => {
    const isLight = body.classList.toggle('light');
    body.classList.toggle('dark', !isLight);
    localStorage.setItem('nz-theme', isLight ? 'light' : 'dark');
  });

  /* Intro */

function closeIntro() {
    const intro = document.getElementById("intro");

    intro.style.opacity = "0";

    setTimeout(() => {
        intro.remove();
    }, 800);
}

// Example: close after 4.5 seconds
setTimeout(closeIntro, 4500);

  /* Nav shrink */
  const nav = $('#nav');
  const scrollProgress = $('#scrollProgress');
  const toTop = $('#toTop');
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('shrink', y > 40);
    toTop.classList.toggle('show', y > 500);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.style.width = ((y / h) * 100) + '%';
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  const navToggle = $('#navToggle');
  const navLinks = $('#navLinks');
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  $$('.nav-link').forEach(a => a.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
  }));

  /* Back to top */
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* Cursor + glow */
  const glow = $('#mouseGlow');
  const cDot = $('#cursorDot');
  const cRing = $('#cursorRing');
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cDot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`; });
  const raf = () => {
    rx += (mx - rx) * 0.14; ry += (my - ry) * 0.14;
    cRing.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    glow.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
  $$('a, button, .mem-card, .g-card, .tilt').forEach(el => {
    el.addEventListener('mouseenter', () => cRing.classList.add('grow'));
    el.addEventListener('mouseleave', () => cRing.classList.remove('grow'));
  });

  /* Magnetic buttons */
  $$('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * 0.18}px, ${y * 0.25}px)`;
    });
    el.addEventListener('mouseleave', () => el.style.transform = '');
  });

  /* 3D tilt */
  $$('[data-tilt]').forEach(el => {
    let raf2;
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf2);
      raf2 = requestAnimationFrame(() => {
        el.style.transform = `perspective(1000px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg) translateY(-4px)`;
      });
    });
    el.addEventListener('mouseleave', () => el.style.transform = '');
  });

  /* Reveal on scroll */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach(el => io.observe(el));

  /* Active nav link on scroll */
  const sections = ['home','about','memories','gallery','legacy','socials','footer'].map(id => document.getElementById(id)).filter(Boolean);
  const links = $$('.nav-link');
  const spy = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id));
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => spy.observe(s));

  /* Counters */
  const cIO = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = parseInt(el.dataset.count, 10);
      const dur = 1600;
      const start = performance.now();
      const tick = t => {
        const p = Math.min((t - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(target * eased).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString();
      };
      requestAnimationFrame(tick);
      cIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  $$('[data-count]').forEach(el => cIO.observe(el));

  /* Lightbox */
  const lb = $('#lightbox');
  const lbImg = $('#lbImg');
  const openLB = src => { lbImg.src = src; lb.classList.add('open'); };
  const closeLB = () => { lb.classList.remove('open'); };
  $$('[data-src]').forEach(el => el.addEventListener('click', () => openLB(el.dataset.src)));
  $('#lbClose').addEventListener('click', closeLB);
  lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLB(); });

  /* 3D Scroll */
const frameA = document.querySelector(".frameA");
const frameB = document.querySelector(".frameB");
const hero = document.querySelector(".hero");

const frames = [];

// Read every filename automatically
document.querySelectorAll("#frame-list img").forEach(img => {
    frames.push(img.dataset.src);
});

// Preload
frames.forEach(src => {
    const img = new Image();
    img.src = src;
});

// First frame
frameA.src = frames[0];
frameB.src = frames[0];

window.addEventListener("scroll", () => {

    const rect = hero.getBoundingClientRect();

    const progress = Math.min(
        Math.max(-rect.top / hero.offsetHeight, 0),
        1
    );

    const position = progress * (frames.length - 1);

    const current = Math.floor(position);
    const next = Math.min(current + 1, frames.length - 1);

    const blend = position - current;

    frameA.src = frames[current];
    frameB.src = frames[next];

    frameA.style.opacity = 1 - blend;
    frameB.style.opacity = blend;

});
  /* Button ripple */
  $$('.btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const r = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.style.cssText = `position:absolute;left:${e.clientX-r.left}px;top:${e.clientY-r.top}px;width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.5);transform:translate(-50%,-50%);pointer-events:none;animation:rip .7s ease-out forwards`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });
  const style = document.createElement('style');
  style.textContent = `@keyframes rip{to{width:400px;height:400px;opacity:0}}`;
  document.head.appendChild(style);

  /* Parallax on hero image */
  const heroVisual = $('.hero-visual');
  if (heroVisual) {
    window.addEventListener('mousemove', e => {
      const x = (e.clientX / window.innerWidth - 0.5) * 14;
      const y = (e.clientY / window.innerHeight - 0.5) * 14;
      heroVisual.style.transform = `translate(${x}px, ${y}px)`;
    });
  }
})();
