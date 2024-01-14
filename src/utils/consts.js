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

const itemProperties = {
  name: null,
  weight: null,
  cost: null,
  description: null,
  equipSlot: '',
  count: null,

  acBonus: { armor: null, shield: null, natural: null, deflection: null },
  checkPenalty: null,
  maxDex: null,

  charges: { name: { restorable: null, nonRestorable: null } }, // название умения

  attackBonus: null, // ability attack mod
  weaponAttackBonus: null, // weapon attack bonus
  damageBonus: null, // ability damage mod
  maxDamageBonus: null, // max ability damage mod
  weaponDamageBonus: null, // weapon damage bonus

  abilityBonus: { str: null, dex: null, con: null, int: null, wis: null, cha: null },

  savingThrows: { fortitude: null, reflex: null, will: null },

  skills: { name: null },
};

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
};
