const intro = document.querySelector("#intro");
const enterButton = document.querySelector("#enterButton");
const siteShell = document.querySelector("#siteShell");
const loveSong = document.querySelector("#loveSong");
const quizAnswer = document.querySelector("#quizAnswer");
const heartRain = document.querySelector("#heartRain");
const confettiLayer = document.querySelector("#confettiLayer");
const heartFragments = document.querySelector("#heartFragments");
const heartToast = document.querySelector("#heartToast");
const wishButton = document.querySelector("#wishButton");
const wishMessage = document.querySelector("#wishMessage");
const flame = document.querySelector("#flame");
const smokes = document.querySelectorAll(".smoke");
const relationshipCounter = document.querySelector("#relationshipCounter");
const counterDays = document.querySelector("#counterDays");
const counterHours = document.querySelector("#counterHours");
const counterMinutes = document.querySelector("#counterMinutes");
const counterSeconds = document.querySelector("#counterSeconds");
const melHeartButton = document.querySelector("#melHeartButton");
const previousPhoto = document.querySelector("#previousPhoto");
const nextPhoto = document.querySelector("#nextPhoto");
const galleryCounter = document.querySelector("#galleryCounter");
const typewriterMessage = document.querySelector("#typewriterMessage");
const foreverMessage = document.querySelector("#foreverMessage");
const toggleMusic = document.querySelector("#toggleMusic");
const volumeControl = document.querySelector("#volumeControl");
const previousTrack = document.querySelector("#previousTrack");
const nextTrack = document.querySelector("#nextTrack");
const shuffleTrack = document.querySelector("#shuffleTrack");
const favoriteTrack = document.querySelector("#favoriteTrack");
const musicTitle = document.querySelector("#musicTitle");
const themeSelector = document.querySelector("#themeSelector");
const photoOfDayImage = document.querySelector("#photoOfDayImage");
const photoOfDayCaption = document.querySelector("#photoOfDayCaption");
const calendarTitle = document.querySelector("#calendarTitle");
const calendarGrid = document.querySelector("#calendarGrid");
const prevMonth = document.querySelector("#prevMonth");
const nextMonth = document.querySelector("#nextMonth");
const prevYear = document.querySelector("#prevYear");
const nextYear = document.querySelector("#nextYear");
const backToPresent = document.querySelector("#backToPresent");
const timeMachine = document.querySelector("#timeMachine");
const botPhrase = document.querySelector("#botPhrase");
const botNext = document.querySelector("#botNext");
const coupleQuizScore = document.querySelector("#coupleQuizScore");
const memoryBoard = document.querySelector("#memoryBoard");
const shootArrow = document.querySelector("#shootArrow");
const targetHeart = document.querySelector("#targetHeart");
const arrowsLeft = document.querySelector("#arrowsLeft");
const cupidoMessage = document.querySelector("#cupidoMessage");
const loveEnvelope = document.querySelector("#loveEnvelope");
const letterTitle = document.querySelector("#letterTitle");
const letterType = document.querySelector("#letterType");
const letterFinal = document.querySelector("#letterFinal");
const spacePortal = document.querySelector("#spacePortal");
const currentDateLabel = document.querySelector("#currentDateLabel");
const currentTimeLabel = document.querySelector("#currentTimeLabel");
const dayNightLabel = document.querySelector("#dayNightLabel");
const statsDays = document.querySelector("#statsDays");
const statsHours = document.querySelector("#statsHours");
const statsMinutes = document.querySelector("#statsMinutes");

const relationshipStart = new Date(2025, 10, 14, 0, 0, 0);
const finalText =
  "Nicolas e Mel ❤️\n" +
  "Este universo nasceu para continuar crescendo com a gente.\n" +
  "Cada foto, cada vídeo, cada mensagem e cada data guardada aqui vira uma estrela nova na nossa história.\n" +
  "O passado fica protegido como memória, o presente fica vivo como carinho e o futuro fica aberto para tudo que ainda vamos construir.\n" +
  "Que este cantinho seja nosso mapa de lembranças, viagens, risadas, sonhos e pequenos detalhes que só nós entendemos.\n" +
  "Enquanto houver amor, sempre vai existir mais uma página para escrever.\n" +
  "Nicolas e Mel para sempre ❤️✨";

const botPhrases = buildRomanticPhrases();

