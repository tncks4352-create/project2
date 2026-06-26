const ENEMY_DATA = {
  skeleton: {
    id: "skeleton",
    name: "Skeleton",
    hp: 100,
    atk: 10,
    speed: 1.5,
    spawnX: 920,
    bottom: 88,
    width: 46,
    height: 62,
    removeX: -60
  }
};

class Enemy {
  constructor(enemyData, battlefield) {
    this.data = enemyData;
    this.battlefield = battlefield;
    this.x = enemyData.spawnX;
    this.hp = enemyData.hp;
    this.atk = enemyData.atk;
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

  update() {
    this.x -= this.data.speed;

    if (this.x <= this.data.removeX) {
      this.remove();
      return;
    }

    this.render();
  }

  render() {
    this.el.style.left = this.x + "px";
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

  update() {
    this.updateSpawnTimer();

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];

      enemy.update();

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
