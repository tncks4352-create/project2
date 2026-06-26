class SkillManager {
  constructor(battlefieldId, enemyManager) {
    this.battlefield = document.getElementById(battlefieldId);
    this.enemyManager = enemyManager;
  }

  useSkill(hero, slot, player) {
    if (!hero || !player) return false;

    const skill = hero.skills && hero.skills[slot];

    if (!skill) {
      console.log("아직 구현되지 않은 스킬입니다");
      return false;
    }

    if (player.mana < skill.cost) return false;

    player.mana -= skill.cost;
    this.cast(skill.id);
    return true;
  }

  cast(skillId) {
    if (skillId === "zeusChainLightning") {
      this.castZeusChainLightning();
      return;
    }

    if (skillId === "zeusThunderfall") {
      this.castZeusThunderfall();
      return;
    }

    if (skillId === "poseidonWaterSpear") {
      this.castPoseidonWaterSpear();
      return;
    }

    if (skillId === "poseidonTidalWave") {
      this.castPoseidonTidalWave();
      return;
    }

    console.log("아직 구현되지 않은 스킬입니다");
  }

  castZeusChainLightning() {
    const target = this.findFrontEnemy();
    if (!target) return;

    target.takeDamage(35);
    this.createEffect("skill-effect lightning-strike", target.x, target.data.bottom + target.data.height);
  }

  castZeusThunderfall() {
    this.getAliveEnemies().forEach(enemy => {
      enemy.takeDamage(25);
    });

    this.createScreenEffect("skill-effect lightning-flash");
  }

  castPoseidonWaterSpear() {
    const target = this.findFrontEnemy();
    if (!target) return;

    target.takeDamage(25);
    this.knockback(target, 40);
    this.createEffect("skill-effect water-spear", target.x, target.data.bottom + target.data.height * 0.5);
  }

  castPoseidonTidalWave() {
    this.getAliveEnemies().forEach(enemy => {
      enemy.takeDamage(15);
      this.knockback(enemy, 80);
    });

    this.createScreenEffect("skill-effect tidal-wave");
  }

  findFrontEnemy() {
    const enemies = this.getAliveEnemies();
    if (enemies.length === 0) return null;

    return enemies.reduce((frontEnemy, enemy) => {
      return enemy.x < frontEnemy.x ? enemy : frontEnemy;
    }, enemies[0]);
  }

  getAliveEnemies() {
    return this.enemyManager.enemies.filter(enemy => {
      return !enemy.isRemoved && enemy.state !== "DEAD";
    });
  }

  knockback(enemy, distance) {
    enemy.x = Math.min(enemy.x + distance, enemy.data.spawnX);
    enemy.render();
  }

  createEffect(className, x, bottom) {
    if (!this.battlefield) return;

    const effect = document.createElement("div");
    effect.className = className;
    effect.style.left = x + "px";
    effect.style.bottom = bottom + "px";

    this.battlefield.appendChild(effect);
    this.removeEffect(effect, 600);
  }

  createScreenEffect(className) {
    if (!this.battlefield) return;

    const effect = document.createElement("div");
    effect.className = className;

    this.battlefield.appendChild(effect);
    this.removeEffect(effect, 800);
  }

  removeEffect(effect, delay) {
    setTimeout(() => {
      effect.remove();
    }, delay);
  }
}