let currentPhoto = 0;
let galleryTimer = null;
let typewriterStarted = false;
let galaxyReady = false;
let calendarDate = new Date();
let coupleScore = 0;
let arrows = 3;
let flippedCards = [];
let matchedCards = 0;
let letterStarted = false;
let currentTrack = 0;
let recentPhraseIndexes = [];

function buildRomanticPhrases() {
  const starts = [
    "Você é",
    "Seu sorriso é",
    "Nosso amor é",
    "Cada memória nossa é",
    "Mel, você é",
    "A nossa história é",
    "Com você, a vida fica",
    "Quando penso em nós, tudo fica",
    "Meu lugar favorito é",
    "O universo fica mais bonito com",
  ];
  const middles = [
    "meu lugar favorito",
    "uma estrela acesa",
    "uma paz que abraça",
    "um carinho que ilumina",
    "uma lembrança que brilha",
    "uma constelação inteira",
    "a parte mais bonita do meu dia",
    "um sonho acordado",
    "uma viagem que quero repetir",
    "a melhor surpresa da vida",
    "o detalhe que muda tudo",
    "uma poesia acontecendo",
  ];
  const endings = [
    "❤️",
    "✨",
    "🌌",
    "para sempre.",
    "todos os dias.",
    "do jeitinho mais lindo.",
    "no meu coração.",
    "na nossa galáxia.",
    "em cada segundo.",
    "e eu amo viver isso com você.",
  ];

  const phrases = [];
  starts.forEach((start) => {
    middles.forEach((middle) => {
      endings.forEach((ending) => {
        phrases.push(`${start} ${middle} ${ending}`);
      });
    });
  });

  return phrases;
}

function startExperience() {
  intro.classList.add("intro--open");
  siteShell.classList.remove("hidden");
  startMusic();
  startGallery();
  updateRelationshipCounter();
  updateRealClock();
  burstHearts(26);

  setTimeout(() => {
    intro.style.display = "none";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 900);
}

function startMusic() {
  if (!loveSong) return;
  loveSong.volume = Number(volumeControl?.value || 55) / 100;
  loadTrack(currentTrack);
  loveSong.play().then(() => updateMusicButton()).catch(() => {
    console.log("Toque novamente para liberar a música no navegador.");
  });
}

function playlist() {
  return window.UNIVERSE_DATA?.musicTracks || [];
}

function loadTrack(index, autoplay = false) {
  const tracks = playlist();
  if (!loveSong || !tracks.length) {
    if (musicTitle) musicTitle.textContent = "Nenhuma música cadastrada";
    return;
  }

  currentTrack = (index + tracks.length) % tracks.length;
  const track = tracks[currentTrack];
  const trackUrl = new URL(track.url, window.location.href).href;
  if (loveSong.src !== trackUrl) {
    loveSong.src = trackUrl;
    loveSong.load();
  }
  if (musicTitle) musicTitle.textContent = track.title;
  updateFavoriteButton();
  if (autoplay) {
    loveSong.play().then(() => updateMusicButton()).catch(() => showToast("Toque novamente para liberar a música."));
  }
}

function updateMusicButton() {
  if (!toggleMusic || !loveSong) return;
  toggleMusic.textContent = loveSong.paused ? "Tocar" : "Pausar";
}

function toggleCurrentMusic() {
  if (!loveSong) return;
  if (loveSong.paused) {
    startMusic();
  } else {
    loveSong.pause();
    updateMusicButton();
  }
}

function updateFavoriteButton() {
  const tracks = playlist();
  if (!favoriteTrack || !tracks.length) return;
  favoriteTrack.textContent = tracks[currentTrack].favorite ? "♥" : "♡";
  favoriteTrack.classList.toggle("is-favorite", Boolean(tracks[currentTrack].favorite));
}

function toggleFavoriteTrack() {
  const tracks = playlist();
  if (!tracks.length) return;
  const track = tracks[currentTrack];
  const previous = Boolean(track.favorite);
  track.favorite = !previous;
  updateFavoriteButton();

  fetch("/favorite", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ kind: "music", item_id: String(track.id) }),
  })
    .then((response) => response.json())
    .then((payload) => {
      if (payload.ok) {
        track.favorite = payload.favorite;
        updateFavoriteButton();
      }
    })
    .catch(() => {
      track.favorite = previous;
      updateFavoriteButton();
      showToast("Não consegui salvar o favorito agora.");
    });
}

function playNextTrack() {
  loadTrack(currentTrack + 1, true);
}

