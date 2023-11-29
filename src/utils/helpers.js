const capitalizedFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const filterUndefinedToNull = (obj) => {
  return Object.fromEntries(
    Object.entries(obj || {}).map(([key, value]) => [key, value === undefined ? null : value])
  );
};

export { capitalizedFirstLetter, filterUndefinedToNull };
