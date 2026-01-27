// --- Elite+ v3 IQ Test Engine (Professional Pool & Audit) ---

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
    earnedBadges: [],
    xp: parseInt(localStorage.getItem('user_xp') || '0'),
    level: parseInt(localStorage.getItem('user_level') || '1'),
    streak: parseInt(localStorage.getItem('user_streak') || '0'),
    lastTestDate: localStorage.getItem('last_test_date') || null
};

const ALL_BADGES = [
    { id: 'speed_demon', name: 'Hız İblisi', icon: '⚡', desc: 'Bir soruyu 3 saniyeden kısa sürede çöz!' },
    { id: 'perfect_score', name: 'Kusursuz Ruh', icon: '💎', desc: '20/20 doğru cevapla testi bitir.' },
    { id: 'math_genius', name: 'Matematik Dehası', icon: '🔢', desc: 'Matematik kategorisinde %100 başarı sağla.' },
    { id: 'logic_master', name: 'Mantık Ustası', icon: '🧠', desc: 'Mantık sorularının tamamını doğru çöz.' },
    { id: 'daily_hero', name: 'Günlük Kahraman', icon: '🌟', desc: 'Günlük görevi başarıyla tamamla.' },
    { id: 'early_bird', name: 'Erkenci Kuş', icon: '🌅', desc: 'Sabah saatlerinde bir test çöz.' }
];

