const UNIT_DATA = {
  swordsman: {
    id: "swordsman",
    name: "Swordsman",
    cost: 20,
    hp: 100,
    speed: 1.4,
    spawnX: 140,
    bottom: 88,
    width: 46,
    height: 62,
    removeX: 1100
  }
};

class Unit {
  constructor(unitData, battlefield) {
    this.data = unitData;
    this.battlefield = battlefield;
    this.x = unitData.spawnX;
    this.hp = unitData.hp;
    this.isRemoved = false;

    this.el = document.createElement("div");
    this.el.className = `unit unit-${unitData.id}`;
    this.el.dataset.name = unitData.name;
    this.el.style.width = unitData.width + "px";
    this.el.style.height = unitData.height + "px";
    this.el.style.bottom = unitData.bottom + "px";

    this.battlefield.appendChild(this.el);
    this.render();
  }

  update() {
    this.x += this.data.speed;

    if (this.x >= this.data.removeX) {
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

class UnitManager {
  constructor(battlefieldId) {
    this.battlefield = document.getElementById(battlefieldId);
    this.units = [];
  }

  spawn(unitId) {
    const unitData = UNIT_DATA[unitId];
    if (!unitData || !this.battlefield) return null;

    const unit = new Unit(unitData, this.battlefield);
    this.units.push(unit);
    return unit;
  }

  update() {
    for (let i = this.units.length - 1; i >= 0; i--) {
      const unit = this.units[i];

      unit.update();

      if (unit.isRemoved) {
        this.units.splice(i, 1);
      }
    }
  }

  reset() {
    this.units.forEach(unit => {
      unit.remove();
    });

    this.units = [];
  }
}
