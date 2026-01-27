// App State
let currentState = {
  mode: null,
  currentQuestionIndex: 0,
  score: 0,
  startTime: null,
  timerInterval: null,
  questions: [],
  answers: [],
};

// Questions Database
const questionsDB = {
  kids: [
    {
      text: "Hangi meyve kırmızıdır?",
      options: ["Muz", "Elma", "Portakal", "Kivi"],
      correct: 1,
      type: "visual",
    },
    {
      text: "1, 2, 3, ... Boşluğa ne gelmeli?",
      options: ["4", "5", "6", "0"],
      correct: 0,
      type: "logic",
    },
    {
      text: "Tavşan ne yemeyi sever?",
      options: ["Peynir", "Balık", "Havuç", "Et"],
      correct: 2,
      type: "logic",
    },
  ],
  adults: [
    {
      text: "2, 4, 8, 16, ? serisinde soru işareti yerine ne gelmelidir?",
      options: ["20", "24", "32", "64"],
      correct: 2,
      type: "math",
    },
    {
      text: "Kitap / Okumak :: Müzik / ?",
      options: ["Dinlemek", "Yazmak", "Görmek", "Yemek"],
      correct: 0,
      type: "analogy",
    },
    {
      text: "Hangi kelime diğerlerinden farklıdır?",
      options: ["Aslan", "Kaplan", "Kedi", "Kartal"],
      correct: 3,
      type: "logic",
    },
  ],
};

// DOM Elements
const screens = {
  welcome: document.getElementById("screen-welcome"),
  test: document.getElementById("screen-test"),
  results: document.getElementById("screen-results"),
};

// --- Initialization ---

function startTest(mode) {
  currentState.mode = mode;
  currentState.questions = questionsDB[mode];
  currentState.currentQuestionIndex = 0;
  currentState.score = 0;
  currentState.answers = [];
  currentState.startTime = Date.now();

  showScreen("test");
  renderQuestion();
  startTimer();
}

function showScreen(screenId) {
  Object.keys(screens).forEach((id) => {
    screens[id].style.display = id === screenId ? "block" : "none";
  });
}

// --- Test Logic ---

function renderQuestion() {
  const question = currentState.questions[currentState.currentQuestionIndex];
  const container = document.getElementById("question-container");
  const qNum = document.getElementById("question-number");
  const progress = document.getElementById("progress");

  qNum.innerText = `Soru ${currentState.currentQuestionIndex + 1}/${currentState.questions.length}`;
  progress.style.width = `${(currentState.currentQuestionIndex / currentState.questions.length) * 100}%`;

  container.innerHTML = `
        <h3 style="margin-bottom: 1.5rem; line-height: 1.4;">${question.text}</h3>
        <div class="option-grid">
            ${question.options
              .map(
                (opt, i) => `
                <button class="btn btn-secondary" onclick="handleAnswer(${i})">${opt}</button>
            `,
              )
              .join("")}
        </div>
    `;
}

function handleAnswer(index) {
  const question = currentState.questions[currentState.currentQuestionIndex];
  const isCorrect = index === question.correct;

  if (isCorrect) currentState.score++;

  currentState.answers.push({
    questionIndex: currentState.currentQuestionIndex,
    isCorrect: isCorrect,
    timeTaken:
      (Date.now() - (currentState.lastQuestionTime || currentState.startTime)) /
      1000,
  });

  currentState.lastQuestionTime = Date.now();

  if (currentState.currentQuestionIndex < currentState.questions.length - 1) {
    currentState.currentQuestionIndex++;
    renderQuestion();
  } else {
    finishTest();
  }
}

function startTimer() {
  const timerEl = document.getElementById("timer");
  clearInterval(currentState.timerInterval);

  currentState.timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - currentState.startTime) / 1000);
    const mins = Math.floor(elapsed / 60)
      .toString()
      .padStart(2, "0");
    const secs = (elapsed % 60).toString().padStart(2, "0");
    timerEl.innerText = `⏱️ ${mins}:${secs}`;
  }, 1000);
}

function finishTest() {
  clearInterval(currentState.timerInterval);
  const totalTime = (Date.now() - currentState.startTime) / 1000;

  // IQ Calculation Logic (simplified for demo)
  // Base IQ: 100
  // Correct answer: +10
  // Speed bonus: + (average time vs goal time)
  const baseIQ = currentState.mode === "kids" ? 90 : 85;
  const perAnswer = 15;
  const timeBonus = Math.max(0, 30 - totalTime / currentState.questions.length); // Bonus for faster answers

  let rawIQ = baseIQ + currentState.score * perAnswer + timeBonus * 2;
  const finalIQ = Math.round(Math.min(160, Math.max(70, rawIQ)));

  displayResults(finalIQ);
  saveToHistory(finalIQ);
}

function displayResults(iq) {
  showScreen("results");
  document.getElementById("iq-score").innerText = iq;

  let feedback = "";
  if (iq > 140)
    feedback = "Sen bir dahisin! Muazzam bir mantıksal kapasiteye sahipsin.";
  else if (iq > 120)
    feedback = "Üstün zekalı! Problem çözme becerilerin çok etkileyici.";
  else if (iq > 100)
    feedback = "Ortalamanın üzerinde. Zihnini harika kullanıyorsun.";
  else
    feedback =
      "Harika bir deneme! Daha fazla pratikle zihnini keskinleştirebilirsin.";

  document.getElementById("result-text").innerText = feedback;
}

// --- History Storage ---

function saveToHistory(iq) {
  let history = JSON.parse(localStorage.getItem("iq_history") || "[]");
  history.push({
    iq: iq,
    date: new Date().toLocaleDateString("tr-TR"),
    mode: currentState.mode,
  });
  localStorage.setItem("iq_history", JSON.stringify(history));
}

function viewHistory() {
  let history = JSON.parse(localStorage.getItem("iq_history") || "[]");
  if (history.length === 0) {
    alert("Henüz bir test tamamlamadın!");
    return;
  }

  let historyContent = history
    .map(
      (h) =>
        `${h.date} - ${h.mode === "kids" ? "Çocuk" : "Yetişkin"}: ${h.iq} IQ`,
    )
    .join("\n");
  alert("Geçmiş Skorların:\n" + historyContent);
}

function restart() {
  showScreen("welcome");
}
