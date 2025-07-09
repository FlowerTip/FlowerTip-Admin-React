# MiniProgress 迷你进度条组件

一个简洁的迷你进度条组件，基于 @ant-design/plots 的 Tiny 组件封装。

## 特性

- 支持自定义高度
- 支持自定义颜色
- 支持自定义进度条宽度比例
- 支持显示/隐藏进度信息
- 支持自定义样式和类名

## 使用示例

```tsx
import { MiniProgress } from './components';

// 基础用法
<MiniProgress percentage={60} height={40} />

// 自定义颜色
<MiniProgress 
  percentage={75} 
  height={40} 
  colors={['#1890ff', '#f0f0f0']} 
/>

// 显示进度信息
<MiniProgress 
  percentage={80} 
  height={40} 
  showInfo={true} 
/>

// 自定义样式
<MiniProgress 
  percentage={90} 
  height={40} 
  style={{ marginBottom: 16 }} 
  className="custom-progress"
/>
```

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| percentage | 进度百分比 | number | - |
| height | 进度条高度 | number | - |
| colors | 进度条颜色，[已完成颜色, 未完成颜色] | [string, string] | ['#909399', '#E8E8E8'] |
| barWidthRatio | 进度条宽度比例，取值范围 0-1 | number | 0.3 |
| showInfo | 是否显示进度信息 | boolean | false |
| style | 自定义样式 | React.CSSProperties | - |
| className | 自定义类名 | string | - |