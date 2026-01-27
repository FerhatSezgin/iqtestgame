// --- Elite IQ Test Engine ---

let currentState = {
    mode: null,
    currentQuestionIndex: 0,
    score: 0,
    startTime: null,
    timerInterval: null,
    questions: [],
    totalQuestionsPerTest: 20
};

// --- Professional Question Database (50+ Questions) ---
const questionsDB = {
    kids: [
        { text: "Hangi meyve kırmızıdır?", options: ["Muz", "Elma", "Portakal", "Kivi"], correct: 1 },
        { text: "1, 2, 3, ... Boşluğa ne gelmeli?", options: ["4", "5", "6", "0"], correct: 0 },
        { text: "Tavşan ne yemeyi sever?", options: ["Peynir", "Balık", "Havuç", "Et"], correct: 2 },
        { text: "Hangisi uçabilir?", options: ["Kedi", "Kuş", "Köpek", "Balık"], correct: 1 },
        { text: "Sarı + Mavi hangi rengi oluşturur?", options: ["Mor", "Turuncu", "Yeşil", "Siyah"], correct: 2 },
        { text: "Hangi hayvan ormanlar kralıdır?", options: ["Aslan", "Ayı", "Kurt", "Fil"], correct: 0 },
        { text: "Hangi mevsimde kar yağar?", options: ["Yaz", "İlkbahar", "Sonbahar", "Kış"], correct: 3 },
        { text: "Güneş nereden doğar?", options: ["Batı", "Doğu", "Kuzey", "Güney"], correct: 1 },
        { text: "Hangisi bir müzik aletidir?", options: ["Kalem", "Gitar", "Fırça", "Kaşık"], correct: 1 },
        { text: "Üçgenin kaç köşesi vardır?", options: ["2", "3", "4", "5"], correct: 1 },
        { text: "Hangi nesne suda yüzer?", options: ["Taş", "Demir anahtar", "Gemi", "Çivi"], correct: 2 },
        { text: "Piyanonun tuşları hangi renklerdir?", options: ["Kırmızı-Mavi", "Siyah-Beyaz", "Sarı-Yeşil", "Mor-Pembe"], correct: 1 },
        { text: "Hangi hayvan süt verir?", options: ["Aslan", "İnek", "Tavuk", "Yılan"], correct: 1 },
        { text: "Hangisi gökyüzünde bulunur?", options: ["Balık", "Bulut", "Araba", "Ağaç"], correct: 1 },
        { text: "Kare şeklinin kaç kenarı vardır?", options: ["3", "4", "5", "6"], correct: 1 },
        { text: "Hangisi bir sebzedir?", options: ["Elma", "Ispanak", "Çilek", "Karpuz"], correct: 1 },
        { text: "Hangi organımızla duyarız?", options: ["Burun", "Göz", "Kulak", "Dil"], correct: 2 },
        { text: "Arı ne yapar?", options: ["Süt", "Bal", "Peynir", "Ekmek"], correct: 1 },
        { text: "Gökkuşağında kaç renk vardır?", options: ["5", "6", "7", "8"], correct: 2 },
        { text: "Hangisi bir taşıttır?", options: ["Ev", "Otobüs", "Ağaç", "Kitap"], correct: 1 },
        { text: "Hangi hayvan 'Miyav' der?", options: ["Köpek", "Kuş", "Kedi", "At"], correct: 2 },
        { text: "Hangisi soğuktur?", options: ["Ateş", "Çay", "Dondurma", "Güneş"], correct: 2 },
        { text: "Ayakkabı nereye giyilir?", options: ["Elinize", "Ayağınıza", "Başınıza", "Belinize"], correct: 1 },
        { text: "Gökyüzü ne renktir?", options: ["Mavi", "Yeşil", "Kırmızı", "Sarı"], correct: 0 },
        { text: "Hangisi bir tatlıdır?", options: ["Turşu", "Pasta", "Ekmek", "Tuz"], correct: 1 }
    ],
    adults: [
        { text: "2, 4, 8, 16, ? serisinde soru işareti yerine ne gelmelidir?", options: ["20", "24", "32", "64"], correct: 2 },
        { text: "Kitap / Okumak :: Müzik / ?", options: ["Dinlemek", "Yazmak", "Görmek", "Yemek"], correct: 0 },
        { text: "Hangi kelime diğerlerinden farklıdır?", options: ["Aslan", "Kaplan", "Kedi", "Kartal"], correct: 3 },
        { text: "Eğer tüm A'lar B ise ve tüm B'ler C ise, tüm A'lar C midir?", options: ["Evet", "Hayır", "Belirsiz", "Hiçbiri"], correct: 0 },
        { text: "Bir maratonda ikinciyi geçersen kaçıncı olursun?", options: ["Birinci", "İkinci", "Üçüncü", "Sonuncu"], correct: 1 },
        { text: "Hangi sayı diğerlerinden farklıdır?", options: ["13", "17", "19", "21"], correct: 3 },
        { text: "Terzi / İğne :: Ressam / ?", options: ["Tuval", "Fırça", "Boya", "Resim"], correct: 1 },
        { text: "1'den 100'e kadar kaç tane 9 rakamı vardır?", options: ["10", "11", "19", "20"], correct: 3 },
        { text: "3 katlı bir binada zemin katta 4 kişi, 1. katta 8 kişi, 2. katta 16 kişi yaşıyor. Asansör en çok hangi tuşa basılarak çağrılır?", options: ["Zemin", "1. Kat", "2. Kat", "Hepsine eşit"], correct: 0 },
        { text: "Hangi ayda 28 gün vardır?", options: ["Sadece Şubat", "Ocak", "Aralık", "Hepsinde"], correct: 3 },
        { text: "Ekmek / Buğday :: Şarap / ?", options: ["Elma", "Üzüm", "Armut", "Kiraz"], correct: 1 },
        { text: "Görsel Soru: Aşağıdaki örüntüyü tamamlayın: 🟦 🟦 🟧 🟦 🟦 ?", options: ["🟦", "🟧", "🟨", "🟥"], correct: 1 },
        { text: "Hangi ülke diğerlerinden farklı bir kıtadadır?", options: ["Brezilya", "Arjantin", "Şili", "Mısır"], correct: 3 },
        { text: "Bir baba 34, oğlu 8 yaşındadır. Kaç yıl sonra babanın yaşı oğlunun yaşının 3 katı olur?", options: ["4", "5", "6", "7"], correct: 1 },
        { text: "Zaman / Saat :: Sıcaklık / ?", options: ["Derece", "Termometre", "Güneş", "Hava"], correct: 1 },
        { text: "Hangi sayı seriyi tamamlar? 1, 1, 2, 3, 5, 8, ?", options: ["11", "12", "13", "14"], correct: 2 },
        { text: "Karanlık / Işık :: Sessizlik / ?", options: ["Gürültü", "Müzik", "Konuşma", "Huzur"], correct: 0 },
        { text: "Türkiye'nin başkenti hangisidir?", options: ["İstanbul", "Ankara", "İzmir", "Antalya"], correct: 1 },
        { text: "Dünya'nın en yüksek dağı hangisidir?", options: ["Ağrı", "Everest", "Lhotse", "K2"], correct: 1 },
        { text: "Hangisi asal sayı değildir?", options: ["2", "3", "7", "9"], correct: 3 },
        { text: "Bir saatte kaç saniye vardır?", options: ["60", "360", "3600", "6000"], correct: 2 },
        { text: "Hangi elementin simgesi 'O' dur?", options: ["Altın", "Oksijen", "Gümüş", "Demir"], correct: 1 },
        { text: "En küçük kıta hangisidir?", options: ["Asya", "Avrupa", "Avustralya", "Antarktika"], correct: 2 },
        { text: "Güneş sistemindeki en büyük gezegen hangisidir?", options: ["Dünya", "Mars", "Jüpiter", "Satürn"], correct: 2 },
        { text: "Hangi sayı diğerlerinden büyüktür? 0.5, 1/4, 0.75, 2/3", options: ["0.5", "1/4", "0.75", "2/3"], correct: 2 }
    ]
};

