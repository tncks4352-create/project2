const SOUND_DATA = {
  bgm: "./assets/sounds/bgm.mp3",
  button: "./assets/sounds/button.mp3",
  summon: "./assets/sounds/summon.mp3",
  slash: "./assets/sounds/slash.mp3",
  hit: "./assets/sounds/hit.mp3",
  death: "./assets/sounds/death.mp3",
  arrow: "./assets/sounds/arrow.mp3",
  lightning: "./assets/sounds/lightning.mp3",
  wave: "./assets/sounds/wave.mp3"
};

class SoundManager {
  constructor() {
    this.sounds = {};
    this.bgm = new Audio(SOUND_DATA.bgm);
    this.bgm.loop = true;
    this.bgm.volume = 0.45;

    Object.keys(SOUND_DATA).forEach(soundId => {
      if (soundId === "bgm") return;
      this.sounds[soundId] = new Audio(SOUND_DATA[soundId]);
    });
  }

  play(soundId) {
    const baseSound = this.sounds[soundId];
    if (!baseSound) return;

    const sound = baseSound.cloneNode();
    sound.volume = baseSound.volume;
    sound.play().catch(() => {});
  }

  playBgm() {
    this.bgm.play().catch(() => {});
  }
}
