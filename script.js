/* ============================================================
   SLIMTIDE — script.js
   ============================================================ */

'use strict';

/* ========== HELPERS ========== */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ========== PARTICLES ========== */
function initParticles() {
    const wrap = $('#particles');
    if (!wrap) return;
    const colors = ['#10b981', '#0ea5e9', '#6366f1', '#f59e0b', '#a78bfa'];
    for (let i = 0; i < 28; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 10 + 4;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const dur = Math.random() * 14 + 8;
        const delay = Math.random() * 10;
        p.style.cssText = `
      width:${size}px; height:${size}px; background:${color};
      left:${left}%; bottom:0;
      animation-duration:${dur}s; animation-delay:${delay}s;
    `;
        wrap.appendChild(p);
    }
}

/* ========== NAVBAR ========== */
function initNavbar() {
    const navbar = $('#navbar');
    const hamburger = $('#hamburger');
    const navLinks = $('#navLinks');

    // Create mobile menu
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'nav-mobile';
    mobileMenu.id = 'mobileMenu';
    mobileMenu.setAttribute('aria-label', 'Mobile navigation');
    mobileMenu.innerHTML = `
    <a href="#how-it-works" class="nav-link">How It Works?</a>
    <a href="#ingredients" class="nav-link">Ingredients</a>
    <a href="#benefits" class="nav-link">Benefits</a>
    <a href="/Order" class="btn-nav">🛒 Order Now</a>
  `;
    navbar.parentNode.insertBefore(mobileMenu, navbar.nextSibling);

    // Scroll handler
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        navbar.classList.toggle('scrolled', y > 20);
        lastScroll = y;
    }, {
        passive: true
    });

    // Hamburger toggle
    hamburger && hamburger.addEventListener('click', () => {
        const open = mobileMenu.classList.toggle('open');
        hamburger.classList.toggle('open', open);
        hamburger.setAttribute('aria-expanded', open);
    });

    // Close on mobile link click
    $$('.nav-link', mobileMenu).forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // Smooth scroll for all anchor links
    document.addEventListener('click', e => {
        const a = e.target.closest('a[href^="#"]');
        if (!a) return;
        const target = $(a.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - 70;
            window.scrollTo({
                top,
                behavior: 'smooth'
            });
        }
    });
}

/* ========== COUNTDOWN TIMER ========== */
function initCountdown() {
    function startTimer(minEl, secEl) {
        let total = 10 * 60; // 10 minutes
        function tick() {
            const m = Math.floor(total / 60);
            const s = total % 60;
            if (minEl) minEl.textContent = String(m).padStart(2, '0');
            if (secEl) secEl.textContent = String(s).padStart(2, '0');
            if (total <= 0) {
                total = 10 * 60;
            } else {
                total--;
            }
        }
        tick();
        return setInterval(tick, 1000);
    }

    // Timer 1
    startTimer($('#t1-min'), $('#t1-sec'));
    // Timer 2 (offset by 30s for variety)
    setTimeout(() => {
        startTimer($('#t2-min'), $('#t2-sec'));
    }, 0);
}

/* ========== ACCORDION (How It Works & FAQ) ========== */
function initAccordions() {
    // How It Works accordions
    $$('.accordion-header').forEach(btn => {
        btn.addEventListener('click', () => {
            const isOpen = btn.getAttribute('aria-expanded') === 'true';
            const item = btn.closest('.accordion-item');
            const body = item.querySelector('.accordion-body');

            // Close siblings
            const parent = item.parentElement;
            $$('.accordion-header', parent).forEach(b => {
                b.setAttribute('aria-expanded', 'false');
                b.closest('.accordion-item').querySelector('.accordion-body').classList.remove('open');
            });

            if (!isOpen) {
                btn.setAttribute('aria-expanded', 'true');
                body.classList.add('open');
            }
        });
    });

    // FAQ accordions
    $$('.faq-header').forEach(btn => {
        btn.addEventListener('click', () => {
            const isOpen = btn.getAttribute('aria-expanded') === 'true';
            const item = btn.closest('.faq-item');
            const body = item.querySelector('.faq-body');

            $$('.faq-header').forEach(b => {
                b.setAttribute('aria-expanded', 'false');
                b.closest('.faq-item').querySelector('.faq-body').classList.remove('open');
            });

            if (!isOpen) {
                btn.setAttribute('aria-expanded', 'true');
                body.classList.add('open');
            }
        });
    });
}

