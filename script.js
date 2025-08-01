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
