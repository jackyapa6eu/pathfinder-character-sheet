import { makeAutoObservable, runInAction, toJS } from 'mobx';
import { get, getDatabase, onValue, ref, set, update } from 'firebase/database';
import { message } from 'antd';
import { debounce } from 'lodash';
import { availableSpellLevels, carryingCapacityTable } from '../utils/consts';
import { copyToClipboard, filterUndefinedToNull, makeName } from '../utils/helpers';
import authStore from './authStore';

export const initialUserData = {
  race: '',
  classes: {},

  alignment: '',

  abilities: {
    str: {
      score: null,
      modifier: null,
      adjustment: null,
      tempModifier: null,
    },
    dex: {
      score: null,
      modifier: null,
      adjustment: null,
      tempModifier: null,
    },
    con: {
      score: null,
      modifier: null,
      adjustment: null,
      tempModifier: null,
    },
    int: {
      score: null,
      modifier: null,
      adjustment: null,
      tempModifier: null,
    },
    wis: {
      score: null,
      modifier: null,
      adjustment: null,
      tempModifier: null,
    },
    cha: {
      score: null,
      modifier: null,
      adjustment: null,
      tempModifier: null,
    },
  },

  hitPoints: {
    total: null,
    wounds: null,
    nonLethal: null,
  },

  initiative: {
    miscModifier: null,
  },

  ac: {
    armorBonus: null,
    shieldBonus: null,
    naturalArmor: null,
    deflectionModifier: null,
    miscModifier: null,
  },

  savingThrows: {
    fortitude: {
      total: null,
      base: null,
      magicMod: null,
      miscMod: null,
      tempMod: null,
    },
    reflex: {
      total: null,
      base: null,
      magicMod: null,
      miscMod: null,
      tempMod: null,
    },
    will: {
      total: null,
      base: null,
      magicMod: null,
      miscMod: null,
      tempMod: null,
    },
  },

  attack: {
    bab: null,
    cmb: null,
    cmd: null,
    perRound: 0,
  },

  feats: {},

  skills: {
    acrobatics: {
      classSkill: false,
      ranks: null,
      miscMod: null,
      bonusClassSkill: false,
    },
    appraise: {
      classSkill: false,
      ranks: null,
      miscMod: null,
      bonusClassSkill: false,
    },
    bluff: {
      classSkill: false,
      ranks: null,
      miscMod: null,
      bonusClassSkill: false,
    },
    climb: {
      classSkill: false,
      ranks: null,
      miscMod: null,
      bonusClassSkill: false,
    },
    craft: {
      classSkill: false,
      ranks: null,
      miscMod: null,
      bonusClassSkill: false,
    },
    diplomacy: {
      classSkill: false,
      ranks: null,
      miscMod: null,
      bonusClassSkill: false,
    },
    disableDevice: {
      classSkill: false,
      ranks: null,
      miscMod: null,
      bonusClassSkill: false,
    },
    escapeArtist: {
      classSkill: false,
      ranks: null,
      miscMod: null,
      bonusClassSkill: false,
    },
    handleAnimal: {
      classSkill: false,
      ranks: null,
      miscMod: null,
      bonusClassSkill: false,
    },
    knowledgeArcana: {
      classSkill: false,
      ranks: null,
      miscMod: null,
      bonusClassSkill: false,
    },
    knowledgeDungeoneering: {
      classSkill: false,
      ranks: null,
      miscMod: null,
      bonusClassSkill: false,
    },
    knowledgeEngineering: {
      classSkill: false,
      ranks: null,
      miscMod: null,
      bonusClassSkill: false,
    },
    knowledgeGeography: {
      classSkill: false,
      ranks: null,
      miscMod: null,
      bonusClassSkill: false,
    },
    knowledgeHistory: {
      classSkill: false,
      ranks: null,
      miscMod: null,
      bonusClassSkill: false,
    },
    knowledgeLocal: {
      classSkill: false,
      ranks: null,
      miscMod: null,
      bonusClassSkill: false,
    },
    knowledgeNature: {
      classSkill: false,
      ranks: null,
      miscMod: null,
      bonusClassSkill: false,
    },
    knowledgeNobility: {
      classSkill: false,
      ranks: null,
      miscMod: null,
      bonusClassSkill: false,
    },
    knowledgePlanes: {
      classSkill: false,
      ranks: null,
      miscMod: null,
      bonusClassSkill: false,
    },
    knowledgeReligion: {
      classSkill: false,
      ranks: null,
      miscMod: null,
      bonusClassSkill: false,
    },
    linguistics: {
      classSkill: false,
      ranks: null,
      miscMod: null,
      bonusClassSkill: false,
    },
    perception: {
      classSkill: false,
      ranks: null,
      miscMod: null,
      bonusClassSkill: false,
    },
    perform: {
      classSkill: false,
      ranks: null,
      miscMod: null,
      bonusClassSkill: false,
    },
    profession: {
      classSkill: false,
      ranks: null,
      miscMod: null,
      bonusClassSkill: false,
    },
    ride: {
      classSkill: false,
      ranks: null,
      miscMod: null,
      bonusClassSkill: false,
    },
    senseMotive: {
      classSkill: false,
      ranks: null,
      miscMod: null,
      bonusClassSkill: false,
    },
    sleightOfHand: {
      classSkill: false,
      ranks: null,
      miscMod: null,
      bonusClassSkill: false,
    },
    spellCraft: {
      classSkill: false,
      ranks: null,
      miscMod: null,
      bonusClassSkill: false,
    },
    stealth: {
      classSkill: false,
      ranks: null,
      miscMod: null,
      bonusClassSkill: false,
    },
    survival: {
      classSkill: false,
      ranks: null,
      miscMod: null,
      bonusClassSkill: false,
    },
    swim: {
      classSkill: false,
      ranks: null,
      miscMod: null,
      bonusClassSkill: false,
    },
    useMagicDevice: {
      classSkill: false,
      ranks: null,
      miscMod: null,
      bonusClassSkill: false,
    },
  },

  spells: {},

  spellsPerDay: {},

  inventory: {},

  totalWeight: 0,

  weapons: {},

  money: {
    gold: 0,
    silver: 0,
    copper: 0,
    platinum: 0,
  },

  equippedItems: {
    head: null, // circlets,crowns,hats,headbands,helmets, phylacteries.
    face: null, // googles,lenses,masks,spectacles,third eyes.
    shoulders: null, // capes, cloaks, mantles, shawls
    throat: null, // amulets, badges, brooches, collars, medals, medallions, necklaces, pendants, periapts, scarabs,scarfs, torcs
    body: null, // armor, robes
    torso: null, //shirts,tunics,vests,vestments
    shield: null,
    arms: null, // armbands,bracelets,bracers
    ringOne: null,
    ringTwo: null,
    hands: null, // gauntlets, gloves
    waist: null, // belts, girdles, sashes
    feet: null, // boots, sandals, shoes, slippers
  },

  equipBonuses: {
    checkPenalty: 0,
    maxDex: 99,
    acBonus: {
      armor: 0,
      shield: 0,
      natural: 0,
      deflection: 0,
    },
    savingThrows: {
      fortitude: 0,
      reflex: 0,
      will: 0,
    },
    abilityBonus: {
      str: 0,
      dex: 0,
      con: 0,
      int: 0,
      wis: 0,
      cha: 0,
    },
  },
};

