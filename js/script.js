document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. Current Year in Footer
    // ==========================================
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // ==========================================
    // 2. Navbar Scroll Effect
    // ==========================================
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ==========================================
    // 3. Mobile Menu Toggle
    // ==========================================
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when clicking a link
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileToggle.querySelector('i').classList.remove('fa-times');
                mobileToggle.querySelector('i').classList.add('fa-bars');
            }
        });
    });

    // ==========================================
    // 4. Dark/Light Mode Theme Toggle
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggleBtn.querySelector('i');

    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Default is light mode, but respect user choice if available
    let currentTheme = savedTheme || 'light';

    // Apply initial theme
    htmlElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggleBtn.addEventListener('click', () => {
        currentTheme = htmlElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', currentTheme);
        localStorage.setItem('theme', currentTheme);
        updateThemeIcon(currentTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun'); // Show sun to toggle to light
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon'); // Show moon to toggle to dark
        }
    }

    // ==========================================
    // 5. Fade-in Animation on Scroll
    // ==========================================
    const fadeElements = document.querySelectorAll('.fade-in');

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing after it becomes visible
                // fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    fadeElements.forEach(el => fadeObserver.observe(el));

    // ==========================================
    // 6. Number Counter Animation for Impact Section
    // ==========================================
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    let hasCounted = false;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasCounted) {
                statNumbers.forEach(stat => {
                    const target = +stat.getAttribute('data-target');
                    const duration = 2000; // ms
                    const increment = target / (duration / 16); // 60fps
                    let current = 0;

                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            stat.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            stat.innerText = target;
                        }
                    };
                    updateCounter();
                });
                hasCounted = true;
                counterObserver.disconnect();
            }
        });
    }, { threshold: 0.5 });

    const impactSection = document.getElementById('impact');
    if (impactSection) {
        counterObserver.observe(impactSection);
    }

    // ==========================================
    // 7. Copy to Clipboard for IBANs
    // ==========================================
    const copyElements = document.querySelectorAll('.copy-value');

    copyElements.forEach(el => {
        const copyBtn = el.querySelector('i.fa-copy');
        if (copyBtn) {
            copyBtn.addEventListener('click', async () => {
                // Extract text and remove the icon part
                const textToCopy = el.textContent.trim();

                try {
                    await navigator.clipboard.writeText(textToCopy);

                    // Visual feedback
                    copyBtn.classList.remove('far', 'fa-copy');
                    copyBtn.classList.add('fas', 'fa-check');
                    copyBtn.style.color = '#10B981'; // Green color for success

                    setTimeout(() => {
                        copyBtn.classList.remove('fas', 'fa-check');
                        copyBtn.classList.add('far', 'fa-copy');
                        copyBtn.style.color = '';
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy text: ', err);
                }
            });
        }
    });

    // ==========================================
    // 8. Language Toggle
    // ==========================================
    const langToggleBtn = document.getElementById('lang-toggle');

    // Check for saved language
    const savedLang = localStorage.getItem('language') || 'en';
    htmlElement.setAttribute('lang', savedLang);
    htmlElement.setAttribute('dir', savedLang === 'ar' ? 'rtl' : 'ltr');
    updateLangBtnText(savedLang);

    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            const currentLang = htmlElement.getAttribute('lang');
            const newLang = currentLang === 'en' ? 'ar' : 'en';

            htmlElement.setAttribute('lang', newLang);
            htmlElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr');
            localStorage.setItem('language', newLang);
            updateLangBtnText(newLang);
        });
    }

    function updateLangBtnText(lang) {
        if (langToggleBtn) {
            // When in English, button says 'عربي'. When in Arabic, button says 'English'.
            langToggleBtn.textContent = lang === 'en' ? 'عربي' : 'English';
        }
    }

    // ==========================================
    // 9. Contact Form Submission
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            const lang = document.documentElement.lang;

            // Show loading state
            submitBtn.innerHTML = lang === 'ar' ? '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...' : '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            const formData = new FormData(this);

            fetch("https://formsubmit.co/ajax/takehelpme@gmail.com", {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => {
                    alert(lang === 'ar' ? 'شكرا لك! تم إرسال رسالتك بنجاح وسنتواصل معك قريبا.' : 'Thank you! Your message has been sent successfully.');
                    this.reset();
                })
                .catch(error => {
                    console.error(error);
                    alert(lang === 'ar' ? 'عذراً، حدث خطأ أثناء الإرسال. يرجى المحاولة لاحقاً.' : 'Sorry, an error occurred. Please try again later.');
                })
                .finally(() => {
                    // Restore button state
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    }
});
