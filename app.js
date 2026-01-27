// --- Elite+ v2 IQ Test Engine ---

let currentState = {
    mode: null,
    currentQuestionIndex: 0,
    score: 0,
    startTime: null,
    timerInterval: null,
    questions: [],
    totalQuestions: 20,
    categoryScores: { Mantık: 0, Matematik: 0, Görsel: 0, Sözel: 0 },
    categoryTotal: { Mantık: 0, Matematik: 0, Görsel: 0, Sözel: 0 },
    testStartTime: null,
    earnedBadges: []
};

// --- Achievements (Badges) Definitions ---
const ALL_BADGES = [
    { id: 'speed_demon', name: 'Hız İblisi', icon: '⚡', desc: 'Bir soruyu 3 saniyeden kısa sürede çöz!' },
    { id: 'perfect_score', name: 'Kusursuz Ruh', icon: '💎', desc: '20/20 doğru cevapla testi bitir.' },
    { id: 'math_genius', name: 'Matematik Dehası', icon: '🔢', desc: 'Matematik kategorisinde %100 başarı sağla.' },
    { id: 'logic_master', name: 'Mantık Ustası', icon: '🧠', desc: 'Mantık sorularının tamamını doğru çöz.' },
    { id: 'daily_hero', name: 'Günlük Kahraman', icon: '🌟', desc: 'Günlük görevi başarıyla tamamla.' },
    { id: 'early_bird', name: 'Erkenci Kuş', icon: '🌅', desc: 'Sabah saatlerinde bir test çöz.' }
];

