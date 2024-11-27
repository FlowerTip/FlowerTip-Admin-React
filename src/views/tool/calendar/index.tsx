import React from 'react';
import type { BadgeProps, CalendarProps } from 'antd';
import { Badge, Calendar } from 'antd';
import type { Dayjs } from 'dayjs';

const getListData = (value: Dayjs) => {
  let listData: { type: string; content: string }[] = []; // Specify the type of listData
  switch (value.date()) {
    case 8:
      listData = [
        { type: 'warning', content: '按时吃饭' },
        { type: 'success', content: '按时睡觉' },
      ];
      break;
    case 10:
      listData = [
        { type: 'warning', content: '待办事项1' },
        { type: 'success', content: '待办事项2' },
        { type: 'error', content: '待办事项3' },
      ];
      break;
    case 15:
      listData = [
        { type: 'warning', content: '明日任务1' },
        { type: 'success', content: '明日任务2' },
        { type: 'error', content: '明日任务3' },
        { type: 'error', content: '明日任务4' },
        { type: 'error', content: '明日任务5' },
        { type: 'error', content: '明日任务6' },
      ];
      break;
    default:
  }
  return listData || [];
};

const getMonthData = (value: Dayjs) => {
  if (value.month() === 8) {
    return 1394;
  }
};

const CalendarComponent: React.FC = () => {
  const monthCellRender = (value: Dayjs) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Badge status={item.type as BadgeProps['status']} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    if (info.type === 'month') return monthCellRender(current);
    return info.originNode;
  };

  return (
    <div style={{ height: '100%', marginBottom: '36px'}}> 
      <Calendar cellRender={cellRender} style={{padding: '10px'}}/>
    </div>
  );
};

export default CalendarComponent;