/* ========== INTERSECTION OBSERVER (Scroll Animations) ========== */
function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) {
        $$('.fade-up, .fade-in-left, .fade-in-right').forEach(el => el.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    $$('.fade-up, .fade-in-left, .fade-in-right').forEach(el => observer.observe(el));
}

/* ========== SCROLL TO TOP ========== */
function initScrollTop() {
    const btn = $('#scrollTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 300);
    }, {
        passive: true
    });
    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ========== PURCHASE NOTIFICATION POPUP ========== */
function initPurchaseNotif() {
    const notif = $('#purchaseNotif');
    if (!notif) return;

    const names = ['Sarah M.', 'Mike T.', 'Jennifer L.', 'Robert K.', 'Amanda S.', 'David C.', 'Lisa P.', 'James W.', 'Emily R.', 'Carlos M.', 'Patricia B.', 'Kevin H.', 'Rachel N.', 'Brian O.', 'Monica D.'];
    const cities = ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ', 'Dallas, TX', 'Austin, TX', 'Miami, FL', 'Seattle, WA', 'Denver, CO', 'Atlanta, GA', 'Boston, MA', 'Portland, OR', 'Nashville, TN', 'Las Vegas, NV'];

    function showNotif() {
        const name = names[Math.floor(Math.random() * names.length)];
        const city = cities[Math.floor(Math.random() * cities.length)];
        $('#notifName').textContent = name;
        $('#notifCity').textContent = city;
        notif.classList.add('show');
        setTimeout(() => notif.classList.remove('show'), 5000);
    }

    // First show after 8 seconds, then every 30s
    setTimeout(showNotif, 8000);
    setInterval(showNotif, 30000);
}

/* ========== EXIT INTENT / SCROLL POPUP ========== */
function initExitPopup() {
    const popup = $('#exitPopup');
    if (!popup) return;

    let shown = false;

    function showPopup() {
        if (shown) return;
        shown = true;
        popup.style.display = 'flex';
        setTimeout(() => popup.classList.add('active'), 10);
    }

    // 1. Scroll 55% trigger
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (scrollPercent >= 55) showPopup();
    }, {
        passive: true
    });

    // 2. 20-second delay trigger
    setTimeout(showPopup, 20000);

    // 3. Exit intent (desktop)
    document.addEventListener('mouseleave', (e) => {
        if (e.clientY <= 0) showPopup();
    });

    // Close on overlay click
    popup.addEventListener('click', (e) => {
        if (e.target === popup) popup.style.display = 'none';
    });
}

/* ========== TOUCH FEEDBACK ========== */
function initTouchFeedback() {
    $$('.btn-primary, .btn-nav').forEach(btn => {
        btn.addEventListener('touchstart', () => btn.style.transform = 'scale(0.98)', {
            passive: true
        });
        btn.addEventListener('touchend', () => {
            setTimeout(() => btn.style.transform = '', 150);
        }, {
            passive: true
        });
    });
}

/* ========== LAZY LOAD IMAGES ========== */
function initLazyLoad() {
    if ('loading' in HTMLImageElement.prototype) return; // native support
    const imgs = $$('img[loading="lazy"]');
    const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) img.src = img.dataset.src;
                imgObserver.unobserve(img);
            }
        });
    });
    imgs.forEach(img => imgObserver.observe(img));
}

/* ========== IMAGE FALLBACK ========== */
function initImageFallback() {
    $$('img').forEach(img => {
        img.addEventListener('error', () => {
            // Set a colored placeholder with the alt text
            const canvas = document.createElement('canvas');
            canvas.width = 300;
            canvas.height = 300;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ecfdf5';
            ctx.fillRect(0, 0, 300, 300);
            ctx.fillStyle = '#10b981';
            ctx.font = 'bold 14px Montserrat, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(img.alt || 'Image', 150, 155);
            img.src = canvas.toDataURL();
            img.style.padding = '10px';
            img.style.border = '2px dashed #10b981';
            img.style.borderRadius = '8px';
        });
    });
}

/* ========== INIT ALL ========== */
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initNavbar();
    initCountdown();
    initAccordions();
    initScrollAnimations();
    initScrollTop();
    initPurchaseNotif();
    initExitPopup();
    initTouchFeedback();
    initLazyLoad();
    initImageFallback();
});