// --- Enhanced Question Database (Cognitive Based) ---
const questionsDB = {
    kids: [
        // Görsel Hafıza & Desen
        { text: "Şu deseni aklında tut: 🟥 🟦 🟥. Sence bir sonraki ne olmalı?", options: ["🟦", "🟥", "🟢", "🟡"], correct: 0, cat: "Görsel" },
        { text: "Şekil Döndürme: ⬅️ okunu sağa çevirirsek hangisi olur?", options: ["⬆️", "➡️", "⬇️", "⬅️"], correct: 1, cat: "Görsel" },
        { text: "Hangi parça eksik?\n[ 🌕 🌑 ] [ 🌕 ? ]", options: ["🌑", "🌕", "⭐", "☀️"], correct: 0, cat: "Görsel" },
        { text: "Büyükten küçüğe sıralarsak en sonda hangisi olur?", options: ["🐘 Fil", "🐈 Kedi", "🐜 Karınca", "🐇 Tavşan"], correct: 2, cat: "Mantık" },
        { text: "Gölgeyi bul: Bir üçgenin (🔺) gölgesi hangisi olabilir?", options: ["🔻", "⬛", "🔵", "🔺"], correct: 3, cat: "Görsel" },
        { text: "Eğer Elma meyveyse, Havuç nedir?", options: ["Meyve", "Sebze", "İçecek", "Tatlı"], correct: 1, cat: "Mantık" },
        { text: "Hangi kutuda daha çok top var?\n[⚽⚽] [🏀🏀🏀] [🎾]", options: ["Birinci", "İkinci", "Üçüncü", "Hepsi aynı"], correct: 1, cat: "Matematik" },
        { text: "Piyano : Müzisyen :: Fırça : ?", options: ["Ressam", "Aşçı", "İşçi", "Şoför"], correct: 0, cat: "Sözel" },
        { text: "Hangi sayı diğerlerinden büyüktür?", options: ["8", "12", "5", "9"], correct: 1, cat: "Matematik" },
        { text: "Akşam olunca gökyüzünde ne görürüz?", options: ["☀️ Güneş", "🌙 Ay", "🌈 Gökkuşağı", "☁️ Beyaz Bulut"], correct: 1, cat: "Mantık" },
        // Daha Zorlayıcı Çocuk Soruları
        { text: "Ayna Görüntüsü: 'b' harfinin aynadaki hali hangisidir?", options: ["p", "d", "q", "b"], correct: 1, cat: "Görsel" },
        { text: "Eğer 1 elma 2 portakala eşitse, 2 elma kaç portakal eder?", options: ["2", "3", "4", "5"], correct: 2, cat: "Matematik" },
        { text: "Mantık Zinciri: Ali Ayşe'den uzun, Ayşe ise Mehmet'ten uzun. En kısa kim?", options: ["Ali", "Ayşe", "Mehmet", "Bilinemez"], correct: 2, cat: "Mantık" },
        { text: "Hangisi sese duyarlıdır?", options: ["Göz", "Burun", "Kulak", "El"], correct: 2, cat: "Mantık" },
        { text: "Tersini Bul: 🧊 Soğuk :: 🔥 ?", options: ["Sıcak", "Islak", "Kuru", "Yumuşak"], correct: 0, cat: "Sözel" },
        { text: "Hangi eşleşme yanlıştır?", options: ["🐶-Hav", "🐱-Cik", "🐮-Möö", "🐑-Mee"], correct: 1, cat: "Mantık" },
        { text: "Bir haftada kaç gün vardır?", options: ["5", "6", "7", "8"], correct: 2, cat: "Matematik" },
        { text: "Kırmızı + Sarı = ?", options: ["Yeşil", "Turuncu", "Mor", "Siyah"], correct: 1, cat: "Görsel" },
        { text: "Hangisi bir ulaşım aracı değildir?", options: ["🚗 Araba", "🏡 Ev", "✈️ Uçak", "🚢 Gemi"], correct: 1, cat: "Mantık" },
        { text: "Gökyüzü neden mavidir?", options: ["Deniz yansıdığı için", "Işık kırıldığı için", "Bulutlar olduğu için", "Boyandığı için"], correct: 1, cat: "Mantık" }
    ],
    adults: [
      // (Önceki yetişkin soruları aynen korunabilir veya daha da zorlaştırılabilir)
      { text: "Bir gölde nilüfer çiçekleri her gün iki katına çıkar. 48 günde gölü kaplıyorsa, yarısını kaç günde kaplar?", options: ["24", "46", "47", "12"], correct: 2, cat: "Mantık" },
      { text: "3, 6, 12, 24, ? serisini tamamlayın.", options: ["36", "48", "60", "72"], correct: 1, cat: "Matematik" },
      // ... (Genişletilmiş 50+ veritabanı buraya entegre edilir)
      { text: "121, 144, 169, 196, ?", options: ["215", "225", "256", "240"], correct: 1, cat: "Matematik" },
      { text: "Saat 03:15'te akrep ile yelkovan arasındaki açı?", options: ["0°", "7.5°", "15°", "2.5°"], correct: 1, cat: "Matematik" },
      { text: "Hangi sayı seriyi tamamlar? 1, 1, 2, 3, 5, 8, ?", options: ["11", "12", "13", "14"], correct: 2, cat: "Matematik" },
      { text: "Analoji: Paradoks / Çelişki :: Analoji / ?", options: ["Benzerlik", "Farklılık", "Eş anlam", "Zıtlık"], correct: 0, cat: "Sözel" },
      { text: "Matris:\n[ ⚫ ⚪ ] [ ⚪ ⚫ ]\n[ ⚫ ⚫ ] [ ? ]", options: ["⚪ ⚪", "⚫ ⚫", "⚫ ⚪", "⚪ ⚫"], correct: 0, cat: "Görsel" },
      { text: "Tüm A'lar B ise, bazı B'ler A mıdır?", options: ["Kesinlikle", "Hayır", "Belki", "Bilinemez"], correct: 0, cat: "Mantık" },
      { text: "Ekmek : Buğday :: Şarap : ?", options: ["Elma", "Üzüm", "Armut", "Kiraz"], correct: 1, cat: "Sözel" },
      { text: "Dünya'nın en yüksek dağı?", options: ["Ağrı", "Everest", "K2", "Lhotse"], correct: 1, cat: "Mantık" },
      { text: "Bir baba 34, oğlu 8 yaşında. Kaç yıl sonra babası oğlunun 3 katı olur?", options: ["4", "5", "6", "7"], correct: 1, cat: "Matematik" },
      { text: "Bir senede kaç hafta vardır?", options: ["50", "51", "52", "53"], correct: 2, cat: "Matematik" },
      { text: "Hangi element simgesi 'O'dur?", options: ["Altın", "Oksijen", "Gümüş", "Demir"], correct: 1, cat: "Matematik" },
      { text: "Hangisi bir asal sayı değildir?", options: ["17", "29", "51", "53"], correct: 2, cat: "Matematik" },
      { text: "LİMAN kelimesinden hangisi yazılamaz?", options: ["MAİL", "ALİN", "MALİ", "MANİ"], correct: 1, cat: "Sözel" },
      { text: "Geri Sayım: 100, 93, 86, 79, ?", options: ["71", "72", "73", "74"], correct: 1, cat: "Matematik" },
      { text: "Eğer 5 kedi 5 fareyi 5 dakikada yakalıyorsa, 100 kedi 100 fareyi kaç dakikada yakalar?", options: ["1", "5", "100", "50"], correct: 1, cat: "Mantık" },
      { text: "Zaman : Saat :: Sıcaklık : ?", options: ["Hava", "Termometre", "Güneş", "Derece"], correct: 1, cat: "Matematik" },
      { text: "Brazilya / Güney Amerika :: Mısır / ?", options: ["Asya", "Afrika", "Avrupa", "Okyanusya"], correct: 1, cat: "Mantık" },
      { text: "ABC : EFG :: 123 : ?", options: ["345", "456", "567", "678"], correct: 2, cat: "Matematik" }
    ]
};

