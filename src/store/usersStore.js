import { makeAutoObservable, runInAction } from 'mobx';
import { getDatabase, ref, get } from 'firebase/database';
import { message } from 'antd';

class UsersStore {
  users = [];

  usersCharacters = [];

  constructor() {
    makeAutoObservable(this);
  }

  getUsers = async (isDm) => {
    const db = getDatabase();
    const dataRef = ref(db, `users`);

    try {
      const response = await get(dataRef);
      if (response.exists()) {
        const users = response.val();
        runInAction(() => {
          this.users = users;
          if (isDm) {
            this.usersCharacters = Object.entries(users).reduce((chars, [userId, userData]) => {
              Object.entries(userData.characters).forEach(([charName, charData]) => {
                chars[charName] = {
                  ...charData,
                  charName: charName,
                  owner: userId,
                };
              });
              return chars;
            }, {});
          }
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
