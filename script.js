let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 900; // 15 minutes

fetch('polity_questions.json')
  .then(res => res.json())
  .then(data => {
    questions = data.sort(() => 0.5 - Math.random()).slice(0, 25);
    startTimer();
    displayQuestion();
  });

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    document.getElementById("timer").innerText = `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      endQuiz();
    }
  }, 1000);
}

function displayQuestion() {
  const current = questions[currentQuestionIndex];
  document.getElementById("question").innerText = current.question;
  document.getElementById("options").innerHTML = current.options
    .map(opt => `<button onclick="checkAnswer(this, '${opt}')">${opt}</button>`).join("");
  document.getElementById("explanation").innerText = "";
  document.getElementById("next-btn").style.display = "none";
}

function checkAnswer(button, selected) {
  const current = questions[currentQuestionIndex];
  const buttons = document.querySelectorAll("#options button");

  buttons.forEach(btn => {
    btn.disabled = true;
    if (btn.innerText === current.answer) btn.classList.add("correct");
    else if (btn.innerText === selected) btn.classList.add("incorrect");
  });

  document.getElementById("explanation").innerText = current.explanation;

  if (selected === current.answer) {
    score++;
    document.getElementById("score").innerText = "Score: " + score;
  }

  document.getElementById("next-btn").style.display = "block";
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) displayQuestion();
  else endQuiz();
}

function endQuiz() {
  clearInterval(timer);
  const trophy = score >= 22 ? "Gold" : score >= 15 ? "Silver" : "Bronze";
  document.getElementById("quiz-container").innerHTML = `
    <h2>Quiz Completed!</h2>
    <p>Your Final Score: ${score}/25</p>
    <p>You won a <strong>${trophy} Trophy</strong>!</p>`;
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
}