// --- Daily Quest Initialization ---
function initDailyQuest() {
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem('last_quest_date');
    
    if (lastDate !== today) {
        const quests = ["110 IQ puanını aş!", "Testi 3 dakikadan kısa sürede bitir!", "Kusursuz (20/20) skor yap!", "Görsel kategorisinde tam puan al!"];
        const randomQuest = quests[Math.floor(Math.random() * quests.length)];
        localStorage.setItem('daily_quest_text', randomQuest);
        localStorage.setItem('last_quest_date', today);
        localStorage.setItem('daily_quest_done', 'false');
    }
    
    const questText = localStorage.getItem('daily_quest_text');
    const isDone = localStorage.getItem('daily_quest_done') === 'true';
    document.getElementById('quest-description').innerText = questText + (isDone ? " ✅" : "");
}

// --- App Navigation ---
function startTest(mode) {
    currentState.mode = mode;
    currentState.questions = shuffleArray([...questionsDB[mode]]).slice(0, currentState.totalQuestions);
    currentState.currentQuestionIndex = 0;
    currentState.score = 0;
    currentState.categoryScores = { Mantık: 0, Matematik: 0, Görsel: 0, Sözel: 0 };
    currentState.categoryTotal = { Mantık: 0, Matematik: 0, Görsel: 0, Sözel: 0 };
    currentState.testStartTime = Date.now();
    currentState.startTime = Date.now();
    currentState.earnedBadges = [];

    updateMascot('😊');
    showScreen('screen-test');
    renderQuestion();
    startTimer();
}

function showScreen(screenId) {
    ['screen-welcome', 'screen-test', 'screen-confirmation', 'screen-results', 'screen-badges'].forEach(id => {
        document.getElementById(id).style.display = id === screenId ? 'block' : 'none';
    });
}

function renderQuestion() {
    const question = currentState.questions[currentState.currentQuestionIndex];
    const container = document.getElementById('question-container');
    const qNum = document.getElementById('question-number');
    const progress = document.getElementById('progress');

    currentState.questionStartTime = Date.now();
    qNum.innerText = `Soru ${currentState.currentQuestionIndex + 1}/${currentState.questions.length}`;
    progress.style.width = `${((currentState.currentQuestionIndex) / currentState.questions.length) * 100}%`;
    currentState.categoryTotal[question.cat]++;

    container.innerHTML = `
        <div style="font-size: 0.8rem; font-weight: 800; color: var(--primary); text-transform: uppercase;">${question.cat}</div>
        <div class="question-text">${question.text.replace(/\n/g, '<br>')}</div>
        <div class="option-grid">
            ${question.options.map((opt, i) => `
                <button class="btn btn-secondary" onclick="handleAnswer(${i})">${opt}</button>
            `).join('')}
        </div>
    `;
}

function handleAnswer(index) {
    const question = currentState.questions[currentState.currentQuestionIndex];
    const timeTaken = (Date.now() - currentState.questionStartTime) / 1000;
    
    if (index === question.correct) {
        currentState.score++;
        currentState.categoryScores[question.cat]++;
        updateMascot('😎'); // Success mascot
        if (timeTaken < 3) grantBadge('speed_demon');
    } else {
        updateMascot('😟'); // Fail mascot
    }

    setTimeout(() => {
        if (currentState.currentQuestionIndex < currentState.questions.length - 1) {
            currentState.currentQuestionIndex++;
            renderQuestion();
            updateMascot('🦊');
        } else {
            showScreen('screen-confirmation');
            clearInterval(currentState.timerInterval);
        }
    }, 400);
}

