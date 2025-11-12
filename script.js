// VetOne.AI Landing Page JavaScript

// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        });
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // Account for fixed navbar
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Form validation and submission
const waitlistForm = document.getElementById('waitlistForm');
const contactForm = document.getElementById('contactForm');
const modal = document.getElementById('successModal');
const modalMessage = document.getElementById('modalMessage');
const closeModal = document.querySelector('.close');

// Phone number formatting (Brazilian format)
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }

    input.value = value;
}

// Add phone formatting to all phone inputs
const phoneInputs = document.querySelectorAll('input[type="tel"]');
phoneInputs.forEach(input => {
    input.addEventListener('input', function() {
        formatPhoneNumber(this);
    });
});

// CRMV formatting
const crmvInput = document.getElementById('waitlist-crmv');
if (crmvInput) {
    crmvInput.addEventListener('input', function() {
        let value = this.value.toUpperCase();
        // Allow letters followed by space and numbers
        value = value.replace(/[^A-Z0-9\s]/g, '');
        this.value = value;
    });
}

// Email validation
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Show success modal
function showSuccessModal(message, title = 'Sucesso!') {
    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) modalTitle.textContent = title;
    if (modalMessage) modalMessage.textContent = message;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close modal
function hideModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

if (closeModal) {
    closeModal.addEventListener('click', hideModal);
}

// Close button in modal
const btnModalClose = document.querySelector('.btn-modal-close');
if (btnModalClose) {
    btnModalClose.addEventListener('click', hideModal);
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        hideModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        hideModal();
    }
});

// Waitlist Form Submission
if (waitlistForm) {
    waitlistForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('waitlist-name').value.trim(),
            email: document.getElementById('waitlist-email').value.trim(),
            phone: document.getElementById('waitlist-phone').value.trim(),
            crmv: document.getElementById('waitlist-crmv').value.trim(),
            clinic: document.getElementById('waitlist-clinic').value.trim(),
            city: document.getElementById('waitlist-city').value.trim(),
            specialty: document.getElementById('waitlist-specialty').value,
            timestamp: new Date().toISOString()
        };

        // Validate email
        if (!isValidEmail(formData.email)) {
            alert('Por favor, insira um e-mail válido.');
            return;
        }

        // Validate CRMV
        if (!formData.crmv || formData.crmv.length < 3) {
            alert('Por favor, insira um CRMV válido.');
            return;
        }

        // Submit button state
        const submitBtn = waitlistForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        try {
            // Submit to backend API
            const response = await fetch('http://localhost:3000/api/waitlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    specialty: formData.specialty
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erro ao enviar formulário');
            }

            // Log to console (for development)
            console.log('Waitlist form submitted:', formData);
            console.log('Server response:', result);

            // Show success message
            showSuccessModal('Parabéns! Você foi adicionado à lista de espera. Entraremos em contato em breve com as instruções para começar seu teste grátis de 30 dias!');

            // Reset form
            waitlistForm.reset();

            // Track conversion (if analytics is set up)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'conversion', {
                    'event_category': 'Waitlist',
                    'event_label': 'Waitlist Signup'
                });
            }

        } catch (error) {
            console.error('Error submitting waitlist form:', error);
            alert(error.message || 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente ou entre em contato diretamente pelo e-mail contato@vetone.ai');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// Contact Form Submission
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('contact-name').value.trim(),
            email: document.getElementById('contact-email').value.trim(),
            phone: document.getElementById('contact-phone').value.trim(),
            subject: document.getElementById('contact-subject').value,
            message: document.getElementById('contact-message').value.trim(),
            timestamp: new Date().toISOString()
        };

        // Validate email
        if (!isValidEmail(formData.email)) {
            alert('Por favor, insira um e-mail válido.');
            return;
        }

        // Validate message
        if (!formData.message || formData.message.length < 10) {
            alert('Por favor, insira uma mensagem com pelo menos 10 caracteres.');
            return;
        }

        // Submit button state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        try {
            // Submit to backend API
            const response = await fetch('http://localhost:3000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    subject: formData.subject,
                    message: formData.message
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erro ao enviar mensagem');
            }

            // Log to console (for development)
            console.log('Contact form submitted:', formData);
            console.log('Server response:', result);

            // Show success message
            showSuccessModal('Mensagem enviada com sucesso! Nossa equipe entrará em contato em até 24 horas.');

            // Reset form
            contactForm.reset();

            // Track conversion (if analytics is set up)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'contact', {
                    'event_category': 'Contact',
                    'event_label': formData.subject
                });
            }

        } catch (error) {
            console.error('Error submitting contact form:', error);
            alert(error.message || 'Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente ou envie um e-mail diretamente para contato@vetone.ai');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Note: In production, update API_BASE_URL to your deployed backend URL
// Example: const API_BASE_URL = 'https://api.vetone.ai';

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Animate elements on scroll
const animateOnScroll = document.querySelectorAll('.feature-card, .benefit-card, .pricing-card, .testimonial-card, .faq-item');
animateOnScroll.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Navbar shadow on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }
});

// Track button clicks (for analytics)
const trackableButtons = document.querySelectorAll('.btn');
trackableButtons.forEach(button => {
    button.addEventListener('click', () => {
        const buttonText = button.textContent.trim();
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                'event_category': 'Button',
                'event_label': buttonText
            });
        }
        console.log('Button clicked:', buttonText);
    });
});

// Add loading state to page
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Detect browser and add class for specific styles if needed
const userAgent = navigator.userAgent.toLowerCase();
if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
    document.body.classList.add('safari');
}

// Performance optimization: Lazy load images (if you add images later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });

    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Add current year to footer (if needed)
const currentYear = new Date().getFullYear();
const yearElements = document.querySelectorAll('.current-year');
yearElements.forEach(el => {
    el.textContent = currentYear;
});

// Console welcome message
console.log('%c🐾 VetOne.AI', 'font-size: 24px; font-weight: bold; color: #4A90E2;');
console.log('%cTransformando o atendimento veterinário com IA', 'font-size: 14px; color: #A06BE8;');
console.log('%cInteressado em trabalhar conosco? Entre em contato: contato@vetone.ai', 'font-size: 12px; color: #718096;');
