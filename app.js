/* Nezaarianz — Premium interactions */
(() => {
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];

    /* ---------------- Preloader ---------------- */

    window.addEventListener("load", () => {
        setTimeout(() => {
            $("#preloader")?.classList.add("hide");
        }, 500);
    });

    /* ---------------- Footer Year ---------------- */

    const year = $("#year");
    if (year) year.textContent = new Date().getFullYear();

    /* ---------------- Theme ---------------- */

    const body = document.body;

    const savedTheme = localStorage.getItem("nz-theme");

    if (savedTheme) {
        body.classList.remove("dark", "light");
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

    /* ---------------- Intro ---------------- */

    function closeIntro() {

        const intro = document.getElementById("intro");

        if (!intro) return;

        intro.style.opacity = "0";

        setTimeout(() => {

            intro.remove();

        }, 800);

    }

    setTimeout(closeIntro, 4500);

    /* ---------------- Navbar ---------------- */

    const nav = $("#nav");

    const scrollProgress = $("#scrollProgress");

    const toTop = $("#toTop");

    function updateScrollUI() {

        const y = window.scrollY;

        nav?.classList.toggle("shrink", y > 40);

        toTop?.classList.toggle("show", y > 500);

        const h =
            document.documentElement.scrollHeight -
            window.innerHeight;

        if (scrollProgress) {

            scrollProgress.style.width =
                (y / h) * 100 + "%";

        }

    }

    document.addEventListener(
        "scroll",
        updateScrollUI,
        { passive: true }
    );

    updateScrollUI();

    /* ---------------- Mobile Menu ---------------- */

    const navToggle = $("#navToggle");

    const navLinks = $("#navLinks");

    navToggle?.addEventListener("click", () => {

        navToggle.classList.toggle("open");

        navLinks.classList.toggle("open");

    });

    $$(".nav-link").forEach(link => {

        link.addEventListener("click", () => {

            navToggle?.classList.remove("open");

            navLinks?.classList.remove("open");

        });

    });

    /* ---------------- Back To Top ---------------- */

    toTop?.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

    /* ---------------- Cursor ---------------- */

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

    function cursorLoop() {

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

        requestAnimationFrame(cursorLoop);

    }

    requestAnimationFrame(cursorLoop);

    $$("a,button,.mem-card,.g-card,.tilt").forEach(el => {

        el.addEventListener("mouseenter", () => {

            ring?.classList.add("grow");

        });

        el.addEventListener("mouseleave", () => {

            ring?.classList.remove("grow");

        });

    });

    /* ---------------- Magnetic ---------------- */

    $$(".magnetic").forEach(el => {

        el.addEventListener("mousemove", e => {

            const r = el.getBoundingClientRect();

            const x =
                e.clientX - (r.left + r.width / 2);

            const y =
                e.clientY - (r.top + r.height / 2);

            el.style.transform =
                `translate(${x * .18}px,${y * .25}px)`;

        });

        el.addEventListener("mouseleave", () => {

            el.style.transform = "";

        });

    });

    /* ---------------- 3D Tilt ---------------- */

    $$("[data-tilt]").forEach(card => {

        let frame;

        card.addEventListener("mousemove", e => {

            const r = card.getBoundingClientRect();

            const px =
                (e.clientX - r.left) / r.width - .5;

            const py =
                (e.clientY - r.top) / r.height - .5;

            cancelAnimationFrame(frame);

            frame = requestAnimationFrame(() => {

                card.style.transform =
                    `perspective(1000px)
                     rotateY(${px * 8}deg)
                     rotateX(${-py * 8}deg)
                     translateY(-4px)`;

            });

        });

        card.addEventListener("mouseleave", () => {

            card.style.transform = "";

        });

    });

      /* ---------------- Reveal ---------------- */

    const revealObserver = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            entry.target.classList.add("in");

            revealObserver.unobserve(entry.target);

        });

    }, {

        threshold: .12,

        rootMargin: "0px 0px -40px 0px"

    });

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

    const spy = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            navItems.forEach(link => {

                link.classList.toggle(
                    "active",
                    link.getAttribute("href") === "#" + entry.target.id
                );

            });

        });

    }, {

        threshold: .4

    });

    sections.forEach(sec => spy.observe(sec));

    /* ---------------- Counters ---------------- */

    const counterObserver = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            const el = entry.target;

            const target = parseInt(el.dataset.count);

            const duration = 1600;

            const start = performance.now();

            function animate(time) {

                const p = Math.min((time - start) / duration, 1);

                const eased = 1 - Math.pow(1 - p, 3);

                el.textContent = Math.floor(target * eased).toLocaleString();

                if (p < 1)
                    requestAnimationFrame(animate);

                else
                    el.textContent = target.toLocaleString();

            }

            requestAnimationFrame(animate);

            counterObserver.unobserve(el);

        });

    }, {

        threshold: .5

    });

    $$("[data-count]").forEach(el => {

        counterObserver.observe(el);

    });

    /* ---------------- Lightbox ---------------- */

    const lightbox = $("#lightbox");

    const lightboxImage = $("#lbImg");

    function openLightbox(src) {

        lightboxImage.src = src;

        lightbox.classList.add("open");

    }

    function closeLightbox() {

        lightbox.classList.remove("open");

    }

    $$("[data-src]").forEach(item => {

        item.addEventListener("click", () => {

            openLightbox(item.dataset.src);

        });

    });

    $("#lbClose")?.addEventListener("click", closeLightbox);

    lightbox?.addEventListener("click", e => {

        if (e.target === lightbox)

            closeLightbox();

    });

    document.addEventListener("keydown", e => {

        if (e.key === "Escape")

            closeLightbox();

    });

    /* ---------------- Hero Parallax ---------------- */

    const heroVisual = $(".hero-visual");

    if (heroVisual) {

        window.addEventListener("mousemove", e => {

            const x =
                (e.clientX / innerWidth - .5) * 14;

            const y =
                (e.clientY / innerHeight - .5) * 14;

            heroVisual.style.transform =
                `translate(${x}px,${y}px)`;

        });

    }

