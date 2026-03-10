let selectedType = "driver";
  
  function getRank(value) {
    if (value < 10000) return "Bronze";
    if (value < 20000) return "Silver";
    if (value < 30000) return "Gold";
    if (value < 40000) return "Platinum";
    if (value < 52000) return "Diamond";
    return "Ruby";
  }
  
  function updateRankDisplay(id, value) {
    const wrapper = document.getElementById(id);
    if (!wrapper) return;
    const rankName = wrapper.querySelector(".rank-name");
    const rankNum = wrapper.querySelector(".rank-number");
    const rank = getRank(value);
    wrapper.className = rank.toLowerCase();
    rankName.textContent = rank;
    rankNum.textContent = value;
  }
  
  function calculatePrice() {
    const startVal = parseInt(document.getElementById("startRank").value);
    const endVal = parseInt(document.getElementById("endRank").value);
    const resultBox = document.getElementById("calcResult");
    updateRankDisplay("startValue", startVal);
    updateRankDisplay("endValue", endVal);
    if (endVal <= startVal) {
      resultBox.innerHTML = "❌ Target rank must be higher than current rank";
      return;
    }
    let total = 0;
    const tiers = rankTiers[selectedType];
    Object.values(tiers).forEach(tier => {
      if (startVal < tier.end && endVal > tier.start) {
        const rangeStart = Math.max(startVal, tier.start);
        const rangeEnd = Math.min(endVal, tier.end);
        const tierFraction = (rangeEnd - rangeStart) / (tier.end - tier.start);
        total += tier.price * tierFraction;
      }
    });
    
const priceMultiplier = typeKey === "selfplay" ? 2 : 1;
const wtDiscount = isWorldTour ? 0.7 : 1;
const originalPrice = Math.round(total * priceMultiplier * wtDiscount);
const discounted = Math.round(originalPrice * 0.95);
    const withLivestream = Math.round(discounted * 1.20);
    
    resultBox.innerHTML = `
      <div style="font-size: 1.2rem; font-weight: 800; color: #fff; margin-bottom: 0.75rem;">
        Total Price: ${discounted} €
      </div>
      <div style="font-size: 0.9rem; color: var(--text-secondary);">
        +20% live stream: <span style="color: var(--accent); font-weight: 600;">${withLivestream} €</span>
      </div>
    `;
  }
  
  function updateSliderFill(slider) {
    const value = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.background = `linear-gradient(to right, #ff6b35 ${value}%, rgba(255,255,255,0.2) ${value}%)`;
  }
  
  window.addEventListener("DOMContentLoaded", () => {
    const start = document.getElementById("startRank");
    const end = document.getElementById("endRank");
    const typeButtons = document.querySelectorAll(".calc-toggle-wrapper .toggle-btn");
    if (!start || !end) return;
    
    start.addEventListener("input", () => {
      if (+end.value <= +start.value) end.value = +start.value + 250;
      updateSliderFill(start);
      updateSliderFill(end);
      calculatePrice();
    });
    end.addEventListener("input", () => {
      if (+end.value <= +start.value) end.value = +start.value + 250;
      updateSliderFill(start);
      updateSliderFill(end);
      calculatePrice();
    });
    
    typeButtons.forEach(btn => {
      btn.addEventListener("click", e => {
        e.preventDefault();
        typeButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedType = btn.dataset.type;
        calculatePrice();
      });
    });
    
    updateSliderFill(start);
    updateSliderFill(end);
    calculatePrice();
  });
    const particlesContainer = document.getElementById('particles');
for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 10 + 's';
    particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
    particlesContainer.appendChild(particle);
}

/* ---------- */

// --- instant toggle optimization ---
(function() {
  const typeButtons = document.querySelectorAll(".calc-toggle-wrapper .toggle-btn");
  const start = document.getElementById("startRank");
  const end = document.getElementById("endRank");

  if (!typeButtons.length || !start || !end) return;

  // remove all transition lag from toggles
  typeButtons.forEach(btn => {
    btn.style.transition = "none";
  });

  // use a single animation frame for updates
  function quickRecalc(type) {
    window.requestAnimationFrame(() => {
      window.selectedType = type;
      calculatePrice(); // uses your existing function
    });
  }

  typeButtons.forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();

      // instant visual response
      typeButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // queued price update (no layout thrash)
      quickRecalc(btn.dataset.type);
    });
  });
})();

/* ---------- */

