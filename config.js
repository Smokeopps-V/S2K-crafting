const CONFIG_ITEMS = [
  {
    name: "Pistol Flashlight",
    category: "attachments",
    levelRequired: 10,
    blueprintRequired: false,
    xp: 5,
    stopLevel: 12,
    materials: { plastic: 75, scrap: 40, elect: 75, glass: 40 }
  },
  {
    name: "SMG Flashlight",
    category: "attachments",
    levelRequired: 20,
    blueprintRequired: false,
    xp: 10,
    stopLevel: 22,
    materials: { plastic: 115, scrap: 55, elect: 115, glass: 40 }
  },
  {
    name: "Rifle Flashlight",
    category: "attachments",
    levelRequired: 30,
    blueprintRequired: false,
    xp: 15,
    stopLevel: 60,
    materials: { plastic: 150, scrap: 75, elect: 150, glass: 40 }
  },
  {
    name: "Small Scope",
    category: "attachments",
    levelRequired: 15,
    blueprintRequired: false,
    xp: 5,
    stopLevel: 20,
    materials: { plastic: 115, scrap: 10, elect: 75, glass: 40 }
  },
  {
    name: "Medium Scope",
    category: "attachments",
    levelRequired: 20,
    blueprintRequired: false,
    xp: 5,
    stopLevel: 25,
    materials: { plastic: 150, scrap: 15, elect: 115, glass: 40 }
  },
  {
    name: "Large Scope",
    category: "attachments",
    levelRequired: 30,
    blueprintRequired: false,
    xp: 15,
    stopLevel: 60,
    materials: { plastic: 190, scrap: 25, elect: 150, glass: 40 }
  },
  {
    name: "Shotgun Suppressor",
    category: "attachments",
    levelRequired: 25,
    blueprintRequired: false,
    xp: 20,
    stopLevel: 30,
    materials: { plastic: 55, scrap: 205, rubber: 85, steel: 180, titanium: 40 }
  },
  {
    name: "SMG Suppressor",
    category: "attachments",
    levelRequired: 25,
    blueprintRequired: false,
    xp: 20,
    stopLevel: 30,
    materials: { plastic: 55, scrap: 205, rubber: 85, steel: 180, titanium: 40 }
  },
  {
    name: "Pistol Suppressor",
    category: "attachments",
    levelRequired: 29,
    blueprintRequired: false,
    xp: 10,
    stopLevel: 35,
    materials: { scrap: 150, rubber: 55, steel: 150, titanium: 15 }
  },
  {
    name: "Sub Extended Mag",
    category: "attachments",
    levelRequired: 22,
    blueprintRequired: false,
    xp: 15,
    stopLevel: 25,
    materials: { plastic: 75, alum: 115, scrap: 115, titanium: 5 }
  },
  {
    name: "Pistol Extended Mag",
    category: "attachments",
    levelRequired: 22,
    blueprintRequired: false,
    xp: 10,
    stopLevel: 28,
    materials: { plastic: 40, alum: 75, scrap: 75, titanium: 10 }
  },
  {
    name: "Shotgun Extended Mag",
    category: "attachments",
    levelRequired: 32,
    blueprintRequired: false,
    xp: 10,
    stopLevel: 60,
    materials: { plastic: 115, alum: 150, scrap: 150, titanium: 10 }
  },
  {
    name: "Pistol Drum Mag",
    category: "attachments",
    levelRequired: 20,
    blueprintRequired: false,
    xp: 10,
    stopLevel: 60,
    materials: { plastic: 75, alum: 115, scrap: 115, titanium: 5 }
  },
  {
    name: "Sub Drum Mag",
    category: "attachments",
    levelRequired: 25,
    blueprintRequired: false,
    xp: 15,
    stopLevel: 60,
    materials: { plastic: 115, alum: 150, scrap: 150, titanium: 10 }
  },
  {
    name: "Vintage Pistol",
    category: "weapons",
    levelRequired: 20,
    blueprintRequired: false,
    xp: 15,
    stopLevel: 60,
    materials: { plastic: 520, alum: 220, scrap: 150, titanium: 40 }
  },
  {
    name: "Desert Eagle",
    category: "weapons",
    levelRequired: 25,
    blueprintRequired: false,
    xp: 15,
    stopLevel: 60,
    materials: { plastic: 520, alum: 220, scrap: 150, titanium: 60 }
  },
  {
    name: "Tec 9",
    category: "weapons",
    levelRequired: 25,
    blueprintRequired: false,
    xp: 15,
    stopLevel: 95,
    materials: { plastic: 890, alum: 250, scrap: 165, titanium: 150 }
  },
  {
    name: "Heavy Revolver",
    category: "weapons",
    levelRequired: 35,
    blueprintRequired: false,
    xp: 15,
    stopLevel: 67.5,
    materials: { plastic: 520, alum: 220, scrap: 150, titanium: 60 }
  },
  {
    name: "AP Pistol",
    category: "weapons",
    levelRequired: 60,
    blueprintRequired: true,
    xp: 0,
    stopLevel: 0,
    materials: { titanium: 225, plastic: 770, alum: 220, scrap: 150, steel: 250 }
  },
  {
    name: "MPX",
    category: "weapons",
    levelRequired: 35,
    blueprintRequired: false,
    xp: 20,
    stopLevel: 85,
    materials: { plastic: 370, alum: 100, scrap: 55, titanium: 115, smgParts: 1 }
  },
  {
    name: "Mac-10",
    category: "weapons",
    levelRequired: 53,
    blueprintRequired: false,
    xp: 25,
    stopLevel: 92,
    materials: { plastic: 370, alum: 100, scrap: 55, titanium: 150, smgParts: 1 }
  },
  {
    name: "UMP",
    category: "weapons",
    levelRequired: 0,
    blueprintRequired: false,
    xp: 25,
    stopLevel: 92,
    materials: { plastic: 370, alum: 100, scrap: 55, titanium: 190, smgParts: 1 }
  },
  {
    name: "Super Shorty",
    category: "weapons",
    levelRequired: 35,
    blueprintRequired: false,
    xp: 25,
    stopLevel: 82.5,
    materials: { plastic: 370, alum: 100, scrap: 55, titanium: 120, shotgunParts: 1 }
  },
  {
    name: "Vepr",
    category: "weapons",
    levelRequired: 35,
    blueprintRequired: false,
    xp: 25,
    stopLevel: 85,
    materials: { plastic: 370, alum: 100, scrap: 55, titanium: 205, shotgunParts: 1 }
  },
  {
    name: "Switchblade",
    category: "tools",
    levelRequired: 0,
    blueprintRequired: false,
    xp: 5,
    stopLevel: 6000,
    materials: { plastic: 55, alum: 30, scrap: 75, titanium: 5 }
  },
  {
    name: "Scale",
    category: "tools",
    levelRequired: 0,
    blueprintRequired: false,
    xp: 1,
    stopLevel: 5,
    materials: { plastic: 40, scrap: 15, elect: 10, glass: 15, controlChip: 1, powerSupply: 1, circuitBoard: 1 }
  },
  {
    name: "Advance Lockpick",
    category: "tools",
    levelRequired: 0,
    blueprintRequired: false,
    xp: 3,
    stopLevel: 10,
    materials: { plastic: 30, alum: 30, scrap: 30 }
  },
  {
    name: "Screwdriver Set",
    category: "tools",
    levelRequired: 1,
    blueprintRequired: false,
    xp: 1,
    stopLevel: 8,
    materials: { plastic: 10, alum: 10, scrap: 10 }
  },
  {
    name: "Fake Plate",
    category: "tools",
    levelRequired: 2,
    blueprintRequired: false,
    xp: 15,
    stopLevel: 60,
    materials: { plastic: 150, alum: 75, scrap: 225, steel: 75 }
  },
  {
    name: "Heavy Cutters",
    category: "tools",
    levelRequired: 5,
    blueprintRequired: false,
    xp: 1,
    stopLevel: 25,
    materials: { plastic: 15, scrap: 40, rubber: 15, steel: 15, titanium: 5 }
  },
  {
    name: "Zipitie",
    category: "tools",
    levelRequired: 5,
    blueprintRequired: false,
    xp: 2,
    stopLevel: 10,
    materials: { plastic: 55, alum: 25, steel: 35, wire: 25 }
  },
  {
    name: "Machete",
    category: "tools",
    levelRequired: 5,
    blueprintRequired: false,
    xp: 5,
    stopLevel: 6,
    materials: { plastic: 55, alum: 30, scrap: 75, titanium: 5 }
  },
  {
    name: "Battle Axe",
    category: "tools",
    levelRequired: 7,
    blueprintRequired: false,
    xp: 5,
    stopLevel: 6,
    materials: { plastic: 55, alum: 75, scrap: 75, titanium: 5 }
  },
  {
    name: "Safe Cracker",
    category: "tools",
    levelRequired: 12,
    blueprintRequired: false,
    xp: 2,
    stopLevel: 25,
    materials: { plastic: 10, alum: 75, scrap: 25, steel: 55, titanium: 5 }
  },
  {
    name: "Heavy Duty Drill",
    category: "tools",
    levelRequired: 15,
    blueprintRequired: false,
    xp: 100,
    stopLevel: 35,
    materials: {
      plastic: 750,
      scrap: 380,
      rubber: 450,
      steel: 530,
      elect: 450,
      controlChip: 5,
      powerSupply: 5,
      circuitBoard: 5,
      titanium: 15
    }
  },
  {
    name: "Racing Tablet",
    category: "tools",
    levelRequired: 15,
    blueprintRequired: false,
    xp: 1,
    stopLevel: 60,
    materials: {
      plastic: 15,
      rubber: 40,
      elect: 150,
      glass: 375,
      wire: 375,
      controlChip: 2,
      powerSupply: 2,
      circuitBoard: 2,
      brokenTablet: 1
    }
  },
  {
    name: "Exotic Lockpick",
    category: "tools",
    levelRequired: 10,
    blueprintRequired: false,
    xp: 10,
    stopLevel: 50,
    materials: { plastic: 75, alum: 75, scrap: 75, titanium: 25 }
  },
  {
    name: "Hacking Device",
    category: "tools",
    levelRequired: 20,
    blueprintRequired: false,
    xp: 1,
    stopLevel: 30,
    materials: {
      scrap: 525,
      rubber: 380,
      steel: 190,
      elect: 380,
      wire: 115,
      controlChip: 2,
      powerSupply: 2,
      circuitBoard: 2
    }
  },
  {
    name: "Advance Radio",
    category: "tools",
    levelRequired: 23,
    blueprintRequired: false,
    xp: 25,
    stopLevel: 30,
    materials: {
      controlChip: 1,
      powerSupply: 1,
      circuitBoard: 1,
      unknownUsb: 1,
      hackingDevice: 1,
      radio: 1
    }
  },
  {
    name: "USB Device",
    category: "tools",
    levelRequired: 25,
    blueprintRequired: false,
    xp: 1,
    stopLevel: 60,
    materials: { plastic: 75, rubber: 10, elect: 150, wire: 25, circuitBoard: 1, brokenUsb: 1 }
  },
  {
    name: "Drilling House",
    category: "tools",
    levelRequired: 25,
    blueprintRequired: false,
    xp: 3,
    stopLevel: 35,
    materials: {
      plastic: 380,
      scrap: 380,
      rubber: 380,
      steel: 380,
      elect: 380,
      controlChip: 3,
      powerSupply: 3,
      circuitBoard: 3,
      titanium: 115
    }
  },
  {
    name: "Drill Bit Mold",
    category: "tools",
    levelRequired: 25,
    blueprintRequired: false,
    xp: 3,
    stopLevel: 35,
    materials: { plastic: 75, rubber: 380 }
  },
  {
    name: "VPN",
    category: "tools",
    levelRequired: 32,
    blueprintRequired: false,
    xp: 1,
    stopLevel: 60,
    materials: {
      scrap: 375,
      rubber: 150,
      steel: 115,
      elect: 375,
      wire: 40,
      controlChip: 5,
      powerSupply: 5,
      circuitBoard: 5,
      brokenVpn: 1
    }
  },
  {
    name: "Blank Card",
    category: "tools",
    levelRequired: 37,
    blueprintRequired: false,
    xp: 1,
    stopLevel: 60,
    materials: { plastic: 150, elect: 30 }
  },
  {
    name: "Info Laptop",
    category: "tools",
    levelRequired: 40,
    blueprintRequired: false,
    xp: 1,
    stopLevel: 60,
    materials: {
      plastic: 375,
      rubber: 750,
      elect: 1125,
      glass: 750,
      wire: 750,
      controlChip: 5,
      powerSupply: 5,
      circuitBoard: 5,
      brokenLaptop: 1
    }
  },
  {
    name: "Encrypted Laptop",
    category: "tools",
    levelRequired: 40,
    blueprintRequired: false,
    xp: 1,
    stopLevel: 60,
    materials: {
      plastic: 375,
      rubber: 750,
      elect: 1125,
      glass: 750,
      wire: 750,
      controlChip: 5,
      powerSupply: 5,
      circuitBoard: 5,
      brokenLaptop: 1
    }
  },
  {
    name: "Thermite",
    category: "tools",
    levelRequired: 40,
    blueprintRequired: false,
    xp: 1,
    stopLevel: 60,
    materials: { thermitePowder: 10 }
  },
  {
    name: "Karambit",
    category: "weapons",
    levelRequired: 60,
    blueprintRequired: false,
    xp: 25,
    stopLevel: 100,
    materials: { alum: 150, scrap: 380, steel: 150, titanium: 75 }
  },
  {
    name: "Metal Spring",
    category: "materials",
    levelRequired: 6,
    blueprintRequired: false,
    xp: 1,
    stopLevel: 60,
    materials: { plastic: 120, alum: 30, scrap: 15 }
  },
  {
    name: "Bolt Assembly",
    category: "materials",
    levelRequired: 8,
    blueprintRequired: false,
    xp: 1,
    stopLevel: 60,
    materials: { plastic: 120, alum: 30, scrap: 15 }
  },
  {
    name: "Gun Trigger",
    category: "materials",
    levelRequired: 12,
    blueprintRequired: false,
    xp: 1,
    stopLevel: 60,
    materials: { plastic: 130, alum: 40, scrap: 25 }
  },
  {
    name: "Pistol Slide",
    category: "materials",
    levelRequired: 14,
    blueprintRequired: false,
    xp: 1,
    stopLevel: 60,
    materials: { plastic: 130, alum: 70, scrap: 40 }
  },
  {
    name: "Pistol Grip",
    category: "materials",
    levelRequired: 16,
    blueprintRequired: false,
    xp: 1,
    stopLevel: 60,
    materials: { plastic: 130, alum: 55, scrap: 55 }
  },
  {
    name: "Pistol Clip",
    category: "materials",
    levelRequired: 18,
    blueprintRequired: false,
    xp: 1,
    stopLevel: 60,
    materials: { plastic: 130, alum: 55, scrap: 30 }
  }
];