class CharactersStore {
  characters = {};

  openedCharacter = {};

  constructor() {
    makeAutoObservable(this);
  }

  clearOpenedCharacter = () => {
    this.setOpenedCharacter({});
  };

  setOpenedCharacter = (newData) => {
    runInAction(() => {
      this.openedCharacter = newData;
    });
  };

  onCharacterChange = (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      this.setOpenedCharacter(data);
    }
  };

  subscribeCharacter = (uid, charId) => {
    const db = getDatabase();
    const dataRef = ref(db, `users/${uid}/characters/${charId}`);

    return onValue(dataRef, this.onCharacterChange);
  };

  getCharactersList = async (uid) => {
    const db = getDatabase();
    const dataRef = ref(db, `users/${uid}/characters`);

    try {
      const response = await get(dataRef);
      if (response.exists()) {
        const characters = response.val();
        runInAction(() => {
          this.characters = characters;
        });
      }
    } catch (e) {
      message.error('Getting user data error.');
      console.log(e);
    }
  };

  createCharacter = async (uid, charData, hasSpells, callBack = false) => {
    const db = getDatabase();
    const charRef = charData.name.replace(/\s+/g, '-').toLowerCase();

    const dataRef = ref(db, `users/${uid}/characters/${charRef}`);

    try {
      await set(dataRef, {
        ...initialUserData,
        ...charData,
        owner: uid,
        classes: { [charData.classes]: { levels: 1, hasSpells } },
        spellsPerDay: { [charData.classes]: availableSpellLevels },
      });
      message.success('Character created!');
      if (callBack) callBack();
    } catch (e) {
      console.log(e);
      message.error('Error on character creation');
    }
  };

  handleChangesLog = async (uid, charRef, { type, target, prevValue = null, currValue = null }) => {
    const { user } = authStore;
    const db = getDatabase();
    const date = Date.now();
    const updates = {};
    updates[`users/${uid}/characters/${charRef}/changesHistory/${date}`] = {
      type,
      target,
      prevValue,
      currValue,
      author: user,
    };
    try {
      await update(ref(db), updates);
    } catch (e) {
      console.log(e);
    }
  };

  changeAbility = async (uid, charRef, abilityName, abilityType, abilityValue) => {
    const db = getDatabase();

    const prevValue = this.openedCharacter.abilities?.[abilityName]?.[abilityType];

    if (abilityType === 'score') {
      try {
        const updates = {};
        updates[`users/${uid}/characters/${charRef}/abilities/${abilityName}/${abilityType}`] =
          abilityValue;

        await update(ref(db), updates);

        message.success(`Ability ${abilityName} changed!`);
      } catch (e) {
        console.log(e);
      }
    }
    if (abilityType === 'adjustment') {
      try {
        const updates = {};
        updates[`users/${uid}/characters/${charRef}/abilities/${abilityName}/adjustment`] =
          abilityValue ?? null;

        await update(ref(db), updates);
        message.success(`Ability ${abilityName.toUpperCase()} changed!`);
      } catch (e) {
        console.log(e);
      }
    }
    await this.handleChangesLog(uid, charRef, {
      type: 'changed',
      target: `${abilityName} ${abilityType}`,
      prevValue,
      currValue: abilityValue,
    }); // TODO +
    // this.changeAttack(uid, charRef);
  };

  changeAbilityDebounce = debounce(async (uid, charRef, abilityName, abilityType, abilityValue) => {
    await this.changeAbility(uid, charRef, abilityName, abilityType, abilityValue);
  }, 700);

  changeBaseInfo = debounce(async (uid, charRef, dataName, newValue) => {
    const db = getDatabase();
    const dataRef = ref(db, `users/${uid}/characters/${charRef}/${dataName}`);

    const prevValue = this.openedCharacter?.[dataName];
    try {
      await set(dataRef, newValue);
      await this.handleChangesLog(uid, charRef, {
        type: 'changed',
        target: dataName,
        prevValue: prevValue,
        currValue: newValue,
      }); // TODO +
      message.success('Changed!');
    } catch (e) {
      console.log(e);
      message.error('Error');
    }
  }, 700);

  changeAvatar = async (uid, charRef, newData) => {
    const db = getDatabase();
    const dataRef = ref(db, `users/${uid}/characters/${charRef}/avatar`);

    try {
      await set(dataRef, newData);

      message.success('Avatar changed!');
    } catch (e) {
      console.log(e);
      message.error('Error');
    }
  };

  changeHitPoints = debounce(async (uid, charRef, hpType, hpValue) => {
    const db = getDatabase();
    const dataRef = ref(db, `users/${uid}/characters/${charRef}/hitPoints/${hpType}`);

    const prevValue = this.openedCharacter.hitPoints?.[hpType];

    try {
      await set(dataRef, hpValue);
      await this.handleChangesLog(uid, charRef, {
        type: 'changed',
        target: `${hpType === 'wounds' ? 'current' : hpType} hit points`,
        prevValue: prevValue,
        currValue: hpValue,
      }); // TODO +
      message.success('Hit points changed!');
    } catch (e) {
      console.log(e);
      message.error('Error on character creation');
    }
  }, 700);

  changeMiscInitiative = debounce(async (uid, charRef, newInitiative) => {
    const db = getDatabase();
    const dataRef = ref(db, `users/${uid}/characters/${charRef}/initiative/miscModifier`);

    const prevValue = this.openedCharacter.initiative?.miscModifier;

    try {
      await set(dataRef, newInitiative);
      await this.handleChangesLog(uid, charRef, {
        type: 'changed',
        target: 'misc modifier initiative',
        prevValue,
        currValue: newInitiative,
      }); // TODO +
      message.success('Initiative changed!');
    } catch (e) {
      console.log(e);
      message.error('Error on character creation');
    }
  }, 700);

  changeAc = debounce(async (uid, charRef, field, newValue) => {
    const db = getDatabase();
    const dataRef = ref(db, `users/${uid}/characters/${charRef}/ac/${field}`);

    const prevValue = this.openedCharacter.ac?.[field];

    try {
      await set(dataRef, newValue);
      if (field === 'miscModifier') {
        await this.handleChangesLog(uid, charRef, {
          type: 'changed',
          target: `AC misc modifier`,
          prevValue,
          currValue: newValue,
        }); // TODO +
      }

      message.success('Ac changed!');
    } catch (e) {
      console.log(e);
      message.error('Error on character creation');
    }
  }, 700);

  changeSavingThrows = debounce(async (uid, charRef, throwName, field, newValue) => {
    const db = getDatabase();
    const prevValue = this.openedCharacter.savingThrows[throwName]?.[field];

    const title = {
      miscMod: 'misc modifier',
      tempMod: 'temp modifier',
    };

    try {
      const updates = {};

      updates[`users/${uid}/characters/${charRef}/savingThrows/${throwName}/${field}`] = newValue;

      await update(ref(db), updates);
      await this.handleChangesLog(uid, charRef, {
        type: 'changed',
        target: `saving throw ${throwName} ${title[field] ?? field}`,
        prevValue,
        currValue: newValue,
      }); // TODO +
      message.success(`Saving throw ${throwName} changed!`);
    } catch (e) {
      console.log(e);
    }
  });

  changeSpeed = debounce(async (uid, charRef, field, newValue) => {
    const db = getDatabase();
    const prevValue = this.openedCharacter.speed?.[field];

    try {
      const updates = {};

      updates[`users/${uid}/characters/${charRef}/speed/${field}`] = newValue;

      await update(ref(db), updates);
      await this.handleChangesLog(uid, charRef, {
        type: 'changed',
        target: `${field} speed`,
        prevValue,
        currValue: newValue,
      }); // TODO +
      message.success(`${field} speed changed!`);
    } catch (e) {
      console.log(e);
    }
  });

  calcAttack = () => {
    const tempStrMod = this.openedCharacter.abilities?.str?.tempModifier;
    const strMod = this.openedCharacter.abilities?.str?.modifier;
    const tempDexMod = this.openedCharacter.abilities?.dex?.tempModifier;
    const dexMod = this.openedCharacter.abilities?.dex?.modifier;
    const cmb = (this.openedCharacter.attack?.bab || 0) + ((tempStrMod ?? strMod) || 0);
    const cmd =
      (this.openedCharacter.attack?.bab || 0) +
      ((tempStrMod ?? strMod) || 0) +
      ((tempDexMod ?? dexMod) || 0) +
      this.monkWisBonus +
      10;
    runInAction(() => {
      if (this.openedCharacter.attack) {
        this.openedCharacter.attack.cmb = cmb;
        this.openedCharacter.attack.cmd = cmd;
      }
    });
  };

  changeAttack = debounce(async (uid, charRef, newValue, isUpdate = false) => {
    const db = getDatabase();
    const prevValue = this.openedCharacter.attack.bab;
    const currValue = newValue || this.openedCharacter.attack?.bab || 0;
    const updates = {};

    updates[`users/${uid}/characters/${charRef}/attack/bab`] = currValue;

    try {
      await update(ref(db), updates);
      await this.handleChangesLog(uid, charRef, {
        type: 'changed',
        target: 'base attack bonus',
        prevValue,
        currValue,
      }); // TODO +
      if (!isUpdate) message.success(`Base attack bonus changed!`);
    } catch (e) {
      console.log(e);
    }
  }, 700);

  changeAttackPerRound = debounce(async (uid, charRef, newValue) => {
    const db = getDatabase();
    const prevValue = this.openedCharacter.attack.perRound;

    const dataRef = ref(db, `users/${uid}/characters/${charRef}/attack/perRound`);
    try {
      await set(dataRef, newValue);
      await this.handleChangesLog(uid, charRef, {
        type: 'changed',
        target: 'attacks per round',
        prevValue,
        currValue: newValue,
      }); // TODO +
      message.success('Attacks per round changed!');
    } catch (e) {
      console.log(e);
      message.error('Error on character creation');
    }
  }, 700);

  changeSkills = debounce(async (uid, charRef, skillName, field, newValue) => {
    const db = getDatabase();
    const prevValue = this.openedCharacter.skills[skillName]?.[field];

    const isClassSkillBonus =
      this.openedCharacter.skills?.[skillName]?.classSkill &&
      !this.openedCharacter.skills?.[skillName]?.ranks;

    const updates = {};
    if (field === 'ranks' && isClassSkillBonus)
      updates[`users/${uid}/characters/${charRef}/skills/${skillName}/bonusClassSkill`] = true;
    updates[`users/${uid}/characters/${charRef}/skills/${skillName}/${field}`] = newValue;

    try {
      await update(ref(db), updates);
      await this.handleChangesLog(uid, charRef, {
        type: 'changed',
        target: `skill ${skillName} ${field === 'miscMod' ? 'misc modifier' : field}`,
        prevValue,
        currValue: newValue,
      }); // TODO +
      message.success('Skill changed!');
    } catch (e) {
      console.log(e);
      message.error('Error on character creation');
    }
  }, 700);

  addFeat = async (uid, charRef, featData) => {
    const db = getDatabase();
    const featRef = featData.name.replace(/\s+/g, '-').toLowerCase();

    const dataRef = ref(db, `users/${uid}/characters/${charRef}/feats/${featRef}`);

    try {
      await set(dataRef, featData);
      await this.handleChangesLog(uid, charRef, {
        type: 'added',
        target: `feat ${featData.name}`,
        prevValue: null,
        currValue: null,
      }); // TODO +
      message.success('Feat added!');
    } catch (e) {
      console.log(e);
      message.error('Error!');
    }
  };

  addClass = async (uid, charRef, classesData, newClass) => {
    const db = getDatabase();
    const updates = {};

    updates[`users/${uid}/characters/${charRef}/classes/`] = classesData;
    if (!this.openedCharacter.spellsPerDay[newClass]) {
      updates[`users/${uid}/characters/${charRef}/spellsPerDay/${newClass}`] = availableSpellLevels;
    }
    try {
      await update(ref(db), updates);
      await this.handleChangesLog(uid, charRef, {
        type: 'added',
        target: `lvl ${newClass}`,
        prevValue: null,
        currValue: null,
      }); // TODO +
      message.success('Class added!');
    } catch (e) {
      console.log(e);
      message.error('Error!');
    }
  };

  deleteFeat = async (uid, charRef, featRef) => {
    const db = getDatabase();
    const dataRef = ref(db, `users/${uid}/characters/${charRef}/feats/${featRef}`);
    const prevValue = this.openedCharacter.feats[featRef];

    try {
      await set(dataRef, null);
      await this.handleChangesLog(uid, charRef, {
        type: 'deleted',
        target: `feat ${prevValue.name}`,
        prevValue: null,
        currValue: null,
      }); // TODO +
      message.success('Feat deleted!');
    } catch (e) {
      console.log(e);
      message.error('Error!');
    }
  };

  addSpell = async (uid, charRef, spellData) => {
    const db = getDatabase();
    const spellRef = spellData.name.replace(/\s+/g, '-').toLowerCase();

    const dataRef = ref(
      db,
      `users/${uid}/characters/${charRef}/spells/${spellData.class}/${spellData.level}/${spellRef}`
    );

    try {
      await set(dataRef, spellData);
      await this.handleChangesLog(uid, charRef, {
        type: 'added',
        target: `spell "${spellData.name}" ${spellData.level}`,
        prevValue: null,
        currValue: null,
      }); // TODO +
      message.success('Spell added!');
    } catch (e) {
      console.log(e);
      message.error('Error!');
    }
  };

  deleteSpell = async (uid, charRef, spellRef, spellData) => {
    const db = getDatabase();
    const prevValue = this.openedCharacter.spells[spellData.class]?.[spellData.level]?.[spellRef];

    const dataRef = ref(
      db,
      `users/${uid}/characters/${charRef}/spells/${spellData.class}/${spellData.level}/${spellRef}`
    );

    try {
      await set(dataRef, null);
      await this.handleChangesLog(uid, charRef, {
        type: 'deleted',
        target: `spell "${prevValue.name}" ${spellData.level}`,
        prevValue: null,
        currValue: null,
      }); // TODO +
      message.success('Spell deleted!');
    } catch (e) {
      console.log(e);
      message.error('Error!');
    }
  };

  prepareSpell = async (uid, charRef, spellData, justSlot = false, preparingSpell) => {
    const db = getDatabase();
    const metaName = spellData.metamagic
      ? spellData.metamagicName
        ? `(${spellData.metamagicName})`
        : '(metamagic)'
      : '';

    const spellRef = `${spellData.name.replace(/\s+/g, '-').toLowerCase()}${metaName}`;

    const spellLevelData = this.openedCharacter.spellsPerDay[spellData.class]?.[spellData.level];

    const toDomain =
      preparingSpell.isDomain &&
      spellLevelData.maxDomainCountPerDay &&
      spellLevelData.maxDomainCountPerDay >
        Object.values(spellLevelData.domainSpells || {}).reduce((acc, curr) => {
          return Object.keys(curr.slots).length;
        }, 0);

    const domainRef = toDomain ? 'domainSpells' : 'spells';
    let path = `users/${uid}/characters/${charRef}/spellsPerDay/${spellData.class}/${spellData.level}/${domainRef}/${spellRef}`;
    let spell;
    if (spellLevelData?.[toDomain ? 'domainSpells' : 'spells']?.[spellRef]) {
      path += `/slots/${Date.now()}`;
      spell = { isUsed: false };
    } else {
      spell = {
        ...spellData,
        freeSlot: justSlot,
        name: `${spellData.name} ${metaName}`,
        metamagic: spellData.metamagic ?? false,
        asDomain: spellData.asDomain ?? false,
        metamagicName: spellData.metamagicName ?? '',
        slots: {
          [Date.now()]: {
            isUsed: false,
          },
        },
        ref: path,
      };
    }

    const dataRef = ref(db, path);

    try {
      await set(dataRef, spell);
      await this.handleChangesLog(uid, charRef, {
        type: 'added',
        target: `prepared spell "${spellData.name} ${metaName}" ${spellData.level}`,
        prevValue: null,
        currValue: null,
      }); // TODO +
      message.success('Spell prepared!');
    } catch (e) {
      console.log(e);
      message.error('Error!');
    }
  };

  spellUse = async (uid, charRef, spellData, slotKey) => {
    const db = getDatabase();
    const dataRef = ref(db, `${spellData.ref}/slots/${slotKey}/isUsed`);
    const isUsed = spellData.slots[slotKey].isUsed;
    try {
      await set(dataRef, !spellData.slots[slotKey].isUsed);
      await this.handleChangesLog(uid, charRef, {
        type: `${isUsed ? 'un' : ''}used`,
        target: `spell ${spellData.name}`,
        prevValue: null,
        currValue: null,
      }); // TODO +

      message.success(`Spell ${spellData.name} ${isUsed ? 'un' : ''}used!`);
    } catch (e) {
      console.log(e);
      message.error('Error!');
    }
  };

  deletePreparedSpell = async (uid, charRef, spellData) => {
    const db = getDatabase();
    const keys = Object.keys(spellData.slots);

    const dataRef = ref(
      db,
      `${spellData.ref}${
        keys.length > 1 ? `/slots/${keys[Math.floor(Math.random() * keys.length)]}` : ''
      }`
    );

    try {
      await set(dataRef, null);
      await this.handleChangesLog(uid, charRef, {
        type: 'deleted',
        target: `prepared spell ${spellData.level} ${spellData.name}`,
        prevValue: null,
        currValue: null,
      }); // TODO +
      message.success(`Spell deleted!`);
    } catch (e) {
      console.log(e);
      message.error('Error!');
    }
  };

  changeFreeSlotsForLevel = async (uid, charRef, isFreeSlots, className, level) => {
    const db = getDatabase();

    const prevValue = this.openedCharacter.spellsPerDay[className]?.[level]?.freeSpells;

    const dataRef = ref(
      db,
      `users/${uid}/characters/${charRef}/spellsPerDay/${className}/${level}/freeSpells`
    );

    try {
      await set(dataRef, isFreeSlots);
      await this.handleChangesLog(uid, charRef, {
        type: 'changed',
        target: `${className} spells ${level} is free spells`,
        prevValue,
        currValue: isFreeSlots,
      }); // TODO  +
      message.success(`Free slots changed`);
    } catch (e) {
      console.log(e);
      message.error('Error!');
    }
  };

  changeMaxSpellsPerDay = debounce(async (uid, charRef, newCount, className, level, isDomain) => {
    const db = getDatabase();
    const maxSpellPerDayRef = isDomain ? 'maxDomainCountPerDay' : 'maxCountPerDay';
    const prevValue = this.openedCharacter.spellsPerDay[className]?.[level]?.[maxSpellPerDayRef];
    const dataRef = ref(
      db,
      `users/${uid}/characters/${charRef}/spellsPerDay/${className}/${level}/${maxSpellPerDayRef}`
    );

    try {
      await set(dataRef, newCount);
      await this.handleChangesLog(uid, charRef, {
        type: 'changed',
        target: `max${isDomain ? ' domain' : ''} ${className} ${level} spells per day`,
        prevValue,
        currValue: newCount,
      }); // TODO +
      message.success(`Max spells per day changed`);
    } catch (e) {
      console.log(e);
      message.error('Error!');
    }
  }, 700);

  makeFullRest = async (uid, charRef) => {
    const db = getDatabase();

    const updates = {};
    Object.entries(this.openedCharacter.spellsPerDay).forEach(([className, levelsObj]) => {
      Object.entries(levelsObj).forEach(([level, levelData]) => {
        if (levelData.spells) {
          Object.entries(levelData.spells).forEach(([spellRef, data]) => {
            Object.keys(data.slots).forEach((slotKey) => {
              updates[
                `users/${uid}/characters/${charRef}/spellsPerDay/${className}/${level}/spells/${spellRef}/slots/${slotKey}/isUsed`
              ] = false;
            });
          });
        }
        if (levelData.domainSpells) {
          Object.entries(levelData.domainSpells).forEach(([spellRef, data]) => {
            Object.keys(data.slots).forEach((slotKey) => {
              updates[
                `users/${uid}/characters/${charRef}/spellsPerDay/${className}/${level}/domainSpells/${spellRef}/slots/${slotKey}/isUsed`
              ] = false;
            });
          });
        }
      });
    });
    let lvlCount = 0;
    if (this.openedCharacter && this.openedCharacter?.classes) {
      lvlCount = Object.values(toJS(this.openedCharacter.classes)).reduce((acc, curr) => {
        return acc + (curr.levels || 0);
      }, 0);
    }
    if (
      this.openedCharacter.hitPoints.wounds &&
      this.openedCharacter.hitPoints.wounds <= this.openedCharacter.hitPoints.total
    ) {
      updates[`users/${uid}/characters/${charRef}/hitPoints/wounds`] = Math.min(
        this.openedCharacter.hitPoints.wounds + lvlCount,
        this.openedCharacter.hitPoints.total
      );
    }
    // откатывает магические предметы
    Object.values(this.openedCharacter?.inventory || {}).forEach((item) => {
      if (item.charges) {
        Object.entries(item.charges).forEach(([chargesName, chargesData]) => {
          if (chargesData.restorable) {
            updates[`${item.ref}/charges/${chargesName}/count`] = chargesData.maxCharges;
          }
        });
      }
    });
    try {
      await update(ref(db), updates);
      await Object.entries(this.openedCharacter.abilities).forEach(([abilityName, abilityObj]) => {
        if (abilityObj.adjustment && abilityObj.adjustment < 0) {
          this.changeAbility(
            uid,
            charRef,
            abilityName,
            'adjustment',
            abilityObj.adjustment + 1 === 0 ? null : abilityObj.adjustment + 1
          );
        }
      });
      await this.handleChangesLog(uid, charRef, {
        type: 'rest',
        target: 'Zzzz... full rest...',
        prevValue: null,
        currValue: null,
      }); // TODO +
      message.success('Zzzz... full rest...');
    } catch (e) {
      console.log(e);
      message.error('Error!');
    }
  };

  createWeapon = async (uid, charRef, weaponData) => {
    const db = getDatabase();
    const dataRef = ref(db, `users/${uid}/characters/${charRef}/weapons/${weaponData.name}`);
    if (!weaponData.maxDamageBonus) delete weaponData.maxDamageBonus;
    try {
      await set(dataRef, weaponData);
      await this.handleChangesLog(uid, charRef, {
        type: 'added',
        target: `quick access weapon ${weaponData.name}`,
        prevValue: null,
        currValue: null,
      }); // TODO +
      message.success(`Weapon created!`);
    } catch (e) {
      console.log(e);
      message.error('Error!');
    }
  };

  changeWeaponData = debounce(async (uid, charRef, weaponName, fieldName, newValue) => {
    const db = getDatabase();
    const prevValue = this.openedCharacter.weapons[weaponName]?.[fieldName];
    const dataRef = ref(
      db,
      `users/${uid}/characters/${charRef}/weapons/${weaponName}/${fieldName}`
    );

    try {
      await set(dataRef, newValue);
      await this.handleChangesLog(uid, charRef, {
        type: 'changed',
        target: `quick access weapon ${weaponName} ${fieldName}`,
        prevValue,
        currValue: newValue,
      }); // TODO +
      message.success(`Weapon edited!`);
    } catch (e) {
      console.log(e);
      message.error('Error!');
    }
  }, 700);

  addWeaponPropertyOnHit = async (uid, charRef, weaponName, propertyData) => {
    const db = getDatabase();
    const dataRef = ref(
      db,
      `users/${uid}/characters/${charRef}/weapons/${weaponName}/onHit/${propertyData.name}`
    );

    try {
      await set(dataRef, propertyData);
      await this.handleChangesLog(uid, charRef, {
        type: 'added',
        target: `quick access weapon "${weaponName}" feat "${propertyData.name}"`,
        prevValue: null,
        currValue: null,
      }); // TODO +
      message.success(`On hit property added!`);
    } catch (e) {
      console.log(e);
      message.error('Error!');
    }
  };

  deleteWeaponPropertyOnHit = async (uid, charRef, weaponName, propertyName) => {
    const db = getDatabase();
    const dataRef = ref(
      db,
      `users/${uid}/characters/${charRef}/weapons/${weaponName}/onHit/${propertyName}`
    );

    try {
      await set(dataRef, null);
      await this.handleChangesLog(uid, charRef, {
        type: 'deleted',
        target: `quick access weapon "${weaponName}" feat "${propertyName}"`,
        prevValue: null,
        currValue: null,
      }); // TODO +
      message.success(`On hit property deleted!`);
    } catch (e) {
      console.log(e);
      message.error('Error!');
    }
  };

  deleteWeapon = async (uid, charRef, weaponName) => {
    const db = getDatabase();
    const dataRef = ref(db, `users/${uid}/characters/${charRef}/weapons/${weaponName}`);

    try {
      await set(dataRef, null);
      await this.handleChangesLog(uid, charRef, {
        type: 'deleted',
        target: `quick access weapon "${weaponName}"`,
        prevValue: null,
        currValue: null,
      }); // TODO +
      message.success(`Weapon deleted!`);
    } catch (e) {
      console.log(e);
      message.error('Error!');
    }
  };

  createInventoryItem = async (uid, charRef, itemData, name) => {
    const db = getDatabase();
    const updates = {};
    const clearedData = filterUndefinedToNull(itemData);
    const itemName = makeName(itemData.name);
    const itemRef = `users/${uid}/characters/${charRef}/inventory/${name ?? itemName}`;
    clearedData.ref = itemRef;
    clearedData.itemName = name ?? itemName;

    try {
      updates[itemRef] = clearedData;
      await update(ref(db), updates);
      await this.handleChangesLog(uid, charRef, {
        type: name ? 'changed' : 'added',
        target: `inventory item "${name ?? itemName}"`,
        prevValue: null,
        currValue: null,
      }); // TODO +
      message.success(name ? 'Item Edited' : `Item added!`);
    } catch (e) {
      console.log(e);
      message.error('Error!');
    }
  };

  deleteInventoryItem = async (uid, charRef, itemData, sell = false) => {
    const db = getDatabase();
    const dataRef = ref(db, itemData.ref);

    try {
      await set(dataRef, null);
      if (sell) {
        let cost = itemData.cost;
        if (itemData.type === 'magicStick') {
          cost = (cost / itemData.chargesMax) * itemData.chargesLeft;
        }
        const itemCost = Math.floor(cost / 2);
        await this.editMoney(
          uid,
          charRef,
          itemData.currency,
          (this.openedCharacter.money[itemData.currency] || 0) + itemCost || 0
        );
        message.success(`Item sold!`);
      } else message.success(`Item deleted!`);
      await this.handleChangesLog(uid, charRef, {
        type: 'deleted',
        target: `${itemData.name}`,
        prevValue: null,
        currValue: null,
      }); // TODO +
    } catch (e) {
      console.log(e);
      message.error('Error!');
    }
  };

  magicItemUse = async (uid, charRef, itemName, chargesData) => {
    const db = getDatabase();
    const dataRef = ref(
      db,
      `${this.openedCharacter.inventory[itemName].ref}/charges/${makeName(chargesData.name)}/count`
    );

    if (chargesData.count <= 0) {
      message.warning(`No charges left.`);
      return;
    }
    try {
      await set(dataRef, chargesData.count - 1);
      await this.handleChangesLog(uid, charRef, {
        type: 'used',
        target: `magic item ${itemName} (${chargesData.name})`,
        prevValue: null,
        currValue: null,
      }); // TODO +
      message.success(`Item used!`);
    } catch (e) {
      console.log(e);
      message.error('Error!');
    }
  };

  handleOnHorse = async (uid, charRef, itemName, newData) => {
    const db = getDatabase();
    const dataRef = ref(db, `${this.openedCharacter.inventory[itemName].ref}/onHorse`);
    try {
      await set(dataRef, newData);
      await this.handleChangesLog(uid, charRef, {
        type: 'changed',
        target: `item ${itemName} on horse`,
        prevValue: this.openedCharacter.inventory[itemName].ref.onHorse,
        currValue: newData,
      }); // TODO +
      message.success(`On horse changed!`);
    } catch (e) {
      console.log(e);
      message.error('Error!');
    }
  };

  handleUsefulItem = async (uid, charRef, itemName, newData) => {
    const db = getDatabase();
    const dataRef = ref(db, `${this.openedCharacter.inventory[itemName].ref}/isUseful`);
    try {
      await set(dataRef, newData);

      message.success(`is useful changed!`);
    } catch (e) {
      console.log(e);
      message.error('Error!');
    }
  };

  editMoney = debounce(async (uid, charRef, moneyType, amount) => {
    const db = getDatabase();
    const dataRef = ref(db, `users/${uid}/characters/${charRef}/money/${moneyType}`);
    const prevValue = this.openedCharacter.money[moneyType];
    try {
      await set(dataRef, amount);
      await this.handleChangesLog(uid, charRef, {
        type: 'changed',
        target: `${moneyType}`,
        prevValue,
        currValue: amount,
      }); // TODO +
      message.success(`Money (${moneyType}) changed!`);
    } catch (e) {
      console.log(e);
      message.error('Error!');
    }
  }, 700);

  changeItemData = debounce(async (uid, charRef, itemName, dataType, newValue) => {
    const db = getDatabase();
    const dataRef = `users/${uid}/characters/${charRef}/inventory/${itemName}/${dataType}`;
    const prevValue = this.openedCharacter.inventory[itemName]?.[dataType];
    const updates = {};
    try {
      updates[dataRef] = newValue;
      await update(ref(db), updates);
      await this.handleChangesLog(uid, charRef, {
        type: 'changed',
        target: `item "${itemName}" property "${dataType}"`,
        prevValue,
        currValue: newValue,
      }); // TODO +
      message.success(`Item changed!`);
    } catch (e) {
      console.log(e);
      message.error('Error!');
    }
  }, 700);

  equipItem = debounce(async (uid, charRef, field, value) => {
    const db = getDatabase();
    const dataRef = `users/${uid}/characters/${charRef}/equippedItems/${field}`;
    const updates = {};

    try {
      updates[dataRef] = value || null;
      await update(ref(db), updates);
      message.success(`Item equipped!`);
    } catch (e) {
      console.log(e);
      message.error('Error!');
    }
  }, 500);

  calcEquippedBonuses = () => {
    if (!this.openedCharacter.equippedItems) {
      runInAction(() => {
        this.openedCharacter.equipBonuses = JSON.parse(
          JSON.stringify(initialUserData.equipBonuses)
        );
      });
      return;
    }
    const equippedItems = Object.values(this.openedCharacter.equippedItems);
    const result = equippedItems.reduce((acc, current) => {
      acc.checkPenalty ??= 0;
      acc.shieldCheckPenalty ??= 0;
      acc.maxDex ??= 99;

      const item = this.openedCharacter.inventory?.[current];
      if (item) {
        Object.entries(item).forEach(([keyName, data]) => {
          if (keyName === 'acBonus') {
            acc.acBonus ??= {};
            Object.values(data).forEach(({ acBonusType, acBonus, maxDex, checkPenalty }) => {
              acc.acBonus[acBonusType] ??= 0;

              if (acBonusType === 'deflection') {
                if (acc.acBonus[acBonusType] < acBonus) acc.acBonus[acBonusType] = acBonus;
              } else {
                acc.acBonus[acBonusType] = acBonus;
              }
              if (acc.maxDex > maxDex) acc.maxDex = maxDex;

              if (acBonusType === 'shield') {
                acc.shieldCheckPenalty += checkPenalty || 0;
              } else acc.checkPenalty += checkPenalty || 0;
            });
          }
          if (keyName === 'savingThrows') {
            acc.savingThrows ??= {};
            Object.values(data).forEach(({ name, count }) => {
              acc.savingThrows[name] ??= 0;
              acc.savingThrows[name] += count;
            });
          }
          if (keyName === 'abilityBonus') {
            acc.abilityBonus ??= {};
            Object.values(data).forEach(({ name, count }) => {
              acc.abilityBonus[name] ??= 0;
              acc.abilityBonus[name] += count;
            });
          }
        }, {});
      }
      return acc;
    }, {});
    runInAction(() => {
      this.openedCharacter.equipBonuses = result;
    });
  };

  calcTotalSavingThrows = () => {
    if (!this.openedCharacter.equippedItems) {
      runInAction(() => {
        this.openedCharacter.equipBonuses = JSON.parse(
          JSON.stringify(initialUserData.equipBonuses)
        );
      });
    }
    const dict = { fortitude: 'con', reflex: 'dex', will: 'wis' };
    const total = Object.entries(dict).reduce((acc, [st, ability]) => {
      const tempAbilityMod = this.openedCharacter.abilities?.[ability]?.tempModifier;
      const abilityMod = this.openedCharacter.abilities?.[ability]?.modifier;

      const { total, ...otherThrows } = this.openedCharacter?.savingThrows?.[st] || {};
      acc[st] ??= 0;
      acc[st] += Object.values(otherThrows).reduce((sum, item) => {
        return sum + item;
      }, 0);
      acc[st] += this.openedCharacter?.equipBonuses?.savingThrows?.[st] || 0;
      acc[st] += tempAbilityMod ?? abilityMod;

      return acc;
    }, {});
    runInAction(() => {
      Object.entries(total).forEach(([st, value]) => {
        this.openedCharacter.savingThrows ??= {};
        this.openedCharacter.savingThrows[st] ??= {};
        this.openedCharacter.savingThrows[st].total = value;
      });
    });
  };

  calcAbilitiesModifiers = () => {
    if (!this.openedCharacter.abilities) {
      return;
    }
    const res = Object.entries(this.openedCharacter.abilities).reduce(
      (acc, [abilityName, abilityValue]) => {
        const abilityFromEquip = this.openedCharacter.equipBonuses?.abilityBonus?.[abilityName];
        acc[abilityName] ??= { abilityModifier: 0, abilityTempModifier: null };

        acc[abilityName].abilityModifier = Math.floor(((abilityValue.score || 0) - 10) / 2);
        acc[abilityName].abilityTempModifier =
          abilityValue.adjustment || abilityFromEquip
            ? Math.floor(
                ((abilityValue.score || 0) +
                  (abilityValue.adjustment || 0) +
                  (this.openedCharacter.equipBonuses?.abilityBonus?.[abilityName] || 0) -
                  10) /
                  2
              )
            : null;
        return acc;
      },
      {}
    );
    runInAction(() => {
      Object.entries(res).forEach(([abilityName, abilityValue]) => {
        this.openedCharacter.abilities[abilityName].modifier = abilityValue.abilityModifier || 0;
        this.openedCharacter.abilities[abilityName].tempModifier =
          abilityValue.abilityTempModifier ?? null;
      });
    });
  };

  editBackground = async (uid, charRef, newBackground) => {
    const db = getDatabase();
    const dataRef = ref(db, `users/${uid}/characters/${charRef}/background/`);
    try {
      await set(dataRef, newBackground);
      message.success(`Background changed`);
    } catch (e) {
      console.log(e);
      message.error('Error!');
    }
  };

  handleCopyToClickBoard = (text) => {
    copyToClipboard(text, () => message.success('Скопировано в буфер обмена', 1));
  };

  get totalWeight() {
    if (!this.openedCharacter.inventory) {
      return 0;
    }
    return Object.values(this.openedCharacter.inventory).reduce((acc, current) => {
      if (!current.onHorse) {
        const count = current.count === undefined ? 1 : current.count;
        acc += (current.weight || 0) * count;
      }

      return acc;
    }, 0);
  }

  get currentLoad() {
    const settingsArr =
      carryingCapacityTable[
        (this.openedCharacter?.abilities?.str?.score || 1) +
          (this.openedCharacter?.equipBonuses?.abilityBonus?.str || 0) +
          (this.openedCharacter?.abilities?.str?.adjustment || 0)
      ];
    const [light, mediumFrom, mediumTo, heavyFrom, heavyTo] = settingsArr;
    if (this.totalWeight <= light) return 'light';
    if (this.totalWeight >= mediumFrom && this.totalWeight <= mediumTo) return 'medium';
    if (this.totalWeight >= heavyFrom && this.totalWeight <= heavyTo) return 'heavy';
    return `${heavyTo} max`;
  }

  get loadCheckPenalty() {
    switch (this.currentLoad) {
      case 'medium':
        return 3;
      case 'heavy':
        return 6;
      default:
        return 0;
    }
  }

  get totalSpeed() {
    let baseSpeed = this.openedCharacter?.speed?.base || 0;
    let total = 0;
    const misc = this.openedCharacter?.speed?.misc || 0;

    switch (this.currentLoad) {
      case 'medium':
        if (this.openedCharacter?.speed?.base === 30) baseSpeed = 20;
        if (this.openedCharacter?.speed?.base === 20) baseSpeed = 15;
        break;
      case 'heavy':
        if (this.openedCharacter?.speed?.base === 30) baseSpeed = 20;
        if (this.openedCharacter?.speed?.base === 20) baseSpeed = 15;
        break;
    }

    total = baseSpeed + misc;
    return total;
  }

  get maxDexByLoad() {
    switch (this.currentLoad) {
      case 'medium':
        return 3;
      case 'heavy':
        return 1;
      default:
        return 99;
    }
  }

  get isMonk() {
    if (this.openedCharacter && this.openedCharacter?.classes)
      return Object.keys(this.openedCharacter?.classes).includes('Monk');
    else return false;
  }

  get monkWisBonus() {
    const acBonuses = this.openedCharacter?.equipBonuses?.acBonus || {};
    const isArmorEquipped = (acBonuses.armor ?? 0) > 0 || (acBonuses.shield ?? 0) > 0;

    const currWisMod =
      this.openedCharacter.abilities?.wis?.tempModifier ??
      this.openedCharacter.abilities?.wis?.modifier;

    return currWisMod > 0 && this.isMonk && !isArmorEquipped && this.currentLoad === 'light'
      ? currWisMod
      : 0;
  }
}

const charactersStore = new CharactersStore();
export default charactersStore;
