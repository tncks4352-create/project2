window.HEROES = [
  {
    id: "zeus",
    name: "제우스",
    icon: "⚡",
    rarity: "UR",
    role: "광역 공격",
    color: "#ffd166",
    skill1: "연쇄 번개",
    skill2: "천둥 강림",
    ultimate: "천벌",
    skills: {
      skill1: {
        id: "zeusChainLightning",
        cost: 15
      },
      skill2: {
        id: "zeusThunderfall",
        cost: 40
      }
    },
    passive: {
      type: "unitStatMultiplier",
      unitId: "archer",
      stat: "atk",
      multiplier: 1.15
    }
  },
  {
    id: "poseidon",
    name: "포세이돈",
    icon: "🌊",
    rarity: "UR",
    role: "방어 / 넉백",
    color: "#4dabf7",
    skill1: "물창",
    skill2: "해일",
    ultimate: "바다의 분노",
    skills: {
      skill1: {
        id: "poseidonWaterSpear",
        cost: 15
      },
      skill2: {
        id: "poseidonTidalWave",
        cost: 40
      }
    },
    passive: {
      type: "unitStatMultiplier",
      unitId: "shieldman",
      stat: "hp",
      multiplier: 1.2
    }
  },
  {
    id: "hades",
    name: "하데스",
    icon: "☠️",
    rarity: "UR",
    role: "소환 / 지속전",
    color: "#9b5de5",
    skill1: "영혼 흡수",
    skill2: "저주의 안개",
    ultimate: "망자의 군단",
    passive: {
      type: "reviveAsAllySkeleton",
      chance: 0.2,
      unitId: "allySkeleton"
    }
  },
  {
    id: "athena",
    name: "아테나",
    icon: "🛡️",
    rarity: "SSR",
    role: "보호 / 회복",
    color: "#f8f9fa",
    skill1: "축복",
    skill2: "수호 방패",
    ultimate: "신성한 성역",
    passive: {
      type: "unitStatMultiplier",
      unitId: "all",
      stat: "hp",
      multiplier: 1.1
    }
  },
  {
    id: "heracles",
    name: "헤라클레스",
    icon: "💪",
    rarity: "SSR",
    role: "한 방 폭딜",
    color: "#ff922b",
    skill1: "강타",
    skill2: "지면 분쇄",
    ultimate: "신의 일격",
    passive: {
      type: "unitStatMultiplier",
      unitId: "swordsman",
      stat: "atk",
      multiplier: 1.2
    }
  },
  {
    id: "apollo",
    name: "아폴론",
    icon: "☀️",
    rarity: "SSR",
    role: "원거리 저격",
    color: "#ffe066",
    skill1: "태양 화살",
    skill2: "태양 폭발",
    ultimate: "태양의 심판",
    passive: {
      type: "unitStatMultiplier",
      unitId: "archer",
      stat: "attackRange",
      multiplier: 1.2
    }
  }
];
