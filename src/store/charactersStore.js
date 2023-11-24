import { makeAutoObservable, runInAction } from 'mobx';
import { getDatabase, ref, set, get, onValue, update } from 'firebase/database';
import { message } from 'antd';
import { debounce } from 'lodash';

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
    total: null,
    miscModifier: null,
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
        update(ref(db), updates);
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

        update(ref(db), updates);
        message.success(`Ability ${abilityName.toUpperCase()} changed!`);
      } catch (e) {
        console.log(e);
      }
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
}

const charactersStore = new CharactersStore();
export default charactersStore;
