document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    const answer = button.nextElementSibling;
    const icon = button.querySelector('span');

    button.setAttribute('aria-expanded', !expanded);

    if (!expanded) {
      answer.classList.add('open');
      // answer.removeAttribute('hidden'); // No hidden attribute now
      icon.textContent = '−';
    } else {
      answer.classList.remove('open');
      // answer.setAttribute('hidden', ''); // No hidden attribute now
      icon.textContent = '+';
    }
  });
});

const priceTiers = [
  { min: 0, max: 10000, price: 6.0 },
  { min: 10000, max: 20000, price: 1.8 },
  { min: 20000, max: 30000, price: 1.5 },
  { min: 30000, max: 40000, price: 6.0 },
  { min: 40000, max: 52000, price: 18.2 },
];

function calculatePrice() {
  const current = parseInt(document.getElementById("currentRS").value);
  const desired = parseInt(document.getElementById("desiredRS").value);
  const result = document.getElementById("priceResult");

  if (!result) return; // Safety check

  if (isNaN(current) || isNaN(desired) || current >= desired) {
    result.innerText = "Please enter valid RS values.";
    return;
  }

  let total = 0;
  for (const tier of priceTiers) {
    const from = Math.max(current * 1000, tier.min);
    const to = Math.min(desired * 1000, tier.max);
    if (to > from) {
      total += ((to - from) / 1000) * tier.price;
    }
  }

  result.innerText = `Estimated Price: €${total.toFixed(2)}`;
}
