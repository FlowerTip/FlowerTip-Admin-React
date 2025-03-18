import dayjs from 'dayjs';
import { useState, useEffect, useRef } from 'react';

interface UseRefreshTimeOptions {
  format?: string;
  interval?: number;
}

/**
 * @description 获取当前时间的Hook
 * @param options 配置项
 * @param options.format 时间格式，默认为YYYY-MM-DD HH:mm:ss
 * @param options.interval 更新间隔(毫秒)，默认为1000ms
 */
export const useRefreshTime = (options?: UseRefreshTimeOptions) => {
  const {
    format = "YYYY-MM-DD HH:mm:ss",
    interval = 1000
  } = options || {};

  const [currentTime, setCurrentTime] = useState(dayjs().format(format));
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(dayjs().format(format));
    };

    timerRef.current = setInterval(updateTime, interval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [format, interval]);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  return {
    currentTime,
    clearTimer,
  };
};