const UNIT_DATA = {
  swordsman: {
    id: "swordsman",
    name: "Swordsman",
    cost: 20,
    hp: 100,
    atk: 10,
    speed: 1.4,
    attackRange: 25,
    attackInterval: 1000,
    imagePath: "./assets/images/swordman.png",
    fallbackColor: "#d8dee9",
    spawnX: 220,
    bottom: 54,
    width: 104,
    height: 140,
    removeX: 1100
  },
  shieldman: {
    id: "shieldman",
    name: "Shieldman",
    cost: 35,
    hp: 220,
    atk: 6,
    speed: 0.8,
    attackRange: 25,
    attackInterval: 1200,
    imagePath: "./assets/images/shieldman.png",
    fallbackColor: "#9fb3c8",
    spawnX: 210,
    bottom: 50,
    width: 128,
    height: 168,
    removeX: 1100
  },
  archer: {
    id: "archer",
    name: "Archer",
    cost: 45,
    hp: 70,
    atk: 15,
    speed: 1.4,
    attackRange: 180,
    attackInterval: 1200,
    attackType: "projectile",
    projectileId: "arrow",
    imagePath: "./assets/images/archerman.png",
    fallbackColor: "#c8a46a",
    spawnX: 205,
    bottom: 55,
    width: 101,
    height: 137,
    removeX: 1100
  },
  allySkeleton: {
    id: "allySkeleton",
    name: "Skeleton",
    cost: 0,
    hp: 100,
    atk: 10,
    speed: 1.2,
    attackRange: 25,
    attackInterval: 1000,
    imagePath: "./assets/images/skeleton.png",
    fallbackColor: "#d7d7d7",
    spawnX: 220,
    bottom: 55,
    width: 99,
    height: 129,
    removeX: 1100,
    skipDeathPassive: true
  }
};

const UNIT_STATE = {
  MOVE: "MOVE",
  ATTACK: "ATTACK",
  DEAD: "DEAD"
};

class Unit {
  constructor(unitData, battlefield, projectileManager, unitManager, options) {
    this.data = unitData;
    this.battlefield = battlefield;
    this.projectileManager = projectileManager;
    this.unitManager = unitManager;
    this.x = options && typeof options.x === "number" ? options.x : unitData.spawnX;
    this.hp = unitData.hp;
    this.maxHp = unitData.hp;
    this.atk = unitData.atk;
    this.state = UNIT_STATE.MOVE;
    this.target = null;
    this.lastAttackTime = 0;
    this.isRemoved = false;

    this.el = document.createElement("div");
    this.el.className = `unit unit-${unitData.id}`;
    this.el.dataset.name = unitData.name;
    this.el.style.width = unitData.width + "px";
    this.el.style.height = unitData.height + "px";
    this.el.style.bottom = unitData.bottom + "px";
    this.applyImageFallback();

    this.hpBarFill = this.createHpBar();
    this.battlefield.appendChild(this.el);
    this.render();
  }

  applyImageFallback() {
    if (!window.applyImageFallback) return;

    window.applyImageFallback(this.el, this.data.imagePath, this.data.fallbackColor);
  }

  update(enemies) {
    if (this.state === UNIT_STATE.DEAD) return;

    this.updateTarget(enemies);

    if (this.state === UNIT_STATE.ATTACK) {
      this.attack();
      this.render();
      return;
    }

    this.x += this.data.speed;

    if (this.x >= this.data.removeX) {
      this.remove();
      return;
    }

    this.render();
  }

  render() {
    this.el.style.left = this.x + "px";
    this.el.dataset.state = this.state;
    this.updateHpBar();
  }

  createHpBar() {
    const hpBar = document.createElement("div");
    const hpBarFill = document.createElement("div");

    hpBar.className = "hp-bar";
    hpBarFill.className = "hp-bar-fill";
    hpBar.appendChild(hpBarFill);
    this.el.appendChild(hpBar);

    return hpBarFill;
  }

  updateHpBar() {
    const hpRatio = Math.max(0, this.hp) / this.maxHp;
    this.hpBarFill.style.width = hpRatio * 100 + "%";
  }

  updateTarget(enemies) {
    if (this.target && (this.target.isRemoved || this.target.state === "DEAD")) {
      this.target = null;
      this.setState(UNIT_STATE.MOVE);
    }

    if (!this.target) {
      this.target = this.findTarget(enemies);
    }

    if (this.target) {
      this.setState(UNIT_STATE.ATTACK);
      return;
    }

    this.setState(UNIT_STATE.MOVE);
  }

  findTarget(enemies) {
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];

