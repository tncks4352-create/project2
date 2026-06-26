const game = {
  state: "menu",
  stage: null,
  player: null,
  ui: null,
  keys: {},
  lastTime: 0
};

window.addEventListener("DOMContentLoaded", () => {
  game.ui = new UIManager();
  game.stage = new StageManager();
  game.player = new Player();

  game.ui.showMenu();

  const startBtn = document.getElementById("startBtn");
  startBtn.addEventListener("click", startGame);

  window.addEventListener("keydown", (event) => {
    game.keys[event.key.toLowerCase()] = true;
  });

  window.addEventListener("keyup", (event) => {
    game.keys[event.key.toLowerCase()] = false;
  });

  requestAnimationFrame(gameLoop);
});

function startGame() {
  game.state = "playing";
  game.ui.showGame();
  game.stage.reset();
  game.player.reset();
}

function gameLoop(timestamp) {
  const deltaTime = timestamp - game.lastTime;
  game.lastTime = timestamp;

  if (game.state === "playing") {
    game.player.update(deltaTime, game);
    game.stage.update(deltaTime, game);
    game.ui.update(game);
  }

  requestAnimationFrame(gameLoop);
}