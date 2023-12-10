import { toJS } from 'mobx';

const capitalizedFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const filterUndefinedToNull = (obj) => {
  return Object.fromEntries(
    Object.entries(obj || {}).map(([key, value]) => [key, value === undefined ? null : value])
  );
};

const makeName = (nameStr) => {
  return nameStr.replace(/\s+/g, '-').toLowerCase();
};

const fieldsAndStrFilter = (arr, fieldName, fieldData, fieldsForSearch, searchStr) => {
  const filteredArr = arr.filter((el) => el[fieldName] === fieldData);
  if (!searchStr) return filteredArr; // сортировка по типу
  else {
    return filteredArr.filter((element) =>
      fieldsForSearch.map((field) => element[field]).some((str) => str && str.includes(searchStr))
    );
  }
};

export { capitalizedFirstLetter, filterUndefinedToNull, makeName, fieldsAndStrFilter };
