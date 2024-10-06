/**
 * Checks if a value is a valid object or null.
 * @param {*} value - The value to check.
 * @returns {boolean} - Returns true if the value is a valid object or null, otherwise false.
 */
const isValidObject = (value: any): value is object | null =>
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value) &&
  value.constructor === Object;

/**
 * Compares two values for equality.
 * @param {*} d1 - The first value.
 * @param {*} d2 - The second value.
 * @returns {boolean} - Returns true if the values are equal, otherwise false.
 */
const diffChecker = (d1: any, d2: any): boolean => {
  if (d1 === null && d2 === null) {
    return true;
  }

  if (d1 === null || d2 === null) {
    return false;
  }

  if (typeof d1 !== typeof d2) {
    return false;
  }

  if (typeof d1 !== 'object') {
    return d1 === d2;
  }

  if (Array.isArray(d1) && Array.isArray(d2)) {
    if (d1.length !== d2.length) {
      return false;
    }

    return d1.every((item, index) => diffChecker(item, d2[index]));
  }

  const keys1 = Object.keys(d1);
  const keys2 = Object.keys(d2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  return keys1.every((key) => {
    if (!keys2.includes(key)) {
      return false;
    }

    return diffChecker(d1[key], d2[key]);
  });
};

/**
 * Checks whether the provided value is a valid function.
 * @param {*} value - The value to be checked.
 * @returns {boolean} - True if the value is a valid function, otherwise false.
 */
const isValidFunction = (value: any): boolean =>
  value instanceof Function && typeof value === 'function';

export { diffChecker, isValidFunction, isValidObject };