const questionsDB = {
    kids: [
        { text: "Şu deseni aklında tut: 🟥 🟦 🟥. Sence bir sonraki ne olmalı?", options: ["🟦", "🟥", "🟢", "🟡"], correct: 0, cat: "Görsel" },
        { text: "Şekil Döndürme: ⬅️ okunu sağa çevirirsek hangisi olur?", options: ["⬆️", "➡️", "⬇️", "⬅️"], correct: 1, cat: "Görsel" },
        { text: "Hangi parça eksik?\n[ 🌕 🌑 ] [ 🌕 ? ]", options: ["🌑", "🌕", "⭐", "☀️"], correct: 0, cat: "Görsel" },
        { text: "Büyükten küçüğe sıralarsak en sonda hangisi olur?", options: ["🐘 Fil", "🐈 Kedi", "🐜 Karınca", "🐇 Tavşan"], correct: 2, cat: "Mantık" },
        { text: "Gölgeyi bul: Bir üçgenin (🔺) gölgesi hangisi olabilir?", options: ["🔻", "⬛", "🔵", "🔺"], correct: 3, cat: "Görsel" },
        { text: "Eğer Elma meyveyse, Havuç nedir?", options: ["Meyve", "Sebze", "İçecek", "Tatlı"], correct: 1, cat: "Sözel" },
        { text: "Hangi kutuda daha çok top var?\n[⚽⚽] [🏀🏀🏀] [🎾]", options: ["Birinci", "İkinci", "Üçüncü", "Hepsi aynı"], correct: 1, cat: "Matematik" },
        { text: "Piyano : Müzisyen :: Fırça : ?", options: ["Ressam", "Aşçı", "İşçi", "Şoför"], correct: 0, cat: "Sözel" },
        { text: "Hangi sayı diğerlerinden büyüktür?", options: ["8", "12", "5", "9"], correct: 1, cat: "Matematik" },
        { text: "Akşam olunca gökyüzünde ne görürüz?", options: ["☀️ Güneş", "🌙 Ay", "🌈 Gökkuşağı", "☁️ Beyaz Bulut"], correct: 1, cat: "Mantık" },
        { text: "Ayna Görüntüsü: 'b' harfinin aynadaki hali hangisidir?", options: ["p", "d", "q", "b"], correct: 1, cat: "Görsel" },
        { text: "Eğer 1 elma 2 portakala eşitse, 2 elma kaç portakal eder?", options: ["2", "3", "4", "5"], correct: 2, cat: "Matematik" },
        { text: "Mantık Zinciri: Ali Ayşe'den uzun, Ayşe ise Mehmet'ten uzun. En kısa kim?", options: ["Ali", "Ayşe", "Mehmet", "Bilinemez"], correct: 2, cat: "Mantık" },
        { text: "Hangisi sese duyarlıdır?", options: ["Göz", "Burun", "Kulak", "El"], correct: 2, cat: "Sözel" },
        { text: "Tersini Bul: 🧊 Soğuk :: 🔥 ?", options: ["Sıcak", "Islak", "Kuru", "Yumuşak"], correct: 0, cat: "Sözel" },
        { text: "Hangi eşleşme yanlıştır?", options: ["🐶-Hav", "🐱-Cik", "🐮-Möö", "🐑-Mee"], correct: 1, cat: "Mantık" },
        { text: "Bir haftada kaç gün vardır?", options: ["5", "6", "7", "8"], correct: 2, cat: "Matematik" },
        { text: "Kırmızı + Sarı = ?", options: ["Yeşil", "Turuncu", "Mor", "Siyah"], correct: 1, cat: "Görsel" },
        { text: "Hangisi bir ulaşım aracı değildir?", options: ["🚗 Araba", "🏡 Ev", "✈️ Uçak", "🚢 Gemi"], correct: 1, cat: "Mantık" },
        { text: "Gökyüzü neden mavidir?", options: ["Deniz yansıdığı için", "Işık kırıldığı için", "Bulutlar olduğu için", "Boyandığı için"], correct: 1, cat: "Mantık" },
        { text: "Sırayı Tamamla: 1, 2, 4, 8, ?", options: ["10", "12", "16", "20"], correct: 2, cat: "Matematik" },
        { text: "Karnımız acıkınca ne yaparız?", options: ["Oyun oynarız", "Yemek yeriz", "Uyuruz", "Su içeriz"], correct: 1, cat: "Mantık" },
        { text: "Hangi hayvan uçabilir?", options: ["🐘 Fil", "🐔 Tavuk", "🐒 Maymun", "🦒 Zürafa"], correct: 1, cat: "Mantık" },
        { text: "Güneş hangi yönden doğar?", options: ["Batı", "Doğu", "Kuzey", "Güney"], correct: 1, cat: "Mantık" },
        { text: "Elma : Kırmızı :: Muz : ?", options: ["Mavi", "Yeşil", "Sarı", "Siyah"], correct: 2, cat: "Sözel" },
        { text: "Hangisi bir müzik aletidir?", options: ["🎻 Keman", "🍴 Çatal", "✏️ Kalem", "🧥 Ceket"], correct: 0, cat: "Sözel" },
        { text: "Bir elde kaç parmak vardır?", options: ["4", "5", "6", "10"], correct: 1, cat: "Matematik" },
        { text: "Hangisi yiyecek değildir?", options: ["🍕 Pizza", "🍎 Elma", "🧱 Tuğla", "🍞 Ekmek"], correct: 2, cat: "Mantık" },
        { text: "Daire hangisidir?", options: ["🟦", "🔺", "🟢", "⭐"], correct: 2, cat: "Görsel" },
        { text: "Yağmur nereden yağar?", options: ["Toprak", "Deniz", "Bulut", "Güneş"], correct: 2, cat: "Mantık" }
    ],
    adults: [
        { text: "Bir gölde nilüfer çiçekleri her gün iki katına çıkar. 48 günde gölü kaplıyorsa, yarısını kaç günde kaplar?", options: ["24", "46", "47", "12"], correct: 2, cat: "Mantık" },
        { text: "3, 6, 12, 24, ? serisini tamamlayın.", options: ["36", "48", "60", "72"], correct: 1, cat: "Matematik" },
        { text: "121, 144, 169, 196, ?", options: ["215", "225", "256", "240"], correct: 1, cat: "Matematik" },
        { text: "Saat 03:15'te akrep ile yelkovan arasındaki açı?", options: ["0°", "7.5°", "15°", "2.5°"], correct: 1, cat: "Matematik" },
        { text: "Hangi sayı seriyi tamamlar? 1, 1, 2, 3, 5, 8, ?", options: ["11", "12", "13", "14"], correct: 2, cat: "Matematik" },
        { text: "Analoji: Paradoks / Çelişki :: Analoji / ?", options: ["Benzerlik", "Farklılık", "Eş anlam", "Zıtlık"], correct: 0, cat: "Sözel" },
        { text: "Matris:\n[ ⚫ ⚪ ] [ ⚪ ⚫ ]\n[ ⚫ ⚫ ] [ ? ]", options: ["⚪ ⚪", "⚫ ⚫", "⚫ ⚪", "⚪ ⚫"], correct: 0, cat: "Görsel" },
        { text: "Tüm A'lar B ise, bazı B'ler A mıdır?", options: ["Kesinlikle", "Hayır", "Belki", "Bilinemez"], correct: 0, cat: "Mantık" },
        { text: "Emek : Buğday :: Şarap : ?", options: ["Elma", "Üzüm", "Armut", "Kiraz"], correct: 1, cat: "Sözel" },
        { text: "Dünya'nın en yüksek dağı?", options: ["Ağrı", "Everest", "K2", "Lhotse"], correct: 1, cat: "Mantık" },
        { text: "Bir baba 34, oğlu 8 yaşında. Kaç yıl sonra babası oğlunun 3 katı olur?", options: ["4", "5", "6", "7"], correct: 1, cat: "Matematik" },
        { text: "Bir senede kaç hafta vardır?", options: ["50", "51", "52", "53"], correct: 2, cat: "Matematik" },
        { text: "Hangi element simgesi 'O'dur?", options: ["Altın", "Oksijen", "Gümüş", "Demir"], correct: 1, cat: "Sözel" },
        { text: "Hangisi bir asal sayı değildir?", options: ["17", "29", "51", "53"], correct: 2, cat: "Matematik" },
        { text: "LİMAN kelimesinden hangisi yazılamaz?", options: ["MAİL", "ALİN", "MALİ", "MANİ"], correct: 1, cat: "Sözel" },
        { text: "Geri Sayım: 100, 93, 86, 79, ?", options: ["71", "72", "73", "74"], correct: 1, cat: "Matematik" },
        { text: "Eğer 5 kedi 5 fareyi 5 dakikada yakalıyorsa, 100 kedi 100 fareyi kaç dakikada yakalar?", options: ["1", "5", "100", "50"], correct: 1, cat: "Mantık" },
        { text: "Zaman : Saat :: Sıcaklık : ?", options: ["Hava", "Termometre", "Güneş", "Derece"], correct: 1, cat: "Sözel" },
        { text: "Brazilya / Güney Amerika :: Mısır / ?", options: ["Asya", "Afrika", "Avrupa", "Okyanusya"], correct: 1, cat: "Mantık" },
        { text: "ABC : EFG :: 123 : ?", options: ["345", "456", "567", "678"], correct: 2, cat: "Matematik" },
        { text: "7, 10, 8, 11, 9, 12, ? serisini tamamlayın.", options: ["7", "10", "12", "13"], correct: 1, cat: "Matematik" },
        { text: "Hangi sayı diğerlerinden farklıdır?", options: ["21", "35", "49", "62"], correct: 3, cat: "Matematik" },
        { text: "Bir maratonda ikinciyi geçersen kaçıncı olursun?", options: ["Birinci", "İkinci", "Üçüncü", "Sonuncu"], correct: 1, cat: "Mantık" },
        { text: "Ocak : 31 :: Şubat : ?", options: ["28/29", "30", "31", "27"], correct: 0, cat: "Matematik" },
        { text: "Su : Buz :: Süt : ?", options: ["Yoğurt", "Peynir", "Krema", "Sıvı"], correct: 1, cat: "Sözel" },
        { text: "Sıfat : Niteleme :: Zarf : ?", options: ["Belirtme", "Durum", "Miktar", "Zaman"], correct: 0, cat: "Sözel" },
        { text: "15, 30, 45, 60, ?", options: ["70", "75", "80", "85"], correct: 1, cat: "Matematik" },
        { text: "Hangisi güneş sistemindeki en büyük gezegendir?", options: ["Mars", "Venüs", "Jüpiter", "Satürn"], correct: 2, cat: "Mantık" },
        { text: "Bir uçak Türkiye-Yunanistan sınırında düşerse, sağ kalanlar nereye gömülür?", options: ["Türkiye", "Yunanistan", "Tarafsız Bölge", "Gömülmezler"], correct: 3, cat: "Mantık" },
        { text: "Hangi ülke Avrupa kıtasında değildir?", options: ["Almanya", "Fransa", "Japonya", "İtalya"], correct: 2, cat: "Mantık" },
        { text: "8, 6, 9, 5, 10, 4, ?", options: ["11", "12", "3", "7"], correct: 0, cat: "Matematik" },
        { text: "Hangi kelime diğerlerinden farklıdır?", options: ["Muz", "Elma", "Ispanak", "Armut"], correct: 2, cat: "Sözel" },
        { text: "Kitap : Yazar :: Beste : ?", options: ["Şarkıcı", "Müzisyen", "Besteci", "Şair"], correct: 2, cat: "Sözel" },
        { text: "Bir futbol maçı ne kadar sürer? (Normal süre)", options: ["45 dk", "60 dk", "90 dk", "120 dk"], correct: 2, cat: "Mantık" },
        { text: "Hangi gezegen halkalarıyla tanınır?", options: ["Mars", "Jüpiter", "Satürn", "Neptün"], correct: 2, cat: "Mantık" },
        { text: "Bir rakamın karesi 49 ise bu rakam kaçtır?", options: ["6", "7", "8", "9"], correct: 1, cat: "Matematik" },
        { text: "Hangi renk gökkuşağında yoktur?", options: ["Kırmızı", "Yeşil", "Pembe", "Mor"], correct: 2, cat: "Görsel" },
        { text: "Bir yıl kaç mevsimdir?", options: ["2", "3", "4", "5"], correct: 2, cat: "Matematik" },
        { text: "Hangi organımızla nefes alırız?", options: ["Kalp", "Mide", "Akciğer", "Karaciğer"], correct: 2, cat: "Mantık" },
        { text: "Türkiye'nin başkenti neresidir?", options: ["İstanbul", "Ankara", "İzmir", "Bursa"], correct: 1, cat: "Mantık" },
        { text: "Bir doğru açının derecesi kaçtır?", options: ["90", "180", "270", "360"], correct: 1, cat: "Matematik" },
        { text: "Hangi elementin simgesi 'H'dir?", options: ["Helyum", "Hidrojen", "Hafniyum", "Holmiyum"], correct: 1, cat: "Sözel" },
        { text: "Bir üçgenin iç açıları toplamı kaçtır?", options: ["90", "180", "270", "360"], correct: 1, cat: "Matematik" },
        { text: "Hangi hayvan memelidir?", options: ["🐟 Balık", "🐍 Yılan", "🐋 Balina", "🦅 Kartal"], correct: 2, cat: "Mantık" },
        { text: "Hangi telefon markası 'iPhone'u üretir?", options: ["Samsung", "Apple", "Xiaomi", "Huawei"], correct: 1, cat: "Sözel" },
        { text: "Bir saatte kaç dakika vardır?", options: ["30", "60", "90", "120"], correct: 1, cat: "Matematik" },
        { text: "Hangi kıta en büyüktür?", options: ["Afrika", "Asya", "Avrupa", "Antarktika"], correct: 1, cat: "Mantık" },
        { text: "Bir kilometre kaç metredir?", options: ["100", "500", "1000", "5000"], correct: 2, cat: "Matematik" },
        { text: "Hangi meyve C vitamini bakımından zengindir?", options: ["Muz", "Elma", "Portakal", "Armut"], correct: 2, cat: "Sözel" },
        { text: "Bir karenin kaç kenarı vardır?", options: ["3", "4", "5", "6"], correct: 1, cat: "Matematik" },
        { text: "Hangi dil Türkiye'nin resmi dilidir?", options: ["İngilizce", "Fransızca", "Türkçe", "Almanca"], correct: 2, cat: "Sözel" },
        { text: "Bir deste kaç tanedir?", options: ["10", "12", "15", "20"], correct: 0, cat: "Matematik" },
        { text: "Hangi renk 'dur' işaretidir?", options: ["Yeşil", "Sarı", "Kırmızı", "Mavi"], correct: 2, cat: "Görsel" },
        { text: "Bir düzine kaç tanedir?", options: ["10", "12", "15", "20"], correct: 1, cat: "Matematik" },
        { text: "Hangi mevsimden sonra kış gelir?", options: ["İlkbahar", "Yaz", "Sonbahar", "Hiçbiri"], correct: 2, cat: "Mantık" },
        { text: "Bir insanın kaç gözü vardır?", options: ["1", "2", "3", "4"], correct: 1, cat: "Mantık" },
        { text: "Hangi yöne güneş batar?", options: ["Doğu", "Batı", "Kuzey", "Güney"], correct: 1, cat: "Mantık" },
        { text: "Bir hafta kaç saattir?", options: ["120", "144", "168", "192"], correct: 2, cat: "Matematik" },
        { text: "Hangi hayvan 'ormanların kralı' olarak bilinir?", options: ["🐘 Fil", "🐅 Kaplan", "🦁 Aslan", "🦒 Zürafa"], correct: 2, cat: "Sözel" },
        { text: "Bir kilogram kaç gramdır?", options: ["100", "500", "1000", "2000"], correct: 2, cat: "Matematik" }
    ]
};

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
    
    const mascot = document.querySelector('.mascot-container');
    if (mascot) {
        mascot.style.display = screenId === 'screen-test' ? 'none' : 'block';
    }
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
        updateMascot('😎'); 
        if (timeTaken < 3) grantBadge('speed_demon');
    } else {
        updateMascot('😟'); 
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
    const baseIQ = 45;
    const accuracyPoints = currentState.score * 4.5; 
    const speedBonus = Math.max(0, 15 - (totalTime / 300) * 10); 
    const finalIQ = Math.round(baseIQ + accuracyPoints + speedBonus);

    if (currentState.score === 20) grantBadge('perfect_score');
    if (currentState.categoryScores['Matematik'] === 5) grantBadge('math_genius');
    if (currentState.categoryScores['Mantık'] === 5) grantBadge('logic_master');
    
    const questText = localStorage.getItem('daily_quest_text');
    if (questText && questText.includes("IQ") && finalIQ > 105) completeDailyQuest();
    if (questText && questText.includes("3 dakika") && totalTime < 180) completeDailyQuest();
    if (questText && questText.includes("Kusursuz") && currentState.score === 20) completeDailyQuest();

    calculateXP(finalIQ, currentState.score);
    updateStreak();
    displayFinalResults(finalIQ);
}

