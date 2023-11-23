import { makeAutoObservable, runInAction } from 'mobx';
import { getDatabase, ref, set, get, onValue } from 'firebase/database';
import { message } from 'antd';

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
      await set(dataRef, charData);
      message.success('Character created!');
      if (callBack) callBack();
    } catch (e) {
      console.log(e);
      message.error('Error on character creation');
    }
  };
}

const charactersStore = new CharactersStore();
export default charactersStore;