// Testimonials Carousel
const slider = document.querySelector('.testimonial-slider');
const cards = document.querySelectorAll('.testimonial-card');
const prevBtn = document.querySelector('.testimonial-nav.prev');
const nextBtn = document.querySelector('.testimonial-nav.next');
const dotsContainer = document.querySelector('.testimonial-dots');

let currentIndex = 0;
let cardsPerView = 3;

// Calculate cards per view based on screen size
function updateCardsPerView() {
  if (window.innerWidth <= 600) {
    cardsPerView = 1;
  } else if (window.innerWidth <= 900) {
    cardsPerView = 2;
  } else {
    cardsPerView = 3;
  }
}

// Create 6 dots (fixed)
function createDots() {
  if (!dotsContainer) return;
  dotsContainer.innerHTML = '';
  
  // Always create exactly 6 dots
  for (let i = 0; i < 7; i++) {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
}

// Update carousel position
function updateCarousel() {
  const cardWidth = cards[0].offsetWidth;
  const gap = 16;
  const offset = currentIndex * (cardWidth + gap);
  slider.style.transform = `translateX(-${offset}px)`;
  
  // Update dots
  document.querySelectorAll('.dot').forEach((dot, index) => {
    dot.classList.toggle('active', index === currentIndex);
  });
  
  // Update button states
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex >= cards.length - cardsPerView;
}

// Go to specific slide
function goToSlide(index) {
  if (index >= 0 && index < cards.length - cardsPerView + 1) {
    currentIndex = index;
    updateCarousel();
  }
}

// Next slide
function nextSlide() {
  if (currentIndex < cards.length - cardsPerView) {
    currentIndex++;
    updateCarousel();
  }
}

// Previous slide
function prevSlide() {
  if (currentIndex > 0) {
    currentIndex--;
    updateCarousel();
  }
}

// Event listeners
prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

// Handle resize
window.addEventListener('resize', () => {
  updateCardsPerView();
  currentIndex = 0;
  updateCarousel();
});

// Initialize
updateCardsPerView();
createDots();
updateCarousel();

        const bars = document.querySelectorAll('.bar');
        bars.forEach(bar => {
            bar.addEventListener('mouseenter', function() {
                const value = this.querySelector('.bar-value').textContent;
                const label = this.querySelector('.bar-label').textContent.replace(/\n/g, ' ');
                this.title = `${label}: ${value} orders completed`;
            });
        });

  const priceIncreaseTimerEl = document.getElementById("priceIncreaseTimer");

  function updatePriceIncreaseTimer() {
    const priceIncreaseDate = new Date('2025-11-26T00:00:00').getTime();
    const now = new Date().getTime();
    const diff = priceIncreaseDate - now;

    if (diff <= 0) {
      priceIncreaseTimerEl.textContent = "ACTIVE NOW! ⚠️";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    priceIncreaseTimerEl.textContent = `${String(days).padStart(2, '0')}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
  }

  updatePriceIncreaseTimer();
  setInterval(updatePriceIncreaseTimer, 1000);

/* ---------- */

// Smooth scroll for all navigation + contact highlight
document.addEventListener('DOMContentLoaded', () => {
  const contactSection = document.querySelector('#contact .footer-section:nth-of-type(3)');
  
  // Add border pulse animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes borderPulse {
      0% {
        border-color: transparent;
        box-shadow: 0 0 0 rgba(255, 107, 53, 0);
      }
      50% {
        border-color: #ff6b35;
        box-shadow: 0 0 20px rgba(255, 107, 53, 0.4);
      }
      100% {
        border-color: transparent;
        box-shadow: 0 0 0 rgba(255, 107, 53, 0);
      }
    }
    
    .footer-section.contact-highlight {
      border: 2px solid transparent;
      border-radius: 12px;
      animation: borderPulse 1.5s ease-in-out;
    }
  `;
  document.head.appendChild(style);

  // Smooth scroll function
  function smoothScrollTo(targetElement, targetId) {
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 600;
    let start = null;

    function animation(currentTime) {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
    
    // Update URL
    history.pushState(null, '', targetId);
    
    // If it's contact, add highlight after scroll
    if (targetId === '#contact' && contactSection) {
      setTimeout(() => {
        contactSection.classList.remove('contact-highlight');
        void contactSection.offsetWidth;
        contactSection.classList.add('contact-highlight');
        setTimeout(() => contactSection.classList.remove('contact-highlight'), 1500);
      }, duration);
    }
  }

  // Handle ALL anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      // Skip empty anchors
      if (targetId === '#' || targetId === '') return;
      
      e.preventDefault();
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        smoothScrollTo(targetElement, targetId);
      }
    });
  });

  // Explicitly handle Buy Now button (in case it doesn't have href)
  const buyNowBtn = document.querySelector('.calc-btn.buy-now');
  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const contactElement = document.querySelector('#contact');
      if (contactElement) {
        smoothScrollTo(contactElement, '#contact');
      }
    });
  }
});

