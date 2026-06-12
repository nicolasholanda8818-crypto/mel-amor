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
const calendarTitle = document.querySelector("#calendarTitle");
const calendarGrid = document.querySelector("#calendarGrid");
const prevMonth = document.querySelector("#prevMonth");
const nextMonth = document.querySelector("#nextMonth");
const backToPresent = document.querySelector("#backToPresent");
const timeMachine = document.querySelector("#timeMachine");
const botPhrase = document.querySelector("#botPhrase");
const botNext = document.querySelector("#botNext");
const enableNotifications = document.querySelector("#enableNotifications");
const coupleQuizScore = document.querySelector("#coupleQuizScore");
const huntScore = document.querySelector("#huntScore");
const heartHunt = document.querySelector("#heartHunt");
const memoryBoard = document.querySelector("#memoryBoard");
const shootArrow = document.querySelector("#shootArrow");
const targetHeart = document.querySelector("#targetHeart");
const arrowsLeft = document.querySelector("#arrowsLeft");
const cupidoMessage = document.querySelector("#cupidoMessage");

const relationshipStart = new Date(2025, 10, 14, 0, 0, 0);
const finalText =
  "Mel ❤️\n" +
  "Em um universo tão grande, cheio de estrelas e caminhos infinitos, a minha maior sorte foi encontrar você.\n" +
  "Entre bilhões de pessoas, foi o seu sorriso que se tornou o meu lugar favorito.\n" +
  "Foi com você que momentos simples ficaram especiais, risadas viraram memórias e dias comuns viraram histórias que quero guardar para sempre.\n" +
  "Cada segundo ao seu lado se transformou em algo que eu nunca quero perder.\n" +
  "Você é a minha princesa, minha melhor companhia, meu carinho, minha paz e uma das partes mais bonitas da minha vida.\n" +
  "Quero continuar construindo lembranças, viagens, sonhos e momentos ao seu lado.\n" +
  "Hoje é o seu aniversário, mas quem ganhou o maior presente fui eu: ter você na minha vida.\n" +
  "Feliz aniversário, Mel.\n" +
  "Eu te amo infinitamente ❤️✨";

const botPhrases = [
  "Hoje é um ótimo dia para criar uma memória ❤",
  "Não esqueçam de registrar um momento especial ✨",
  "O universo fica mais bonito quando vocês estão juntos.",
  "Uma foto de hoje pode virar uma saudade linda amanhã.",
  "Cuidem do amor como quem cuida de uma estrela rara.",
];

let currentPhoto = 0;
let galleryTimer = null;
let typewriterStarted = false;
let galaxyReady = false;
let calendarDate = new Date();
let coupleScore = 0;
let huntFound = 0;
let arrows = 3;
let flippedCards = [];
let matchedCards = 0;

function startExperience() {
  intro.classList.add("intro--open");
  siteShell.classList.remove("hidden");
  startMusic();
  startGallery();
  updateRelationshipCounter();
  burstHearts(26);

  setTimeout(() => {
    intro.style.display = "none";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 900);
}

function startMusic() {
  loveSong.volume = Number(volumeControl?.value || 55) / 100;
  loveSong.play().catch(() => {
    console.log("A música precisa do arquivo static/music/musica.mp3 para tocar.");
  });
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

function explodeMelHeart() {
  if (!melHeartButton) {
    return;
  }

  melHeartButton.classList.remove("orbit-card--explode");
  void melHeartButton.offsetWidth;
  melHeartButton.classList.add("orbit-card--explode");

  heartToast.textContent = "Meu coração se apaixonou pelo seu ❤️";
  heartToast.classList.add("heart-toast--show");

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
  setTimeout(() => heartToast.classList.remove("heart-toast--show"), 3200);
}

function answerQuiz(event) {
  const option = event.currentTarget;
  const isCorrect = option.dataset.correct === "true";

  if (isCorrect) {
    quizAnswer.textContent = "💖 Acertou Mel!";
    burstHearts(42);
    return;
  }

  quizAnswer.textContent = "Quase, princesa. A resposta é Morro Branco ❤";
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
  const photos = Array.from(document.querySelectorAll(".polaroid"));
  const videos = Array.from(document.querySelectorAll(".video-card"));
  const diary = Array.from(document.querySelectorAll(".diary-card"));
  const events = Array.from(document.querySelectorAll(".timeline__item"));

  const matches = [...photos, ...videos, ...diary, ...events].filter((item) => item.dataset.date === dateKey);
  [...photos, ...videos, ...diary, ...events].forEach((item) => {
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
  const current = botPhrases.indexOf(botPhrase.textContent);
  botPhrase.textContent = botPhrases[(current + 1 + botPhrases.length) % botPhrases.length];
}

function requestNotifications() {
  if (!("Notification" in window)) {
    botPhrase.textContent = "Seu navegador não permite notificações aqui, mas o carinho continua salvo ✨";
    return;
  }

  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      new Notification("Universo da Mel", {
        body: "Não esqueçam de registrar um momento especial ✨",
      });
    }
  });
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

  if (heartHunt) {
    for (let index = 0; index < 5; index += 1) {
      const hiddenHeart = document.createElement("button");
      hiddenHeart.type = "button";
      hiddenHeart.className = "hidden-heart";
      hiddenHeart.textContent = "❤";
      hiddenHeart.style.left = `${8 + Math.random() * 82}%`;
      hiddenHeart.style.top = `${42 + Math.random() * 45}%`;
      hiddenHeart.addEventListener("click", () => {
        if (hiddenHeart.classList.contains("found")) return;
        hiddenHeart.classList.add("found");
        huntFound += 1;
        huntScore.textContent = `${huntFound} / 5`;
        burstHearts(10);
      });
      heartHunt.appendChild(hiddenHeart);
    }
  }

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
toggleMusic?.addEventListener("click", () => {
  if (loveSong.paused) startMusic();
  else loveSong.pause();
});
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
backToPresent?.addEventListener("click", returnToPresent);
botNext?.addEventListener("click", rotateBotPhrase);
enableNotifications?.addEventListener("click", requestNotifications);
shootArrow?.addEventListener("click", shootCupidArrow);
document.querySelectorAll(".quiz-option").forEach((button) => button.addEventListener("click", answerQuiz));

setInterval(updateRelationshipCounter, 1000);
setInterval(rotateBotPhrase, 14000);
updateRelationshipCounter();
renderCalendar();
initGames();
observeFinalMessage();
createGalaxy();

if (!galaxyReady) {
  document.body.classList.add("no-galaxy");
}
