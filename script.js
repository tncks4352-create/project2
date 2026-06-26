const battlefield = document.getElementById("battlefield");
const heroEl = document.getElementById("hero");

const manaEl = document.getElementById("mana");
const heroHpBar = document.getElementById("heroHpBar");
const playerBaseHpEl = document.getElementById("playerBaseHp");
const enemyBaseHpEl = document.getElementById("enemyBaseHp");

const resultModal = document.getElementById("resultModal");
const resultText = document.getElementById("resultText");

const keys = {};

let gameOver = false;
let mana = 0;
let playerBaseHp = 500;
let enemyBaseHp = 700;
let enemySpawnLevel = 1;

const hero = {
  x: 130,
  y: 88,
  hp: 200,
  maxHp: 200,
  speed: 4,
  atk: 18,
  range: 80,
  attackCooldown: 0
};

const units = [];
const enemies = [];

const unitData = {
  rabbit: {
    name: "🐰",
    className: "rabbit",
    cost: 20,
    hp: 70,
    atk: 10,
    range: 35,
    speed: 1.25,
    cooldown: 45
  },
  cat: {
    name: "🐱",
    className: "cat",
    cost: 35,
    hp: 55,
    atk: 16,
    range: 150,
    speed: 0.9,
    cooldown: 65
  },
  bear: {
    name: "🐻",
    className: "bear",
    cost: 55,
    hp: 150,
    atk: 22,
    range: 45,
    speed: 0.65,
    cooldown: 80
  }
};

const enemyData = {
  zombie: {
    name: "Z",
    className: "zombie",
    hp: 65,
    atk: 9,
    range: 35,
    speed: 0.7,
    cooldown: 55
  },
  skeleton: {
    name: "S",
    className: "skeleton",
    hp: 45,
    atk: 14,
    range: 120,
    speed: 0.9,
    cooldown: 70
  },
  golem: {
    name: "G",
    className: "golem",
    hp: 180,
    atk: 24,
    range: 45,
    speed: 0.45,
    cooldown: 90
  }
};

document.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;

  if (e.code === "Space") heroAttack();
  if (e.key === "1") spawnUnit("rabbit");
  if (e.key === "2") spawnUnit("cat");
  if (e.key === "3") spawnUnit("bear");
  if (e.key.toLowerCase() === "q") healSkill();
  if (e.key.toLowerCase() === "e") lightningSkill();
});

document.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

document.querySelectorAll(".slot[data-unit]").forEach(button => {
  button.addEventListener("click", () => {
    spawnUnit(button.dataset.unit);
  });
});

document.getElementById("healBtn").addEventListener("click", healSkill);
document.getElementById("lightningBtn").addEventListener("click", lightningSkill);

function createCharacter(type, data, x, team) {
  const el = document.createElement("div");
  el.className = `${team} ${data.className}`;
  el.textContent = data.name;
  battlefield.appendChild(el);

  return {
    type,
    team,
    x,
    hp: data.hp,
    maxHp: data.hp,
    atk: data.atk,
    range: data.range,
    speed: data.speed,
    cooldown: data.cooldown,
    attackTimer: 0,
    el
  };
}

function spawnUnit(type) {
  const data = unitData[type];

  if (!data || mana < data.cost || gameOver) return;

  mana -= data.cost;

  const unit = createCharacter(type, data, hero.x + 70, "unit");
  units.push(unit);
}

function spawnEnemy() {
  if (gameOver) return;

  let type = "zombie";

  const random = Math.random();

  if (enemySpawnLevel >= 2 && random > 0.65) type = "skeleton";
  if (enemySpawnLevel >= 3 && random > 0.78) type = "golem";

  const enemy = createCharacter(type, enemyData[type], 930, "enemy");
  enemies.push(enemy);
}

function updateHero() {
  if (keys["a"]) hero.x -= hero.speed;
  if (keys["d"]) hero.x += hero.speed;

  hero.x = Math.max(115, Math.min(hero.x, 830));
  heroEl.style.left = hero.x + "px";

  if (hero.attackCooldown > 0) hero.attackCooldown--;
}

function heroAttack() {
  if (hero.attackCooldown > 0 || gameOver) return;

  const target = enemies.find(enemy => Math.abs(enemy.x - hero.x) <= hero.range);

  if (target) {
    target.hp -= hero.atk;
    showDamage(target.x, 340, hero.atk);
  }

  hero.attackCooldown = 35;
}

