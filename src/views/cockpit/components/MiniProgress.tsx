import React from 'react';
import { Tiny } from '@ant-design/plots';

interface MiniProgressProps {
  percentage: number;
  height: number;
  /**
   * 进度条颜色，[已完成颜色, 未完成颜色]
   */
  colors?: [string, string];
  /**
   * 进度条宽度比例，取值范围 0-1
   */
  barWidthRatio?: number;
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
  colors = ['#909399', '#E8E8E8'],
  barWidthRatio = 0.3,
  showInfo = false,
  style,
  className
}) => {
  const config = {
    height,
    autoFit: true,
    percent: percentage / 100,
    color: colors,
    barWidthRatio,
    showInfo,
  };

  return <Tiny.Line {...config} style={style} className={className} />;
};

export default MiniProgress;