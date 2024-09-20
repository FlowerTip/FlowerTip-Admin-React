import React from "react";
import dayjs from "dayjs";
import './index.scss';

const DayjsTool: React.FC = () => {
  const formatStr = "YYYY-MM-DD HH:mm:ss";

  const currDateTime = dayjs().format(formatStr);

  const currWeekBeginTime = dayjs(dayjs().subtract(6, "day")).format(formatStr);
  const currWeekEndTime = dayjs().format(formatStr);

  const currMonthBeginTime = dayjs(dayjs().subtract(29, "day")).format(formatStr);
  const currMonthEndTime = dayjs().format(formatStr);

  const currYearBeginTime = dayjs(dayjs().subtract(364, "day")).format(formatStr);
  const currYearEndTime = dayjs().format(formatStr);
  return (
    <div className="dayjs-wrapper">
      <p>当前日期时间：{currDateTime}</p>
      <p>近一周：{currWeekBeginTime} 至 {currWeekEndTime}</p>
      <p>近一月：{currMonthBeginTime} 至 {currMonthEndTime}</p>
      <p>近一年：{currYearBeginTime} 至 {currYearEndTime}</p>
    </div>
  )
}

export default DayjsTool;