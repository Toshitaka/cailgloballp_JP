/**
 * CAIL Global Corporate Site - Main JavaScript
 * Handles scroll animations, smooth navigation, modal, and contact form
 */

// =========================================
// Modal Functionality
// =========================================
const modal = document.getElementById('contact-modal');
const modalOpenButtons = document.querySelectorAll('[data-modal-open]');
const modalCloseButtons = document.querySelectorAll('[data-modal-close]');

function openModal() {
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

modalOpenButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    });
});

modalCloseButtons.forEach(btn => {
    btn.addEventListener('click', closeModal);
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
        closeModal();
    }
});

// =========================================
// Smooth Scroll Navigation
// =========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// =========================================
// Scroll Animation (Intersection Observer)
// =========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Stagger animation for child elements
            const children = entry.target.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
            children.forEach((child, index) => {
                child.style.transitionDelay = `${index * 100}ms`;
                child.classList.add('visible');
            });
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => {
    observer.observe(el);
});

// =========================================
// Header Scroll Effect
// =========================================
let lastScrollY = window.scrollY;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
    } else {
        header.style.boxShadow = 'none';
    }
    lastScrollY = window.scrollY;
});

// =========================================
// Contact Form - Mailto Integration
// =========================================
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form values
        const companyName = document.getElementById('company').value.trim();
        const fullName = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        // Validate
        if (!companyName || !fullName || !email || !message) {
            alert('Please fill in all fields.');
            return;
        }

        // Build mailto URL with specified subject
        const to = 'info@cail.inc';
        const subject = 'Inquiry via Corporate Website';
        const body = `Company: ${companyName}
Name: ${fullName}
Email: ${email}

Message:
${message}`;

        // Encode for URL
        const mailtoUrl = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        // Open mail client
        window.location.href = mailtoUrl;

        // Close modal and reset form after a delay
        setTimeout(() => {
            contactForm.reset();
            closeModal();
        }, 500);
    });
}

// =========================================
// Button Ripple Effect
// =========================================
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function (e) {
        // Skip ripple for modal buttons to avoid interference
        if (this.hasAttribute('data-modal-open') || this.hasAttribute('data-modal-close')) {
            return;
        }

        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.style.cssText = `
      position: absolute;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      width: 100px;
      height: 100px;
      left: ${x - 50}px;
      top: ${y - 50}px;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
    `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation to document
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// =========================================
// Hero Parallax Effect (Mouse-based)
// =========================================
const parallaxElements = document.querySelectorAll('[data-parallax-speed]');
const heroBackground = document.querySelector('.hero__background');

window.addEventListener('mousemove', (e) => {
    if (!heroBackground) return;

    const rect = heroBackground.getBoundingClientRect();
    if (rect.bottom < 0) return; // Skip if hero is not visible

    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    parallaxElements.forEach(el => {
        const speed = parseFloat(el.dataset.parallaxSpeed) || 0.05;
        const moveX = x * speed * 100;
        const moveY = y * speed * 100;

        if (el.classList.contains('hero__character-container')) {
            el.style.transform = `translateY(-50%) translate(${moveX}px, ${moveY}px)`;
        } else {
            el.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
    });
});

// =========================================
// Floating Particles Generator
// =========================================
function createParticles() {
    const container = document.getElementById('hero-particles');
    if (!container) return;

    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        createParticle(container, i);
    }
}

function createParticle(container, index) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    // Random properties
    const left = Math.random() * 100;
    const delay = Math.random() * 15;
    const duration = 10 + Math.random() * 10;
    const size = 2 + Math.random() * 4;
    const hue = Math.random() > 0.7 ? 280 : 180; // Purple or Cyan

    particle.style.cssText = `
        left: ${left}%;
        width: ${size}px;
        height: ${size}px;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
        background: hsla(${hue}, 100%, 70%, 0.8);
        box-shadow: 0 0 ${size * 2}px hsla(${hue}, 100%, 50%, 0.5);
    `;

    container.appendChild(particle);
}

// Initialize particles
createParticles();

// =========================================
// Scroll-based Parallax
// =========================================
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroSection = document.getElementById('hero');

    if (heroSection && scrollY < window.innerHeight) {
        const parallaxSpeed = 0.4;
        const gridLayer = document.querySelector('.hero__grid-layer');
        const characterContainer = document.querySelector('.hero__character-container');

        if (gridLayer) {
            gridLayer.style.transform = `perspective(500px) rotateX(10deg) translateY(${scrollY * parallaxSpeed * 0.5}px)`;
        }

        if (characterContainer) {
            characterContainer.style.transform = `translateY(calc(-50% + ${scrollY * parallaxSpeed}px))`;
        }
    }
});

// =========================================
// Page Load Animation
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-out';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

console.log('🐻‍❄️ CAIL Corporate Site loaded successfully');


// =========================================
// Advanced Particle System for Background
// =========================================
(function() {
    const canvas = document.getElementById('particles-bg');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    
    // Configuration
    const particleCount = 50; 
    const connectionDistance = 150;
    const colors = ['rgba(0, 242, 255, ', 'rgba(124, 58, 237, ']; // Blue and Purple

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 0.5;
            this.colorPrefix = colors[Math.floor(Math.random() * colors.length)];
            this.opacity = Math.random() * 0.5 + 0.1;
            this.opacitySpeed = (Math.random() - 0.5) * 0.01;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            this.opacity += this.opacitySpeed;
            if (this.opacity > 0.6 || this.opacity < 0.1) this.opacitySpeed *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.colorPrefix + this.opacity + ')';
            ctx.fill();
        }
    }

    function init() {
        resize();
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        loop();
    }

    function loop() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        ctx.strokeStyle = 'rgba(100, 116, 139, 0.1)';
        ctx.lineWidth = 0.5;
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(loop);
    }

    window.addEventListener('resize', resize);
    init();
})();
