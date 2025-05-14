import { KeyMap } from "../types";

/**
 * Renames keys of an object based on the provided key mapping.
 * @template T - The type of the object whose keys are to be renamed.
 * @param {T} obj - The object whose keys are to be renamed.
 * @param {KeyMap<T>} keyMap - The mapping of old keys to new keys.
 * @returns {Record<string, any>} - A new object with renamed keys based on the key mapping.
 */
export const renameKeys = <T extends Record<string, any>>(
  obj: T,
  keyMap: KeyMap<T>
): Record<string, any> => {
  const newObj: Record<string, any> = {};

  for (let key in obj) {
    const newKey = keyMap[key as keyof T] || key;
    newObj[newKey] = obj[key];
  }
  newObj.code = "INVALID_INPUT";
  return newObj;
};
