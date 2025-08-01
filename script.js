// Pricing Calculator
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

  result.innerText = `Estimated Price: €${total.toFixed(2)}`;
  result.style.color = "#00ffff";
}

// FAQ Accordion
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      const answer = button.nextElementSibling;
      const icon = button.querySelector('.faq-icon');

      button.setAttribute('aria-expanded', !expanded);

      if (!expanded) {
        answer.classList.add('open');
        icon.textContent = '−';
      } else {
        answer.classList.remove('open');
        icon.textContent = '+';
      }
    });
  });

  // Price calculator event listeners
  document.getElementById("currentRS").addEventListener("input", calculatePrice);
  document.getElementById("desiredRS").addEventListener("input", calculatePrice);
});

// Utility functions
function buyAccount(accountId) {
  alert("To purchase account ID: " + accountId + ", please contact us via Discord or email.");
}

function copyDiscordName() {
  navigator.clipboard.writeText('boostingthefinals').then(() => {
    alert('Discord name copied to clipboard!');
  }).catch(() => {
    alert('Discord: boostingthefinals');
  });
}
