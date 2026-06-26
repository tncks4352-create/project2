class UIManager {
  constructor() {
    this.menuScreen = document.getElementById("menuScreen");
    this.gameScreen = document.getElementById("gameScreen");

    this.stageText = document.getElementById("stageText");
    this.hpText = document.getElementById("hpText");
    this.manaText = document.getElementById("manaText");
  }

  showMenu() {
    this.menuScreen.classList.add("active");
    this.gameScreen.classList.remove("active");
  }

  showGame() {
    this.menuScreen.classList.remove("active");
    this.gameScreen.classList.add("active");
  }

  update(game) {
    this.stageText.textContent = game.stage.stage;
    this.hpText.textContent = Math.floor(game.player.hp);
    this.manaText.textContent = Math.floor(game.player.mana);
  }
}