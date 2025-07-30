document.addEventListener("DOMContentLoaded", () => {
  const questions = document.querySelectorAll(".faq-question");

  questions.forEach((btn) => {
    btn.addEventListener("click", () => {
      const answer = btn.nextElementSibling;

      document.querySelectorAll(".faq-answer").forEach((a) => {
        if (a !== answer) a.style.display = "none";
      });

      answer.style.display = answer.style.display === "block" ? "none" : "block";
    });
  });
});