function processResults() {
    const totalTime = (Date.now() - currentState.testStartTime) / 1000;
    const baseIQ = currentState.mode === 'kids' ? 88 : 78;
    const accuracy = (currentState.score / currentState.totalQuestions) * 85;
    const speedBonus = Math.max(0, 20 - (totalTime / 300) * 10);
    const finalIQ = Math.round(baseIQ + accuracy + speedBonus);

    // Badges Check
    if (currentState.score === 20) grantBadge('perfect_score');
    if (currentState.categoryScores['Matematik'] === 5) grantBadge('math_genius');
    if (currentState.categoryScores['Mantık'] === 5) grantBadge('logic_master');
    
    // Daily Quest check
    const questText = localStorage.getItem('daily_quest_text');
    if (questText.includes("IQ") && finalIQ > 105) completeDailyQuest();
    if (questText.includes("3 dakika") && totalTime < 180) completeDailyQuest();
    if (questText.includes("Kusursuz") && currentState.score === 20) completeDailyQuest();

    displayFinalResults(finalIQ);
}

function displayFinalResults(iq) {
    showScreen('screen-results');
    document.getElementById('iq-score').innerText = iq;
    
    const rankEl = document.getElementById('result-rank');
    let rank = "Zihin Kaşifi 🔍";
    if (iq > 145) rank = "Evrensel Deha 👑";
    else if (iq > 130) rank = "Üstün Zekalı 🎖️";
    else if (iq > 115) rank = "Strateji Ustası 🏆";
    else if (iq > 95) rank = "Mantık Uygulayıcı 📐";
    rankEl.innerText = rank;

    const bars = document.getElementById('ability-bars');
    bars.innerHTML = '';
    Object.keys(currentState.categoryScores).forEach(cat => {
        const total = currentState.categoryTotal[cat] || 1;
        const p = (currentState.categoryScores[cat] / total) * 100;
        bars.innerHTML += `<div class="ability-item"><div class="ability-label"><span>${cat}</span><span>%${Math.round(p)}</span></div><div class="ability-bar"><div class="ability-fill" style="width: ${p}%"></div></div></div>`;
    });

    renderEarnedBadges();
    saveToHistory(iq, rank);
}

// --- Badge Logic ---
function grantBadge(badgeId) {
    let earned = JSON.parse(localStorage.getItem('earned_badges') || '[]');
    if (!earned.includes(badgeId)) {
        earned.push(badgeId);
        localStorage.setItem('earned_badges', JSON.stringify(earned));
        currentState.earnedBadges.push(badgeId);
    }
}

function renderEarnedBadges() {
    const container = document.getElementById('earned-badges-session');
    container.innerHTML = currentState.earnedBadges.length > 0 ? '<p style="font-size: 0.8rem; width: 100%; margin-bottom: 0.5rem;">Bu testte kazandığın rozetler:</p>' : '';
    currentState.earnedBadges.forEach(id => {
        const badge = ALL_BADGES.find(b => b.id === id);
        container.innerHTML += `<div class="badge-item earned" title="${badge.name}: ${badge.desc}">${badge.icon}</div>`;
    });
}

function showBadgesScreen() {
    showScreen('screen-badges');
    const container = document.getElementById('full-badges-list');
    const earned = JSON.parse(localStorage.getItem('earned_badges') || '[]');
    container.innerHTML = '';
    ALL_BADGES.forEach(badge => {
        const isEarned = earned.includes(badge.id);
        container.innerHTML += `<div class="badge-item ${isEarned ? 'earned' : ''}" title="${badge.name}: ${badge.desc}">${badge.icon}</div>`;
    });
}

// --- Mascot & Helpers ---
function updateMascot(icon) {
    document.getElementById('mascot-face').innerText = icon;
}

function completeDailyQuest() {
    const isDone = localStorage.getItem('daily_quest_done') === 'true';
    if (!isDone) {
        localStorage.setItem('daily_quest_done', 'true');
        grantBadge('daily_hero');
        initDailyQuest();
    }
}

function startTimer() {
    const timerEl = document.getElementById('timer');
    if (currentState.timerInterval) clearInterval(currentState.timerInterval);
    currentState.timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - currentState.testStartTime) / 1000);
        timerEl.innerText = `⏱️ ${Math.floor(elapsed/60).toString().padStart(2,'0')}:${(elapsed%60).toString().padStart(2,'0')}`;
    }, 1000);
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function saveToHistory(iq, rank) {
    let h = JSON.parse(localStorage.getItem('iq_elite_history') || '[]');
    h.push({ iq, rank, date: new Date().toLocaleDateString('tr-TR') });
    localStorage.setItem('iq_elite_history', JSON.stringify(h.slice(-10)));
}

function viewHistory() { window.open('history.html', '_blank'); }
function restart() { initDailyQuest(); showScreen('screen-welcome'); updateMascot('🦊'); }

// Init
window.onload = initDailyQuest;