/* ---------- */

document.addEventListener('DOMContentLoaded', function() {
  console.log("Looking for priceIncreaseTimer element...");
  const priceIncreaseTimerEl = document.getElementById("priceIncreaseTimer");
  console.log("Found element:", priceIncreaseTimerEl);
  
  if (!priceIncreaseTimerEl) {
    console.error("ERROR: priceIncreaseTimer element NOT found!");
    return;
  }

  function updatePriceIncreaseTimer() {
    const priceIncreaseDate = new Date('2025-11-26T00:00:00').getTime();
    const now = new Date().getTime();
    const diff = priceIncreaseDate - now;

    if (diff <= 0) {
      priceIncreaseTimerEl.textContent = "ACTIVE NOW! ⚠️";
      console.log("Timer finished - showing ACTIVE NOW");
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    priceIncreaseTimerEl.textContent = `${String(days).padStart(2, '0')}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
  }

  updatePriceIncreaseTimer();
  setInterval(updatePriceIncreaseTimer, 1000);
});

/* ---------- */

// Mobile menu toggle
document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
    this.classList.toggle('active');
    document.querySelector('.nav-links').classList.toggle('active');
});

/* ---------- */

// Create Premium Christmas lights
document.addEventListener('DOMContentLoaded', function() {
    createChristmasLights();
});

function createChristmasLights() {
    // Remove existing lights if any
    const existing = document.querySelector('.christmas-lights');
    if (existing) existing.remove();
    
    const lightsContainer = document.createElement('div');
    lightsContainer.className = 'christmas-lights';
    
    // Create 40 lights for full coverage
    for (let i = 0; i < 40; i++) {
        const light = document.createElement('div');
        light.className = 'light';
        lightsContainer.appendChild(light);
    }
    
    document.body.appendChild(lightsContainer);
}

// FAQ Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other items if you want accordion behavior (one open at a time)
            // faqItems.forEach(otherItem => {
            //     if (otherItem !== item) {
            //         otherItem.classList.remove('active');
            //     }
            // });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
});

/* ---------- */

(function() {
  // Ranked Mode tiers
  const rankTiers = {
    driver: {
      'Bronze → Silver': { start: 0, end: 10000, price: 12 },
      'Silver → Gold': { start: 10000, end: 20000, price: 30 },
      'Gold → Platinum': { start: 20000, end: 30000, price: 40 },
      'Platinum → Diamond': { start: 30000, end: 40000, price: 72 },
      'Diamond → Ruby': { start: 40000, end: 50000, price: 190 },
'Ruby (50k → 53k)': { start: 50000, end: 53000, price: 120 },
'Ruby (53k → 55k)': { start: 53000, end: 55000, price: 120 }
    },
    selfplay: {
      'Bronze → Silver': { start: 0, end: 10000, price: 12 },
      'Silver → Gold': { start: 10000, end: 20000, price: 30 },
      'Gold → Platinum': { start: 20000, end: 30000, price: 40 },
      'Platinum → Diamond': { start: 30000, end: 40000, price: 72 },
      'Diamond → Ruby': { start: 40000, end: 50000, price: 190 },
'Ruby (50k → 53k)': { start: 50000, end: 53000, price: 120 },
'Ruby (53k → 55k)': { start: 53000, end: 55000, price: 120 }
    }
  };

  // World Tour exact pricing
  const worldTourPricing = {
    driver: {
      1: 0, 2: 3, 3: 5, 4: 7, 5: 12, 6: 17, 7: 22, 8: 28,
      9: 35, 10: 42, 11: 52, 12: 60, 13: 72, 14: 85, 15: 95, 16: 110,
      17: 130, 18: 150, 19: 175, 20: 200, 21: 230, 22: 270, 23: 310, 24: 340
    },
    selfplay: {
      1: 0, 2: 3, 3: 5, 4: 7, 5: 12, 6: 17, 7: 22, 8: 28,
      9: 35, 10: 42, 11: 52, 12: 60, 13: 72, 14: 85, 15: 95, 16: 110,
      17: 130, 18: 150, 19: 175, 20: 200, 21: 230, 22: 270, 23: 310, 24: 340
    }
  };
  
  let selectedType = "driver";
  let selectedTypeWT = "driver-wt";
  let currentMode = "ranked";
  
  function getRank(value) {
    if (value < 10000) return "Bronze";
    if (value < 20000) return "Silver";
    if (value < 30000) return "Gold";
    if (value < 40000) return "Platinum";
    if (value < 52000) return "Diamond";
    return "Ruby";
  }

  function getWorldTourRank(value) {
    if (value <= 4) return "Bronze";
    if (value <= 8) return "Silver";
    if (value <= 12) return "Gold";
    if (value <= 16) return "Platinum";
    if (value <= 20) return "Diamond";
    return "Emerald";
  }
  
  function updateRankDisplay(id, value, isWorldTour = false) {
    const wrapper = document.getElementById(id);
    if (!wrapper) return;
    const rankName = wrapper.querySelector(".rank-name");
    const rankNum = wrapper.querySelector(".rank-number");
    const rank = isWorldTour ? getWorldTourRank(value) : getRank(value);
    wrapper.className = rank.toLowerCase();
    rankName.textContent = rank;
    rankNum.textContent = value;
  }
  
  function calculatePrice(isWorldTour = false) {
    const startId = isWorldTour ? "startRankWT" : "startRank";
    const endId = isWorldTour ? "endRankWT" : "endRank";
    const resultId = isWorldTour ? "calcResultWT" : "calcResult";
    const startValId = isWorldTour ? "startValueWT" : "startValue";
    const endValId = isWorldTour ? "endValueWT" : "endValue";
    
    const startVal = parseInt(document.getElementById(startId).value);
    const endVal = parseInt(document.getElementById(endId).value);
    const resultBox = document.getElementById(resultId);
    
    updateRankDisplay(startValId, startVal, isWorldTour);
    updateRankDisplay(endValId, endVal, isWorldTour);
    
    if (endVal <= startVal) {
      resultBox.innerHTML = "❌ Target must be higher than current";
      return;
    }
    
    let total = 0;
    
    if (isWorldTour) {
      const typeKey = selectedTypeWT.replace('-wt', '');
      const pricing = worldTourPricing[typeKey];
      total = pricing[endVal] - pricing[startVal];
    } else {
      const tiers = rankTiers[selectedType];
      Object.values(tiers).forEach(tier => {
        if (startVal < tier.end && endVal > tier.start) {
          const rangeStart = Math.max(startVal, tier.start);
          const rangeEnd = Math.min(endVal, tier.end);
          const tierFraction = (rangeEnd - rangeStart) / (tier.end - tier.start);
          total += tier.price * tierFraction;
        }
      });
    }
    
    const typeKey = isWorldTour ? selectedTypeWT.replace('-wt', '') : selectedType;
const priceMultiplier = typeKey === "selfplay" ? 2 : 1;
const wtDiscount = isWorldTour ? 0.7 : 1;
const originalPrice = Math.round(total * priceMultiplier * wtDiscount);
const discounted = Math.round(originalPrice * 0.95);
    const withLivestream = Math.round(discounted * 1.20);
    
    resultBox.innerHTML = `
      <div style="font-size: 1.2rem; font-weight: 800; color: #fff; margin-bottom: 0.75rem;">
        Total Price: ${discounted} €
      </div>
      <div style="font-size: 0.9rem; color: var(--text-secondary);">
        +20% live stream: <span style="color: var(--accent); font-weight: 600;">${withLivestream} €</span>
      </div>
    `;
  }
  
  function updateSliderFill(slider) {
    const value = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.background = `linear-gradient(to right, #ff6b35 ${value}%, rgba(255,255,255,0.2) ${value}%)`;
  }
  
  window.addEventListener("DOMContentLoaded", () => {
    // Mode Toggle (Ranked/World Tour)
    const modeToggleBtns = document.querySelectorAll('.mode-toggle-btn');
    modeToggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        modeToggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const mode = btn.dataset.mode;
        document.getElementById('ranked-content').style.display = mode === 'ranked' ? 'block' : 'none';
        document.getElementById('worldtour-content').style.display = mode === 'worldtour' ? 'block' : 'none';
        currentMode = mode;
        if (mode === 'ranked') {
  const rankedBtns = document.querySelectorAll('#ranked-content .toggle-btn');
  rankedBtns.forEach(b => b.classList.remove('active'));
  const driverBtn = document.querySelector('#ranked-content .toggle-btn[data-type="driver"]');
  if (driverBtn) {
    driverBtn.classList.add('active');
    selectedType = "driver";
    calculatePrice(false);
  }
}

        // Auto-select Account Driver when switching to World Tour
        if (mode === 'worldtour') {
          const wtButtons = document.querySelectorAll('#worldtour-content .toggle-btn');
          wtButtons.forEach(b => b.classList.remove('active'));
          const driverBtn = document.querySelector('#worldtour-content .toggle-btn[data-type="driver-wt"]');
          if (driverBtn) {
            driverBtn.classList.add('active');
            selectedTypeWT = "driver-wt";
            calculatePrice(true);
          }
        }
      });
    });
    
    // Ranked Mode
    const start = document.getElementById("startRank");
    const end = document.getElementById("endRank");
    const typeButtons = document.querySelectorAll('#ranked-content .toggle-btn');
    
    if (start && end) {
      start.addEventListener("input", () => {
        if (+end.value <= +start.value) end.value = +start.value + 250;
        updateSliderFill(start);
        updateSliderFill(end);
        calculatePrice(false);
      });
      end.addEventListener("input", () => {
        if (+end.value <= +start.value) end.value = +start.value + 250;
        updateSliderFill(start);
        updateSliderFill(end);
        calculatePrice(false);
      });
      
      typeButtons.forEach(btn => {
        btn.addEventListener("click", e => {
          e.preventDefault();
          typeButtons.forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          selectedType = btn.dataset.type;
          calculatePrice(false);
        });
      });
      
      updateSliderFill(start);
      updateSliderFill(end);
      calculatePrice(false);
    }
    
    // World Tour
    const startWT = document.getElementById("startRankWT");
    const endWT = document.getElementById("endRankWT");
    const typeButtonsWT = document.querySelectorAll('#worldtour-content .toggle-btn');
    
    if (startWT && endWT) {
      startWT.addEventListener("input", () => {
        if (+endWT.value <= +startWT.value) endWT.value = +startWT.value + 1;
        updateSliderFill(startWT);
        updateSliderFill(endWT);
        calculatePrice(true);
      });
      endWT.addEventListener("input", () => {
        if (+endWT.value <= +startWT.value) endWT.value = +startWT.value + 1;
        updateSliderFill(startWT);
        updateSliderFill(endWT);
        calculatePrice(true);
      });
      
      typeButtonsWT.forEach(btn => {
        btn.addEventListener("click", e => {
          e.preventDefault();
          typeButtonsWT.forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          selectedTypeWT = btn.dataset.type;
          calculatePrice(true);
        });
      });
      
      updateSliderFill(startWT);
      updateSliderFill(endWT);
      calculatePrice(true);
    }
  });
})();