function playPreviousTrack() {
  loadTrack(currentTrack - 1, true);
}

function playRandomTrack() {
  const tracks = playlist();
  if (!tracks.length) return;
  if (tracks.length === 1) {
    loadTrack(0, true);
    return;
  }
  let next = currentTrack;
  while (next === currentTrack) {
    next = Math.floor(Math.random() * tracks.length);
  }
  loadTrack(next, true);
}

function galleryItems() {
  return Array.from(document.querySelectorAll(".polaroid")).filter((item) => item.style.display !== "none");
}

function showPhoto(index) {
  const allPhotos = Array.from(document.querySelectorAll(".polaroid"));
  const photos = galleryItems();
  if (!photos.length) {
    if (galleryCounter) galleryCounter.textContent = "0 / 0";
    return;
  }

  allPhotos.forEach((photo) => photo.classList.remove("active"));
  currentPhoto = (index + photos.length) % photos.length;
  photos[currentPhoto].classList.add("active");

  if (galleryCounter) {
    galleryCounter.textContent = `${currentPhoto + 1} / ${photos.length}`;
  }
}

function startGallery() {
  const photos = galleryItems();
  showPhoto(currentPhoto);
  if (galleryTimer || photos.length <= 1) {
    return;
  }

  galleryTimer = setInterval(() => {
    showPhoto(currentPhoto + 1);
  }, 3600);
}

function restartGallery() {
  clearInterval(galleryTimer);
  galleryTimer = null;
  startGallery();
}

function updateRelationshipCounter() {
  const now = new Date();
  const diff = Math.max(0, now.getTime() - relationshipStart.getTime());
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (counterDays) counterDays.textContent = days;
  if (counterHours) counterHours.textContent = hours;
  if (counterMinutes) counterMinutes.textContent = minutes;
  if (counterSeconds) counterSeconds.textContent = seconds;
  if (relationshipCounter) {
    relationshipCounter.textContent =
      `Desde 14/11/2025: ${days} dias, ${hours} horas, ${minutes} minutos e ${seconds} segundos.`;
  }
  if (statsDays) statsDays.textContent = days;
  if (statsHours) statsHours.textContent = Math.floor(totalSeconds / 3600);
  if (statsMinutes) statsMinutes.textContent = Math.floor(totalSeconds / 60);
}

