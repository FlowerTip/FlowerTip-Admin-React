import React, { useEffect, useRef } from 'react';
import { AiEditor, OpenaiModelConfig } from "aieditor";
import "aieditor/dist/style.css"

const AiEditorComponent: React.FC = () => {
  //定义 ref
  const divRef = useRef(null);
  //初始化 AiEditor
  useEffect(() => {
    if (divRef.current) {
      const aiEditor = new AiEditor({
        element: divRef.current,
        placeholder: "输入任何你想要编写的内容，AI功能可以帮助你优化完善内容。",
        content: '',
        ai: {
          models: {
            openai: {
              endpoint: "https://api.chatanywhere.tech",
              model: "gpt-3.5-turbo",
              apiKey: "sk-XKL1YHDdy9VHWZeDdiXNbswkHumM2fllSe7JH5ZR3v8oL8El"
            } as OpenaiModelConfig
          }
        },
        fontSize: {
          defaultValue: 16
      },
      })
      return () => {
        aiEditor.destroy();
      }
    }
  }, [])
  return (
    <div style={{ height: '100%', backgroundColor: '#fff' }}>
      <div ref={divRef} style={{ height: "100%", fontSize: '16px' }} >
      <div className="aie-container">
        <div className="aie-container-header"></div>
        <div className="aie-container-main"></div>
        <div className="aie-container-footer" style={{display: 'none'}}></div>
    </div>
      </div>
    </div>
  );
};

export default AiEditorComponent;