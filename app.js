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
