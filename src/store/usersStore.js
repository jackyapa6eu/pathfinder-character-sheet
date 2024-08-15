import { makeAutoObservable, runInAction, toJS } from 'mobx';
import { getDatabase, ref, get } from 'firebase/database';
import { message } from 'antd';

class UsersStore {
  users = [];

  usersCharacters = {};

  usersAllCharacters = {};

  constructor() {
    makeAutoObservable(this);
  }

  getUsers = async (userId, isDm) => {
    const db = getDatabase();
    const dataRef = ref(db, `users`);

    try {
      const response = await get(dataRef);
      if (response.exists()) {
        const users = response.val();
        runInAction(() => {
          this.users = users;
          const allUsersCharacters = {};
          this.usersCharacters = Object.entries(users).reduce((chars, [ownerId, userData]) => {
            Object.entries(userData.characters || {}).forEach(([charName, charData]) => {
              const data = {
                ...charData,
                charName: charName,
                owner: ownerId,
              };
              if (!charData.private || charData.owner === userId || isDm) {
                chars[charName] = data;
              }
              allUsersCharacters[charName] = data;
            });
            return chars;
          }, {});
          this.usersAllCharacters = allUsersCharacters;
        });
      }
    } catch (e) {
      message.error('Getting users data error.');
      console.log(e);
    }
  };
}

const usersStore = new UsersStore();
export default usersStore;
