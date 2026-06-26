const HEROES = window.HEROES;
const keys = {};
let player;
let unitManager;
let enemyManager;
let projectileManager;
let skillManager;
let soundManager;
let selectedHero = null;

const gameData = {
  playerBaseHp: 500,
  enemyBaseHp: 700,
  stage: 1
};

const VISUAL_ASSETS = {
  playerBase: {
    path: "./assets/images/ancienttemple.png",
    fallbackColor: "#574b90"
  },
  enemyBase: {
    path: "./assets/images/darktemple.png",
    fallbackColor: "#8b1e3f"
  },
  zeus: {
    path: "./assets/images/zeus.png",
    fallbackColor: "#ffd166"
  },
  poseidon: {
    path: "./assets/images/poseidon.png",
    fallbackColor: "#4dabf7"
  }
};

window.addEventListener("DOMContentLoaded", () => {
  soundManager = new SoundManager();
  window.soundManager = soundManager;
  window.applyImageFallback = applyImageFallback;

  player = new Player();
  projectileManager = new ProjectileManager("battlefield");
  unitManager = new UnitManager("battlefield", projectileManager);
  enemyManager = new EnemyManager("battlefield");
  skillManager = new SkillManager("battlefield", enemyManager);

  createHeroCards();
  setupStaticImageFallbacks();
  setupButtonSounds();
  setupUnitButtons();
  setupSkillButtons();

  document.getElementById("goSelectBtn").onclick = () => {
    showScreen("heroSelectScreen");
  };

  document.getElementById("startBattleBtn").onclick = () => {
    if (!selectedHero) return;
    startBattle();
  };

  document.addEventListener("keydown", e => {
    keys[e.key.toLowerCase()] = true;
  });

  document.addEventListener("keyup", e => {
    keys[e.key.toLowerCase()] = false;
  });

  loop();
});

function applyImageFallback(el, imagePath, fallbackColor) {
  if (!el || !imagePath) return;

  const image = new Image();

  image.onload = () => {
    el.style.backgroundColor = "transparent";
    el.style.borderColor = "transparent";
  };

  image.onerror = () => {
    el.style.backgroundImage = "none";
    el.style.backgroundColor = fallbackColor;
    el.style.borderColor = "#000";
  };

  image.src = imagePath;
}

function setupStaticImageFallbacks() {
  applyImageFallback(
    document.getElementById("playerBase"),
    VISUAL_ASSETS.playerBase.path,
    VISUAL_ASSETS.playerBase.fallbackColor
  );

  applyImageFallback(
    document.getElementById("enemyBase"),
    VISUAL_ASSETS.enemyBase.path,
    VISUAL_ASSETS.enemyBase.fallbackColor
  );
}

function setupButtonSounds() {
  document.addEventListener("click", e => {
    if (!e.target.closest("button")) return;
    soundManager.play("button");
  });
}

function setupUnitButtons() {
  const unitButtons = document.querySelectorAll("[data-unit-id]");

  unitButtons.forEach(button => {
    button.addEventListener("click", () => {
      recruitUnit(button.dataset.unitId);
    });
  });
}

function setupSkillButtons() {
  document.getElementById("skill1Btn").addEventListener("click", () => {
    skillManager.useSkill(selectedHero, "skill1", player);
  });

  document.getElementById("skill2Btn").addEventListener("click", () => {
    skillManager.useSkill(selectedHero, "skill2", player);
  });
}

function recruitUnit(unitId) {
  const unitData = UNIT_DATA[unitId];

  if (!unitData || !player || !unitManager) return;
  if (player.mana < unitData.cost) return;

  player.mana -= unitData.cost;
  unitManager.spawn(unitId);
}

function createHeroCards() {
  const heroGrid = document.getElementById("heroGrid");

  HEROES.forEach(hero => {
    const card = document.createElement("button");
    card.className = "heroCard";
    card.style.setProperty("--hero-color", hero.color);

    card.innerHTML = `
      <div class="heroTop">
        <div class="heroIcon">${hero.icon}</div>
        <div class="rarity">${hero.rarity}</div>
      </div>
      <div class="heroName">${hero.name}</div>
      <div class="heroRole">${hero.role}</div>
      <div class="heroSkills">
        ${hero.skill1} / ${hero.skill2} / ${hero.ultimate}
      </div>
    `;

    card.addEventListener("click", () => {
      selectHero(hero, card);
    });

    heroGrid.appendChild(card);
  });
}

function selectHero(hero, selectedCard) {
  selectedHero = hero;

  document.querySelectorAll(".heroCard").forEach(card => {
    card.classList.remove("selected");
  });

  selectedCard.classList.add("selected");
  document.getElementById("selectedHeroText").textContent = `${hero.icon} ${hero.name}`;
  document.getElementById("startBattleBtn").disabled = false;
}

function startBattle() {
  document.documentElement.style.setProperty("--active-hero-color", selectedHero.color);

  document.getElementById("currentHeroName").textContent =
    `${selectedHero.icon} ${selectedHero.name}`;

  document.getElementById("player").dataset.name = selectedHero.name;
  document.getElementById("player").className = `hero-${selectedHero.id}`;
  applyHeroImageFallback(selectedHero);

  document.getElementById("skill1Btn").innerHTML =
    `${selectedHero.skill1}<br><small>15 신력</small>`;

  document.getElementById("skill2Btn").innerHTML =
    `${selectedHero.skill2}<br><small>40 신력</small>`;

  document.getElementById("ultimateBtn").innerHTML =
    `${selectedHero.ultimate}<br><small>0%</small>`;

  player.reset();
  unitManager.setSelectedHero(selectedHero);
  unitManager.reset();
  enemyManager.reset();
  projectileManager.reset();
  soundManager.playBgm();
  showScreen("gameScreen");
}

function applyHeroImageFallback(hero) {
  const heroAsset = VISUAL_ASSETS[hero.id];
  if (!heroAsset) return;

  applyImageFallback(
    document.getElementById("player"),
    heroAsset.path,
    heroAsset.fallbackColor
  );
}

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  document.getElementById(screenId).classList.add("active");
}

function updateUI() {
  document.getElementById("playerBaseHp").textContent = gameData.playerBaseHp;
  document.getElementById("enemyBaseHp").textContent = gameData.enemyBaseHp;
  document.getElementById("manaText").textContent = Math.floor(player.mana);
}

function loop() {
  if (document.getElementById("gameScreen").classList.contains("active")) {
    player.update(keys);
    unitManager.update(enemyManager.enemies);
    enemyManager.update(unitManager.units);
    projectileManager.update(enemyManager.enemies);
    updateUI();
  }

  requestAnimationFrame(loop);
}
