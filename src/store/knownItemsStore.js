import { makeAutoObservable, toJS } from 'mobx';
import { getDatabase, onValue, ref, update } from 'firebase/database';
import { filterUndefinedToNull, makeName } from '../utils/helpers';
import { message } from 'antd';
import { debounce } from 'lodash';

class KnownItemsStore {
  knownItems = {};

  userId = null;

  constructor() {
    makeAutoObservable(this);
  }

  getBasePath = () => {
    return `users/${this.userId}/knownItems/`;
  };

  setUserId = (id) => {
    this.userId = id;
  };

  onKnownItemsChange = (snapshot) => {
    if (snapshot.exists()) {
      this.knownItems = snapshot.val();
    }
  };

  subscribeKnownItems = () => {
    const db = getDatabase();
    const dataRef = ref(db, this.getBasePath());

    return onValue(dataRef, this.onKnownItemsChange);
  };

  createKnownItem = async (itemData, name) => {
    const db = getDatabase();
    const updates = {};
    const clearedData = filterUndefinedToNull(itemData);
    const itemName = makeName(itemData.name);
    const knownItemRef = `${this.getBasePath()}${name ?? itemName}`;
    clearedData.ref = knownItemRef;
    clearedData.itemName = name ?? itemName;

    try {
      updates[knownItemRef] = clearedData;
      await update(ref(db), updates);
    } catch (e) {
      console.log(e);
      message.error('Error!');
    }
  };

  changeItemData = debounce(async (itemData, dataType, newValue) => {
    const db = getDatabase();
    const dataRef = `${this.getBasePath()}/${itemData.itemName}/${dataType}`;

    const updates = {};
    try {
      updates[dataRef] = newValue;
      await update(ref(db), updates);
      message.success(`Known item changed!`);
    } catch (e) {
      console.log(e);
      message.error('Error!');
    }
  }, 700);
}

const knownItemsStore = new KnownItemsStore();

export default knownItemsStore;
