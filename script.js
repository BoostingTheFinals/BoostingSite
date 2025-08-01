// Create animated particles
function createParticles() {
  const particles = document.getElementById('particles');
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 20 + 's';
    particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
    particles.appendChild(particle);
  }
}

// Pricing Calculator
const blockPrices = [
  { min: 0, max: 10000, price: 8 },
  { min: 10000, max: 20000, price: 18 },
  { min: 20000, max: 30000, price: 40 },
  { min: 30000, max: 40000, price: 75 },
  { min: 40000, max: 52000, price: 280 },
];

function calculatePrice() {
  const currentInput = parseFloat(document.getElementById("currentRS").value);
  const desiredInput = parseFloat(document.getElementById("desiredRS").value);
  const result = document.getElementById("priceResult");
  const progressBar = document.getElementById("progressBar");

  if (!result) return;

  if (
    isNaN(currentInput) ||
    isNaN(desiredInput) ||
    currentInput >= desiredInput ||
    currentInput < 0 ||
    desiredInput > 52
  ) {
    result.innerHTML = `
      <div style="font-size: 1.2rem; color: #f87171;">Please enter valid RS values</div>
      <div style="font-size: 1rem; color: #64748b; margin-top: 0.5rem;">Current RS must be less than target RS (0-52 range)</div>
    `;
    progressBar.style.width = "0%";
    return;
  }

  const current = currentInput * 1000;
  const desired = desiredInput * 1000;
  let total = 0;

  for (const block of blockPrices) {
    const start = Math.max(current, block.min);
    const end = Math.min(desired, block.max);

    if (start < end) {
      const overlap = end - start;
      const blockSize = block.max - block.min;
      const portion = overlap / blockSize;
      total += block.price * portion;
    }
  }

  // Calculate discount for orders over €100
  const discount = total > 100 ? total * 0.2 : 0;
  const finalPrice = total - discount;
  
  // Calculate rush price
  const rushPrice = finalPrice * 1.5;
  
  // Estimate completion time
  const rsGap = desiredInput - currentInput;
  let estimatedHours;
  if (rsGap <= 10) estimatedHours = "6-12 hours";
  else if (rsGap <= 20) estimatedHours = "18-30 hours";
  else if (rsGap <= 30) estimatedHours = "30-48 hours";
  else estimatedHours = "60-72 hours";

  // Update progress bar
  const progress = Math.min((desiredInput / 52) * 100, 100);
  progressBar.style.width = progress + "%";

  result.innerHTML = `
    <div style="margin-bottom: 1.5rem;">
      <div style="font-size: 2.2rem; font-weight: 900; color: #00ffff; margin-bottom: 0.5rem;">
        €${finalPrice.toFixed(2)}
      </div>
      ${discount > 0 ? `<div style="color: #22c55e; font-weight: 600;">💚 Saved €${discount.toFixed(2)} (20% bulk discount)</div>` : ''}
      ${rushPrice > finalPrice ? `<div style="color: #f59e0b; font-size: 0.9rem; margin-top: 0.5rem;">Rush 24h: €${rushPrice.toFixed(2)}</div>` : ''}
    </div>
    <div style="font-size: 1rem; color: #cbd5e1;">
      📅 Estimated completion: ${estimatedHours}<br>
      🎯 Target rank: ${getRankName(desiredInput)}<br>
      🛡️ Includes 48h rank protection
    </div>
  `;
}

function getRankName(rs) {
  if (rs < 10) return "Bronze 🌫️";
  else if (rs < 20) return "Silver 🪙";
  else if (rs < 30) return "Gold ⚪";
  else if (rs < 40) return "Diamond 💎";
  else return "Ruby ♦️";
}

