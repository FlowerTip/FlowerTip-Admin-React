import dayjs from 'dayjs';
import { useState } from 'react'
/**
 * @description 获取当前时间
 */
export const useRefreshTime = () => {
  let [currentTime, setCurrentTime] = useState(dayjs().format("YYYY-MM-DD HH:mm:ss"));

  const timer = setInterval(() => {
    setCurrentTime(dayjs().format("YYYY-MM-DD HH:mm:ss"))
  }, 1000);

  const clearTimer = () => {
    clearInterval(timer);
  };
  return {
    currentTime,
    clearTimer,
  };
};