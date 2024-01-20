const capitalizedFirstLetter = (str) => {
  if (!str) return '';
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

const filterData = (arr, fieldsForSearch, searchStr) => {
  return arr.filter((element) =>
    fieldsForSearch.map((field) => element[field]).some((str) => str && str.includes(searchStr))
  );
};

const fieldsAndStrFilter = (arr, fieldName, fieldData, fieldsForSearch, searchStr) => {
  const filteredArr = arr.filter((el) => el[fieldName] === fieldData);
  if (!searchStr) return filteredArr; // сортировка по типу
  else {
    return filterData(filteredArr, fieldsForSearch, searchStr);
  }
};

const getLSData = (name) => {
  return JSON.parse(localStorage.getItem(name));
};

const setLSData = (name, data) => {
  localStorage.setItem(name, JSON.stringify(data));
};

const copyToClipboard = (text, callBack) => {
  const textArea = document.createElement('textarea');
  textArea.style.position = 'absolute';
  textArea.style.left = '50%';
  textArea.style.top = '50%';
  textArea.style.zIndex = '-99999999';
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    if (callBack) callBack();
  } catch (err) {
    console.error('Unable to copy to clipboard', err);
  }
  textArea.remove();
};

export {
  capitalizedFirstLetter,
  filterUndefinedToNull,
  makeName,
  fieldsAndStrFilter,
  filterData,
  getLSData,
  setLSData,
  copyToClipboard,
};
