const ENEMY_DATA = {
  skeleton: {
    id: "skeleton",
    name: "Skeleton",
    hp: 100,
    atk: 10,
    speed: 1.5,
    attackRange: 25,
    attackInterval: 1000,
    spawnX: 920,
    bottom: 88,
    width: 46,
    height: 62,
    removeX: -60
  },
  minotaur: {
    id: "minotaur",
    name: "Minotaur",
    hp: 180,
    atk: 6,
    speed: 0.5,
    attackRange: 30,
    attackInterval: 1500,
    spawnX: 900,
    bottom: 82,
    width: 68,
    height: 86,
    removeX: -80
  }
};

const ENEMY_STATE = {
  MOVE: "MOVE",
  ATTACK: "ATTACK",
  DEAD: "DEAD"
};

class Enemy {
  constructor(enemyData, battlefield) {
    this.data = enemyData;
    this.battlefield = battlefield;
    this.x = enemyData.spawnX;
    this.hp = enemyData.hp;
    this.maxHp = enemyData.hp;
    this.atk = enemyData.atk;
    this.state = ENEMY_STATE.MOVE;
    this.target = null;
    this.lastAttackTime = 0;
    this.isRemoved = false;

    this.el = document.createElement("div");
    this.el.className = `enemy enemy-${enemyData.id}`;
    this.el.dataset.name = enemyData.name;
    this.el.style.width = enemyData.width + "px";
    this.el.style.height = enemyData.height + "px";
    this.el.style.bottom = enemyData.bottom + "px";

    this.hpBarFill = this.createHpBar();
    this.battlefield.appendChild(this.el);
    this.render();
  }

  update(units) {
    if (this.state === ENEMY_STATE.DEAD) return;

    this.updateTarget(units);

    if (this.state === ENEMY_STATE.ATTACK) {
      this.attack();
      this.render();
      return;
    }

    this.x -= this.data.speed;

    if (this.x <= this.data.removeX) {
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

  updateTarget(units) {
    if (this.target && (this.target.isRemoved || this.target.state === "DEAD")) {
      this.target = null;
      this.setState(ENEMY_STATE.MOVE);
    }

    if (!this.target) {
      this.target = this.findTarget(units);
    }

    if (this.target) {
      this.setState(ENEMY_STATE.ATTACK);
      return;
    }

    this.setState(ENEMY_STATE.MOVE);
  }

  findTarget(units) {
    for (let i = 0; i < units.length; i++) {
      const unit = units[i];

      if (unit.isRemoved || unit.state === "DEAD") continue;
      if (Math.abs(this.x - unit.x) <= this.data.attackRange) return unit;
    }

    return null;
  }

  attack() {
    if (!this.target || this.target.isRemoved) {
      this.target = null;
      this.setState(ENEMY_STATE.MOVE);
      return;
    }

    const now = Date.now();
    if (now - this.lastAttackTime < this.data.attackInterval) return;

    this.playAttackMotion();
    this.target.takeDamage(this.atk);
    this.lastAttackTime = now;

    if (this.target.isRemoved || this.target.state === "DEAD") {
      this.target = null;
      this.setState(ENEMY_STATE.MOVE);
    }
  }

  takeDamage(damage) {
    if (this.state === ENEMY_STATE.DEAD) return;

    this.hp -= damage;
    this.showDamageText(damage);
    this.updateHpBar();

    if (this.hp <= 0) {
      this.die();
    }
  }

  die() {
    this.hp = 0;
    this.updateHpBar();
    this.setState(ENEMY_STATE.DEAD);
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

class EnemyManager {
  constructor(battlefieldId) {
    this.battlefield = document.getElementById(battlefieldId);
    this.enemies = [];
    this.spawnTimers = {
      skeleton: {
        interval: 4000,
        lastSpawnTime: 0
      },
      minotaur: {
        interval: 12000,
        lastSpawnTime: 0
      }
    };
  }

  spawn(enemyId) {
    const enemyData = ENEMY_DATA[enemyId];
    if (!enemyData || !this.battlefield) return null;

    const enemy = new Enemy(enemyData, this.battlefield);
    this.enemies.push(enemy);
    return enemy;
  }

  update(units) {
    this.updateSpawnTimer();

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];

      if (enemy.isRemoved) {
        this.enemies.splice(i, 1);
        continue;
      }

      enemy.update(units);

      if (enemy.isRemoved) {
        this.enemies.splice(i, 1);
      }
    }
  }

  updateSpawnTimer() {
    const now = Date.now();

    Object.keys(this.spawnTimers).forEach(enemyId => {
      const spawnTimer = this.spawnTimers[enemyId];

      if (spawnTimer.lastSpawnTime === 0) {
        spawnTimer.lastSpawnTime = now;
        return;
      }

      if (now - spawnTimer.lastSpawnTime < spawnTimer.interval) return;

      this.spawn(enemyId);
      spawnTimer.lastSpawnTime = now;
    });
  }

  reset() {
    this.enemies.forEach(enemy => {
      enemy.remove();
    });

    this.enemies = [];
    Object.keys(this.spawnTimers).forEach(enemyId => {
      this.spawnTimers[enemyId].lastSpawnTime = Date.now();
    });
  }
}
