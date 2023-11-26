import { makeAutoObservable, runInAction, toJS } from 'mobx';
import { getDatabase, ref, set, get, onValue, update } from 'firebase/database';
import { message } from 'antd';
import { debounce } from 'lodash';

const savingThrowsAbilities = {
  fortitude: 'con',
  reflex: 'dex',
  will: 'wis',
};

export const initialUserData = {
  race: '',
  level: 1,
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
  },

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

  createCharacter = async (uid, charData, callBack = false) => {
    const db = getDatabase();
    const charRef = charData.name.replace(/\s+/g, '-').toLowerCase();

    const dataRef = ref(db, `users/${uid}/characters/${charRef}`);

    try {
      await set(dataRef, { ...initialUserData, ...charData });
      message.success('Character created!');
      if (callBack) callBack();
    } catch (e) {
      console.log(e);
      message.error('Error on character creation');
    }
  };

  changeAbility = debounce(async (uid, charRef, abilityName, abilityType, abilityValue) => {
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
    const cmb = (newValue || this.openedCharacter.attack?.bab || 0) + (tempStrMod ?? strMod);
    const cmd =
      (newValue || this.openedCharacter.attack?.bab || 0) +
      (tempStrMod ?? strMod) +
      (tempDexMod ?? dexMod) +
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

  recalcTotalSavingThrows = debounce(async (uid, charRef) => {
    const db = getDatabase();
    const updates = {};

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
}

const charactersStore = new CharactersStore();
export default charactersStore;
