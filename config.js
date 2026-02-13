const CONFIG_ITEMS = [

  {
    name: "Lockpick",
    category: "tools",
    levelRequired: 2,
    blueprintRequired: false,
    materials: {
      steel: 10,
      plastic: 5
    }
  },

  {
    name: "Advanced Lockpick",
    category: "tools",
    levelRequired: 5,
    blueprintRequired: true,
    materials: {
      steel: 25,
      plastic: 15,
      electronics: 10,
      titanium: 6
    }
  },

  {
    name: "Switchblade",
    category: "weapons",
    levelRequired: 8,
    blueprintRequired: true,
    materials: {
      steel: 40,
      rubber: 10,
      titanium: 12
    }
  }

];

const CONFIG_CRAFT_PLAN = [
  { item: "Advanced Lockpick", quantity: 2 },
  { item: "Switchblade", quantity: 1 }
];
