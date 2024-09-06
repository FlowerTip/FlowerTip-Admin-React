/**
 * 判断是否是外链
 * @param {string} path
 * @returns {Boolean}
 */
export const isExternalFn = (path: string): boolean => {
  return /^(https?:|mailto:|tel:)/.test(path);
};