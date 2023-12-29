import { makeAutoObservable, runInAction, toJS } from 'mobx';
import { getDatabase, ref, set, get, onValue, update } from 'firebase/database';
import { message } from 'antd';
import { debounce } from 'lodash';
import { availableSpellLevels } from '../utils/consts';
import { filterUndefinedToNull, makeName } from '../utils/helpers';

const savingThrowsAbilities = {
  fortitude: 'con',
  reflex: 'dex',
  will: 'wis',
};

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
    },
    appraise: {
      classSkill: false,
      ranks: null,
      miscMod: null,
    },
    bluff: {
      classSkill: false,
      ranks: null,
      miscMod: null,
    },
    climb: {
      classSkill: false,
      ranks: null,
      miscMod: null,
    },
    craft: {
      classSkill: false,
      ranks: null,
      miscMod: null,
    },
    diplomacy: {
      classSkill: false,
      ranks: null,
      miscMod: null,
    },
    disableDevice: {
      classSkill: false,
      ranks: null,
      miscMod: null,
    },
    escapeArtist: {
      classSkill: false,
      ranks: null,
      miscMod: null,
    },
    handleAnimal: {
      classSkill: false,
      ranks: null,
      miscMod: null,
    },
    knowledgeArcana: {
      classSkill: false,
      ranks: null,
      miscMod: null,
    },
    knowledgeDungeoneering: {
      classSkill: false,
      ranks: null,
      miscMod: null,
    },
    knowledgeEngineering: {
      classSkill: false,
      ranks: null,
      miscMod: null,
    },
    knowledgeGeography: {
      classSkill: false,
      ranks: null,
      miscMod: null,
    },
    knowledgeHistory: {
      classSkill: false,
      ranks: null,
      miscMod: null,
    },
    knowledgeLocal: {
      classSkill: false,
      ranks: null,
      miscMod: null,
    },
    knowledgeNature: {
      classSkill: false,
      ranks: null,
      miscMod: null,
    },
    knowledgeNobility: {
      classSkill: false,
      ranks: null,
      miscMod: null,
    },
    knowledgePlanes: {
      classSkill: false,
      ranks: null,
      miscMod: null,
    },
    knowledgeReligion: {
      classSkill: false,
      ranks: null,
      miscMod: null,
    },
    linguistics: {
      classSkill: false,
      ranks: null,
      miscMod: null,
    },
    perception: {
      classSkill: false,
      ranks: null,
      miscMod: null,
    },
    perform: {
      classSkill: false,
      ranks: null,
      miscMod: null,
    },
    profession: {
      classSkill: false,
      ranks: null,
      miscMod: null,
    },
    ride: {
      classSkill: false,
      ranks: null,
      miscMod: null,
    },
    senseMotive: {
      classSkill: false,
      ranks: null,
      miscMod: null,
    },
    sleightOfHand: {
      classSkill: false,
      ranks: null,
      miscMod: null,
    },
    spellCraft: {
      classSkill: false,
      ranks: null,
      miscMod: null,
    },
    stealth: {
      classSkill: false,
      ranks: null,
      miscMod: null,
    },
    survival: {
      classSkill: false,
      ranks: null,
      miscMod: null,
    },
    swim: {
      classSkill: false,
      ranks: null,
      miscMod: null,
    },
    useMagicDevice: {
      classSkill: false,
      ranks: null,
      miscMod: null,
    },
  },

  spells: {},

  spellsPerDay: {},

  inventory: {},

  weapons: {},

  money: {
    gold: 0,
    silver: 0,
    copper: 0,
    platinum: 0,
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
      runInAction(() => {
        this.openedCharacter = newData;
      });
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

  changeAbility = async (uid, charRef, abilityName, abilityType, abilityValue) => {
    const db = getDatabase();
    if (abilityType === 'score') {
      try {
        const updates = {};
        const adjustment = this.openedCharacter.abilities?.[abilityName]?.adjustment || 0;
        const tempModifier = Math.floor((abilityValue + (adjustment || 0) - 10) / 2);
        updates[`users/${uid}/characters/${charRef}/abilities/${abilityName}/${abilityType}`] =
          abilityValue;
        updates[`users/${uid}/characters/${charRef}/abilities/${abilityName}/modifier`] =
          Math.floor((abilityValue - 10) / 2);
        updates[`users/${uid}/characters/${charRef}/abilities/${abilityName}/tempModifier`] =
          adjustment ? tempModifier : null;
        await update(ref(db), updates);
        message.success(`Ability ${abilityName} changed!`);
      } catch (e) {
        console.log(e);
      }
    }
    if (abilityType === 'adjustment') {
      const score = this.openedCharacter.abilities?.[abilityName].score || 0;
      const adjustment = abilityValue;
      try {
        const updates = {};
        const tempModifier = Math.floor((score + (adjustment || 0) - 10) / 2);
        updates[`users/${uid}/characters/${charRef}/abilities/${abilityName}/adjustment`] =
          adjustment ?? null;
        updates[`users/${uid}/characters/${charRef}/abilities/${abilityName}/tempModifier`] =
          adjustment ? tempModifier : null;

        await update(ref(db), updates);
        message.success(`Ability ${abilityName.toUpperCase()} changed!`);
      } catch (e) {
        console.log(e);
      }
    }
    this.recalcTotalSavingThrows(uid, charRef);
    this.changeAttack(uid, charRef);
  };

  changeAbilityDebounce = debounce(async (uid, charRef, abilityName, abilityType, abilityValue) => {
    await this.changeAbility(uid, charRef, abilityName, abilityType, abilityValue);
  }, 700);

  changeBaseInfo = debounce(async (uid, charRef, dataName, newValue) => {
    const db = getDatabase();
    const dataRef = ref(db, `users/${uid}/characters/${charRef}/${dataName}`);
    console.log(newValue);
    try {
      await set(dataRef, newValue);
      message.success('Changed!');
    } catch (e) {
      console.log(e);
      message.error('Error');
    }
  }, 700);

  changeHitPoints = debounce(async (uid, charRef, hpType, hpValue) => {
    const db = getDatabase();
    const dataRef = ref(db, `users/${uid}/characters/${charRef}/hitPoints/${hpType}`);
    try {
      await set(dataRef, hpValue);
      message.success('Hit points changed!');
    } catch (e) {
      console.log(e);
      message.error('Error on character creation');
    }
  }, 700);

  changeMiscInitiative = debounce(async (uid, charRef, newInitiative) => {
    const db = getDatabase();
    const dataRef = ref(db, `users/${uid}/characters/${charRef}/initiative/miscModifier`);
    try {
      await set(dataRef, newInitiative);
      message.success('Initiative changed!');
    } catch (e) {
      console.log(e);
      message.error('Error on character creation');
    }
  }, 700);

  changeAc = debounce(async (uid, charRef, field, newValue) => {
    const db = getDatabase();
    const dataRef = ref(db, `users/${uid}/characters/${charRef}/ac/${field}`);
    try {
      await set(dataRef, newValue);
      message.success('Ac changed!');
    } catch (e) {
      console.log(e);
      message.error('Error on character creation');
    }
  }, 700);

  changeSavingThrows = debounce(async (uid, charRef, throwName, field, newValue, abilityName) => {
    const db = getDatabase();
    const tempAbilityMod = this.openedCharacter.abilities?.[abilityName]?.tempModifier;
    const abilityMod = this.openedCharacter.abilities?.[abilityName]?.modifier;
    const savingThrow = this.openedCharacter.savingThrows?.[throwName];
    // получим объект всех спасбросков кроме изменяемого и тотал.
    const { total: prevTotal = 0, [field]: current, ...otherThrows } = savingThrow || {};
    const total =
      (tempAbilityMod ?? abilityMod) +
      (newValue || 0) +
      Object.values(otherThrows).reduce((acc, curr) => acc + curr, 0);

    try {
      const updates = {};

      updates[`users/${uid}/characters/${charRef}/savingThrows/${throwName}/${field}`] = newValue;
      updates[`users/${uid}/characters/${charRef}/savingThrows/${throwName}/total`] =
        Math.floor(total);

      await update(ref(db), updates);
      message.success(`Saving throw ${throwName} changed!`);
    } catch (e) {
      console.log(e);
    }
  });

  changeAttack = debounce(async (uid, charRef, newValue, isUpdate = false) => {
    const db = getDatabase();

    const updates = {};
    const tempStrMod = this.openedCharacter.abilities?.str?.tempModifier;
    const strMod = this.openedCharacter.abilities?.str?.modifier;
    const tempDexMod = this.openedCharacter.abilities?.dex?.tempModifier;
    const dexMod = this.openedCharacter.abilities?.dex?.modifier;
    const cmb = (newValue || this.openedCharacter.attack?.bab || 0) + ((tempStrMod ?? strMod) || 0);
    const cmd =
      (newValue || this.openedCharacter.attack?.bab || 0) +
      ((tempStrMod ?? strMod) || 0) +
      ((tempDexMod ?? dexMod) || 0) +
      10;

    updates[`users/${uid}/characters/${charRef}/attack/bab`] =
      newValue || this.openedCharacter.attack?.bab || 0;
    updates[`users/${uid}/characters/${charRef}/attack/cmb`] = cmb;
    updates[`users/${uid}/characters/${charRef}/attack/cmd`] = cmd;

    try {
      await update(ref(db), updates);
      if (!isUpdate) message.success(`Base attack bonus changed!`);
    } catch (e) {
      console.log(e);
    }
  }, 700);

  changeAttackPerRound = debounce(async (uid, charRef, newValue) => {
    const db = getDatabase();
    const dataRef = ref(db, `users/${uid}/characters/${charRef}/attack/perRound`);
    try {
      await set(dataRef, newValue);
      message.success('Attacks per round changed!');
    } catch (e) {
      console.log(e);
      message.error('Error on character creation');
    }
  }, 700);

  recalcTotalSavingThrows = debounce(async (uid, charRef) => {
    const db = getDatabase();
    const updates = {};

    if (this.openedCharacter.savingThrows) {
      Object.entries(this.openedCharacter.savingThrows).forEach(([name, data]) => {
        const { total = 0, ...otherThrows } = data || {};
        const tempAbilityMod =
          this.openedCharacter.abilities?.[savingThrowsAbilities[name]]?.tempModifier;
        const abilityMod = this.openedCharacter.abilities?.[savingThrowsAbilities[name]]?.modifier;
        const newTotal =
          (tempAbilityMod ?? abilityMod) +
          Object.values(otherThrows).reduce((acc, curr) => acc + curr, 0);
        updates[`users/${uid}/characters/${charRef}/savingThrows/${name}/total`] =
          Math.floor(newTotal);
      });
      try {
        await update(ref(db), updates);
      } catch (e) {
        console.log(e);
      }
    }
  });

  changeSkills = debounce(async (uid, charRef, skillName, field, newValue) => {
    const db = getDatabase();
    const dataRef = ref(db, `users/${uid}/characters/${charRef}/skills/${skillName}/${field}`);
    try {
      await set(dataRef, newValue);
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
      message.success('Class added!');
    } catch (e) {
      console.log(e);
      message.error('Error!');
    }
  };

  deleteFeat = async (uid, charRef, featRef) => {
    const db = getDatabase();

    const dataRef = ref(db, `users/${uid}/characters/${charRef}/feats/${featRef}`);

    try {
      await set(dataRef, null);
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
      message.success('Spell added!');
    } catch (e) {
      console.log(e);
      message.error('Error!');
    }
  };

  deleteSpell = async (uid, charRef, spellRef, spellData) => {
    const db = getDatabase();

    const dataRef = ref(
      db,
      `users/${uid}/characters/${charRef}/spells/${spellData.class}/${spellData.level}/${spellRef}`
    );

    try {
      await set(dataRef, null);
      message.success('Spell deleted!');
    } catch (e) {
      console.log(e);
      message.error('Error!');
    }
  };

  prepareSpell = async (uid, charRef, spellData, justSlot = false, preparingSpell) => {
    console.log(spellData);
    const db = getDatabase();
    const spellRef = `${spellData.name.replace(/\s+/g, '-').toLowerCase()}${
      spellData.metamagic ? '(metamagic)' : ''
    }`;

    const spellLevelData = toJS(this.openedCharacter).spellsPerDay[spellData.class][
      spellData.level
    ];

    const toDomain =
      preparingSpell.isDomain &&
      spellLevelData.maxDomainCountPerDay &&
      spellLevelData.maxDomainCountPerDay >
        Object.values(spellLevelData.domainSpells || {}).reduce((acc, curr) => {
          return Object.keys(curr.slots).length;
        }, 0);
    // spellLevelData.maxDomainCountPerDay > Object.keys(spellLevelData.domainSpells || {}).length;

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
        name: `${spellData.name} ${spellData.metamagic ? '(metamagic)' : ''}`,
        metamagic: spellData.metamagic ?? false,
        asDomain: spellData.asDomain ?? false,
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
      message.success('Spell prepared!');
    } catch (e) {
      console.log(e);
      message.error('Error!');
    }
  };

  spellUse = async (uid, charRef, spellData, slotKey) => {
    const db = getDatabase();
    const dataRef = ref(db, `${spellData.ref}/slots/${slotKey}/isUsed`);

    try {
      await set(dataRef, !spellData.slots[slotKey].isUsed);
      message.success(
        `Spell ${spellData.name} ${spellData.slots[slotKey].isUsed ? 'un' : ''}used!`
      );
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
      message.success(`Spell deleted!`);
    } catch (e) {
      console.log(e);
      message.error('Error!');
    }
  };

  changeFreeSlotsForLevel = async (uid, charRef, isFreeSlots, className, level) => {
    const db = getDatabase();
    const dataRef = ref(
      db,
      `users/${uid}/characters/${charRef}/spellsPerDay/${className}/${level}/freeSpells`
    );

    try {
      await set(dataRef, isFreeSlots);
      message.success(`Free slots changed`);
    } catch (e) {
      console.log(e);
      message.error('Error!');
    }
  };

  changeMaxSpellsPerDay = debounce(async (uid, charRef, newCount, className, level, isDomain) => {
    const db = getDatabase();
    const dataRef = ref(
      db,
      `users/${uid}/characters/${charRef}/spellsPerDay/${className}/${level}/${
        isDomain ? 'maxDomainCountPerDay' : 'maxCountPerDay'
      }`
    );

    try {
      await set(dataRef, newCount);
      message.success(`Free slots changed`);
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
    if (
      this.openedCharacter.hitPoints.wounds &&
      this.openedCharacter.hitPoints.wounds <= this.openedCharacter.hitPoints.total
    ) {
      updates[`users/${uid}/characters/${charRef}/hitPoints/wounds`] =
        this.openedCharacter.hitPoints.wounds + 1 === this.openedCharacter.hitPoints.total
          ? null
          : this.openedCharacter.hitPoints.wounds + 1;
    }
    // откатывает магические предметы
    Object.values(this.openedCharacter.inventory).forEach((item) => {
      if (item.type === 'magicItem') {
        updates[`${item.ref}/chargesLeft`] = item.chargesMax;
      }
    });
    try {
      await update(ref(db), updates);
      await Object.entries(toJS(this.openedCharacter.abilities)).forEach(
        ([abilityName, abilityObj]) => {
          if (abilityObj.adjustment && abilityObj.adjustment < 0) {
            this.changeAbility(
              uid,
              charRef,
              abilityName,
              'adjustment',
              abilityObj.adjustment + 1 === 0 ? null : abilityObj.adjustment + 1
            );
          }
        }
      );
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
      message.success(`Weapon created!`);
    } catch (e) {
      console.log(e);
      message.error('Error!');
    }
  };

  changeWeaponData = debounce(async (uid, charRef, weaponName, fieldName, newValue) => {
    const db = getDatabase();
    const dataRef = ref(
      db,
      `users/${uid}/characters/${charRef}/weapons/${weaponName}/${fieldName}`
    );

    try {
      await set(dataRef, newValue);
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
      message.success(`Weapon deleted!`);
    } catch (e) {
      console.log(e);
      message.error('Error!');
    }
  };

  createInventoryItem = async (uid, charRef, itemData, name, addKnownItemModalIsOpen) => {
    const db = getDatabase();
    const updates = {};
    const clearedData = filterUndefinedToNull(itemData);
    const knownClearedData = JSON.parse(JSON.stringify(clearedData));
    const itemName = makeName(itemData.name);
    const itemRef = `users/${uid}/characters/${charRef}/inventory/${name ?? itemName}`;
    const knownItemRef = `users/${uid}/characters/${charRef}/knownItems/${name ?? itemName}`;
    clearedData.ref = itemRef;
    clearedData.itemName = name ?? itemName;
    knownClearedData.ref = knownItemRef;
    knownClearedData.itemName = name ?? itemName;
    if (clearedData.type === 'magicStick' || knownClearedData.type === 'magicStick') {
      clearedData.chargesLeft = clearedData.chargesMax;
      clearedData.chargesMax = 50;
    }
    if (clearedData.type === 'magicItem' || knownClearedData.type === 'magicStick') {
      clearedData.chargesLeft = clearedData.chargesMax;
    }
    // const dataRef = ref(db, itemRef);

    try {
      if (!addKnownItemModalIsOpen) updates[itemRef] = clearedData;
      updates[knownItemRef] = knownClearedData;
      // await set(dataRef, clearedData);
      await update(ref(db), updates);
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
    } catch (e) {
      console.log(e);
      message.error('Error!');
    }
  };

  magicItemUse = async (uid, charRef, itemData) => {
    const db = getDatabase();
    const dataRef = ref(db, `${itemData.ref}/chargesLeft`);

    if (itemData.chargesLeft <= 0) {
      message.warning(`No charges left.`);
      return;
    }
    try {
      await set(dataRef, itemData.chargesLeft - 1);

      message.success(`Item used!`);
    } catch (e) {
      console.log(e);
      message.error('Error!');
    }
  };

  editMoney = debounce(async (uid, charRef, moneyType, amount) => {
    const db = getDatabase();
    const dataRef = ref(db, `users/${uid}/characters/${charRef}/money/${moneyType}`);

    try {
      await set(dataRef, amount);
      message.success(`Money (${moneyType}) changed!`);
    } catch (e) {
      console.log(e);
      message.error('Error!');
    }
  }, 700);

  changeItemData = debounce(async (uid, charRef, itemName, dataType, newValue, isKnown) => {
    const db = getDatabase();
    const dataRef = `users/${uid}/characters/${charRef}/inventory/${itemName}/${dataType}`;
    const dataKnownRef = `users/${uid}/characters/${charRef}/knownItems/${itemName}`;
    let knownItem;
    if (this.openedCharacter.inventory[itemName]) {
      knownItem = JSON.parse(JSON.stringify(this.openedCharacter.inventory[itemName]));
    } else {
      knownItem = JSON.parse(JSON.stringify(this.openedCharacter.knownItems[itemName]));
    }
    knownItem[dataType] = newValue;
    knownItem.ref = dataKnownRef;
    const updates = {};
    try {
      if (!isKnown) {
        updates[dataRef] = newValue;
      }
      console.log(knownItem);
      updates[dataKnownRef] = knownItem;
      // await set(dataRef, clearedData);
      await update(ref(db), updates);
      // await set(dataRef, newValue);
      message.success(`Item changed!`);
    } catch (e) {
      console.log(e);
      message.error('Error!');
    }
  }, 700);
}

const charactersStore = new CharactersStore();
export default charactersStore;
