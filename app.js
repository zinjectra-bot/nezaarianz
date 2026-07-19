/* ==========================================================
   Nezaarianz — Premium Interactions (Part ?)
   Core UI + Navigation + Cursor + Tilt + Random Junks
========================================================== */

(() => {

"use strict";

/* ==========================================================
   Helpers
========================================================== */

const $ = (selector, root = document) =>
    root.querySelector(selector);

const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];


/* ==========================================================
   Preloader
========================================================== */

window.addEventListener("load", () => {

    const preloader = $("#preloader");

    if (!preloader) return;

    setTimeout(() => {

        preloader.classList.add("hide");

    }, 500);

});


/* ==========================================================
   Footer Year
========================================================== */

const year = $("#year");

if (year) {

    year.textContent = new Date().getFullYear();

}


/* ==========================================================
   Theme
========================================================== */

const body = document.body;

const savedTheme = localStorage.getItem("nz-theme");

if (savedTheme) {

    body.classList.remove("dark","light");
    body.classList.add(savedTheme);

}

$("#themeToggle")?.addEventListener("click", () => {

    const light = body.classList.toggle("light");

    body.classList.toggle("dark", !light);

    localStorage.setItem(
        "nz-theme",
        light ? "light" : "dark"
    );

});


/* ==========================================================
   Navbar
========================================================== */

const nav = $("#nav");
const progress = $("#scrollProgress");
const toTop = $("#toTop");

function updateScrollUI() {

    const scroll = window.scrollY;

    nav?.classList.toggle("shrink", scroll > 40);

    toTop?.classList.toggle("show", scroll > 500);

    const max =
        document.documentElement.scrollHeight -
        window.innerHeight;

    if (progress && max > 0) {

        progress.style.width =
            (scroll / max) * 100 + "%";

    }

}

window.addEventListener(
    "scroll",
    updateScrollUI,
    { passive: true }
);

updateScrollUI();


/* ==========================================================
   Mobile Menu
========================================================== */

const navToggle = $("#navToggle");
const navLinks = $("#navLinks");

navToggle?.addEventListener("click", () => {

    navToggle.classList.toggle("open");
    navLinks?.classList.toggle("open");

});

$$(".nav-link").forEach(link => {

    link.addEventListener("click", () => {

        navToggle?.classList.remove("open");
        navLinks?.classList.remove("open");

    });

});


/* ==========================================================
   Back To Top
========================================================== */

toTop?.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});


/* ==========================================================
   Cursor
========================================================== */

const glow = $("#mouseGlow");
const dot = $("#cursorDot");
const ring = $("#cursorRing");

let mouseX = innerWidth / 2;
let mouseY = innerHeight / 2;

let ringX = mouseX;
let ringY = mouseY;

window.addEventListener("mousemove", e => {

    mouseX = e.clientX;
    mouseY = e.clientY;

    if (dot) {

        dot.style.transform =
            `translate(${mouseX}px,${mouseY}px) translate(-50%,-50%)`;

    }

});

function animateCursor() {

    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;

    if (ring) {

        ring.style.transform =
            `translate(${ringX}px,${ringY}px) translate(-50%,-50%)`;

    }

    if (glow) {

        glow.style.transform =
            `translate(${ringX}px,${ringY}px) translate(-50%,-50%)`;

    }

    requestAnimationFrame(animateCursor);

}

requestAnimationFrame(animateCursor);


/* ==========================================================
   Cursor Hover
========================================================== */

$$("button,a,.mem-card,.g-card,.tilt").forEach(el => {

    el.addEventListener("mouseenter", () => {

        ring?.classList.add("grow");

    });

    el.addEventListener("mouseleave", () => {

        ring?.classList.remove("grow");

    });

});


/* ==========================================================
   Magnetic Buttons
========================================================== */

$$(".magnetic").forEach(el => {

    el.addEventListener("mousemove", e => {

        const rect = el.getBoundingClientRect();

        const x =
            e.clientX - (rect.left + rect.width / 2);

        const y =
            e.clientY - (rect.top + rect.height / 2);

        el.style.transform =
            `translate(${x * 0.18}px,${y * 0.22}px)`;

    });

    el.addEventListener("mouseleave", () => {

        el.style.transform = "";

    });

});


/* ==========================================================
   Premium 3D Tilt
========================================================== */

$$("[data-tilt]").forEach(card => {

    let frame;

    card.addEventListener("mousemove", e => {

        cancelAnimationFrame(frame);

        frame = requestAnimationFrame(() => {

            const rect =
                card.getBoundingClientRect();

            const px =
                (e.clientX - rect.left) /
                rect.width -
                0.5;

            const py =
                (e.clientY - rect.top) /
                rect.height -
                0.5;

            card.style.transform = `
perspective(1200px)
rotateY(${px * 8}deg)
rotateX(${-py * 8}deg)
translateY(-4px)
`;

        });

    });

    card.addEventListener("mouseleave", () => {

        card.style.transform = "";

    });

});
   
/* ---------------- Reveal ---------------- */

const revealObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("in");
            revealObserver.unobserve(entry.target);
        });
    },
    {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    }
);

$$(".reveal").forEach(el => revealObserver.observe(el));

/* ---------------- Active Nav ---------------- */

const sections = [
    "home",
    "about",
    "memories",
    "gallery",
    "legacy",
    "socials",
    "footer"
]
.map(id => document.getElementById(id))
.filter(Boolean);

