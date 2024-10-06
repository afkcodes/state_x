/**
 * Checks if a value is a valid object or null.
 * @param {*} value - The value to check.
 * @returns {boolean} - Returns true if the value is a valid object or null, otherwise false.
 */
declare const isValidObject: (value: any) => value is object | null;
/**
 * Compares two values for equality.
 * @param {*} d1 - The first value.
 * @param {*} d2 - The second value.
 * @returns {boolean} - Returns true if the values are equal, otherwise false.
 */
declare const diffChecker: (d1: any, d2: any) => boolean;
/**
 * Checks whether the provided value is a valid function.
 * @param {*} value - The value to be checked.
 * @returns {boolean} - True if the value is a valid function, otherwise false.
 */
declare const isValidFunction: (value: any) => boolean;
export { diffChecker, isValidFunction, isValidObject };
