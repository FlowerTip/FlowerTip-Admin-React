/**
 * localStorage 设置 token
 * @param token
 */
export const setToken = (token: string) => {
  localStorage.setItem("token", token);
};

/**
 * localStorage 获取 token
 * @returns token
 */
export const getToken = () => {
  return localStorage.getItem("token");
};

/**
 * localStorage 移除 token
 */
export const removeToken = () => {
  localStorage.removeItem("token");
};