function calculateXP(iq, correctAnswers) {
    const earnedXP = Math.round((iq * 2) + (correctAnswers * 50));
    currentState.xp += earnedXP;
    
    // Basit level sistemi: Her level için 1000 XP
    const newLevel = Math.floor(currentState.xp / 1000) + 1;
    
    if (newLevel > currentState.level) {
        showLevelUp(newLevel);
    }
    
    currentState.level = newLevel;
    localStorage.setItem('user_xp', currentState.xp);
    localStorage.setItem('user_level', currentState.level);
    
    return earnedXP;
}

function updateStreak() {
    const today = new Date().toDateString();
    if (currentState.lastTestDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (currentState.lastTestDate === yesterday.toDateString()) {
            currentState.streak++;
        } else {
            currentState.streak = 1;
        }
        
        currentState.lastTestDate = today;
        localStorage.setItem('user_streak', currentState.streak);
        localStorage.setItem('last_test_date', today);
    }
}

function showLevelUp(level) {
    // Gelecekte bir kutlama efekti eklenebilir
    console.log("TEBRİKLER! Seviye atladın: " + level);
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
    saveToHistory(iq, rank, currentState.categoryScores);
    updateProfileUI();
}

function updateProfileUI() {
    const levelEl = document.getElementById('user-level');
    const xpBarEl = document.getElementById('xp-progress-fill');
    const streakEl = document.getElementById('streak-count');
    
    if (levelEl) levelEl.innerText = currentState.level;
    if (xpBarEl) {
        const xpInCurrentLevel = currentState.xp % 1000;
        xpBarEl.style.width = `${(xpInCurrentLevel / 1000) * 100}%`;
    }
    if (streakEl) streakEl.innerText = currentState.streak;
}

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
        container.innerHTML += `<div class="badge-compact" title="${badge.name}: ${badge.desc}">${badge.icon}</div>`;
    });
}

