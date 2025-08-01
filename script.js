// Enhanced animated particles system
function createParticles() {
  const particles = document.getElementById('particles');
  if (!particles) return;
  
  // Clear existing particles
  particles.innerHTML = '';
  
  // Create more particles for full-page effect
  const particleCount = window.innerWidth < 768 ? 20 : 50;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random horizontal position
    particle.style.left = Math.random() * 100 + '%';
    
    // Stagger animation delays for continuous effect
    particle.style.animationDelay = Math.random() * 25 + 's';
    
    // Vary animation duration for more natural movement
    const duration = Math.random() * 15 + 15; // 15-30 seconds
    particle.style.animationDuration = duration + 's';
    
    particles.appendChild(particle);
  }
}

// Recreate particles on window resize for responsive design
function handleResize() {
  clearTimeout(window.resizeTimer);
  window.resizeTimer = setTimeout(createParticles, 100);
}

// Initialize particles when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  createParticles();
  
  // Recreate particles on resize
  window.addEventListener('resize', handleResize);
  
  // Optionally recreate particles periodically for fresh effect
  setInterval(createParticles, 120000); // Every 2 minutes
  
  // Rest of your existing initialization code...
  initializeFAQ();
  initializeScrollAnimations();
  
  // Auto-calculate price when inputs change
  const currentInput = document.getElementById("currentRS");
  const desiredInput = document.getElementById("desiredRS");
  
  if (currentInput && desiredInput) {
    currentInput.addEventListener('input', calculatePrice);
    desiredInput.addEventListener('input', calculatePrice);
  }
});

// Enhanced scroll animations that work with particles
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Add subtle particle burst effect when sections come into view
        if (entry.target.tagName === 'SECTION') {
          createSectionParticleBurst(entry.target);
        }
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
    observer.observe(el);
  });
}

// Optional: Create a small particle burst when sections come into view
function createSectionParticleBurst(section) {
  // This is optional - creates a small burst of particles when sections animate in
  const burstContainer = document.createElement('div');
  burstContainer.style.position = 'absolute';
  burstContainer.style.top = '50%';
  burstContainer.style.left = '50%';
  burstContainer.style.pointerEvents = 'none';
  burstContainer.style.zIndex = '1';
  
  section.style.position = 'relative';
  section.appendChild(burstContainer);
  
  // Create small burst particles
  for (let i = 0; i < 5; i++) {
    const burstParticle = document.createElement('div');
    burstParticle.style.position = 'absolute';
    burstParticle.style.width = '2px';
    burstParticle.style.height = '2px';
    burstParticle.style.background = '#00c8ff';
    burstParticle.style.borderRadius = '50%';
    burstParticle.style.boxShadow = '0 0 6px #00c8ff';
    
    const angle = (360 / 5) * i;
    const distance = 30;
    const x = Math.cos(angle * Math.PI / 180) * distance;
    const y = Math.sin(angle * Math.PI / 180) * distance;
    
    burstParticle.style.animation = `burstOut 1s ease-out forwards`;
    burstParticle.style.setProperty('--x', x + 'px');
    burstParticle.style.setProperty('--y', y + 'px');
    
    burstContainer.appendChild(burstParticle);
  }
  
  // Clean up after animation
  setTimeout(() => {
    if (burstContainer.parentNode) {
      burstContainer.parentNode.removeChild(burstContainer);
    }
  }, 1000);
}

// Add burst animation CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes burstOut {
    0% {
      transform: translate(0, 0) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate(var(--x), var(--y)) scale(0);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