// FAQ Functionality
function initializeFAQ() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const answer = this.nextElementSibling;
      const icon = this.querySelector('.faq-icon');
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      
      // Close all other FAQ items
      faqQuestions.forEach(otherQuestion => {
        if (otherQuestion !== this) {
          const otherAnswer = otherQuestion.nextElementSibling;
          const otherIcon = otherQuestion.querySelector('.faq-icon');
          
          otherQuestion.setAttribute('aria-expanded', 'false');
          otherAnswer.classList.remove('open');
          otherIcon.textContent = '+';
        }
      });
      
      // Toggle current FAQ item
      if (isExpanded) {
        this.setAttribute('aria-expanded', 'false');
        answer.classList.remove('open');
        icon.textContent = '+';
      } else {
        this.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
        icon.textContent = '−';
      }
    });
  });
}

// Scroll animations
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
    observer.observe(el);
  });
}

// Mobile Menu Toggle
function initializeMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('nav');
  
  if (mobileMenuBtn && nav) {
    mobileMenuBtn.addEventListener('click', function() {
      nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
      nav.style.flexDirection = 'column';
      nav.style.position = 'absolute';
      nav.style.top = '100%';
      nav.style.left = '0';
      nav.style.right = '0';
      nav.style.background = 'rgba(10, 10, 10, 0.95)';
      nav.style.padding = '1rem';
      nav.style.backdropFilter = 'blur(20px)';
      nav.style.border = '1px solid rgba(0, 200, 255, 0.1)';
      nav.style.borderTop = 'none';
      nav.style.borderRadius = '0 0 15px 15px';
    });
  }
}

// Dynamic testimonials rotation
function initializeTestimonialRotation() {
  const reviews = document.querySelectorAll('.review');
  let currentReview = 0;
  
  function rotateReviews() {
    reviews.forEach((review, index) => {
      review.style.opacity = index === currentReview ? '1' : '0.7';
      review.style.transform = index === currentReview ? 'scale(1.02)' : 'scale(1)';
    });
    
    currentReview = (currentReview + 1) % reviews.length;
  }
  
  if (reviews.length > 0) {
    setInterval(rotateReviews, 5000); // Rotate every 5 seconds
  }
}

// Live visitor counter simulation
function initializeLiveCounters() {
  const counters = document.querySelectorAll('.trust-number');
  
  counters.forEach(counter => {
    const target = parseInt(counter.textContent.replace(/\D/g, ''));
    if (target && target > 10) {
      // Add small random variations to make it feel "live"
      setInterval(() => {
        const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        const newValue = target + variation;
        if (newValue > 0) {
          counter.textContent = counter.textContent.replace(/\d+/, newValue.toString());
        }
      }, 30000 + Math.random() * 30000); // Random interval between 30-60 seconds
    }
  });
}

// Smooth number counting animation
function animateCounters() {
  const counters = document.querySelectorAll('.trust-number, .stat-value');
  
  const countUp = (element, target) => {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      
      // Handle different number formats
      if (element.textContent.includes('+')) {
        element.textContent = Math.floor(current) + '+';
      } else if (element.textContent.includes('Top')) {
        element.textContent = 'Top ' + Math.floor(current);
      } else if (element.textContent.includes('.')) {
        element.textContent = current.toFixed(1);
      } else {
        element.textContent = Math.floor(current).toLocaleString();
      }
    }, 20);
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
        entry.target.classList.add('animated');
        const text = entry.target.textContent;
        const number = parseInt(text.replace(/\D/g, ''));
        if (number && number > 0) {
          entry.target.textContent = '0';
          countUp(entry.target, number);
        }
      }
    });
  });
  
  counters.forEach(counter => {
    observer.observe(counter);
  });
}

// Form validation and enhancement
function initializeFormHandling() {
  const form = document.querySelector('.contact-form form');
  const inputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
  
  // Add real-time validation
  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      validateField(this);
    });
    
    input.addEventListener('input', function() {
      clearFieldError(this);
    });
  });
  
  // Form submission
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      let isValid = true;
      inputs.forEach(input => {
        if (!validateField(input)) {
          isValid = false;
        }
      });
      
      if (isValid) {
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<div class="loading"></div> Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual submission)
        setTimeout(() => {
          showNotification('Message sent successfully! We\'ll respond within 2 minutes.');
          form.reset();
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }, 2000);
      }
    });
  }
}

