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
    spawnX: 140,
    bottom: 88,
    width: 46,
    height: 62,
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
    spawnX: 140,
    bottom: 86,
    width: 54,
    height: 70,
    removeX: 1100
  }
};

const UNIT_STATE = {
  MOVE: "MOVE",
  ATTACK: "ATTACK",
  DEAD: "DEAD"
};

class Unit {
  constructor(unitData, battlefield) {
    this.data = unitData;
    this.battlefield = battlefield;
    this.x = unitData.spawnX;
    this.hp = unitData.hp;
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

    this.battlefield.appendChild(this.el);
    this.render();
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

    this.target.takeDamage(this.atk);
    this.lastAttackTime = now;

    if (this.target.isRemoved || this.target.state === "DEAD") {
      this.target = null;
      this.setState(UNIT_STATE.MOVE);
    }
  }

  takeDamage(damage) {
    if (this.state === UNIT_STATE.DEAD) return;

    this.hp -= damage;

    if (this.hp <= 0) {
      this.die();
    }
  }

  die() {
    this.hp = 0;
    this.setState(UNIT_STATE.DEAD);
    this.remove();
  }

  setState(nextState) {
    if (this.state === nextState) return;

    this.state = nextState;
  }

  remove() {
    if (this.isRemoved) return;

    this.isRemoved = true;
    this.el.remove();
  }
}

class UnitManager {
  constructor(battlefieldId) {
    this.battlefield = document.getElementById(battlefieldId);
    this.units = [];
  }

  spawn(unitId) {
    const unitData = UNIT_DATA[unitId];
    if (!unitData || !this.battlefield) return null;

    const unit = new Unit(unitData, this.battlefield);
    this.units.push(unit);
    return unit;
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
