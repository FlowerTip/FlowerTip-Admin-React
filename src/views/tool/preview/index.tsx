import React, { useState } from "react";
import { usePreview } from '@/hooks/usePreview';
import { Button, Modal } from "antd";

const PreviewFile: React.FC = () => {
  const { preview } = usePreview();
  const [modal1Open, setModal1Open] = useState(false);
  const [fileType, setFileType] = useState('docx');
  const previewDoc = () => {
    setModal1Open(true);
    setFileType('docx');
    setTimeout(() => {
      preview('docx', 'https://www.flowertip.cn/docs/test.docx', document.getElementById('previewContainer2') as HTMLDivElement)
    }, 100)
  }

  const previewPdf = () => {
    setModal1Open(true);
    setFileType('pdf');
    setTimeout(() => {
      preview('pdf', 'https://www.flowertip.cn/docs/test.pdf', document.getElementById('previewContainer1') as HTMLDivElement)
    }, 100)
  }

  const previewExcel = () => {
    setModal1Open(true);
    setFileType('excel');
    setTimeout(() => {
      preview('excel', 'https://www.flowertip.cn/docs/test.xlsx', document.getElementById('previewContainer3') as HTMLDivElement)
    }, 100)
  }
  return (
    <div style={{ height: '100%', backgroundColor: 'var(--ant-color-bg-container)', padding: 20 }}>
      <Button type="primary" onClick={previewDoc} style={{ marginRight: 20 }}>docx预览</Button>
      <Button type="primary" onClick={previewPdf} style={{ marginRight: 20 }}>pdf预览</Button>
      <Button type="primary" onClick={previewExcel}>excel预览</Button>
      <Modal
        width={'65%'}
        title="文档预览"
        style={{ top: 20 }}
        open={modal1Open}
        onCancel={() => setModal1Open(false)}
        footer={null}
      >
        {
          fileType === 'pdf' && <div id="previewContainer1" style={{ minHeight: '400px', width: '100%' }}></div>
        }
        {
          fileType === 'docx' && <div id="previewContainer2" style={{ minHeight: '400px', width: '100%' }}></div>
        }
        {
          fileType === 'excel' && <div id="previewContainer3" style={{ minHeight: '400px', width: '100%' }}></div>
        }
      </Modal>
    </div>
  )
}

export default PreviewFile;