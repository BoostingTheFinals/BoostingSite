// Enhanced animated particles system with more coverage
function createParticles() {
  const particles = document.getElementById('particles');
  if (!particles) return;
  
  // Clear existing particles
  particles.innerHTML = '';
  
  // Significantly increase particle count for full coverage
  const particleCount = window.innerWidth < 768 ? 40 : 80;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random horizontal position across full width
    particle.style.left = Math.random() * 100 + '%';
    
    // Stagger animation delays for continuous effect (longer cycle)
    particle.style.animationDelay = Math.random() * 40 + 's';
    
    // Vary animation duration for more natural movement
    const duration = Math.random() * 20 + 15; // 15-35 seconds
    particle.style.animationDuration = duration + 's';
    
    // Add random opacity variation
    particle.style.opacity = 0.3 + Math.random() * 0.7;
    
    particles.appendChild(particle);
  }
}

// Create section-specific particles for enhanced effects
function createSectionParticles(section, count = 8) {
  if (!section) return;
  
  // Remove existing section particles
  const existingParticles = section.querySelector('.section-particles');
  if (existingParticles) {
    existingParticles.remove();
  }
  
  const sectionParticles = document.createElement('div');
  sectionParticles.className = 'section-particles';
  
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'section-particle';
    
    // Random size
    const size = Math.random() * 4 + 1;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // Random position
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    // Random animation delay
    particle.style.animationDelay = Math.random() * 15 + 's';
    
    // Random animation duration
    const duration = Math.random() * 10 + 10;
    particle.style.animationDuration = duration + 's';
    
    sectionParticles.appendChild(particle);
  }
  
  section.appendChild(sectionParticles);
}

// Enhanced particle creation for all sections
function initializeSectionParticles() {
  // Add particles to hero section
  const hero = document.querySelector('.hero');
  if (hero) createSectionParticles(hero, 12);
  
  // Add particles to trust section
  const trustSection = document.querySelector('.trust-section');
  if (trustSection) createSectionParticles(trustSection, 10);
  
  // Add particles to pricing calculator
  const pricingCalculator = document.querySelector('.pricing-calculator');
  if (pricingCalculator) createSectionParticles(pricingCalculator, 8);
  
  // Add particles to other key sections
  const sections = document.querySelectorAll('section:not(.hero):not(.trust-section)');
  sections.forEach(section => {
    if (!section.querySelector('.section-particles')) {
      createSectionParticles(section, 6);
    }
  });
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

// Calculate base price (example)
let basePrice = calculateBasePrice(desiredInput); // Your custom function
let finalPrice = basePrice;
let streamingFee = 0;

// Apply streaming increase (+15%) if selected
if (streaming) {
  streamingFee = basePrice * 0.15;
  finalPrice += streamingFee;
}

// Optionally calculate rush price
let rushPrice = finalPrice + rushFee; // Assume rushFee already defined

// Update progress bar
const progress = Math.min((desiredInput / 52) * 100, 100);
progressBar.style.width = progress + "%";

// Update result
result.innerHTML = `
  <div style="margin-bottom: 1.5rem;">
    <div style="font-size: 2.2rem; font-weight: 900; color: #00ffff; margin-bottom: 0.5rem;">
      €${finalPrice.toFixed(2)}
    </div>
    ${streaming ? `<div style="color: #22c55e; font-weight: 600;">+ Streaming €${streamingFee.toFixed(2)} (15%)</div>` : ''}
    ${rushPrice > finalPrice ? `<div style="color: #f59e0b; font-size: 0.9rem; margin-top: 0.5rem;">Rush 24h: €${rushPrice.toFixed(2)}</div>` : ''}
  </div>
  <div style="font-size: 1rem; color: #cbd5e1;">
    📅 Estimated completion: ${estimatedHours}<br>
    🎯 Target rank: ${getRankName(desiredInput)}<br>
    🛡️ Includes 48h rank protection
  </div>
`;


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

// Enhanced scroll animations
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Add extra particles when section becomes visible
        if (entry.target.tagName === 'SECTION' && !entry.target.querySelector('.section-particles')) {
          setTimeout(() => {
            createSectionParticles(entry.target, 6);
          }, 200);
        }
      }
    });
  }, observerOptions);

  // Observe all fade-in elements
  document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
    observer.observe(el);
  });
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Initialize main background particles
  createParticles();
  
  // Initialize section-specific particles
  initializeSectionParticles();
  
  // Initialize scroll animations
  initializeScrollAnimations();
  
  // Initialize FAQ functionality
  initializeFAQ();
  
  // Initialize pricing calculator
  const currentInput = document.getElementById('currentRS');
  const desiredInput = document.getElementById('desiredRS');
  
  if (currentInput && desiredInput) {
    currentInput.addEventListener('input', calculatePrice);
    desiredInput.addEventListener('input', calculatePrice);
  }
  
  // Recreate particles on window resize for optimal coverage
  window.addEventListener('resize', () => {
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
      createParticles();
      initializeSectionParticles();
    }, 250);
  });
});

// Additional utility functions
function copyDiscordName() {
  navigator.clipboard.writeText('boostingthefinals').then(() => {
    const notification = document.getElementById('notification');
    if (notification) {
      notification.classList.add('show');
      setTimeout(() => {
        notification.classList.remove('show');
      }, 3000);
    }
  });
}

function openLiveChat() {
  window.open('https://discord.com/users/boostingthefinals', '_blank');
}
