const CONFIG_ITEMS = [
  {
    name: "Pistol Flashlight",
    category: "attachments",
    levelRequired: 10,
    blueprintRequired: false,
    xp: 5,
    stopLevel: 1250,
    materials: {
      glass: 40,
      plastic: 75,
      electronics: 75,
      scrap: 40
    }
  },
  {
    name: "SMG Flashlight",
    category: "attachments",
    levelRequired: 20,
    blueprintRequired: false,
    xp: 10,
    stopLevel: 2200,
    materials: {
      glass: 40,
      plastic: 115,
      electronics: 115,
      scrap: 55
    }
  },
  {
    name: "Rifle Flashlight",
    category: "attachments",
    levelRequired: 30,
    blueprintRequired: false,
    xp: 15,
    stopLevel: 6000,
    materials: {
      glass: 40,
      plastic: 150,
      electronics: 150,
      scrap: 75
    }
  },
  {
    name: "Small Scope",
    category: "attachments",
    levelRequired: 15,
    blueprintRequired: false,
    xp: 5,
    stopLevel: 2000,
    yields: 2,
    materials: {
      scrap: 10,
      plastic: 115,
      electronics: 75,
      glass: 40
    }
  },
  {
    name: "Medium Scope",
    category: "attachments",
    levelRequired: 20,
    blueprintRequired: false,
    xp: 10,
    stopLevel: 2500,
    yields: 2,
    materials: {
      scrap: 15,
      plastic: 150,
      electronics: 115,
      glass: 40
    }
  },
  {
    name: "Large Scope",
    category: "attachments",
    levelRequired: 30,
    blueprintRequired: false,
    xp: 15,
    stopLevel: 6000,
    yields: 2,
    materials: {
      scrap: 25,
      plastic: 190,
      electronics: 150,
      glass: 40
    }
  },
  {
    name: "Shotgun Suppressor",
    category: "attachments",
    levelRequired: 25,
    blueprintRequired: true,
    xp: 20,
    stopLevel: 30,
    materials: {
      plastic: 55,
      scrap: 205,
      rubber: 85,
      steel: 180,
      titanium: 40
    }
  },
  {
    name: "SMG Suppressor",
    category: "attachments",
    levelRequired: 25,
    blueprintRequired: true,
    xp: 20,
    stopLevel: 30,
    materials: {
      plastic: 55,
      scrap: 205,
      rubber: 85,
      steel: 180,
      titanium: 40
    }
  },
  {
    name: "Pistol Suppressor",
    category: "attachments",
    levelRequired: 29,
    blueprintRequired: true,
    xp: 10,
    stopLevel: 3500,
    materials: {
      scrap: 150,
      rubber: 55,
      steel: 150,
      titanium: 15
    }
  },
  {
    name: "Ext Sub Mag",
    category: "attachments",
    levelRequired: 22,
    blueprintRequired: true,
    xp: 15,
    stopLevel: 2500,
    materials: {
      plastic: 75,
      titanium: 5,
      scrap: 115,
      aluminium: 115
    }
  },
  {
    name: "Ext Pistol Mag",
    category: "attachments",
    levelRequired: 22,
    blueprintRequired: true,
    xp: 10,
    stopLevel: 2800,
    materials: {
      plastic: 40,
      titanium: 10,
      scrap: 75,
      aluminium: 75
    }
  },
  {
    name: "Ext Shotgun Mag",
    category: "attachments",
    levelRequired: 32,
    blueprintRequired: true,
    xp: 10,
    stopLevel: 6000,
    materials: {
      plastic: 115,
      titanium: 10,
      scrap: 150,
      aluminium: 150
    }
  },
  {
    name: "Pistol Drum Mag",
    category: "attachments",
    levelRequired: 20,
    blueprintRequired: true,
    xp: 10,
    stopLevel: 6000,
    materials: {
      plastic: 75,
      titanium: 5,
      scrap: 115,
      aluminium: 115
    }
  },
  {
    name: "Sub Drum Mag",
    category: "attachments",
    levelRequired: 25,
    blueprintRequired: true,
    xp: 15,
    stopLevel: 6000,
    materials: {
      plastic: 115,
      titanium: 10,
      scrap: 150,
      aluminium: 150
    }
  },
  {
    name: "Vintage Pistol",
    category: "weapons",
    levelRequired: 20,
    blueprintRequired: false,
    xp: 15,
    stopLevel: 6000,
    materials: {
      pistolSlide: 1,
      titanium: 40,
      gunTrigger: 1,
      pistolClip: 1,
      pistolGrip: 1
    }
  },
  {
    name: "Beretta M9A",
    category: "weapons",
    levelRequired: 25,
    blueprintRequired: true,
    xp: 15,
    stopLevel: 4500,
    materials: {
      gunTrigger: 1,
      pistolClip: 1,
      pistolSlide: 1,
      pistolGrip: 1,
      titanium: 55
    }
  },
  {
    name: "Desert Eagle",
    category: "weapons",
    levelRequired: 25,
    blueprintRequired: true,
    xp: 15,
    stopLevel: 60,
    materials: {
      pistolSlide: 1,
      gunTrigger: 1,
      pistolClip: 1,
      pistolGrip: 1,
      titanium: 60
    }
  },
  {
    name: "Tec 9",
    category: "weapons",
    levelRequired: 25,
    blueprintRequired: true,
    xp: 15,
    stopLevel: 95,
    materials: {
      pistolSlide: 1,
      gunTrigger: 1,
      pistolClip: 1,
      pistolGrip: 1,
      plastic: 370,
      aluminium: 30,
      scrap: 15,
      titanium: 150
    }
  },
  {
    name: "Heavy Revolver",
    category: "weapons",
    levelRequired: 35,
    blueprintRequired: true,
    xp: 15,
    stopLevel: 67.5,
    materials: {
      pistolSlide: 1,
      gunTrigger: 1,
      pistolClip: 1,
      pistolGrip: 1,
      titanium: 60
    }
  },
  {
    name: "AP Pistol",
    category: "weapons",
    levelRequired: 60,
    blueprintRequired: true,
    xp: 0,
    stopLevel: 0,
    materials: {
      pistolSlide: 1,
      gunTrigger: 1,
      pistolClip: 1,
      pistolGrip: 1,
      titanium: 225,
      plastic: 250,
      steel: 250
    }
  },
  {
    name: "MPX",
    category: "weapons",
    levelRequired: 35,
    blueprintRequired: true,
    xp: 20,
    stopLevel: 85,
    materials: {
      metalSpring: 1,
      boltAssembly: 1,
      gunTrigger: 1,
      smgExtractor: 1,
      smgBarrel: 1,
      smgMag: 1,
      titanium: 115
    }
  },
  {
    name: "Mac-10",
    category: "weapons",
    levelRequired: 53,
    blueprintRequired: true,
    xp: 25,
    stopLevel: 92,
    materials: {
      metalSpring: 1,
      boltAssembly: 1,
      gunTrigger: 1,
      smgExtractor: 1,
      smgBarrel: 1,
      smgMag: 1,
      titanium: 150
    }
  },
  {
    name: "UMP",
    category: "weapons",
    levelRequired: 45,
    blueprintRequired: true,
    xp: 25,
    stopLevel: 92,
    materials: {
      metalSpring: 1,
      boltAssembly: 1,
      gunTrigger: 1,
      smgExtractor: 1,
      smgBarrel: 1,
      smgMag: 1,
      titanium: 190
    }
  },
  {
    name: "Super Shorty",
    category: "weapons",
    levelRequired: 35,
    blueprintRequired: true,
    xp: 25,
    stopLevel: 82.5,
    materials: {
      metalSpring: 1,
      boltAssembly: 1,
      gunTrigger: 1,
      titanium: 120,
      shotgunParts: 1
    }
  },
  {
    name: "Vepr",
    category: "weapons",
    levelRequired: 35,
    blueprintRequired: true,
    xp: 25,
    stopLevel: 85,
    materials: {
      metalSpring: 1,
      boltAssembly: 1,
      gunTrigger: 1,
      titanium: 205,
      shotgunParts: 1
    }
  },
  {
    name: "Switchblade",
    category: "tools",
    levelRequired: 0,
    blueprintRequired: true,
    xp: 5,
    stopLevel: 6000,
    materials: {
      plastic: 55,
      titanium: 5,
      scrap: 75,
      aluminium: 30
    }
  },
  {
    name: "Scales",
    category: "tools",
    levelRequired: 0,
    blueprintRequired: true,
    xp: 1,
    stopLevel: 500,
    materials: {
      glass: 15,
      scrap: 15,
      controlChip: 1,
      powerSupply: 1,
      plastic: 40,
      electronics: 10,
      circuitBoard: 1
    }
  },
  {
    name: "Advanced Lockpick",
    category: "tools",
    levelRequired: 0,
    blueprintRequired: true,
    xp: 3,
    stopLevel: 1000,
    materials: {
      plastic: 30,
      scrap: 30,
      aluminium: 30
    }
  },
  {
    name: "Screw driver Set",
    category: "tools",
    levelRequired: 1,
    blueprintRequired: false,
    xp: 1,
    stopLevel: 800,
    materials: {
      plastic: 10,
      scrap: 10,
      aluminium: 10
    }
  },
  {
    name: "Fake Number Plate",
    category: "tools",
    levelRequired: 2,
    blueprintRequired: true,
    xp: 15,
    stopLevel: 60000,
    materials: {
      scrap: 225,
      plastic: 150,
      steel: 75,
      aluminium: 75
    }
  },
  {
    name: "Heavy Cutters",
    category: "tools",
    levelRequired: 5,
    blueprintRequired: false,
    xp: 1,
    stopLevel: 2500,
    materials: {
      titanium: 5,
      scrap: 40,
      plastic: 15,
      steel: 15,
      rubber: 15
    }
  },
  {
    name: "Ziptie",
    category: "tools",
    levelRequired: 5,
    blueprintRequired: false,
    xp: 2,
    stopLevel: 1000,
    materials: {
      wire: 25,
      plastic: 55,
      steel: 35,
      aluminium: 25
    }
  },
  {
    name: "Machete",
    category: "tools",
    levelRequired: 5,
    blueprintRequired: false,
    xp: 5,
    stopLevel: 6000,
    materials: {
      plastic: 55,
      titanium: 5,
      scrap: 75,
      aluminium: 30
    }
  },
  {
    name: "Battle Axe",
    category: "tools",
    levelRequired: 7,
    blueprintRequired: false,
    xp: 5,
    stopLevel: 6000,
    materials: {
      plastic: 55,
      titanium: 5,
      scrap: 75,
      aluminium: 75
    }
  },
  {
    name: "Golfclub",
    category: "tools",
    levelRequired: 10,
    blueprintRequired: false,
    xp: 8,
    stopLevel: 6000,
    materials: {
      plastic: 60,
      titanium: 10,
      scrap: 90,
      aluminium: 60
    }
  },
  {
    name: "Bottle",
    category: "tools",
    levelRequired: 15,
    blueprintRequired: false,
    xp: 10,
    stopLevel: 6000,
    materials: {
      plastic: 70,
      titanium: 15,
      scrap: 105,
      aluminium: 70
    }
  },
  {
    name: "Pool Cue",
    category: "tools",
    levelRequired: 17,
    blueprintRequired: false,
    xp: 10,
    stopLevel: 6000,
    materials: {
      plastic: 70,
      titanium: 15,
      scrap: 105,
      aluminium: 70
    }
  },
  {
    name: "Pan",
    category: "tools",
    levelRequired: 23,
    blueprintRequired: false,
    xp: 12,
    stopLevel: 7000,
    materials: {
      plastic: 70,
      titanium: 25,
      scrap: 130,
      aluminium: 70
    }
  },
  {
    name: "Safe Cracker",
    category: "tools",
    levelRequired: 12,
    blueprintRequired: false,
    xp: 2,
    stopLevel: 2500,
    materials: {
      titanium: 5,
      scrap: 25,
      plastic: 10,
      steel: 55,
      aluminium: 75
    }
  },
  {
    name: "Heavy Duty Drill",
    category: "tools",
    levelRequired: 15,
    blueprintRequired: false,
    xp: 100,
    stopLevel: 3500,
    materials: {
      titanium: 15,
      scrap: 380,
      powerSupply: 5,
      plastic: 750,
      steel: 530,
      controlChip: 5,
      circuitBoard: 5,
      electronics: 450,
      rubber: 450
    }
  },
  {
    name: "Racing Tablet",
    category: "tools",
    levelRequired: 15,
    blueprintRequired: false,
    xp: 1,
    stopLevel: 60000,
    materials: {
      glass: 375,
      brokenTablet: 1,
      powerSupply: 2,
      plastic: 15,
      rubber: 40,
      controlChip: 2,
      circuitBoard: 2,
      electronics: 150,
      wire: 375
    }
  },
  {
    name: "Exotic Lockpick",
    category: "tools",
    levelRequired: 10,
    blueprintRequired: false,
    xp: 10,
    stopLevel: 50,
    materials: {
      plastic: 75,
      alum: 75,
      scrap: 75,
      titanium: 25
    }
  },
  {
    name: "Hacking Device",
    category: "tools",
    levelRequired: 20,
    blueprintRequired: false,
    xp: 1,
    stopLevel: 3000,
    materials: {
      electronics: 380,
      circuitBoard: 2,
      scrap: 525,
      controlChip: 2,
      powerSupply: 2,
      wire: 115,
      steel: 190,
      rubber: 380
    }
  },
  {
    name: "Advanced Radio",
    category: "tools",
    levelRequired: 23,
    blueprintRequired: false,
    xp: 25,
    stopLevel: 3000,
    materials: {
      unknownUsbDevice: 1,
      controlChip: 1,
      powerSupply: 1,
      hackingDevice: 1,
      radio: 1,
      circuitBoard: 1
    }
  },
  {
    name: "Unknown USB Device",
    category: "tools",
    levelRequired: 25,
    blueprintRequired: false,
    xp: 1,
    stopLevel: 60000,
    materials: {
      circuitBoard: 1,
      brokenUsb: 1,
      rubber: 10,
      plastic: 75,
      electronics: 150,
      wire: 25
    }
  },
  {
    name: "Drill Housing",
    category: "tools",
    levelRequired: 25,
    blueprintRequired: false,
    xp: 3,
    stopLevel: 3500,
    materials: {
      titanium: 115,
      scrap: 380,
      powerSupply: 3,
      plastic: 380,
      steel: 380,
      controlChip: 3,
      circuitBoard: 3,
      electronics: 380,
      rubber: 380
    }
  },
  {
    name: "Drill Bit Mold",
    category: "tools",
    levelRequired: 25,
    blueprintRequired: false,
    xp: 3,
    stopLevel: 3500,
    materials: {
      rubber: 380,
      plastic: 75
    }
  },
  {
    name: "VPN",
    category: "tools",
    levelRequired: 32,
    blueprintRequired: false,
    xp: 1,
    stopLevel: 60000,
    materials: {
      circuitBoard: 5,
      scrap: 375,
      powerSupply: 5,
      wire: 40,
      rubber: 150,
      controlChip: 5,
      steel: 115,
      electronics: 375,
      brokenVpn: 1
    }
  },
  {
    name: "Blank Card",
    category: "tools",
    levelRequired: 37,
    blueprintRequired: false,
    xp: 1,
    stopLevel: 60000,
    yields: 10,
    materials: {
      electronics: 30,
      plastic: 150
    }
  },
  {
    name: "Info Laptop",
    category: "tools",
    levelRequired: 40,
    blueprintRequired: false,
    xp: 1,
    stopLevel: 60000,
    materials: {
      glass: 750,
      powerSupply: 5,
      plastic: 375,
      rubber: 750,
      controlChip: 5,
      circuitBoard: 5,
      wire: 750,
      electronics: 1125,
      brokenLaptop: 1
    }
  },
  {
    name: "Encrypted Laptop",
    category: "tools",
    levelRequired: 40,
    blueprintRequired: false,
    xp: 1,
    stopLevel: 60000,
    materials: {
      glass: 750,
      powerSupply: 5,
      plastic: 375,
      rubber: 750,
      controlChip: 5,
      circuitBoard: 5,
      wire: 750,
      electronics: 1125,
      brokenLaptop: 1
    }
  },
  {
    name: "Tool Belt",
    category: "tools",
    levelRequired: 18,
    blueprintRequired: false,
    xp: 1,
    stopLevel: 60000,
    materials: {
      sewingThread: 75,
      leatherHide: 40
    }
  },
  {
    name: "Lockpick",
    category: "tools",
    levelRequired: 0,
    blueprintRequired: false,
    xp: 1,
    stopLevel: 500,
    materials: {
      plastic: 5,
      scrap: 10,
      rubber: 15
    }
  },
  {
    name: "Manhole Remover",
    category: "tools",
    levelRequired: 10,
    blueprintRequired: false,
    xp: 2,
    stopLevel: 2500,
    materials: {
      scrap: 25,
      titanium: 15,
      steel: 55,
      aluminium: 75
    }
  },
  {
    name: "Drill Battery",
    category: "tools",
    levelRequired: 25,
    blueprintRequired: false,
    xp: 3,
    stopLevel: 3500,
    materials: {
      superCellBattery: 150
    }
  },
  {
    name: "Drug Crate",
    category: "tools",
    levelRequired: 25,
    blueprintRequired: false,
    xp: 3,
    stopLevel: 3500,
    materials: {
      rubber: 25,
      plastic: 40,
      steel: 50,
      aluminium: 30
    }
  },
  {
    name: "Bag of Clothes",
    category: "tools",
    levelRequired: 25,
    blueprintRequired: false,
    xp: 5,
    stopLevel: 6000,
    materials: {
      blaineCountyCoyotes: 1,
      downtownBullsharks: 1,
      paletoBayPirates: 1,
      losSantosBandits: 1,
      mazeBankMaulers: 1,
      mountChiliadAvalanche: 1,
      vinewoodStars: 1,
      vespucciBeachSharks: 1
    }
  },
  {
    name: "Rifle Ammo",
    category: "materials",
    levelRequired: 29,
    blueprintRequired: false,
    xp: 1,
    stopLevel: 3500,
    materials: {
      scrap: 25,
      gunpowder: 25
    }
  },
  {
    name: "Digital Scanner",
    category: "tools",
    levelRequired: 35,
    blueprintRequired: false,
    xp: 15,
    stopLevel: 5500,
    materials: {
      techShavings: 45,
      titanium: 75,
      circuitBoard: 3,
      controlChip: 3,
      powerSupply: 3,
      plastic: 230,
      electronics: 530,
      wire: 265
    }
  },
  {
    name: "Gunpowder",
    category: "materials",
    levelRequired: 5,
    blueprintRequired: false,
    xp: 1,
    stopLevel: 1200,
    materials: {
      sulfurPowder: 25,
      charcoal: 15
    }
  },
  {
    name: "Copper",
    category: "materials",
    levelRequired: 5,
    blueprintRequired: false,
    xp: 1,
    stopLevel: 1200,
    materials: {
      copperOre: 10
    }
  },
  {
    name: "Gold",
    category: "materials",
    levelRequired: 5,
    blueprintRequired: false,
    xp: 1,
    stopLevel: 1200,
    materials: {
      goldNugget: 10
    }
  },
  {
    name: "Aluminum Oxide",
    category: "materials",
    levelRequired: 35,
    blueprintRequired: false,
    xp: 1,
    stopLevel: 1200,
    materials: {
      gunpowder: 25,
      aluminium: 25
    }
  },
  {
    name: "Iron Oxide",
    category: "materials",
    levelRequired: 35,
    blueprintRequired: false,
    xp: 1,
    stopLevel: 1200,
    materials: {
      gunpowder: 25,
      steel: 25
    }
  },
  {
    name: "Thermite",
    category: "tools",
    levelRequired: 40,
    blueprintRequired: true,
    xp: 1,
    stopLevel: 60,
    materials: {
      thermitePowder: 10
    }
  },
  {
    name: "Karambit",
    category: "weapons",
    levelRequired: 60,
    blueprintRequired: false,
    xp: 25,
    stopLevel: 100,
    materials: {
      alum: 150,
      scrap: 380,
      steel: 150,
      titanium: 75
    }
  },
  {
    name: "AK47",
    category: "weapons",
    levelRequired: 45,
    blueprintRequired: true,
    xp: 50,
    stopLevel: 10000,
    materials: {
      akMag: 1,
      titanium: 350,
      akBolt: 1,
      akBarrelPin: 1,
      akStock: 1,
      akReceiverCover: 1,
      akBarrel: 1,
      akPistonPin: 1
    }
  },
  {
    name: "Tommy Gun",
    category: "weapons",
    levelRequired: 35,
    blueprintRequired: true,
    xp: 25,
    stopLevel: 8750,
    materials: {
      boltAssembly: 1,
      titanium: 135,
      smgMag: 1,
      gunTrigger: 1,
      smgBarrel: 1,
      metalSpring: 1,
      planks: 5,
      smgExtractor: 1
    }
  },
  {
    name: "Metal Spring",
    category: "materials",
    levelRequired: 6,
    blueprintRequired: false,
    xp: 1,
    stopLevel: 6000,
    materials: {
      plastic: 120,
      scrap: 15,
      aluminium: 30
    }
  },
  {
    name: "Bolt Assembly",
    category: "materials",
    levelRequired: 8,
    blueprintRequired: false,
    xp: 1,
    stopLevel: 60,
    materials: {
      plastic: 120,
      alum: 30,
      scrap: 15
    }
  },
  {
    name: "Gun Trigger",
    category: "materials",
    levelRequired: 12,
    blueprintRequired: false,
    xp: 1,
    stopLevel: 6000,
    materials: {
      plastic: 130,
      scrap: 25,
      aluminium: 40
    }
  },
  {
    name: "Pistol Slide",
    category: "materials",
    levelRequired: 14,
    blueprintRequired: false,
    xp: 1,
    stopLevel: 6000,
    materials: {
      plastic: 130,
      scrap: 40,
      aluminium: 70
    }
  },
  {
    name: "Pistol Grip",
    category: "materials",
    levelRequired: 16,
    blueprintRequired: false,
    xp: 1,
    stopLevel: 6000,
    materials: {
      plastic: 130,
      scrap: 55,
      aluminium: 55
    }
  },
  {
    name: "Pistol Clip",
    category: "materials",
    levelRequired: 18,
    blueprintRequired: false,
    xp: 1,
    stopLevel: 6000,
    materials: {
      plastic: 130,
      scrap: 30,
      aluminium: 55
    }
  }
];

