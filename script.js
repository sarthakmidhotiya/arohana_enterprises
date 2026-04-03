document.addEventListener('DOMContentLoaded', () => {
    // 1. Lenis Smooth Scroll Setup
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth ease-out
        direction: 'vertical', // vertical, horizontal
        gestureDirection: 'vertical', // vertical, horizontal, both
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. Preloader
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                lenis.resize(); // Recalculate dimensions for Lenis
            }, 800);
        }, 400); // Quick fade out after load
    });

    // 3. Scroll Progress Indicator
    const scrollProgress = document.querySelector('.scroll-progress');
    lenis.on('scroll', ({ scroll, limit }) => {
        const progress = (scroll / limit) * 100;
        scrollProgress.style.width = `${progress}%`;
    });

    // 4. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li a');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.innerHTML = navLinks.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if(hamburger) hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });

    // 5. Sticky Header & Active Nav Link 
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section');

    lenis.on('scroll', ({ scroll }) => {
        // Sticky Header effect
        if (scroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active state based on scroll
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scroll >= (sectionTop - 300)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    // 6. Intersection Observer for Blur/Reveal Animations
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealOnScroll.observe(el));

    // 7. Parallax for Images on scroll
    const parallaxImgs = document.querySelectorAll('.parallax-img');
    lenis.on('scroll', ({ scroll }) => {
        parallaxImgs.forEach(img => {
            const speed = 0.15;
            const yPos = -(scroll * speed);
            // Limit the parallax bounds if needed, but smooth scrolling usually handles this gracefully
            img.style.transform = `translateY(${yPos}px)`;
        });
    });

    // 8. Ripple Effect for Buttons
    document.querySelectorAll('.ripple-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            let x = e.clientX - e.target.getBoundingClientRect().left;
            let y = e.clientY - e.target.getBoundingClientRect().top;
            
            let ripples = document.createElement('span');
            ripples.classList.add('ripple');
            ripples.style.left = x + 'px';
            ripples.style.top = y + 'px';
            
            this.appendChild(ripples);
            
            setTimeout(() => {
                ripples.remove();
            }, 800); // matches CSS animation duration
        });
    });

    // 9. Smooth Anchor Scrolling interception for Lenis
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    lenis.scrollTo(targetElement, { offset: -80 }); // adjust for sticky header height
                }
            }
        });
    });

    // 10. Form Submission Simulation (Floating labels handled in CSS)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.style.pointerEvents = 'none';
            
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitBtn.style.background = '#28a745'; // Success green
                submitBtn.style.backgroundSize = '100%';
                
                contactForm.reset();
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.pointerEvents = 'auto';
                    submitBtn.style.background = ''; // Restore original gradient
                }, 3000);
            }, 1500);
        });
    }
});
