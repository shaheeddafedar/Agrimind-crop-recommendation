document.addEventListener('DOMContentLoaded', () => {
    const loginModalOverlay = document.getElementById('login-modal-overlay');
    const loginBtn = document.getElementById('login-btn');
    const heroCtaBtn = document.getElementById('hero-cta-btn');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const closeModalBtn = document.querySelector('.close-btn');
    const userNavProfile = document.querySelector('.user-nav-profile');
    const userDropdownMenu = document.querySelector('.user-dropdown-menu');

    const showLoginModal = () => {
        if (loginModalOverlay) {
            loginModalOverlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    };
    window.showLoginModal = showLoginModal;

    const hideLoginModal = () => {
        if (loginModalOverlay) {
            loginModalOverlay.classList.add('hidden');
            document.body.style.overflow = '';
        }
    };

    loginBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        showLoginModal();
    });

    heroCtaBtn?.addEventListener('click', (e) => {
        const isLoggedIn = !document.getElementById('login-btn');
        if (!isLoggedIn) {
            e.preventDefault();
            showLoginModal();
        }
    });

    mobileMenuToggle?.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuToggle.querySelector('i');
        if (icon.classList.contains('fa-bars')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileMenuToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    closeModalBtn?.addEventListener('click', hideLoginModal);

    loginModalOverlay?.addEventListener('click', (e) => {
        if (e.target === loginModalOverlay) hideLoginModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && loginModalOverlay && !loginModalOverlay.classList.contains('hidden')) {
            hideLoginModal();
        }
    });

    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature-card, .testimonial-card, .stat-item');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(el);
        });
    };
    animateOnScroll();

    const setupPasswordToggle = (toggleId, inputId) => {
        const toggleBtn = document.getElementById(toggleId);
        const passwordInput = document.getElementById(inputId);

        if (toggleBtn && passwordInput) {
            toggleBtn.addEventListener('click', function (e) {
                e.preventDefault(); 
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                this.classList.toggle('fa-eye');
                this.classList.toggle('fa-eye-slash');
            });
        }
    };

    setupPasswordToggle('toggleSignupPassword', 'password');
    setupPasswordToggle('toggleLoginPassword', 'modal-password');

    // --- ADDED: CLICK-BASED USER DROPDOWN LOGIC ---
    if (userNavProfile && userDropdownMenu) {
        userNavProfile.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevents click from reaching the window
            userDropdownMenu.classList.toggle('show');
        });

        // Close the menu if user clicks anywhere else
        window.addEventListener('click', () => {
            if (userDropdownMenu.classList.contains('show')) {
                userDropdownMenu.classList.remove('show');
            }
        });
    }

    // Function to fetch and display market prices
    async function loadLiveMarketPrices() {
        const container = document.getElementById('market-prices-container');
        
        // If the container doesn't exist on this page, stop running
        if (!container) return;

        try {
            // Call the API endpoint we created in Step 3
            const response = await fetch('/api/market-prices');
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const prices = await response.json();
            
            // If the database is empty, show a message
            if (prices.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: #666;">No live data available for Belagavi currently. Waiting for daily update.</p>';
                return;
            }

            // Clear the "Loading..." text
            container.innerHTML = ''; 
            
            // Loop through each price and create a row for it
            prices.forEach(item => {
                const priceRow = document.createElement('div');
                priceRow.style.cssText = 'display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0;';
                
                // Capitalize the crop name nicely
                const cropName = item.commodity.charAt(0).toUpperCase() + item.commodity.slice(1);
                
                priceRow.innerHTML = `
                    <strong style="color: #333; font-size: 14px;">${cropName}</strong>
                    <span style="color: #2E8B57; font-weight: bold; font-size: 14px;">₹${item.modalPrice} / qtl</span>
                `;
                
                container.appendChild(priceRow);
            });

        } catch (error) {
            console.error('Error loading market prices:', error);
            container.innerHTML = '<p style="color: red; text-align: center;">Could not load market data right now.</p>';
        }
    }

    // Run the function as soon as the page loads
    document.addEventListener('DOMContentLoaded', () => {
        loadLiveMarketPrices();
    });
});