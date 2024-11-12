import UploadOutlined from '@ant-design/icons/UploadOutlined';
import { Button, Card, message, Upload } from 'antd';
const props: any = {
  name: 'file',
  action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info: any) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  progress: {
    strokeColor: {
      '0%': '#108ee9',
      '100%': '#87d068',
    },
    strokeWidth: 3,
    format: (percent: number) => percent && `${parseFloat(percent.toFixed(2))}%`,
  },
};
const FileUpload = () => (
  <Card style={{height: '100%'}}>
    <Upload {...props}>
    <Button icon={<UploadOutlined />}>点击上传文件</Button>
  </Upload>
  </Card>
);
export default FileUpload;