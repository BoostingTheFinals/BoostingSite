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