function showBadgesScreen() {
    showScreen('screen-badges');
    const container = document.getElementById('full-badges-list');
    const earned = JSON.parse(localStorage.getItem('earned_badges') || '[]');
    container.innerHTML = '';
    ALL_BADGES.forEach(badge => {
        const isEarned = earned.includes(badge.id);
        container.innerHTML += `
            <div class="badge-item ${isEarned ? 'earned' : ''}">
                <div class="badge-icon">${badge.icon}</div>
                <div class="badge-info">
                    <span class="badge-name">${badge.name} ${isEarned ? '✅' : '🔒'}</span>
                    <span class="badge-desc">${badge.desc}</span>
                </div>
            </div>
        `;
    });
}

function updateMascot(icon) {
    const mascotFace = document.getElementById('mascot-face');
    if (mascotFace) mascotFace.innerText = icon;
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
        if (timerEl) {
            timerEl.innerText = `⏱️ ${Math.floor(elapsed/60).toString().padStart(2,'0')}:${(elapsed%60).toString().padStart(2,'0')}`;
        }
    }, 1000);
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function saveToHistory(iq, rank, categories) {
    let h = JSON.parse(localStorage.getItem('iq_elite_history') || '[]');
    h.push({ 
        iq, 
        rank, 
        date: new Date().toLocaleDateString('tr-TR'),
        categories: { ...categories }
    });
    localStorage.setItem('iq_elite_history', JSON.stringify(h.slice(-15))); // 15 kayda çıkardık
}

function viewHistory() { window.open('history.html', '_blank'); }
function restart() { initDailyQuest(); showScreen('screen-welcome'); updateMascot('🦊'); }

window.onload = () => {
    initDailyQuest();
    updateProfileUI();
};
