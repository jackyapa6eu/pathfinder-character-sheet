import { value } from 'lodash/seq';

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
  Eidolon: true,
  Familiar: true,
  'Animal companion': true,
  'Fantastic beast': true,
  Ritualist: true,
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

const availableAbilitiesForSelect = [
  { value: 'str', label: 'STR' },
  { value: 'dex', label: 'DEX' },
  { value: 'con', label: 'CON' },
  { value: 'int', label: 'INT' },
  { value: 'wis', label: 'WIS' },
  { value: 'cha', label: 'CHA' },
];

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

const itemTypes = [
  {
    label: 'Armor',
    value: 'armor',
  },
  {
    label: 'Magic item',
    value: 'magicItem',
  },
  {
    label: 'Magic stick',
    value: 'magicStick',
  },
  {
    label: 'Consumables',
    value: 'consumables',
  },
  {
    label: 'Items',
    value: 'items',
  },
  {
    label: 'Weapon',
    value: 'weapon',
  },
];

const equippedItem = {
  none: null,
  head: null, // circlets,crowns,hats,headbands,helmets, phylacteries.
  face: null, // googles,lenses,masks,spectacles,third eyes.
  shoulders: null, // capes, cloaks, mantles, shawls
  throat: null, // amulets, badges, brooches, collars, medals, medallions, necklaces, pendants, periapts, scarabs,scarfs, torcs
  body: null, // armor, robes
  torso: null, //shirts,tunics,vests,vestments
  arms: null, // armbands,bracelets,bracers
  ring: null,
  hands: null, // gauntlets, gloves
  waist: null, // belts, girdles, sashes
  feet: null, // boots, sandals, shoes, slippers
  shield: null,
};

const availableSkills = {
  acrobatics: { ability: 'dex', value: 'acrobatics' },
  appraise: { ability: 'int', value: 'appraise' },
  bluff: { ability: 'cha', value: 'bluff' },
  climb: { ability: 'str', value: 'climb' },
  craft: { ability: 'int', value: 'craft' },
  diplomacy: { ability: 'cha', value: 'diplomacy' },
  disableDevice: {
    ability: 'dex',
    value: 'disableDevice',
    label: 'disable device',
    trainedOnly: true,
  },
  disguise: { ability: 'cha', value: 'disguise' },
  escapeArtist: { ability: 'dex', value: 'escapeArtist', label: 'escape Artist' },
  fly: { ability: 'dex', value: 'fly' },
  handleAnimal: {
    ability: 'cha',
    value: 'handleAnimal',
    label: 'handle Animal',
    trainedOnly: true,
  },
  heal: { ability: 'wis', value: 'heal' },
  intimidate: { ability: 'cha', value: 'intimidate' },
  knowledgeArcana: {
    ability: 'int',
    value: 'knowledgeArcana',
    label: 'knowledge (Arcana)',
    trainedOnly: true,
  },
  knowledgeDungeoneering: {
    ability: 'int',
    value: 'knowledgeDungeoneering',
    label: 'knowledge (Dungeoneering)',
    trainedOnly: true,
  },
  knowledgeEngineering: {
    ability: 'int',
    value: 'knowledgeEngineering',
    label: 'knowledge (Engineering)',
    trainedOnly: true,
  },
  knowledgeGeography: {
    ability: 'int',
    value: 'knowledgeGeography',
    label: 'knowledge (Geography)',
    trainedOnly: true,
  },
  knowledgeHistory: {
    ability: 'int',
    value: 'knowledgeHistory',
    label: 'knowledge (History)',
    trainedOnly: true,
  },
  knowledgeLocal: {
    ability: 'int',
    value: 'knowledgeLocal',
    label: 'knowledge (Local)',
    trainedOnly: true,
  },
  knowledgeNature: {
    ability: 'int',
    value: 'knowledgeNature',
    label: 'knowledge (Nature)',
    trainedOnly: true,
  },
  knowledgePlanes: {
    ability: 'int',
    value: 'knowledgePlanes',
    label: 'knowledge (Planes)',
    trainedOnly: true,
  },
  knowledgeNobility: {
    ability: 'int',
    value: 'knowledgeNobility',
    label: 'knowledge (Nobility)',
    trainedOnly: true,
  },
  knowledgeReligion: {
    ability: 'int',
    value: 'knowledgeReligion',
    label: 'knowledge (Religion)',
    trainedOnly: true,
  },
  linguistics: { ability: 'int', value: 'linguistics', trainedOnly: true },
  perception: { ability: 'wis', value: 'perception' },
  perform: { ability: 'cha', value: 'perform' },
  profession: { ability: 'wis', value: 'profession', trainedOnly: true },
  ride: { ability: 'dex', value: 'ride' },
  senseMotive: { ability: 'wis', value: 'senseMotive', label: 'sense Motive' },
  sleightOfHand: {
    ability: 'dex',
    value: 'sleightOfHand',
    label: 'sleight of Hand',
    trainedOnly: true,
  },
  spellCraft: { ability: 'int', value: 'spellCraft', trainedOnly: true },
  stealth: { ability: 'dex', value: 'stealth' },
  survival: { ability: 'wis', value: 'survival' },
  swim: { ability: 'str', value: 'swim' },
  useMagicDevice: {
    ability: 'cha',
    value: 'useMagicDevice',
    label: 'use Magic Device',
    trainedOnly: true,
  },
};

const carryingCapacityTable = {
  1: [3, 4, 6, 7, 10],
  2: [6, 7, 13, 14, 20],
  3: [10, 11, 20, 21, 30],
  4: [13, 14, 26, 27, 40],
  5: [16, 17, 33, 34, 50],
  6: [20, 21, 40, 41, 60],
  7: [23, 24, 46, 47, 70],
  8: [26, 27, 53, 54, 80],
  9: [30, 31, 60, 61, 90],
  10: [33, 34, 66, 67, 100],
  11: [38, 39, 76, 77, 115],
  12: [43, 44, 86, 87, 130],
  13: [50, 51, 100, 101, 150],
  14: [58, 59, 116, 117, 175],
  15: [66, 67, 133, 134, 200],
  16: [76, 77, 153, 154, 230],
  17: [86, 87, 173, 174, 260],
  18: [100, 101, 200, 201, 300],
  19: [116, 117, 233, 234, 350],
  20: [133, 134, 266, 267, 400],
  21: [153, 154, 306, 307, 460],
  22: [173, 174, 346, 347, 520],
  23: [200, 201, 400, 401, 600],
  24: [233, 234, 466, 467, 700],
  25: [266, 267, 533, 534, 800],
  26: [306, 307, 613, 614, 920],
  27: [346, 347, 693, 694, 1040],
  28: [400, 401, 800, 801, 1200],
  29: [466, 467, 933, 934, 1400],
};

export {
  alignmentSelectOptions,
  availableClasses,
  availableSchools,
  availableSpellsSavingThrow,
  availableSpellLevels,
  itemTypes,
  equippedItem,
  availableAbilitiesForSelect,
  availableSkills,
  carryingCapacityTable,
};
