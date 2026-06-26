class Player {
  constructor() {
    this.el = document.getElementById("player");

    this.startX = 150;
    this.x = this.startX;

    this.hp = 100;
    this.maxHp = 100;
    this.mana = 0;
    this.maxMana = 100;

    this.speed = 0.35;
  }

  reset() {
    this.x = this.startX;
    this.hp = this.maxHp;
    this.mana = 0;
    this.render();
  }

  update(deltaTime, game) {
    this.handleMove(deltaTime, game.keys);
    this.regenMana(deltaTime);
    this.render();
  }

  handleMove(deltaTime, keys) {
    if (keys["a"]) {
      this.x -= this.speed * deltaTime;
    }

    if (keys["d"]) {
      this.x += this.speed * deltaTime;
    }

    this.x = Math.max(125, Math.min(this.x, 820));
  }

  regenMana(deltaTime) {
    this.mana += 0.015 * deltaTime;
    this.mana = Math.min(this.mana, this.maxMana);
  }

  render() {
    this.el.style.left = `${this.x}px`;
  }
}