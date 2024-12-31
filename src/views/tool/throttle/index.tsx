import React, { useState } from "react";
import { useDebounceFn, useThrottleFn } from 'ahooks';
import { Button } from "antd";

const ThrottleTool: React.FC = () => {
  let [count1, setCount1] = useState(1);
  let [count2, setCount2] = useState(1);

  const { run: handleDebounce } = useDebounceFn(() => {
    count1++
    setCount1(count1)
  }, {
    wait: 200
  })

  const {run: handleThrottle} = useThrottleFn(() => {
    count2++;
    setCount2(count2);
  }, {
    wait: 200
  })

  return (
    <div style={{ height: '100%', backgroundColor: 'var(--ant-color-bg-container)', padding: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{marginRight: '120px'}}>
        <Button type="primary" onClick={handleDebounce}>点击事件防抖</Button>
        <h3 style={{ height: '100px', lineHeight: '100px',  textAlign: 'center' }}>当前的数值为：{count1}</h3>
      </div>
      <div>
        <Button type="primary" onClick={handleThrottle}>点击事件节流</Button>
        <h3 style={{ height: '100px', lineHeight: '100px', textAlign: 'center' }}>当前的数值为：{count2}</h3>
      </div>
    </div>
  )
}

export default ThrottleTool;