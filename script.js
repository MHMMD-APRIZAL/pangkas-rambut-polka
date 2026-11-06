document.addEventListener('DOMContentLoaded', () => {

    // ================================================
    // 1. MOBILE MENU
    // ================================================
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // Close mobile menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    // ================================================
    // 2. STICKY NAVBAR SCROLL EFFECT
    // ================================================
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    // ================================================
    // 3. SCROLL REVEAL (Intersection Observer)
    // ================================================
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ================================================
    // 4. ANIMATED STAT COUNTERS
    // ================================================
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'));
                animateCounter(el, target);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    // ================================================
    // 5. REVIEW MARQUEE — Clone cards for seamless loop
    // ================================================
    const marqueeTrack = document.querySelector('.marquee-track');
    if (marqueeTrack) {
        const cards = marqueeTrack.querySelectorAll('.review-card');
        // Clone each card and append to create a seamless infinite loop
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            marqueeTrack.appendChild(clone);
        });
    }

    function animateCounter(el, target) {
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);

            el.textContent = current.toLocaleString('id-ID');

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // ================================================
    // 5. DRAGGABLE FLOATING BUBBLES
    //    Full mouse + touch support, no external libs
    // ================================================
    const bubbles = document.querySelectorAll('.draggable');

    bubbles.forEach(bubble => {
        let isDragging = false;
        let startX, startY;
        let initialLeft, initialTop;

        // Ensure bubbles are positioned absolutely relative to the hero
        // Convert any right/bottom CSS to left/top for consistent dragging
        ensureLeftTopPosition(bubble);

        // --- MOUSE EVENTS ---
        bubble.addEventListener('mousedown', onPointerDown);
        document.addEventListener('mousemove', onPointerMove);
        document.addEventListener('mouseup', onPointerUp);

        // --- TOUCH EVENTS ---
        bubble.addEventListener('touchstart', onPointerDown, { passive: false });
        document.addEventListener('touchmove', onPointerMove, { passive: false });
        document.addEventListener('touchend', onPointerUp);

        function onPointerDown(e) {
            e.preventDefault();
            isDragging = true;
            bubble.classList.add('dragging');

            const pos = getPointerPosition(e);
            const rect = bubble.getBoundingClientRect();

            // Offset from pointer to bubble's top-left corner
            startX = pos.x - rect.left;
            startY = pos.y - rect.top;

            // Store initial position for constraint calculations
            initialLeft = rect.left;
            initialTop = rect.top;
        }

        function onPointerMove(e) {
            if (!isDragging) return;
            e.preventDefault();

            const pos = getPointerPosition(e);
            const parent = bubble.parentElement;
            const parentRect = parent.getBoundingClientRect();

            // Calculate new position relative to parent
            let newLeft = pos.x - parentRect.left - startX;
            let newTop = pos.y - parentRect.top - startY;

            // Constrain within parent boundaries
            const bubbleW = bubble.offsetWidth;
            const bubbleH = bubble.offsetHeight;

            newLeft = Math.max(-bubbleW * 0.3, Math.min(newLeft, parentRect.width - bubbleW * 0.7));
            newTop = Math.max(-bubbleH * 0.3, Math.min(newTop, parentRect.height - bubbleH * 0.7));

            // Apply position directly (bypassing CSS animation transform)
            bubble.style.left = newLeft + 'px';
            bubble.style.top = newTop + 'px';
            bubble.style.right = 'auto';
            bubble.style.bottom = 'auto';
        }

        function onPointerUp() {
            if (!isDragging) return;
            isDragging = false;
            bubble.classList.remove('dragging');
        }

        function getPointerPosition(e) {
            if (e.touches && e.touches.length > 0) {
                return { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
            return { x: e.clientX, y: e.clientY };
        }
    });

    /**
     * Convert any `right` or `bottom` CSS positioning to `left` and `top`
     * so drag logic has a consistent coordinate system.
     */
    function ensureLeftTopPosition(el) {
        const style = window.getComputedStyle(el);
        const parent = el.parentElement;
        const parentRect = parent.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();

        // If 'right' is set but 'left' is auto, convert
        if (style.right !== 'auto' && style.left === 'auto') {
            el.style.left = (elRect.left - parentRect.left) + 'px';
            el.style.right = 'auto';
        }
        // If 'bottom' is set but 'top' is auto, convert
        if (style.bottom !== 'auto' && style.top === 'auto') {
            el.style.top = (elRect.top - parentRect.top) + 'px';
            el.style.bottom = 'auto';
        }
    }

});