/* ---------- */

// Footer links switch calculator modes
document.addEventListener('DOMContentLoaded', () => {
    const footerLinks = document.querySelectorAll('.footer-section a');
    
    footerLinks.forEach(link => {
        if (link.textContent === 'Ranked') {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                // Scroll to calculator
                document.querySelector('#calculator').scrollIntoView({ behavior: 'smooth' });
                // Click Ranked tab
                setTimeout(() => {
                    document.querySelector('.mode-toggle-btn[data-mode="ranked"]').click();
                }, 600);
            });
        }
        
        if (link.textContent === 'World Tour') {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                // Scroll to calculator
                document.querySelector('#calculator').scrollIntoView({ behavior: 'smooth' });
                // Click World Tour tab
                setTimeout(() => {
                    document.querySelector('.mode-toggle-btn[data-mode="worldtour"]').click();
                }, 600);
            });
        }
    });
});
// Smooth scroll for all navigation + contact highlight
document.addEventListener('DOMContentLoaded', () => {
  const contactSection = document.querySelector('#contact .footer-section:nth-of-type(3)');
  
  // Add border pulse animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes borderPulse {
      0% {
        border-color: transparent;
        box-shadow: 0 0 0 rgba(255, 107, 53, 0);
      }
      50% {
        border-color: #ff6b35;
        box-shadow: 0 0 20px rgba(255, 107, 53, 0.4);
      }
      100% {
        border-color: transparent;
        box-shadow: 0 0 0 rgba(255, 107, 53, 0);
      }
    }
    
    .footer-section.contact-highlight {
      border: 2px solid transparent;
      border-radius: 12px;
      animation: borderPulse 1.5s ease-in-out;
    }
  `;
  document.head.appendChild(style);

  // Smooth scroll function with offset for fixed header
  function smoothScrollTo(targetElement, targetId) {
    const headerHeight = 140; // Adjust this value (header + announcement bar height)
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 600;
    let start = null;

    function animation(currentTime) {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
    
    // Update URL
    history.pushState(null, '', targetId);
    
    // If it's contact, add highlight after scroll
    if (targetId === '#contact' && contactSection) {
      setTimeout(() => {
        contactSection.classList.remove('contact-highlight');
        void contactSection.offsetWidth;
        contactSection.classList.add('contact-highlight');
        setTimeout(() => contactSection.classList.remove('contact-highlight'), 1500);
      }, duration);
    }
  }

  // Handle ALL anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      // Skip empty anchors
      if (targetId === '#' || targetId === '') return;
      
      e.preventDefault();
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        smoothScrollTo(targetElement, targetId);
      }
    });
  });

  // Explicitly handle Buy Now button (in case it doesn't have href)
  const buyNowBtn = document.querySelector('.calc-btn.buy-now');
  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const contactElement = document.querySelector('#contact');
      if (contactElement) {
        smoothScrollTo(contactElement, '#contact');
      }
    });
  }
});

/* ---------- */

(function() {
  // Ranked Mode tiers (unchanged)
  const rankTiers = {
    driver: {
      'Bronze → Silver': { start: 0, end: 10000, price: 12 },
      'Silver → Gold': { start: 10000, end: 20000, price: 30 },
      'Gold → Platinum': { start: 20000, end: 30000, price: 40 },
      'Platinum → Diamond': { start: 30000, end: 40000, price: 72 },
      'Diamond → Ruby': { start: 40000, end: 50000, price: 190 },
'Ruby (50k → 53k)': { start: 50000, end: 53000, price: 120 },
'Ruby (53k → 55k)': { start: 53000, end: 55000, price: 120 }
    },
    selfplay: {
      'Bronze → Silver': { start: 0, end: 10000, price: 12 },
      'Silver → Gold': { start: 10000, end: 20000, price: 30 },
      'Gold → Platinum': { start: 20000, end: 30000, price: 40 },
      'Platinum → Diamond': { start: 30000, end: 40000, price: 72 },
      'Diamond → Ruby': { start: 40000, end: 50000, price: 190 },
'Ruby (50k → 53k)': { start: 50000, end: 53000, price: 120 },
'Ruby (53k → 55k)': { start: 53000, end: 55000, price: 120 }
    }
  };

  // World Tour exact pricing
  const worldTourPricing = {
    driver: {
      1: 0, 2: 3, 3: 5, 4: 7, 5: 12, 6: 17, 7: 22, 8: 28,
      9: 35, 10: 42, 11: 52, 12: 60, 13: 72, 14: 85, 15: 95, 16: 110,
      17: 130, 18: 150, 19: 175, 20: 200, 21: 230, 22: 270, 23: 310, 24: 340
    },
    selfplay: {
      1: 0, 2: 3, 3: 5, 4: 7, 5: 12, 6: 17, 7: 22, 8: 28,
      9: 35, 10: 42, 11: 52, 12: 60, 13: 72, 14: 85, 15: 95, 16: 110,
      17: 130, 18: 150, 19: 175, 20: 200, 21: 230, 22: 270, 23: 310, 24: 340
    }
  };
  
  let selectedType = "driver";
  let selectedTypeWT = "driver-wt";
  let currentMode = "ranked";
  
  function getRank(value) {
    if (value < 2500) return "Bronze 4";
    if (value < 5000) return "Bronze 3";
    if (value < 7500) return "Bronze 2";
    if (value < 10000) return "Bronze 1";
    if (value < 12500) return "Silver 4";
    if (value < 15000) return "Silver 3";
    if (value < 17500) return "Silver 2";
    if (value < 20000) return "Silver 1";
    if (value < 22500) return "Gold 4";
    if (value < 25000) return "Gold 3";
    if (value < 27500) return "Gold 2";
    if (value < 30000) return "Gold 1";
    if (value < 32500) return "Platinum 4";
    if (value < 35000) return "Platinum 3";
    if (value < 37500) return "Platinum 2";
    if (value < 40000) return "Platinum 1";
    if (value < 42500) return "Diamond 4";
    if (value < 45000) return "Diamond 3";
    if (value < 47500) return "Diamond 2";
    if (value < 50000) return "Diamond 1";
    return "Ruby";
  }

function getWorldTourRank(value) {
  if (value === 1) return "Bronze 4";
  if (value === 2) return "Bronze 3";
  if (value === 3) return "Bronze 2";
  if (value === 4) return "Bronze 1";
  if (value === 5) return "Silver 4";
  if (value === 6) return "Silver 3";
  if (value === 7) return "Silver 2";
  if (value === 8) return "Silver 1";
  if (value === 9) return "Gold 4";
  if (value === 10) return "Gold 3";
  if (value === 11) return "Gold 2";
  if (value === 12) return "Gold 1";
  if (value === 13) return "Platinum 4";
  if (value === 14) return "Platinum 3";
  if (value === 15) return "Platinum 2";
  if (value === 16) return "Platinum 1";
  if (value === 17) return "Diamond 4";
  if (value === 18) return "Diamond 3";
  if (value === 19) return "Diamond 2";
  if (value === 20) return "Diamond 1";
  if (value === 21) return "Emerald 4";
  if (value === 22) return "Emerald 3";
  if (value === 23) return "Emerald 2";
  return "Emerald 1";
}
  
  function updateRankDisplay(id, value, isWorldTour = false) {
    const wrapper = document.getElementById(id);
    if (!wrapper) return;
    const rankName = wrapper.querySelector(".rank-name");
    const rankNum = wrapper.querySelector(".rank-number");
    const rank = isWorldTour ? getWorldTourRank(value) : getRank(value);
    const baseRank = rank.split(' ')[0].toLowerCase();
    wrapper.className = baseRank;
    rankName.textContent = rank;
    rankNum.textContent = value;
  }
  
  function calculatePrice(isWorldTour = false) {
    const startId = isWorldTour ? "startRankWT" : "startRank";
    const endId = isWorldTour ? "endRankWT" : "endRank";
    const resultId = isWorldTour ? "calcResultWT" : "calcResult";
    const startValId = isWorldTour ? "startValueWT" : "startValue";
    const endValId = isWorldTour ? "endValueWT" : "endValue";
    
    const startVal = parseInt(document.getElementById(startId).value);
    const endVal = parseInt(document.getElementById(endId).value);
    const resultBox = document.getElementById(resultId);
    
    updateRankDisplay(startValId, startVal, isWorldTour);
    updateRankDisplay(endValId, endVal, isWorldTour);
    
    if (endVal <= startVal) {
      resultBox.innerHTML = "⚠ Target must be higher than current";
      return;
    }
    
    let total = 0;
    
    if (isWorldTour) {
      const typeKey = selectedTypeWT.replace('-wt', '');
      const pricing = worldTourPricing[typeKey];
      total = pricing[endVal] - pricing[startVal];
    } else {
      const tiers = rankTiers[selectedType];
      Object.values(tiers).forEach(tier => {
        if (startVal < tier.end && endVal > tier.start) {
          const rangeStart = Math.max(startVal, tier.start);
          const rangeEnd = Math.min(endVal, tier.end);
          const tierFraction = (rangeEnd - rangeStart) / (tier.end - tier.start);
          total += tier.price * tierFraction;
        }
      });
    }
    
const typeKey = isWorldTour ? selectedTypeWT.replace('-wt', '') : selectedType;
const priceMultiplier = typeKey === "selfplay" ? 2 : 1;
const wtDiscount = isWorldTour ? 0.81 : 1;
const originalPrice = Math.round(total * priceMultiplier * wtDiscount);
const discounted = Math.round(originalPrice * 0.95); // 5% off
const withLivestream = Math.round(discounted * 1.2); // +20% for livestream
    
    resultBox.innerHTML = `
      <div style="font-size: 1.2rem; font-weight: 800; color: #fff; margin-bottom: 0.75rem;">
        <div style="text-decoration: line-through; color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 0.25rem;">
          ${originalPrice} €
        </div>
        <div style="color: var(--accent);">
          Total Price: ${discounted} €
        </div>
      </div>
      <div style="font-size: 0.9rem; color: var(--text-secondary);">
        +20% live stream: <span style="color: var(--accent); font-weight: 600;">${withLivestream} €</span>
      </div>
    `;
  }
  
  function updateSliderFill(slider) {
    const value = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.background = `linear-gradient(to right, #ff6b35 ${value}%, rgba(255,255,255,0.2) ${value}%)`;
  }
  
  window.addEventListener("DOMContentLoaded", () => {
    // Mode Toggle (Ranked/World Tour)
    const modeToggleBtns = document.querySelectorAll('.mode-toggle-btn');
    modeToggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        modeToggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const mode = btn.dataset.mode;
        document.getElementById('ranked-content').style.display = mode === 'ranked' ? 'block' : 'none';
        document.getElementById('worldtour-content').style.display = mode === 'worldtour' ? 'block' : 'none';
        currentMode = mode;
        
        if (mode === 'ranked') {
          const rankedBtns = document.querySelectorAll('#ranked-content .toggle-btn');
          rankedBtns.forEach(b => b.classList.remove('active'));
          const driverBtn = document.querySelector('#ranked-content .toggle-btn[data-type="driver"]');
          if (driverBtn) {
            driverBtn.classList.add('active');
            selectedType = "driver";
            calculatePrice(false);
          }
        }
        
        if (mode === 'worldtour') {
          const wtButtons = document.querySelectorAll('#worldtour-content .toggle-btn');
          wtButtons.forEach(b => b.classList.remove('active'));
          const driverBtn = document.querySelector('#worldtour-content .toggle-btn[data-type="driver-wt"]');
          if (driverBtn) {
            driverBtn.classList.add('active');
            selectedTypeWT = "driver-wt";
            calculatePrice(true);
          }
        }
      });
    });
    
    // Ranked Mode
    const start = document.getElementById("startRank");
    const end = document.getElementById("endRank");
    const typeButtons = document.querySelectorAll('#ranked-content .toggle-btn');
    
    if (start && end) {
      start.addEventListener("input", () => {
        if (+end.value <= +start.value) end.value = +start.value + 250;
        updateSliderFill(start);
        updateSliderFill(end);
        calculatePrice(false);
      });
      end.addEventListener("input", () => {
        if (+end.value <= +start.value) end.value = +start.value + 250;
        updateSliderFill(start);
        updateSliderFill(end);
        calculatePrice(false);
      });
      
      typeButtons.forEach(btn => {
        btn.addEventListener("click", e => {
          e.preventDefault();
          typeButtons.forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          selectedType = btn.dataset.type;
          calculatePrice(false);
        });
      });
      
      updateSliderFill(start);
      updateSliderFill(end);
      calculatePrice(false);
    }
    
    // World Tour
    const startWT = document.getElementById("startRankWT");
    const endWT = document.getElementById("endRankWT");
    const typeButtonsWT = document.querySelectorAll('#worldtour-content .toggle-btn');
    
    if (startWT && endWT) {
      startWT.addEventListener("input", () => {
        if (+endWT.value <= +startWT.value) endWT.value = +startWT.value + 1;
        updateSliderFill(startWT);
        updateSliderFill(endWT);
        calculatePrice(true);
      });
      endWT.addEventListener("input", () => {
        if (+endWT.value <= +startWT.value) endWT.value = +startWT.value + 1;
        updateSliderFill(startWT);
        updateSliderFill(endWT);
        calculatePrice(true);
      });
      
      typeButtonsWT.forEach(btn => {
        btn.addEventListener("click", e => {
          e.preventDefault();
          typeButtonsWT.forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          selectedTypeWT = btn.dataset.type;
          calculatePrice(true);
        });
      });
      
          }
  });

