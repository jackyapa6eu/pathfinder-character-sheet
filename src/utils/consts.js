const alignmentSelectOptions = [
  {
    value: 'Lawful Good',
  },
  {
    value: 'Neutral Good',
  },
  {
    value: 'Chaotic Good',
  },
  {
    value: 'Lawful Neutral',
  },
  {
    value: 'Neutral',
  },
  {
    value: 'Chaotic Neutral',
  },
  {
    value: 'Lawful Evil',
  },
  {
    value: 'Neutral Evil',
  },
  {
    value: 'Chaotic Evil',
  },
];

const availableClasses = {
  Barbarian: true,
  Bard: true,
  Cleric: true,
  Druid: true,
  Fighter: true,
  Monk: true,
  Paladin: true,
  Ranger: true,
  Rogue: true,
  Sorcerer: true,
  Wizard: true,
  Alchemist: true,
  Cavalier: true,
  Gunslinger: true,
  Inquisitor: true,
  Magus: true,
  Oracle: true,
  Omdura: true,
  Shifter: true,
  Summoner: true,
  'Vampire Hunter': true,
  Vigilante: true,
  Witch: true,
  'Arcane Archer': true,
  'Arcane Trickster': true,
  Assassin: true,
  'Dragon Disciple': true,
  Duelist: true,
  'Eldritch Knight': true,
  Loremaster: true,
  'Mystic Theurge': true,
  Shadowdancer: true,
};

const availableSchools = {
  Abjuration: true,
  Conjuration: true,
  Divination: true,
  Enchantment: true,
  Evocation: true,
  Illusion: true,
  Necromancy: true,
  Transmutation: true,
};

const availableSpellsSavingThrow = {
  will: true,
  reflex: true,
  fortitude: true,
  none: true,
};

const availableSpellLevels = {
  'supernatural ability': { maxCountPerDay: 'infinity', freeSpells: false },
  '0 lvl': { maxCountPerDay: 0, freeSpells: false },
  '1 lvl': { maxCountPerDay: 0, freeSpells: false },
  '2 lvl': { maxCountPerDay: 0, freeSpells: false },
  '3 lvl': { maxCountPerDay: 0, freeSpells: false },
  '4 lvl': { maxCountPerDay: 0, freeSpells: false },
  '5 lvl': { maxCountPerDay: 0, freeSpells: false },
  '6 lvl': { maxCountPerDay: 0, freeSpells: false },
  '7 lvl': { maxCountPerDay: 0, freeSpells: false },
  '8 lvl': { maxCountPerDay: 0, freeSpells: false },
  '9 lvl': { maxCountPerDay: 0, freeSpells: false },
};

export {
  alignmentSelectOptions,
  availableClasses,
  availableSchools,
  availableSpellsSavingThrow,
  availableSpellLevels,
};
