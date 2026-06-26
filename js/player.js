class Player {
  constructor() {
    this.el = document.getElementById("player");

    this.x = 150;
    this.speed = 4;

    this.hp = 100;
    this.maxHp = 100;

    this.mana = 0;
    this.maxMana = 100;
  }

  update(keys) {
    this.move(keys);
    this.regenMana();
    this.render();
  }

  move(keys) {
    if (keys["a"]) this.x -= this.speed;
    if (keys["d"]) this.x += this.speed;

    this.x = Math.max(125, Math.min(820, this.x));
  }

  regenMana() {
    this.mana += 0.05;
    this.mana = Math.min(this.mana, this.maxMana);
  }

  render() {
    this.el.style.left = this.x + "px";
  }
}