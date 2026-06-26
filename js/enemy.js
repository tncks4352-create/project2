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

    if (this.hp <= 0) {
      this.die();
    }
  }

  die() {
    this.hp = 0;
    this.setState(ENEMY_STATE.DEAD);
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

class EnemyManager {
  constructor(battlefieldId) {
    this.battlefield = document.getElementById(battlefieldId);
    this.enemies = [];
    this.spawnInterval = 3000;
    this.lastSpawnTime = 0;
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

    if (this.lastSpawnTime === 0) {
      this.lastSpawnTime = now;
      return;
    }

    if (now - this.lastSpawnTime < this.spawnInterval) return;

    this.spawn("skeleton");
    this.lastSpawnTime = now;
  }

  reset() {
    this.enemies.forEach(enemy => {
      enemy.remove();
    });

    this.enemies = [];
    this.lastSpawnTime = Date.now();
  }
}