      if (enemy.isRemoved || enemy.state === "DEAD") continue;
      if (Math.abs(this.x - enemy.x) <= this.data.attackRange) return enemy;
    }

    return null;
  }

  attack() {
    if (!this.target || this.target.isRemoved) {
      this.target = null;
      this.setState(UNIT_STATE.MOVE);
      return;
    }

    const now = Date.now();
    if (now - this.lastAttackTime < this.data.attackInterval) return;

    this.playAttackMotion();
    this.dealDamage();
    this.lastAttackTime = now;

    if (this.target.isRemoved || this.target.state === "DEAD") {
      this.target = null;
      this.setState(UNIT_STATE.MOVE);
    }
  }

  dealDamage() {
    if (this.data.attackType === "projectile") {
      this.fireProjectile();
      return;
    }

    window.soundManager && window.soundManager.play("slash");
    this.target.takeDamage(this.atk);
  }

  fireProjectile() {
    if (!this.projectileManager || !this.data.projectileId) return;

    window.soundManager && window.soundManager.play("arrow");
    this.projectileManager.spawn(this.data.projectileId, {
      x: this.x + this.data.width,
      bottom: this.data.bottom + this.data.height * 0.55,
      damage: this.atk,
      direction: 1
    });
  }

  takeDamage(damage) {
    if (this.state === UNIT_STATE.DEAD) return;

    this.hp -= damage;
    this.showDamageText(damage);
    this.updateHpBar();

    if (this.hp <= 0) {
      this.die();
    }
  }

  die() {
    this.hp = 0;
    window.soundManager && window.soundManager.play("death");
    this.updateHpBar();
    this.setState(UNIT_STATE.DEAD);
    this.unitManager.handleUnitDeath(this);
    this.remove(true);
  }

  playAttackMotion() {
    this.el.classList.remove("attack-motion");

    requestAnimationFrame(() => {
      this.el.classList.add("attack-motion");

      setTimeout(() => {
        this.el.classList.remove("attack-motion");
      }, 120);
    });
  }

  showDamageText(damage) {
    const damageText = document.createElement("div");

    damageText.className = "damage-text";
    damageText.textContent = `-${damage}`;
    this.el.appendChild(damageText);

    setTimeout(() => {
      damageText.remove();
    }, 700);
  }

  setState(nextState) {
    if (this.state === nextState) return;

    this.state = nextState;
  }

  remove(useFade) {
    if (this.isRemoved) return;

    this.isRemoved = true;

    if (useFade) {
      this.el.classList.add("dead-fade");

      setTimeout(() => {
        this.el.remove();
      }, 300);

      return;
    }

    this.el.remove();
  }
}

class UnitManager {
  constructor(battlefieldId, projectileManager) {
    this.battlefield = document.getElementById(battlefieldId);
    this.projectileManager = projectileManager;
    this.selectedHero = null;
    this.units = [];
  }

  setSelectedHero(hero) {
    this.selectedHero = hero;
  }

  spawn(unitId, options) {
    const unitData = this.createUnitData(unitId);
    if (!unitData || !this.battlefield) return null;

    const unit = new Unit(unitData, this.battlefield, this.projectileManager, this, options);
    this.units.push(unit);
    window.soundManager && window.soundManager.play("summon");
    return unit;
  }

  createUnitData(unitId) {
    const baseData = UNIT_DATA[unitId];
    if (!baseData) return null;

    const unitData = { ...baseData };
    this.applyHeroPassive(unitData);
    return unitData;
  }

  applyHeroPassive(unitData) {
    if (!this.selectedHero || !this.selectedHero.passive) return;

    const passive = this.selectedHero.passive;
    const isTargetUnit = passive.unitId === "all" || passive.unitId === unitData.id;

    if (passive.type !== "unitStatMultiplier" || !isTargetUnit) return;
    if (typeof unitData[passive.stat] !== "number") return;

    unitData[passive.stat] = Math.round(unitData[passive.stat] * passive.multiplier);
  }

  handleUnitDeath(unit) {
    const passive = this.selectedHero && this.selectedHero.passive;

    if (!passive || passive.type !== "reviveAsAllySkeleton") return;
    if (unit.data.skipDeathPassive) return;
    if (Math.random() >= passive.chance) return;

    this.spawn(passive.unitId, {
      x: unit.x
    });
  }

  update(enemies) {
    for (let i = this.units.length - 1; i >= 0; i--) {
      const unit = this.units[i];

      if (unit.isRemoved) {
        this.units.splice(i, 1);
        continue;
      }

      unit.update(enemies);

      if (unit.isRemoved) {
        this.units.splice(i, 1);
      }
    }
  }

  reset() {
    this.units.forEach(unit => {
      unit.remove();
    });

    this.units = [];
  }
}
