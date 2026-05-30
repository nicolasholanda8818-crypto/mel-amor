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

let currentPhoto = 0;
let galleryTimer = null;
let typewriterStarted = false;
let galaxyReady = false;

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
  loveSong.volume = 0.55;
  loveSong.play().catch(() => {
    console.log("A musica precisa do arquivo static/music/musica.mp3 para tocar.");
  });
}

function galleryItems() {
  return Array.from(document.querySelectorAll(".polaroid"));
}

function showPhoto(index) {
  const photos = galleryItems();
  if (!photos.length) {
    return;
  }

  photos[currentPhoto].classList.remove("active");
  currentPhoto = (index + photos.length) % photos.length;
  photos[currentPhoto].classList.add("active");

  if (galleryCounter) {
    galleryCounter.textContent = `${currentPhoto + 1} / ${photos.length}`;
  }
}

function startGallery() {
  const photos = galleryItems();
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
  const colors = ["#ff4fa3", "#ffd36a", "#8d5cff", "#ffffff", "#5be7ff"];

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

  for (let index = 0; index < 180; index += 1) {
    const fragment = document.createElement("span");
    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * 360;
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

  burstHearts(80);
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

function createGalaxy() {
  const canvas = document.querySelector("#galaxyCanvas");

  if (!window.THREE || !canvas) {
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 6;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const starGeometry = new THREE.BufferGeometry();
  const starCount = 2400;
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);

  for (let index = 0; index < starCount; index += 1) {
    const radius = Math.random() * 8.5;
    const spin = radius * 1.6;
    const branch = (index % 5) * ((Math.PI * 2) / 5);
    const randomX = (Math.random() - 0.5) * 1.4;
    const randomY = (Math.random() - 0.5) * 0.9;
    const randomZ = (Math.random() - 0.5) * 1.4;

    positions[index * 3] = Math.cos(branch + spin) * radius + randomX;
    positions[index * 3 + 1] = randomY;
    positions[index * 3 + 2] = Math.sin(branch + spin) * radius + randomZ;

    colors[index * 3] = 1;
    colors[index * 3 + 1] = 0.3 + Math.random() * 0.5;
    colors[index * 3 + 2] = 0.72 + Math.random() * 0.28;
  }

  starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  starGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const starMaterial = new THREE.PointsMaterial({
    size: 0.035,
    vertexColors: true,
    transparent: true,
    opacity: 0.92,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);

  const heartShape = new THREE.Shape();
  heartShape.moveTo(0, 0.28);
  heartShape.bezierCurveTo(0, 0, -0.5, 0, -0.5, 0.32);
  heartShape.bezierCurveTo(-0.5, 0.72, 0, 0.9, 0, 1.18);
  heartShape.bezierCurveTo(0, 0.9, 0.5, 0.72, 0.5, 0.32);
  heartShape.bezierCurveTo(0.5, 0, 0, 0, 0, 0.28);

  const heartGeometry = new THREE.ExtrudeGeometry(heartShape, {
    depth: 0.12,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 2,
    bevelSize: 0.02,
    bevelThickness: 0.02,
  });
  heartGeometry.center();

  const heartMaterial = new THREE.MeshStandardMaterial({
    color: 0xff4fa3,
    emissive: 0x801040,
    roughness: 0.35,
    metalness: 0.25,
  });

  const hearts = [];
  for (let index = 0; index < 26; index += 1) {
    const heart = new THREE.Mesh(heartGeometry, heartMaterial.clone());
    heart.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 6, -Math.random() * 7);
    heart.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    const scale = 0.16 + Math.random() * 0.24;
    heart.scale.set(scale, scale, scale);
    scene.add(heart);
    hearts.push(heart);
  }

  scene.add(new THREE.AmbientLight(0xffffff, 0.65));

  const pinkLight = new THREE.PointLight(0xff4fa3, 2.6, 12);
  pinkLight.position.set(2, 2, 4);
  scene.add(pinkLight);

  const goldLight = new THREE.PointLight(0xffd36a, 1.4, 10);
  goldLight.position.set(-3, -1, 3);
  scene.add(goldLight);

  function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animate() {
    requestAnimationFrame(animate);
    stars.rotation.y += 0.0009;
    stars.rotation.x += 0.0002;

    hearts.forEach((heart, index) => {
      heart.rotation.y += 0.01 + index * 0.0004;
      heart.position.y += Math.sin(Date.now() * 0.001 + index) * 0.002;
    });

    renderer.render(scene, camera);
  }

  window.addEventListener("resize", resize);
  animate();
  galaxyReady = true;
}

enterButton.addEventListener("click", startExperience);
wishButton.addEventListener("click", blowCandle);
melHeartButton.addEventListener("click", explodeMelHeart);
previousPhoto.addEventListener("click", () => {
  showPhoto(currentPhoto - 1);
  restartGallery();
});
nextPhoto.addEventListener("click", () => {
  showPhoto(currentPhoto + 1);
  restartGallery();
});
document.querySelectorAll(".quiz-option").forEach((button) => button.addEventListener("click", answerQuiz));
setInterval(updateRelationshipCounter, 1000);
updateRelationshipCounter();
observeFinalMessage();
createGalaxy();

if (!galaxyReady) {
  document.body.classList.add("no-galaxy");
}
