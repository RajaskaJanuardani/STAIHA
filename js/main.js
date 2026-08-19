/* ============================================================
   STTNU - Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ========================================================
       1. NAVBAR — scrolled state & active link
       ======================================================== */
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    const updateNavbar = () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    const updateActiveLink = () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', () => {
        updateNavbar();
        updateActiveLink();
    });
    updateNavbar();

    /* ========================================================
       2. HAMBURGER MENU
       ======================================================== */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('open');
        document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close on nav link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('open');
            document.body.style.overflow = '';
        }
    });

    /* ========================================================
       3. SMOOTH SCROLL
       ======================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    /* ========================================================
       4. SCROLL ANIMATIONS (Intersection Observer)
       ======================================================== */
    const animateElements = document.querySelectorAll(
        '.animate-fade-up, .animate-left, .animate-right, .animate-up'
    );

    const observerOptions = {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Respect animation-delay if set inline
                const delay = parseFloat(entry.target.style.animationDelay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay * 1000);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => observer.observe(el));

    /* ========================================================
       5. COUNTER ANIMATION (Hero Stats)
       ======================================================== */
    const counters = document.querySelectorAll('.stat-number[data-target]');
    let countersStarted = false;

    const startCounters = () => {
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const update = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current).toLocaleString('id-ID');
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target.toLocaleString('id-ID');
                }
            };
            update();
        });
        countersStarted = true;
    };

    const heroSection = document.getElementById('home');
    const counterObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !countersStarted) {
            setTimeout(startCounters, 800);
        }
    }, { threshold: 0.4 });

    if (heroSection) counterObserver.observe(heroSection);

    /* ========================================================
       6. TABS — About Section
       ======================================================== */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;

            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetContent = document.getElementById(`tab-${target}`);
            if (targetContent) targetContent.classList.add('active');
        });
    });

    /* ========================================================
       7. TESTIMONIAL SLIDER
       ======================================================== */
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentSlide = 0;
    let autoSlideInterval;

    const showSlide = (index) => {
        testimonialCards.forEach(c => c.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));

        currentSlide = (index + testimonialCards.length) % testimonialCards.length;
        testimonialCards[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    };

    const startAutoSlide = () => {
        autoSlideInterval = setInterval(() => showSlide(currentSlide + 1), 5000);
    };

    const resetAutoSlide = () => {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    };

    if (prevBtn) {
        prevBtn.addEventListener('click', () => { showSlide(currentSlide - 1); resetAutoSlide(); });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => { showSlide(currentSlide + 1); resetAutoSlide(); });
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            showSlide(parseInt(dot.dataset.index));
            resetAutoSlide();
        });
    });

    showSlide(0);
    startAutoSlide();

    // Touch swipe for testimonials
    const sliderEl = document.getElementById('testimonialSlider');
    if (sliderEl) {
        let touchStartX = 0;
        sliderEl.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
        sliderEl.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                showSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
                resetAutoSlide();
            }
        });
    }

    /* ========================================================
       8. BACK TO TOP
       ======================================================== */
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ========================================================
       9. CONTACT FORM VALIDATION
       ======================================================== */
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    const validators = {
        name: {
            el: document.getElementById('name'),
            errEl: document.getElementById('nameError'),
            validate: (v) => v.trim().length >= 3 ? '' : 'Nama minimal 3 karakter.'
        },
        phone: {
            el: document.getElementById('phone'),
            errEl: document.getElementById('phoneError'),
            validate: (v) => /^[\d\s\-\+]{10,15}$/.test(v.trim()) ? '' : 'Masukkan nomor telepon yang valid.'
        },
        email: {
            el: document.getElementById('email'),
            errEl: document.getElementById('emailError'),
            validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Masukkan alamat email yang valid.'
        },
        message: {
            el: document.getElementById('message'),
            errEl: document.getElementById('messageError'),
            validate: (v) => v.trim().length >= 10 ? '' : 'Pesan minimal 10 karakter.'
        }
    };

    const validateField = (key) => {
        const { el, errEl, validate } = validators[key];
        if (!el) return true;
        const error = validate(el.value);
        errEl.textContent = error;
        if (error) {
            el.classList.add('error');
            return false;
        } else {
            el.classList.remove('error');
            return true;
        }
    };

    // Real-time validation on blur
    Object.keys(validators).forEach(key => {
        const { el } = validators[key];
        if (el) {
            el.addEventListener('blur', () => validateField(key));
            el.addEventListener('input', () => {
                if (el.classList.contains('error')) validateField(key);
            });
        }
    });

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;
            Object.keys(validators).forEach(key => {
                if (!validateField(key)) isValid = false;
            });

            if (isValid) {
                // Simulate form submission
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Mengirim...';

                setTimeout(() => {
                    contactForm.style.display = 'none';
                    formSuccess.style.display = 'block';
                }, 1800);
            }
        });
    }

    /* ========================================================
       10. PARTICLES (Decorative floating elements on hero)
       ======================================================== */
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        const particleCount = 18;
        for (let i = 0; i < particleCount; i++) {
            const p = document.createElement('div');
            const size = Math.random() * 6 + 3;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const delay = Math.random() * 6;
            const duration = Math.random() * 8 + 6;
            const opacity = Math.random() * 0.25 + 0.05;

            p.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: rgba(255, 215, 0, ${opacity});
                border-radius: 50%;
                left: ${x}%;
                top: ${y}%;
                animation: floatParticle ${duration}s ease-in-out ${delay}s infinite alternate;
                pointer-events: none;
            `;
            particlesContainer.appendChild(p);
        }

        // Inject keyframe dynamically
        if (!document.getElementById('particleStyle')) {
            const style = document.createElement('style');
            style.id = 'particleStyle';
            style.textContent = `
                @keyframes floatParticle {
                    from { transform: translate(0, 0) scale(1); opacity: 0.1; }
                    to   { transform: translate(${Math.random() > 0.5 ? '' : '-'}${Math.floor(Math.random() * 40 + 10)}px, -${Math.floor(Math.random() * 40 + 10)}px) scale(1.5); opacity: 0.4; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /* ========================================================
       11. FACILITY CARDS — always show overlay on mobile
       ======================================================== */
    const handleFacilityCards = () => {
        const cards = document.querySelectorAll('.facility-overlay');
        if (window.innerWidth <= 768) {
            cards.forEach(overlay => overlay.style.opacity = '1');
        } else {
            cards.forEach(overlay => overlay.style.opacity = '');
        }
    };

    handleFacilityCards();
    window.addEventListener('resize', handleFacilityCards);

    /* ========================================================
       12. NEWS SMALL CARDS — click handler (placeholder)
       ======================================================== */
    document.querySelectorAll('.news-small').forEach(card => {
        card.addEventListener('click', () => {
            // Placeholder: in a real app this would navigate to the article
            console.log('Navigate to news article');
        });
        card.style.cursor = 'pointer';
    });

});