// --- Initialization & Navigation ---

function startTest(mode) {
    currentState.mode = mode;
    // Shuffle and pick 20
    currentState.questions = shuffleArray([...questionsDB[mode]]).slice(0, currentState.totalQuestionsPerTest);
    currentState.currentQuestionIndex = 0;
    currentState.score = 0;
    currentState.startTime = Date.now();
    
    showScreen('screen-test');
    renderQuestion();
    startTimer();
}

function showScreen(screenId) {
    ['screen-welcome', 'screen-test', 'screen-results'].forEach(id => {
        document.getElementById(id).style.display = id === screenId ? 'block' : 'none';
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// --- Test Core ---

function renderQuestion() {
    const question = currentState.questions[currentState.currentQuestionIndex];
    const container = document.getElementById('question-container');
    const qNum = document.getElementById('question-number');
    const progress = document.getElementById('progress');

    qNum.innerText = `Soru ${currentState.currentQuestionIndex + 1}/${currentState.questions.length}`;
    progress.style.width = `${((currentState.currentQuestionIndex) / currentState.questions.length) * 100}%`;

    // Animation Effect
    container.style.opacity = 0;
    container.style.transform = "translateX(20px)";
    
    setTimeout(() => {
        container.innerHTML = `
            <div class="question-text">${question.text}</div>
            <div class="option-grid">
                ${question.options.map((opt, i) => `
                    <button class="btn btn-secondary" onclick="handleAnswer(${i})">${opt}</button>
                `).join('')}
            </div>
        `;
        container.style.opacity = 1;
        container.style.transform = "translateX(0)";
    }, 50);
}

function handleAnswer(index) {
    const question = currentState.questions[currentState.currentQuestionIndex];
    if (index === question.correct) currentState.score++;
    
    if (currentState.currentQuestionIndex < currentState.questions.length - 1) {
        currentState.currentQuestionIndex++;
        renderQuestion();
    } else {
        finishTest();
    }
}

function startTimer() {
    const timerEl = document.getElementById('timer');
    if (currentState.timerInterval) clearInterval(currentState.timerInterval);
    
    currentState.timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - currentState.startTime) / 1000);
        const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const secs = (elapsed % 60).toString().padStart(2, '0');
        timerEl.innerText = `⏱️ ${mins}:${secs}`;
    }, 1000);
}

