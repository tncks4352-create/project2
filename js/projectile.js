const PROJECTILE_DATA = {
  arrow: {
    id: "arrow",
    name: "Arrow",
    speed: 6,
    width: 28,
    height: 6,
    hitRange: 18,
    removeX: 1120
  }
};

class Projectile {
  constructor(projectileData, battlefield, options) {
    this.data = projectileData;
    this.battlefield = battlefield;
    this.x = options.x;
    this.bottom = options.bottom;
    this.damage = options.damage;
    this.direction = options.direction || 1;
    this.isRemoved = false;

    this.el = document.createElement("div");
    this.el.className = `projectile projectile-${projectileData.id}`;
    this.el.style.width = projectileData.width + "px";
    this.el.style.height = projectileData.height + "px";
    this.el.style.bottom = this.bottom + "px";

    this.battlefield.appendChild(this.el);
    this.render();
  }

  update(enemies) {
    this.x += this.data.speed * this.direction;

    if (this.x >= this.data.removeX) {
      this.remove();
      return;
    }

    this.checkCollision(enemies);
    this.render();
  }

  checkCollision(enemies) {
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];

      if (enemy.isRemoved || enemy.state === "DEAD") continue;

      const enemyCenterX = enemy.x + enemy.data.width / 2;
      if (Math.abs(this.x - enemyCenterX) > this.data.hitRange) continue;

      enemy.takeDamage(this.damage);
      this.remove();
      return;
    }
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

class ProjectileManager {
  constructor(battlefieldId) {
    this.battlefield = document.getElementById(battlefieldId);
    this.projectiles = [];
  }

  spawn(projectileId, options) {
    const projectileData = PROJECTILE_DATA[projectileId];
    if (!projectileData || !this.battlefield) return null;

    const projectile = new Projectile(projectileData, this.battlefield, options);
    this.projectiles.push(projectile);
    return projectile;
  }

  update(enemies) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];

      if (projectile.isRemoved) {
        this.projectiles.splice(i, 1);
        continue;
      }

      projectile.update(enemies);

      if (projectile.isRemoved) {
        this.projectiles.splice(i, 1);
      }
    }
  }

  reset() {
    this.projectiles.forEach(projectile => {
      projectile.remove();
    });

    this.projectiles = [];
  }
}
