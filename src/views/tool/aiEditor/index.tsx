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
        }
      })
      return () => {
        aiEditor.destroy();
      }
    }
  }, [])
  return (
    <div style={{ height: '100%', backgroundColor: '#fff' }}>
      <div ref={divRef} style={{ height: "100%" }} />
    </div>
  );
};

export default AiEditorComponent;