function updateUnits() {
  for (let i = units.length - 1; i >= 0; i--) {
    const unit = units[i];

    if (unit.attackTimer > 0) unit.attackTimer--;

    const target = enemies.find(enemy => Math.abs(enemy.x - unit.x) <= unit.range);

    if (target) {
      if (unit.attackTimer <= 0) {
        target.hp -= unit.atk;
        showDamage(target.x, 340, unit.atk);
        unit.attackTimer = unit.cooldown;
      }
    } else {
      unit.x += unit.speed;
    }

    if (unit.x >= 940) {
      enemyBaseHp -= unit.atk;
      showDamage(990, 300, unit.atk);
      removeCharacter(unit, units, i);
      continue;
    }

    if (unit.hp <= 0) {
      removeCharacter(unit, units, i);
      continue;
    }

    unit.el.style.left = unit.x + "px";
  }
}

function updateEnemies() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];

    if (enemy.attackTimer > 0) enemy.attackTimer--;

    const targetUnit = units.find(unit => Math.abs(unit.x - enemy.x) <= enemy.range);

    if (targetUnit) {
      if (enemy.attackTimer <= 0) {
        targetUnit.hp -= enemy.atk;
        showDamage(targetUnit.x, 310, enemy.atk);
        enemy.attackTimer = enemy.cooldown;
      }
    } else if (Math.abs(enemy.x - hero.x) <= enemy.range + 20) {
      if (enemy.attackTimer <= 0) {
        hero.hp -= enemy.atk;
        showDamage(hero.x, 300, enemy.atk);
        enemy.attackTimer = enemy.cooldown;
      }
    } else {
      enemy.x -= enemy.speed;
    }

    if (enemy.x <= 90) {
      playerBaseHp -= enemy.atk;
      showDamage(60, 300, enemy.atk);
      removeCharacter(enemy, enemies, i);
      continue;
    }

    if (enemy.hp <= 0) {
      mana = Math.min(100, mana + 8);
      removeCharacter(enemy, enemies, i);
      continue;
    }

    enemy.el.style.left = enemy.x + "px";
  }
}

function healSkill() {
  if (mana < 30 || gameOver) return;

  mana -= 30;
  hero.hp = Math.min(hero.maxHp, hero.hp + 55);

  units.forEach(unit => {
    unit.hp = Math.min(unit.maxHp, unit.hp + 25);
  });
}

function lightningSkill() {
  if (mana < 45 || gameOver) return;

  mana -= 45;

  enemies.forEach(enemy => {
    enemy.hp -= 40;
    showDamage(enemy.x, 300, 40);
  });
}

function removeCharacter(character, list, index) {
  character.el.remove();
  list.splice(index, 1);
}

function showDamage(x, y, amount) {
  const text = document.createElement("div");
  text.className = "damageText";
  text.textContent = `-${amount}`;
  text.style.left = x + "px";
  text.style.top = y + "px";
  battlefield.appendChild(text);

  setTimeout(() => {
    text.remove();
  }, 600);
}

function updateResource() {
  mana += 0.06;
  mana = Math.min(100, mana);
}

function updateUI() {
  manaEl.textContent = Math.floor(mana);
  playerBaseHpEl.textContent = Math.max(0, Math.floor(playerBaseHp));
  enemyBaseHpEl.textContent = Math.max(0, Math.floor(enemyBaseHp));

  const hpPercent = Math.max(0, hero.hp / hero.maxHp * 100);
  heroHpBar.style.width = hpPercent + "%";
}

function checkGameEnd() {
  if (hero.hp <= 0 || playerBaseHp <= 0) {
    endGame(false);
  }

  if (enemyBaseHp <= 0) {
    endGame(true);
  }
}

function endGame(isWin) {
  gameOver = true;
  resultModal.classList.remove("hidden");
  resultText.textContent = isWin ? "승리!" : "패배!";
}

function gameLoop() {
  if (!gameOver) {
    updateHero();
    updateUnits();
    updateEnemies();
    updateResource();
    updateUI();
    checkGameEnd();
  }

  requestAnimationFrame(gameLoop);
}

setInterval(spawnEnemy, 2300);

setInterval(() => {
  enemySpawnLevel++;
}, 20000);

gameLoop();