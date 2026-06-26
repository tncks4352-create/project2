const HEROES = [
  {
    id: "zeus",
    name: "제우스",
    icon: "⚡",
    rarity: "UR",
    role: "광역 공격",
    color: "#ffd166",
    skill1: "연쇄 번개",
    skill2: "천둥 강림",
    ultimate: "천벌"
  },
  {
    id: "poseidon",
    name: "포세이돈",
    icon: "🌊",
    rarity: "UR",
    role: "방어 / 넉백",
    color: "#4dabf7",
    skill1: "물창",
    skill2: "해일",
    ultimate: "바다의 분노"
  },
  {
    id: "hades",
    name: "하데스",
    icon: "☠️",
    rarity: "UR",
    role: "소환 / 지속전",
    color: "#9b5de5",
    skill1: "영혼 흡수",
    skill2: "저주의 안개",
    ultimate: "망자의 군단"
  },
  {
    id: "athena",
    name: "아테나",
    icon: "🛡️",
    rarity: "SSR",
    role: "보호 / 회복",
    color: "#f8f9fa",
    skill1: "축복",
    skill2: "수호 방패",
    ultimate: "신성한 성역"
  },
  {
    id: "heracles",
    name: "헤라클레스",
    icon: "💪",
    rarity: "SSR",
    role: "한 방 폭딜",
    color: "#ff922b",
    skill1: "강타",
    skill2: "지면 분쇄",
    ultimate: "신의 일격"
  },
  {
    id: "apollo",
    name: "아폴론",
    icon: "☀️",
    rarity: "SSR",
    role: "원거리 저격",
    color: "#ffe066",
    skill1: "태양 화살",
    skill2: "태양 폭발",
    ultimate: "태양의 심판"
  }
];

const keys = {};
let player;
let unitManager;
let selectedHero = null;

const gameData = {
  playerBaseHp: 500,
  enemyBaseHp: 700,
  stage: 1
};

window.addEventListener("DOMContentLoaded", () => {
  player = new Player();
  unitManager = new UnitManager("battlefield");

  createHeroCards();
  setupUnitButtons();

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

function setupUnitButtons() {
  const swordsmanBtn = document.getElementById("swordsmanBtn");

  if (!swordsmanBtn) return;

  swordsmanBtn.addEventListener("click", () => {
    recruitUnit(swordsmanBtn.dataset.unitId);
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
        ${hero.skill1} · ${hero.skill2} · ${hero.ultimate}
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

  document.getElementById("skill1Btn").innerHTML =
    `${selectedHero.skill1}<br><small>15 신력</small>`;

  document.getElementById("skill2Btn").innerHTML =
    `${selectedHero.skill2}<br><small>40 신력</small>`;

  document.getElementById("ultimateBtn").innerHTML =
    `${selectedHero.ultimate}<br><small>0%</small>`;

  player.reset();
  unitManager.reset();
  showScreen("gameScreen");
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
    unitManager.update();
    updateUI();
  }

  requestAnimationFrame(loop);
}
