'use strict';

/* ── PRELOADER ──────────────────────────────────────────── */
document.body.style.overflow = 'hidden';

window.addEventListener('load', () => {
    const el = document.getElementById('preloader');
    setTimeout(() => {
        el?.classList.add('hidden');
        document.body.style.overflow = '';
        initPostLoad();
    }, 1800);
});

/* ── CUSTOM CURSOR ──────────────────────────────────────── */
const $dot  = document.getElementById('cursorDot');
const $ring = document.getElementById('cursorRing');

if ($dot && $ring && window.matchMedia('(hover: hover)').matches) {
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        $dot.style.left = mx + 'px';
        $dot.style.top  = my + 'px';
    });

    (function loop() {
        rx += (mx - rx) * 0.1;
        ry += (my - ry) * 0.1;
        $ring.style.left = rx + 'px';
        $ring.style.top  = ry + 'px';
        requestAnimationFrame(loop);
    })();

    const hoverEls = 'a, button, .bc, .proj-row, .art-row, .tl-row, .cert-card';
    document.querySelectorAll(hoverEls).forEach(el => {
        el.addEventListener('mouseenter', () => $ring.classList.add('hover-active'));
        el.addEventListener('mouseleave', () => $ring.classList.remove('hover-active'));
    });
}

/* ── SCROLL HANDLER ─────────────────────────────────────── */
const $nav      = document.getElementById('navbar');
const $progress = document.getElementById('scrollProgress');
const $btt      = document.getElementById('btt');
const $sections = document.querySelectorAll('section[id]');
const $navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    const y     = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;

    if ($progress) $progress.style.width = (total > 0 ? (y / total) * 100 : 0) + '%';
    if ($nav)  $nav.classList.toggle('scrolled', y > 50);
    if ($btt)  $btt.classList.toggle('visible',  y > 500);

    let current = '';
    $sections.forEach(s => { if (y >= s.offsetTop - 160) current = s.id; });
    $navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
}, { passive: true });

/* ── MOBILE MENU ────────────────────────────────────────── */
const $burger  = document.getElementById('hamburger');
const $menu    = document.getElementById('navMenu');
const $overlay = document.getElementById('navOverlay');

const openMenu  = () => { $burger?.classList.add('open'); $menu?.classList.add('open'); $overlay?.classList.add('open'); document.body.style.overflow = 'hidden'; };
const closeMenu = () => { $burger?.classList.remove('open'); $menu?.classList.remove('open'); $overlay?.classList.remove('open'); document.body.style.overflow = ''; };

$burger?.addEventListener('click', () => $burger.classList.contains('open') ? closeMenu() : openMenu());
$overlay?.addEventListener('click', closeMenu);
$navLinks.forEach(l => l.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

/* ── SMOOTH SCROLL ──────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

/* ── BACK TO TOP ────────────────────────────────────────── */
$btt?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── TYPEWRITER ─────────────────────────────────────────── */
function initTypewriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;

    const roles = [
        'Cloud Architecture',
        'Data Engineering',
        'AI/ML Solutions',
        'Generative AI',
        'DevOps Excellence',
        'Quantum Computing',
    ];

    let ri = 0, ci = 0, deleting = false, paused = false;

    const tick = () => {
        if (paused) { paused = false; setTimeout(tick, 1200); return; }
        const word = roles[ri];
        if (!deleting) {
            el.textContent = word.slice(0, ++ci);
            if (ci === word.length) { paused = true; deleting = true; }
            setTimeout(tick, paused ? 80 : 75);
        } else {
            el.textContent = word.slice(0, --ci);
            if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; setTimeout(tick, 380); return; }
            setTimeout(tick, 42);
        }
    };
    setTimeout(tick, 900);
}

/* ── SCROLL REVEAL ──────────────────────────────────────── */
function initReveal() {
    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (!entry.isIntersecting) return;
            setTimeout(() => entry.target.classList.add('visible'), i * 55);
            io.unobserve(entry.target);
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -48px 0px' });

    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

/* ── COUNTER ANIMATION ──────────────────────────────────── */
function initCounters() {
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el  = entry.target;
            const max = parseInt(el.dataset.target, 10);
            if (isNaN(max)) return;
            let n = 0;
            const step = max / (1400 / 16);
            const run  = () => {
                n = Math.min(n + step, max);
                el.textContent = Math.floor(n);
                if (n < max) requestAnimationFrame(run);
                else el.textContent = max;
            };
            run();
            io.unobserve(el);
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.counter').forEach(el => io.observe(el));
}

/* ── PROJ ROW HOVER INDENT ──────────────────────────────── */
function initProjHover() {
    document.querySelectorAll('.proj-row').forEach(row => {
        row.addEventListener('mouseenter', () => { row.style.paddingLeft = '10px'; });
        row.addEventListener('mouseleave', () => { row.style.paddingLeft = ''; });
    });
}

/* ── CONTACT FORM ───────────────────────────────────────── */
function initForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        const inputs = [...form.querySelectorAll('input, textarea')];
        if (!inputs.every(i => i.value.trim())) {
            inputs.forEach(i => {
                if (!i.value.trim()) {
                    i.style.borderBottomColor = '#ef4444';
                    setTimeout(() => { i.style.borderBottomColor = ''; }, 2000);
                }
            });
            return;
        }
        const btn  = form.querySelector('.submit-btn');
        const orig = btn.innerHTML;
        btn.innerHTML = '<span>Sending…</span><i class="fas fa-spinner fa-spin"></i>';
        btn.disabled  = true;
        setTimeout(() => {
            btn.innerHTML = '<span>Sent!</span><i class="fas fa-check"></i>';
            setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; form.reset(); }, 2500);
        }, 1600);
    });
}

/* ── INIT EVERYTHING AFTER PRELOADER ────────────────────── */
function initPostLoad() {
    initTypewriter();
    initReveal();
    initCounters();
    initProjHover();
    initForm();
}

/* ── IMMEDIATE: set navbar state on DOMContentLoaded ────── */
document.addEventListener('DOMContentLoaded', () => {
    if ($nav && window.scrollY > 50) $nav.classList.add('scrolled');
});