function burstHearts(amount = 18) {
  for (let index = 0; index < amount; index += 1) {
    const heart = document.createElement("span");
    heart.className = "rain-heart";
    heart.textContent = "❤";
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${18 + Math.random() * 28}px`;
    heart.style.animationDuration = `${2.4 + Math.random() * 1.8}s`;
    heartRain.appendChild(heart);
    setTimeout(() => heart.remove(), 4500);
  }
}

function throwConfetti(amount = 80) {
  const colors = ["#ff69b4", "#ffd36a", "#8d5cff", "#ffffff", "#5be7ff"];

  for (let index = 0; index < amount; index += 1) {
    const confetti = document.createElement("span");
    confetti.className = "confetti";
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDuration = `${2 + Math.random() * 2.2}s`;
    confetti.style.transform = `rotate(${Math.random() * 180}deg)`;
    confettiLayer.appendChild(confetti);
    setTimeout(() => confetti.remove(), 4600);
  }
}

function showToast(message) {
  if (!heartToast) return;
  heartToast.textContent = message;
  heartToast.classList.add("heart-toast--show");
  setTimeout(() => heartToast.classList.remove("heart-toast--show"), 3200);
}

function showPortal(callback) {
  if (!spacePortal) {
    callback();
    return;
  }
  spacePortal.classList.add("space-portal--show");
  setTimeout(callback, 360);
  setTimeout(() => spacePortal.classList.remove("space-portal--show"), 920);
}

function updateRealClock() {
  const now = new Date();
  const hour = now.getHours();
  const isDay = hour >= 6 && hour < 18;

  if (currentDateLabel) {
    currentDateLabel.textContent = now.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
  if (currentTimeLabel) {
    currentTimeLabel.textContent = now.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }
  if (dayNightLabel) {
    dayNightLabel.textContent = isDay ? "Modo dia" : "Modo noite";
  }

  document.body.classList.toggle("day-mode", isDay);
  document.body.classList.toggle("night-mode", !isDay);
}

function applyTheme(theme) {
  const allowed = ["galaxy", "garden", "dream"];
  const nextTheme = allowed.includes(theme) ? theme : "galaxy";
  document.body.classList.remove("theme-galaxy", "theme-garden", "theme-dream");
  document.body.classList.add(`theme-${nextTheme}`);
  if (themeSelector) themeSelector.value = nextTheme;
  localStorage.setItem("universeTheme", nextTheme);
}

function initThemeSelector() {
  const savedTheme = localStorage.getItem("universeTheme");
  if (savedTheme) {
    applyTheme(savedTheme);
  }
  themeSelector?.addEventListener("change", () => applyTheme(themeSelector.value));
}

function updatePhotoOfDay() {
  if (!photoOfDayImage || !photoOfDayCaption) return;
  const photos = Array.from(document.querySelectorAll(".polaroid"));
  if (!photos.length) return;

  const today = new Date();
  const daySeed = Number(
    `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`
  );
  const selected = photos[daySeed % photos.length];
  const image = selected.querySelector("img");
  const caption = selected.querySelector("figcaption");
  if (!image) return;

  photoOfDayImage.src = image.dataset.full || image.src;
  photoOfDayImage.alt = image.alt || "Foto do dia";
  photoOfDayCaption.textContent = caption?.textContent || "Uma memória linda do nosso universo.";
}

function explodeMelHeart() {
  if (!melHeartButton) {
    return;
  }

  melHeartButton.classList.remove("orbit-card--explode");
  void melHeartButton.offsetWidth;
  melHeartButton.classList.add("orbit-card--explode");

  showToast("Meu coração se apaixonou pelo seu ❤️");

  const rect = melHeartButton.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;
  const pieces = ["❤", "💖", "💕", "✨", "✦", "✧", "M", "E", "L"];

  for (let index = 0; index < 220; index += 1) {
    const fragment = document.createElement("span");
    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * 380;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    fragment.className = "heart-piece";
    fragment.textContent = pieces[index % pieces.length];
    fragment.style.left = `${originX}px`;
    fragment.style.top = `${originY}px`;
    fragment.style.setProperty("--x", `${x}px`);
    fragment.style.setProperty("--y", `${y}px`);
    fragment.style.fontSize = `${14 + Math.random() * 30}px`;
    fragment.style.animationDuration = `${950 + Math.random() * 1100}ms`;
    heartFragments.appendChild(fragment);
    setTimeout(() => fragment.remove(), 2300);
  }

  burstHearts(100);
  setTimeout(() => melHeartButton.classList.remove("orbit-card--explode"), 1100);
}

function answerQuiz(event) {
  const option = event.currentTarget;
  const isCorrect = option.dataset.correct === "true";

  if (isCorrect) {
    if (quizAnswer) quizAnswer.textContent = "💖 Acertou Mel!";
    burstHearts(42);
    return;
  }

  if (quizAnswer) quizAnswer.textContent = "Quase, princesa. A resposta é Morro Branco ❤";
}

function blowCandle() {
  flame.classList.add("flame--out");
  smokes.forEach((smoke) => smoke.classList.add("smoke--active"));
  wishMessage.textContent = "Faça um pedido princesa ❤";
  throwConfetti(110);
  burstHearts(34);
}

function startTypewriter() {
  if (typewriterStarted || !typewriterMessage) {
    return;
  }

  typewriterStarted = true;
  typewriterMessage.textContent = "";
  let index = 0;

  const timer = setInterval(() => {
    typewriterMessage.textContent += finalText[index];
    index += 1;

    if (index >= finalText.length) {
      clearInterval(timer);
      foreverMessage.classList.remove("hidden");
      burstHearts(90);
      throwConfetti(70);
    }
  }, 32);
}

function observeFinalMessage() {
  if (!typewriterMessage || !("IntersectionObserver" in window)) {
    startTypewriter();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        startTypewriter();
        observer.disconnect();
      }
    },
    { threshold: 0.35 }
  );

  observer.observe(typewriterMessage);
}

function renderCalendar() {
  if (!calendarGrid || !calendarTitle) return;

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const todayKey = new Date().toISOString().slice(0, 10);
  const eventDates = new Set(window.UNIVERSE_DATA?.events || []);

  calendarTitle.textContent = firstDay.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
  calendarGrid.innerHTML = "";

  ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].forEach((day) => {
    const label = document.createElement("strong");
    label.textContent = day;
    calendarGrid.appendChild(label);
  });

  for (let index = 0; index < firstDay.getDay(); index += 1) {
    calendarGrid.appendChild(document.createElement("span"));
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    const date = new Date(year, month, day);
    const key = date.toISOString().slice(0, 10);
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = day;
    if (key === todayKey) button.classList.add("is-today");
    if (eventDates.has(key)) button.classList.add("has-memory");
    button.addEventListener("click", () => enterTimeMachine(key));
    calendarGrid.appendChild(button);
  }
}

function enterTimeMachine(dateKey) {
  if (dateKey === "2026-06-02" && window.UNIVERSE_DATA?.birthdayUrl) {
    window.location.href = window.UNIVERSE_DATA.birthdayUrl;
    return;
  }

  const photos = Array.from(document.querySelectorAll(".polaroid"));
  const videos = Array.from(document.querySelectorAll(".video-card"));
  const diary = Array.from(document.querySelectorAll(".diary-card"));
  const events = Array.from(document.querySelectorAll(".timeline__item"));
  const letters = Array.from(document.querySelectorAll(".saved-letter"));

  const matches = [...photos, ...videos, ...diary, ...events, ...letters].filter((item) => item.dataset.date === dateKey);
  [...photos, ...videos, ...diary, ...events, ...letters].forEach((item) => {
    item.style.display = item.dataset.date === dateKey ? "" : "none";
  });

  currentPhoto = 0;
  restartGallery();
  timeMachine.innerHTML = `
    <strong>Memórias de ${dateKey.split("-").reverse().join("/")}</strong>
    <p>${matches.length ? `${matches.length} registro(s) encontrados nessa data.` : "Nenhuma memória cadastrada nessa data ainda."}</p>
  `;
}

function returnToPresent() {
  document.querySelectorAll("[data-date]").forEach((item) => {
    item.style.display = "";
  });
  currentPhoto = 0;
  restartGallery();
  timeMachine.innerHTML = `
    <strong>Hoje no nosso universo</strong>
    <p>Você voltou ao presente. O site está mostrando todas as memórias novamente.</p>
  `;
}

function rotateBotPhrase() {
  if (!botPhrase) return;
  if (!botPhrases.length) return;
  let index = Math.floor(Math.random() * botPhrases.length);
  let guard = 0;
  while (recentPhraseIndexes.includes(index) && guard < 30) {
    index = Math.floor(Math.random() * botPhrases.length);
    guard += 1;
  }
  recentPhraseIndexes.push(index);
  recentPhraseIndexes = recentPhraseIndexes.slice(-32);
  botPhrase.textContent = botPhrases[index];
}

function initGames() {
  document.querySelectorAll(".couple-answer").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.answer === "right") {
        coupleScore += 10;
        burstHearts(24);
      }
      coupleQuizScore.textContent = `Pontuação: ${coupleScore}`;
    });
  });

  if (memoryBoard) {
    const symbols = ["❤", "🌌", "✨", "💖", "❤", "🌌", "✨", "💖"].sort(() => Math.random() - 0.5);
    symbols.forEach((symbol) => {
      const card = document.createElement("button");
      card.type = "button";
      card.textContent = "?";
      card.dataset.symbol = symbol;
      card.addEventListener("click", () => flipMemoryCard(card));
      memoryBoard.appendChild(card);
    });
  }
}

function flipMemoryCard(card) {
  if (card.classList.contains("matched") || flippedCards.includes(card) || flippedCards.length === 2) return;
  card.textContent = card.dataset.symbol;
  card.classList.add("flipped");
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    const [first, second] = flippedCards;
    if (first.dataset.symbol === second.dataset.symbol) {
      first.classList.add("matched");
      second.classList.add("matched");
      matchedCards += 2;
      flippedCards = [];
      burstHearts(12);
      if (matchedCards === 8) throwConfetti(70);
    } else {
      setTimeout(() => {
        first.textContent = "?";
        second.textContent = "?";
        first.classList.remove("flipped");
        second.classList.remove("flipped");
        flippedCards = [];
      }, 800);
    }
  }
}

function shootCupidArrow() {
  if (arrows <= 0) {
    cupidoMessage.textContent = "As flechas acabaram, mas o amor ficou no alvo ❤";
    return;
  }

  arrows -= 1;
  arrowsLeft.textContent = "🏹".repeat(arrows);
  targetHeart.classList.add("target-hit");
  burstHearts(46);
  throwConfetti(36);

  if (arrows === 0) {
    cupidoMessage.textContent = "Desde o primeiro momento, meu coração escolheu você ❤ Nicolas e Mel para sempre ❤";
    for (let index = 0; index < 80; index += 1) {
      const rain = document.createElement("span");
      rain.className = "rain-heart couple-rain";
      rain.textContent = "Nicolas ❤ Mel";
      rain.style.left = `${Math.random() * 100}%`;
      rain.style.fontSize = `${12 + Math.random() * 14}px`;
      heartRain.appendChild(rain);
      setTimeout(() => rain.remove(), 5000);
    }
  } else {
    cupidoMessage.textContent = "Impacto! O coração brilhou ❤";
  }

  setTimeout(() => targetHeart.classList.remove("target-hit"), 900);
}

function initConstellationChips() {
  document.querySelectorAll(".constellation-chip").forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.add("constellation-chip--active");
      showToast("Em meio a bilhões de estrelas, encontrei você.");
      burstHearts(18);
      setTimeout(() => button.classList.remove("constellation-chip--active"), 900);
    });
  });
}

function getLetterContent() {
  const now = new Date();
  const monthDay = `${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  if (monthDay === "06-02") {
    return {
      title: "Feliz Aniversário Minha Princesa ❤️",
      text:
        "Feliz Aniversário Minha Princesa ❤️\n" +
        "Hoje a carta guarda uma alegria especial: celebrar você, seu sorriso e a sorte enorme que é ter você na minha vida.\n" +
        "Que seu novo ciclo seja lindo, leve, cheio de saúde, sonhos realizados e motivos para sorrir.\n" +
        "Eu te amo infinitamente.",
    };
  }

  if (monthDay === "06-12") {
    return {
      title: "Feliz Dia dos Namorados ❤️",
      text:
        "Feliz Dia dos Namorados ❤️\n" +
        "Em um universo tão grande, meu coração encontrou o seu e escolheu ficar.\n" +
        "Obrigado por transformar dias comuns em lembranças bonitas e por ser meu carinho preferido.\n" +
        "Quero continuar vivendo nossa história, uma estrela de cada vez.",
    };
  }

  return {
    title: "Carta para a Mel ❤️",
    text:
      "Mel, se este envelope chegou até você, é porque existe uma parte do meu coração morando aqui.\n" +
      "Eu amo cada detalhe nosso, cada risada, cada viagem, cada conversa e cada sonho que a gente ainda vai viver.\n" +
      "Você é meu lugar favorito.",
  };
}

function openInteractiveLetter() {
  if (letterStarted || !letterType || !loveEnvelope) return;
  letterStarted = true;
  loveEnvelope.classList.add("love-envelope--open");
  document.body.classList.add("letter-reading");
  letterType.textContent = "";
  if (letterFinal) letterFinal.classList.add("hidden");
  const content = getLetterContent();
  if (letterTitle) letterTitle.textContent = content.title;
  let index = 0;
  const timer = setInterval(() => {
    letterType.textContent += content.text[index];
    index += 1;
    if (index >= content.text.length) {
      clearInterval(timer);
      letterFinal?.classList.remove("hidden");
      loveEnvelope.classList.add("love-envelope--finished");
      burstHearts(56);
    }
  }, 30);
}

function initSectionPortals() {
  document.querySelectorAll('.quick-nav a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      showPortal(() => target.scrollIntoView({ behavior: "smooth", block: "start" }));
    });
  });
}

