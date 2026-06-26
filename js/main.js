const keys = {};
let player;

const gameData = {
  playerBaseHp: 500,
  enemyBaseHp: 700,
  stage: 1
};

window.addEventListener("DOMContentLoaded", () => {
  player = new Player();

  document.getElementById("startBtn").onclick = () => {
    document.getElementById("menu").style.display = "none";
    document.getElementById("game").style.display = "block";
  };

  document.addEventListener("keydown", e => {
    keys[e.key.toLowerCase()] = true;
  });

  document.addEventListener("keyup", e => {
    keys[e.key.toLowerCase()] = false;
  });

  loop();
});

function updateUI() {
  document.getElementById("playerBaseHp").textContent = gameData.playerBaseHp;
  document.getElementById("enemyBaseHp").textContent = gameData.enemyBaseHp;
  document.getElementById("stageText").textContent = gameData.stage;
  document.getElementById("manaText").textContent = Math.floor(player.mana);
}

function loop() {
  if (player) {
    player.update(keys);
    updateUI();
  }

  requestAnimationFrame(loop);
}