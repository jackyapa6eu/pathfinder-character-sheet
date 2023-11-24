import { makeAutoObservable, runInAction } from 'mobx';
import { getDatabase, ref, get } from 'firebase/database';
import { message } from 'antd';

class UsersStore {
  users = [];

  constructor() {
    makeAutoObservable(this);
  }

  getUsers = async () => {
    const db = getDatabase();
    const dataRef = ref(db, `users`);

    try {
      const response = await get(dataRef);
      if (response.exists()) {
        const users = response.val();
        runInAction(() => {
          this.users = users;
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