function createGalaxy() {
  const canvas = document.querySelector("#galaxyCanvas");

  if (!window.THREE || !canvas) {
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 7;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const starGeometry = new THREE.BufferGeometry();
  const starCount = 2800;
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);

  for (let index = 0; index < starCount; index += 1) {
    const radius = Math.random() * 9;
    const spin = radius * 1.6;
    const branch = (index % 6) * ((Math.PI * 2) / 6);
    positions[index * 3] = Math.cos(branch + spin) * radius + (Math.random() - 0.5) * 1.4;
    positions[index * 3 + 1] = (Math.random() - 0.5) * 1.1;
    positions[index * 3 + 2] = Math.sin(branch + spin) * radius + (Math.random() - 0.5) * 1.4;
    colors[index * 3] = 1;
    colors[index * 3 + 1] = 0.35 + Math.random() * 0.45;
    colors[index * 3 + 2] = 0.72 + Math.random() * 0.28;
  }

  starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  starGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const stars = new THREE.Points(
    starGeometry,
    new THREE.PointsMaterial({
      size: 0.035,
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  scene.add(stars);

  const planetGeometry = new THREE.SphereGeometry(0.34, 32, 32);
  const planets = [
    new THREE.Mesh(planetGeometry, new THREE.MeshStandardMaterial({ color: 0xff69b4, emissive: 0x451032 })),
    new THREE.Mesh(planetGeometry, new THREE.MeshStandardMaterial({ color: 0x8d5cff, emissive: 0x160b36 })),
  ];
  planets[0].position.set(-3.6, 1.2, -1.5);
  planets[1].position.set(3.7, -1.3, -2.2);
  planets.forEach((planet) => scene.add(planet));

  const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffb6dd, transparent: true, opacity: 0.32 });
  const constellation = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-2.5, -1.4, -2),
      new THREE.Vector3(-1.6, -0.8, -2),
      new THREE.Vector3(-0.5, -1.1, -2),
      new THREE.Vector3(0.2, -0.2, -2),
    ]),
    lineMaterial
  );
  scene.add(constellation);

  scene.add(new THREE.AmbientLight(0xffffff, 0.65));
  const pinkLight = new THREE.PointLight(0xff69b4, 2.7, 12);
  pinkLight.position.set(2, 2, 4);
  scene.add(pinkLight);

  function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animate() {
    requestAnimationFrame(animate);
    stars.rotation.y += 0.0009;
    stars.rotation.x += 0.0002;
    constellation.rotation.z += 0.0008;
    planets.forEach((planet, index) => {
      planet.rotation.y += 0.006;
      planet.position.y += Math.sin(Date.now() * 0.001 + index) * 0.0015;
    });
    renderer.render(scene, camera);
  }

  window.addEventListener("resize", resize);
  animate();
  galaxyReady = true;
}