/* ---------------- Apple Video Scroll Engine ---------------- */

gsap.registerPlugin(ScrollTrigger);

const intro = document.querySelector(".intro-animation");
const video = document.getElementById("introVideo");

if (intro && video) {

    video.pause();
    video.autoplay = false;
    video.loop = false;
    video.controls = false;
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    

    let target = 0;
    let current = 0;
    let raf = null;

    function render() {

        current += (target - current) * 0.12;

        if (Math.abs(current - target) < 0.001) {
            current = target;
        }

        if (video.duration) {

            const t = current * video.duration;

            if (Math.abs(video.currentTime - t) > 0.01) {
                video.currentTime = t;
            }

        }

        raf = requestAnimationFrame(render);
        

    }

    function init() {

        video.currentTime = 0;

        if (!raf) render();

        ScrollTrigger.create({

            trigger: intro,

            start: "top top",

            end: () => "+=" + window.innerHeight * 2,

            pin: true,

            pinSpacing: false,

            scrub: 0.08,

            invalidateOnRefresh: true,

            anticipatePin: 1,

            fastScrollEnd: true,

            onUpdate(self) {

                target = self.progress;

            }

        });

        ScrollTrigger.refresh();

    }

    if (video.readyState >= 2) {

        init();

    } else {

        video.addEventListener("loadedmetadata", init, {
            once: true
        });

    }

}



function render() {

    current += (target - current) * 0.28;

    if (Math.abs(current - target) < 0.0005) {

        current = target;

    }

    if (video.duration) {

        const time = current * video.duration;

        if (Math.abs(video.currentTime - time) > 0.02) {

            video.currentTime = time;

        }

    }

    raf = requestAnimationFrame(render);

}
    
ScrollTrigger.config({

    ignoreMobileResize: true,

    autoRefreshEvents: "DOMContentLoaded,load"

});


onLeaveBack() {

    target = 0;

    video.currentTime = 0;

}
    
/* ---------------- Button Ripple ---------------- */

$$(".btn").forEach(btn => {

    btn.style.position = "relative";
    btn.style.overflow = "hidden";

    btn.addEventListener("click", e => {

        const rect = btn.getBoundingClientRect();

        const ripple = document.createElement("span");

        ripple.style.cssText = `
            position:absolute;
            left:${e.clientX - rect.left}px;
            top:${e.clientY - rect.top}px;
            width:10px;
            height:10px;
            border-radius:50%;
            background:rgba(255,255,255,.45);
            transform:translate(-50%,-50%) scale(0);
            pointer-events:none;
            animation:ripple .7s ease-out forwards;
            z-index:2;
        `;

        btn.appendChild(ripple);

        ripple.addEventListener("animationend", () => {
            ripple.remove();
        });

    });

});

const rippleStyle = document.createElement("style");

rippleStyle.textContent = `
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

/* ---------------- Refresh ScrollTrigger ---------------- */

window.addEventListener("resize", () => {

    ScrollTrigger.refresh();

});

window.addEventListener("load", () => {

    ScrollTrigger.refresh();

});
