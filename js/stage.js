class StageManager {
  constructor() {
    this.stage = 1;
    this.elapsedTime = 0;
  }

  reset() {
    this.stage = 1;
    this.elapsedTime = 0;
  }

  update(deltaTime, game) {
    this.elapsedTime += deltaTime;

    // 나중에 적 웨이브, 보스, 클리어 조건을 여기서 관리
  }
}