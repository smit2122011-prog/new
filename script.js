/* ╔══════════════════════════════════════════════════════════════╗
   ║  NIRAV Institute – Interactive Scripts                       ║
   ║  Particles, Scroll Animations, Counters, FAQ, Navigation    ║
   ╚══════════════════════════════════════════════════════════════╝ */

(function () {
    'use strict';

    // ═══════════════════ PRELOADER ═══════════════════
    let preloaderDismissed = false;
    function hidePreloader() {
        if (preloaderDismissed) return;
        preloaderDismissed = true;
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('loaded');
            document.body.style.overflow = '';
            initParticles();
        }
    }

    if (document.readyState === 'complete') {
        setTimeout(hidePreloader, 800);
    } else {
        window.addEventListener('load', function () {
            setTimeout(hidePreloader, 1000);
        });
        // Safety fallback: maximum 2.5 seconds wait
        setTimeout(hidePreloader, 2500);
    }

    // ═══════════════════ NAVBAR ═══════════════════
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll behavior
    let lastScroll = 0;
    window.addEventListener('scroll', function () {
        const currentScroll = window.scrollY;

        if (currentScroll > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;

        // WhatsApp FAB visibility
        const whatsappFab = document.getElementById('whatsappFab');
        if (whatsappFab) {
            if (currentScroll > 400) {
                whatsappFab.classList.add('visible');
            } else {
                whatsappFab.classList.remove('visible');
            }
        }

        // Back to top visibility
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            if (currentScroll > 600) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }

        // Active nav link on scroll
        updateActiveNavLink();
    }, { passive: true });

    // Hamburger menu
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // Close menu on link click
    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            if (hamburger) hamburger.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // Active nav link based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 120;

        sections.forEach(function (section) {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Back to top
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ═══════════════════ SCROLL REVEAL ANIMATIONS ═══════════════════
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(function (el) {
        revealObserver.observe(el);
    });

    // ═══════════════════ COUNTER ANIMATION ═══════════════════
    const counters = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(function (counter) {
        counterObserver.observe(counter);
    });

    function animateCounter(el) {
        const target = parseFloat(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        const isDecimal = target % 1 !== 0;
        const duration = 2000;
        const startTime = performance.now();

        function easeOutExpo(t) {
            return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        }

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutExpo(progress);
            const current = easedProgress * target;

            if (isDecimal) {
                el.textContent = current.toFixed(1) + suffix;
            } else {
                el.textContent = Math.floor(current) + suffix;
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                if (isDecimal) {
                    el.textContent = target.toFixed(1) + suffix;
                } else {
                    el.textContent = target + suffix;
                }
            }
        }

        requestAnimationFrame(update);
    }

    // ═══════════════════ COURSE TABS ═══════════════════
    const courseTabs = document.querySelectorAll('.course-tab');
    const coursePanels = document.querySelectorAll('.course-panel');

    courseTabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            const targetTab = this.getAttribute('data-tab');

            // Update tabs
            courseTabs.forEach(function (t) { t.classList.remove('active'); });
            this.classList.add('active');

            // Update panels
            coursePanels.forEach(function (panel) {
                panel.classList.remove('active');
            });

            var targetPanel = document.getElementById('panel-' + targetTab);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // ═══════════════════ FAQ ACCORDION ═══════════════════
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
        var question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', function () {
                var isActive = item.classList.contains('active');

                // Close all
                faqItems.forEach(function (faq) {
                    faq.classList.remove('active');
                    var btn = faq.querySelector('.faq-question');
                    if (btn) btn.setAttribute('aria-expanded', 'false');
                });

                // Open clicked (if wasn't active)
                if (!isActive) {
                    item.classList.add('active');
                    this.setAttribute('aria-expanded', 'true');
                }
            });
        }
    });

    // ═══════════════════ ENQUIRY FORM (WHATSAPP 8511933922) ═══════════════════
    var enquiryForm = document.getElementById('enquiryForm');
    var formSuccess = document.getElementById('formSuccess');
    var enquiryPreview = document.getElementById('enquiryPreview');
    var whatsappDirectLink = document.getElementById('whatsappDirectLink');
    var btnSubmitAnother = document.getElementById('btnSubmitAnother');

    var TARGET_WHATSAPP_NUMBER = '918511933922'; // Target WhatsApp line

    if (enquiryForm) {
        enquiryForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var nameInput = document.getElementById('form-name');
            var phoneInput = document.getElementById('form-phone');
            var emailInput = document.getElementById('form-email');
            var classInput = document.getElementById('form-class');
            var messageInput = document.getElementById('form-message');

            var nameVal = nameInput ? nameInput.value.trim() : '';
            var phoneVal = phoneInput ? phoneInput.value.trim() : '';
            var emailVal = emailInput ? emailInput.value.trim() : '';
            var classVal = classInput && classInput.value ? classInput.value : '';
            var messageVal = messageInput ? messageInput.value.trim() : '';

            // Validation
            if (!nameVal || nameVal.length < 2) {
                shakeElement(nameInput.closest('.form-input-wrapper'));
                nameInput.focus();
                return;
            }

            var cleanPhone = phoneVal.replace(/\D/g, '');
            if (!cleanPhone || cleanPhone.length < 10) {
                shakeElement(phoneInput.closest('.form-input-wrapper'));
                phoneInput.focus();
                return;
            }

            if (!classVal) {
                shakeElement(classInput.closest('.form-input-wrapper'));
                classInput.focus();
                return;
            }

            // Button feedback
            var submitBtn = enquiryForm.querySelector('.btn-submit');
            var originalBtnHtml = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Connecting to WhatsApp...</span>';
            submitBtn.disabled = true;

            // Current timestamp
            var now = new Date();
            var timeString = now.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            // Formatted WhatsApp Message
            var waMessage = 
                '🎓 *NEW ADMISSION ENQUIRY - NIRAV INSTITUTE*\n' +
                '━━━━━━━━━━━━━━━━━━━━━━━━\n' +
                '👤 *Student / Parent Name:* ' + nameVal + '\n' +
                '📱 *Mobile Number:* ' + phoneVal + '\n' +
                '📧 *Email:* ' + (emailVal || 'Not provided') + '\n' +
                '📚 *Class / Target Course:* ' + classVal + '\n' +
                '💬 *Query / Message:* ' + (messageVal || 'Interested in admissions, batch timings & fee details.') + '\n' +
                '━━━━━━━━━━━━━━━━━━━━━━━━\n' +
                '📅 *Received:* ' + timeString + '\n' +
                '🌐 *Source:* NIRAV Institute Website';

            var encodedMsg = encodeURIComponent(waMessage);
            var whatsappUrl = 'https://api.whatsapp.com/send?phone=' + TARGET_WHATSAPP_NUMBER + '&text=' + encodedMsg;

            // Optional Backend lead logging (runs asynchronously, never blocks WhatsApp redirect)
            try {
                fetch('/api/enquire', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: nameVal,
                        phone: phoneVal,
                        email: emailVal,
                        classCourse: classVal,
                        message: messageVal,
                        submittedAt: now.toISOString(),
                        targetWhatsApp: TARGET_WHATSAPP_NUMBER
                    })
                }).catch(function () {
                    // Graceful fallback when running purely as client-side static file
                });
            } catch (err) {
                // Static file environment
            }

            // Launch WhatsApp and display success preview
            setTimeout(function () {
                // Try opening WhatsApp in a new tab/window
                var waWindow = window.open(whatsappUrl, '_blank');

                // Build preview HTML
                if (enquiryPreview) {
                    enquiryPreview.innerHTML =
                        '<div class="enquiry-preview-row">' +
                            '<span class="enquiry-preview-label">👤 Name</span>' +
                            '<span class="enquiry-preview-val">' + escapeHtml(nameVal) + '</span>' +
                        '</div>' +
                        '<div class="enquiry-preview-row">' +
                            '<span class="enquiry-preview-label">📱 Mobile</span>' +
                            '<span class="enquiry-preview-val">' + escapeHtml(phoneVal) + '</span>' +
                        '</div>' +
                        '<div class="enquiry-preview-row">' +
                            '<span class="enquiry-preview-label">📚 Course</span>' +
                            '<span class="enquiry-preview-val">' + escapeHtml(classVal) + '</span>' +
                        '</div>' +
                        (emailVal ? (
                            '<div class="enquiry-preview-row">' +
                                '<span class="enquiry-preview-label">📧 Email</span>' +
                                '<span class="enquiry-preview-val">' + escapeHtml(emailVal) + '</span>' +
                            '</div>'
                        ) : '') +
                        '<div class="enquiry-preview-row">' +
                            '<span class="enquiry-preview-label">📲 Routed to</span>' +
                            '<span class="enquiry-preview-val text-gold">+91 85119 33922</span>' +
                        '</div>';
                }

                if (whatsappDirectLink) {
                    whatsappDirectLink.href = whatsappUrl;
                }

                // Show confirmation card
                enquiryForm.style.display = 'none';
                if (formSuccess) {
                    formSuccess.removeAttribute('hidden');
                    formSuccess.style.display = 'block';
                }
            }, 800);
        });
    }

    if (btnSubmitAnother) {
        btnSubmitAnother.addEventListener('click', function () {
            if (enquiryForm) {
                enquiryForm.reset();
                enquiryForm.style.display = 'block';
                var submitBtn = enquiryForm.querySelector('.btn-submit');
                if (submitBtn) {
                    submitBtn.innerHTML = '<i class="fab fa-whatsapp"></i> <span>Send Enquiry via WhatsApp</span>';
                    submitBtn.disabled = false;
                }
            }
            if (formSuccess) {
                formSuccess.setAttribute('hidden', '');
                formSuccess.style.display = 'none';
            }
        });
    }

    function escapeHtml(str) {
        if (!str) return '';
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function shakeElement(el) {
        el.style.animation = 'none';
        el.offsetHeight; // Trigger reflow
        el.style.animation = 'shake 0.5s ease';
        el.style.borderColor = '#ef4444';

        setTimeout(function () {
            el.style.borderColor = '';
            el.style.animation = '';
        }, 1500);
    }

    // Add shake animation CSS dynamically
    var shakeStyle = document.createElement('style');
    shakeStyle.textContent = '@keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }';
    document.head.appendChild(shakeStyle);

    // ═══════════════════ PARTICLE CANVAS ═══════════════════
    function initParticles() {
        var canvas = document.getElementById('particleCanvas');
        if (!canvas) return;

        var ctx = canvas.getContext('2d');
        var particles = [];
        var particleCount = 50;
        var animationId;

        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        function resizeCanvas() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        function Particle() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.isGold = Math.random() > 0.7;
        }

        Particle.prototype.update = function () {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        };

        Particle.prototype.draw = function () {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            if (this.isGold) {
                ctx.fillStyle = 'rgba(255, 184, 0, ' + this.opacity + ')';
            } else {
                ctx.fillStyle = 'rgba(255, 255, 255, ' + this.opacity + ')';
            }
            ctx.fill();
        };

        // Create particles
        for (var i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function drawConnections() {
            for (var i = 0; i < particles.length; i++) {
                for (var j = i + 1; j < particles.length; j++) {
                    var dx = particles[i].x - particles[j].x;
                    var dy = particles[i].y - particles[j].y;
                    var distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        var opacity = (1 - distance / 120) * 0.1;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = 'rgba(255, 184, 0, ' + opacity + ')';
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(function (p) {
                p.update();
                p.draw();
            });

            drawConnections();
            animationId = requestAnimationFrame(animate);
        }

        animate();

        // Pause when not visible
        var heroObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    if (!animationId) animate();
                } else {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            });
        }, { threshold: 0 });

        heroObserver.observe(canvas);
    }

    // ═══════════════════ SMOOTH SCROLL FOR CTA LINKS ═══════════════════
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

})();