function finishTest() {
    clearInterval(currentState.timerInterval);
    const totalTime = (Date.now() - currentState.startTime) / 1000;
    
    // IQ Puanı Hesaplama: Doğruluk + Hız Primi
    const baseIQ = currentState.mode === 'kids' ? 80 : 70;
    const accuracyPoints = (currentState.score / currentState.questions.length) * 80;
    const speedBonus = Math.max(0, 20 - (totalTime / 180) * 10); // 3 dakika bazlı hız primi
    
    const finalIQ = Math.round(baseIQ + accuracyPoints + speedBonus);
    
    displayResults(finalIQ);
    saveToHistory(finalIQ);
}

function displayResults(iq) {
    showScreen('screen-results');
    document.getElementById('iq-score').innerText = iq;
    
    let feedback = "";
    if (iq > 145) feedback = "🚨 DEHA SEVİYESİ! Zihinsel kapasiteniz olağanüstü.";
    else if (iq > 130) feedback = "🌟 Üstün Zekalı! Karmaşık problemleri çözmede çok yeteneklisiniz.";
    else if (iq > 115) feedback = "💎 Yüksek Zeka. Standartların oldukça üzerindesiniz.";
    else if (iq > 90) feedback = "✅ Ortalama Zeka. Sağlıklı ve dengeli bir bilişsel yapı.";
    else feedback = "📚 Geliştirilebilir. Bol bol zeka oyunları çözerek zihnini tazeleyebilirsin.";
    
    document.getElementById('result-text').innerText = feedback;
}

// --- History & Storage ---

function saveToHistory(iq) {
    let history = JSON.parse(localStorage.getItem('iq_pro_history') || '[]');
    history.push({
        iq: iq,
        date: new Date().toLocaleDateString('tr-TR'),
        mode: currentState.mode === 'kids' ? 'Çocuk' : 'Yetişkin'
    });
    localStorage.setItem('iq_pro_history', JSON.stringify(history.slice(-10))); // Son 10 testi sakla
}

function viewHistory() {
    let history = JSON.parse(localStorage.getItem('iq_pro_history') || '[]');
    if (history.length === 0) {
        alert("Henüz bir test tamamlamadın!");
        return;
    }
    
    let list = history.map((h, i) => `${i+1}. ${h.date} | ${h.mode}: ${h.iq} IQ`).join('\n');
    alert("📊 Son 10 Test Gelişimin:\n\n" + list);
}

function restart() {
    showScreen('screen-welcome');
}
