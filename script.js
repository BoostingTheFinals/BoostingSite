// Pricing Calculator (existing code)
const blockPrices = [
  { min: 0, max: 10000, price: 6 },
  { min: 10000, max: 20000, price: 15 },
  { min: 20000, max: 30000, price: 35 },
  { min: 30000, max: 40000, price: 60 },
  { min: 40000, max: 52000, price: 230 },
];

function calculatePrice() {
  const currentInput = parseFloat(document.getElementById("currentRS").value);
  const desiredInput = parseFloat(document.getElementById("desiredRS").value);
  const result = document.getElementById("priceResult");

  if (!result) return;

  if (
    isNaN(currentInput) ||
    isNaN(desiredInput) ||
    currentInput >= desiredInput ||
    currentInput < 0 ||
    desiredInput > 52
  ) {
    result.innerText = "Please enter valid RS values (0-52).";
    result.style.color = "#ff6b6b";
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

  result.innerText = `Total Price: €${total.toFixed(2)}`;
  result.style.color = "#00ffff";
}

// FAQ Functionality
document.addEventListener('DOMContentLoaded', function() {
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
});

// Auto-calculate price when inputs change
document.addEventListener('DOMContentLoaded', function() {
  const currentInput = document.getElementById("currentRS");
  const desiredInput = document.getElementById("desiredRS");
  
  if (currentInput && desiredInput) {
    currentInput.addEventListener('input', calculatePrice);
    desiredInput.addEventListener('input', calculatePrice);
  }
});

// Account purchase function
function buyAccount(accountType) {
  const subject = encodeURIComponent(`Account Purchase Inquiry - ${accountType}`);
  const body = encodeURIComponent(`Hi, I'm interested in purchasing the ${accountType} account. Please provide more details about the purchase process.`);
  window.location.href = `mailto:boostingthefinals@gmail.com?subject=${subject}&body=${body}`;
}

// Discord name copy function
function copyDiscordName() {
  const discordName = 'boostingthefinals';
  
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(discordName).then(() => {
      alert('Discord username copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
      fallbackCopyTextToClipboard(discordName);
    });
  } else {
    fallbackCopyTextToClipboard(discordName);
  }
}

function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";
  
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      alert('Discord username copied to clipboard!');
    } else {
      alert('Failed to copy Discord username');
    }
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
    alert('Failed to copy Discord username');
  }
  
  document.body.removeChild(textArea);
}