/* ---------- */

(function() {
  // Add reveal classes to sections
  const targets = [
    '.stat-card', '.service-card', '.process-step', '.payment-card',
    '.testimonial-card', '.faq-item', '.account-card', '.order-card',
    '.pricing-card', '.section-header'
  ];

  targets.forEach((selector, si) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = (i * 0.07) + 's';
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Add number counter animation to stat numbers
  function animateCount(el, target, isText) {
    if (isText) { el.textContent = target; return; }
    const num = parseFloat(target);
    if (isNaN(num)) { el.textContent = target; return; }
    const suffix = target.replace(/[\d.]/g, '');
    let start = 0;
    const dur = 1200;
    const startTime = performance.now();
    function update(now) {
      const p = Math.min((now - startTime) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const val = Math.round(num * ease);
      el.textContent = val + suffix;
      if (p < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const raw = el.dataset.target || el.textContent.trim();
        el.dataset.target = raw;
        const numeric = raw.replace(/[^0-9.]/g, '');
        animateCount(el, raw, !numeric);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

  // Add subtle cursor glow effect on hover for cards
  const glowCards = document.querySelectorAll('.service-card, .stat-card, .payment-card, .account-card');
  glowCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255,90,26,0.06) 0%, rgba(13,13,13, rgba(13,13,13,0) 100%)\`;
    });
  });
})();