function validateField(field) {
  const value = field.value.trim();
  const fieldGroup = field.parentElement;
  let isValid = true;
  
  // Remove existing error
  clearFieldError(field);
  
  // Required field validation
  if (field.hasAttribute('required') && !value) {
    showFieldError(field, 'This field is required');
    isValid = false;
  }
  
  // Email validation
  if (field.type === 'email' && value && !isValidEmail(value)) {
    showFieldError(field, 'Please enter a valid email address');
    isValid = false;
  }
  
  return isValid;
}

function showFieldError(field, message) {
  const fieldGroup = field.parentElement;
  const error = document.createElement('div');
  error.className = 'field-error';
  error.style.color = '#f87171';
  error.style.fontSize = '0.9rem';
  error.style.marginTop = '0.5rem';
  error.textContent = message;
  fieldGroup.appendChild(error);
  
  field.style.borderColor = '#f87171';
}

function clearFieldError(field) {
  const fieldGroup = field.parentElement;
  const existingError = fieldGroup.querySelector('.field-error');
  if (existingError) {
    existingError.remove();
  }
  field.style.borderColor = '';
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Utility functions
function copyDiscordName() {
  const discordName = 'boostingthefinals';
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(discordName).then(() => {
      showNotification('Discord name copied to clipboard!');
    }).catch(() => {
      fallbackCopyToClipboard(discordName);
    });
  } else {
    fallbackCopyToClipboard(discordName);
  }
}

function fallbackCopyToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    document.execCommand('copy');
    showNotification('Discord name copied to clipboard!');
  } catch (err) {
    showNotification('Unable to copy. Discord: ' + text);
  }
  
  document.body.removeChild(textArea);
}

function showNotification(message, duration = 3000) {
  const notification = document.getElementById('notification');
  if (notification) {
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
      notification.classList.remove('show');
    }, duration);
  }
}

function openLiveChat() {
  // Try to open Discord first, fallback to showing contact info
  const discordUrl = 'https://discord.com/users/boostingthefinals';
  const newWindow = window.open(discordUrl, '_blank');
  
  if (!newWindow) {
    // If popup blocked, show notification with contact info
    showNotification('Please contact us on Discord: boostingthefinals', 5000);
  }
}

// Advanced features
function initializeAdvancedFeatures() {
  // Parallax effect for hero section
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      heroContent.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
  });
  
  // Auto-hide header on scroll down, show on scroll up
  let lastScrollTop = 0;
  const header = document.querySelector('.main-header');
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling down
      header.style.transform = 'translateY(-100%)';
    } else {
      // Scrolling up
      header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
  });
  
  // Dynamic pricing updates
  setInterval(() => {
    const priceElements = document.querySelectorAll('td:nth-child(2)');
    priceElements.forEach(element => {
      if (element.textContent.includes('€')) {
        // Add subtle "live" indicator
        element.style.position = 'relative';
        if (!element.querySelector('.live-indicator')) {
          const indicator = document.createElement('span');
          indicator.className = 'live-indicator';
          indicator.style.cssText = `
            position: absolute;
            top: -5px;
            right: -5px;
            width: 8px;
            height: 8px;
            background: #22c55e;
            border-radius: 50%;
            animation: pulse 2s infinite;
          `;
          element.appendChild(indicator);
        }
      }
    });
  }, 10000);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  createParticles();
  initializeFAQ();
  initializeScrollAnimations();
  initializeMobileMenu();
  initializeFormHandling();
  initializeTestimonialRotation();
  initializeLiveCounters();
  animateCounters();
  initializeAdvancedFeatures();
  
  // Auto-calculate price when inputs change
  const currentInput = document.getElementById("currentRS");
  const desiredInput = document.getElementById("desiredRS");
  
  if (currentInput && desiredInput) {
    currentInput.addEventListener('input', calculatePrice);
    desiredInput.addEventListener('input', calculatePrice);
  }
  
  // Initialize smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerHeight = document.querySelector('.main-header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Add loading screen fade out
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 500);
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Performance monitoring
function trackPerformance() {
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
        
        if (loadTime > 3000) {
          console.log('Slow load detected:', loadTime + 'ms');
