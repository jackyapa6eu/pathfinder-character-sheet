import { makeAutoObservable, runInAction } from 'mobx';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set, get } from 'firebase/database';
import { message } from 'antd';

class AuthStore {
  user = null;

  authLoadingState = 'pending';

  mountedAuthLoadingState = 'pending';

  constructor() {
    makeAutoObservable(this);
  }

  setAppMountedAuthLoadingState = (newState) => {
    runInAction(() => {
      this.mountedAuthLoadingState = newState;
    });
  };

  setAuthLoadingState = (newState) => {
    runInAction(() => {
      this.authLoadingState = newState;
    });
  };

  setUser = (newUserData) => {
    runInAction(() => {
      this.user = newUserData;
    });
  };

  getUserData = async (uid) => {
    const db = getDatabase();

    const dataRef = ref(db, `users/${uid}`);

    try {
      const response = await get(dataRef);
      if (response.exists()) {
        const data = response.val();
        console.log(data);
        this.setUser(data);
      }
    } catch (e) {
      message.error('Getting user data error.');
      console.log(e);
    }
  };

  signUp = async (values) => {
    const auth = getAuth();
    const db = getDatabase();

    const { email, password, displayName } = values;
    this.setAuthLoadingState('loading');
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      const { uid } = user;

      const dataRef = ref(db, `users/${user.uid}`);
      await set(dataRef, { uid, email, displayName });
      message.success('Success!');
    } catch (error) {
      message.error(`Error! ${error.message}`);
      console.error('Registration error:', error.message);
    } finally {
      this.setAuthLoadingState('pending');
    }
  };

  signIn = async (values) => {
    const auth = getAuth();

    const { email, password } = values;
    this.setAuthLoadingState('loading');
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const { uid } = user;

      await this.getUserData(uid);
      message.success('Success!');
    } catch (error) {
      message.error(`Error! ${error.message}`);
      console.error('Registration error:', error.message);
    } finally {
      this.setAuthLoadingState('pending');
    }
  };

  logout = async () => {
    const auth = getAuth();
    try {
      await auth.signOut();
    } catch (e) {
      console.log(e);
    } finally {
      this.setUser(null);
    }
  };
}

const authStore = new AuthStore();
export default authStore;