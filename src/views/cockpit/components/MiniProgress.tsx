import React from 'react';
import { Progress } from 'antd';

interface MiniProgressProps {
  percentage: number;
  height: number;
  /**
   * 进度条颜色
   */
  color?: string;
  /**
   * 是否显示进度信息
   */
  showInfo?: boolean;
  /**
   * 自定义样式
   */
  style?: React.CSSProperties;
  /**
   * 自定义类名
   */
  className?: string;
}

const MiniProgress: React.FC<MiniProgressProps> = ({
  percentage,
  height,
  color = '#409eff',
  showInfo = false,
  style,
  className
}) => {
  return (
    <div style={{ height, display: 'flex', alignItems: 'center', ...style }} className={className}>
      <Progress
        percent={percentage}
        strokeColor={color}
        showInfo={showInfo}
        size="small"
        style={{ width: '100%' }}
      />
    </div>
  );
};

export default MiniProgress;