const navItems = $$(".nav-link");

const spy = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            navItems.forEach(link => {
                link.classList.toggle(
                    "active",
                    link.getAttribute("href") === "#" + entry.target.id
                );
            });
        });
    },
    {
        threshold: 0.45
    }
);

sections.forEach(section => spy.observe(section));

/* ---------------- Counters ---------------- */

const counterObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            const el = entry.target;
            const target = Number(el.dataset.count);
            const startTime = performance.now();
            const duration = 1600;

            function update(now) {

                const progress = Math.min((now - startTime) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);

                el.textContent = Math.floor(target * eased).toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    el.textContent = target.toLocaleString();
                }

            }

            requestAnimationFrame(update);

            counterObserver.unobserve(el);

        });
    },
    {
        threshold: 0.5
    }
);

$$("[data-count]").forEach(el => counterObserver.observe(el));

/* ---------------- Lightbox ---------------- */

const lightbox = $("#lightbox");
const lbImg = $("#lbImg");

function openLightbox(src) {
    if (!lightbox || !lbImg) return;

    lbImg.src = src;
    lightbox.classList.add("open");
}

function closeLightbox() {
    lightbox?.classList.remove("open");
}

$$("[data-src]").forEach(item => {
    item.addEventListener("click", () => {
        openLightbox(item.dataset.src);
    });
});

$("#lbClose")?.addEventListener("click", closeLightbox);

lightbox?.addEventListener("click", e => {
    if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeLightbox();
});

/* ---------------- Hero Parallax ---------------- */

const heroVisual = $(".hero-visual");

if (heroVisual) {

    window.addEventListener("mousemove", e => {

        const x = (e.clientX / innerWidth - 0.5) * 14;
        const y = (e.clientY / innerHeight - 0.5) * 14;

        heroVisual.style.transform =
            `translate3d(${x}px,${y}px,0)`;

    });

}

const heroVideo = document.querySelector(".hero-video");

if (heroVideo) {

    heroVideo.muted = true;
    heroVideo.loop = true;
    heroVideo.playsInline = true;

    heroVideo.play().catch(() => {

        document.addEventListener("click", () => {
            heroVideo.play();
        }, { once: true });

    });

}
   
$$(".btn").forEach(btn => {

    btn.style.position = "relative";
    btn.style.overflow = "hidden";

    btn.addEventListener("pointerdown", e => {

        const rect = btn.getBoundingClientRect();

        const ripple = document.createElement("span");

        ripple.className = "btn-ripple";

        ripple.style.left = (e.clientX - rect.left) + "px";
        ripple.style.top = (e.clientY - rect.top) + "px";

        btn.appendChild(ripple);

        ripple.addEventListener("animationend", () => {

            ripple.remove();

        });

    });

});

const rippleStyle = document.createElement("style");

rippleStyle.textContent = `
.btn-ripple{

position:absolute;
width:12px;
height:12px;
left:0;
top:0;
border-radius:50%;
background:rgba(255,255,255,.45);
pointer-events:none;
transform:translate(-50%,-50%) scale(0);
animation:ripple .65s ease-out forwards;

}

@keyframes ripple{

0%{
transform:translate(-50%,-50%) scale(0);
opacity:.8;
}

100%{
transform:translate(-50%,-50%) scale(40);
opacity:0;
}

}
`;

document.head.appendChild(rippleStyle);

/* ==========================================================
   Refresh
========================================================== */

window.addEventListener("resize", () => {

    ScrollTrigger.refresh();

});

window.addEventListener("orientationchange", () => {

    setTimeout(() => {

        ScrollTrigger.refresh();

    }, 250);

});

 /* ==========================================================
   Performance Optimizations
========================================================== */

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if (prefersReducedMotion) {

    document.documentElement.classList.add("reduce-motion");

}

/* ---------- Passive Listeners ---------- */

["touchstart","touchmove","wheel"].forEach(type => {

    window.addEventListener(type, () => {}, {
        passive: true
    });

});

/* ---------- Smooth Scroll ---------- */

document.documentElement.style.scrollBehavior = "smooth";

/* ---------- Lazy Images ---------- */

$$("img").forEach(img => {

    if (!img.hasAttribute("loading")) {

        img.loading = "lazy";

    }

    if (!img.hasAttribute("decoding")) {

        img.decoding = "async";

    }

});

/* ---------- GPU Acceleration ---------- */

$$(".hero,.hero-visual,.intro-animation,video,.mem-card,.g-card")
.forEach(el => {

    el.style.willChange = "transform";

});

/* ---------- Page Visibility ---------- */

document.addEventListener("visibilitychange", () => {

    if (document.hidden) {

        gsap.globalTimeline.pause();

    } else {

        gsap.globalTimeline.resume();

    }

});

/* ---------- Refresh ---------- */

window.addEventListener("load", () => {

    if (window.ScrollTrigger) {

        ScrollTrigger.refresh(true);

    }

});

window.addEventListener("resize", () => {

    if (window.ScrollTrigger) {

        ScrollTrigger.refresh(true);

    }

});

/* ---------- Cleanup ---------- */

window.addEventListener("beforeunload", () => {

    if (window.ScrollTrigger) {

        ScrollTrigger.getAll().forEach(st => st.kill());

    }

});

/* ==========================================================
   Finished, Coded By Zinjectra/Ad1th
========================================================== */

})();