enterButton?.addEventListener("click", startExperience);
wishButton?.addEventListener("click", blowCandle);
melHeartButton?.addEventListener("click", explodeMelHeart);
previousPhoto?.addEventListener("click", () => {
  showPhoto(currentPhoto - 1);
  restartGallery();
});
nextPhoto?.addEventListener("click", () => {
  showPhoto(currentPhoto + 1);
  restartGallery();
});
toggleMusic?.addEventListener("click", toggleCurrentMusic);
previousTrack?.addEventListener("click", playPreviousTrack);
nextTrack?.addEventListener("click", playNextTrack);
shuffleTrack?.addEventListener("click", playRandomTrack);
favoriteTrack?.addEventListener("click", toggleFavoriteTrack);
loveSong?.addEventListener("ended", playNextTrack);
loveSong?.addEventListener("pause", updateMusicButton);
loveSong?.addEventListener("play", updateMusicButton);
volumeControl?.addEventListener("input", () => {
  loveSong.volume = Number(volumeControl.value) / 100;
});
prevMonth?.addEventListener("click", () => {
  calendarDate.setMonth(calendarDate.getMonth() - 1);
  renderCalendar();
});
nextMonth?.addEventListener("click", () => {
  calendarDate.setMonth(calendarDate.getMonth() + 1);
  renderCalendar();
});
prevYear?.addEventListener("click", () => {
  calendarDate.setFullYear(calendarDate.getFullYear() - 1);
  renderCalendar();
});
nextYear?.addEventListener("click", () => {
  calendarDate.setFullYear(calendarDate.getFullYear() + 1);
  renderCalendar();
});
backToPresent?.addEventListener("click", returnToPresent);
botNext?.addEventListener("click", rotateBotPhrase);
shootArrow?.addEventListener("click", shootCupidArrow);
loveEnvelope?.addEventListener("click", openInteractiveLetter);
document.querySelectorAll(".quiz-option[data-correct]").forEach((button) => button.addEventListener("click", answerQuiz));

setInterval(updateRelationshipCounter, 1000);
setInterval(updateRealClock, 1000);
setInterval(rotateBotPhrase, 14000);
updateRelationshipCounter();
updateRealClock();
loadTrack(0);
initThemeSelector();
updatePhotoOfDay();
renderCalendar();
initGames();
initConstellationChips();
initSectionPortals();
observeFinalMessage();
createGalaxy();

if (!galaxyReady) {
  document.body.classList.add("no-galaxy");
}
