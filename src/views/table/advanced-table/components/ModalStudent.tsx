import {
  ModalForm,
  ProForm,
  ProFormText,
  ProFormDigit,
  ProFormSelect,
  ProFormDateTimePicker,
  ProFormUploadButton
} from '@ant-design/pro-components';
import { Form, message, Image } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { useState, useImperativeHandle, forwardRef, Ref } from 'react';
import { reqUploadAvatar } from '@/api/upload'

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
type ModalProps = {
  api: (params: StudentItem) => Promise<Res.SaveStudentData>,
  reload: () => {},
  rowData: StudentItem
}

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const ModalStudent = ({ }, ref: Ref<unknown>) => {
  const [form] = Form.useForm<StudentItem>();
  const [modalVisiable, setModalVisiable] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalProps, setModalProps] = useState<ModalProps>()
  const [rowFormItem, setRowFormItem] = useState<StudentItem>()
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const acceptParams = (params: ModalProps) => {
    const row = params.rowData;
    setRowFormItem(row);
    setModalProps(params)
    if (row.id) {
      setModalTitle("编辑学员")
      setFileList([{
        uid: row.id as string,
        name: '学员头像',
        status: 'done',
        url: row.avatarUrl
      }])
    } else {
      setModalTitle('新增学员')
      setFileList([])
    }
    setModalVisiable(true);
  };

  const submitFinish = async (values: StudentItem) => {
    const req = {
      ...rowFormItem,
      ...values,
      avatarUrl: fileList.length > 0 ? '' : rowFormItem?.avatarUrl,
    }
    const { code, data } = await modalProps!.api(req);
    if (code === 200) {
      if (fileList.length > 0) {
        handleUpload({
          name: '用户头像',
          id: data.id
        })
      } else {
        message.success('操作成功');
        modalProps!.reload();
        setModalVisiable(false);
      }
    }
  }

  useImperativeHandle(ref, () => ({
    acceptParams
  }))

  const handleUpload = async (fileParams: { name: string, id: string }) => {
    console.log(fileList, 'fileList', fileList[0])
    const formData = new FormData();
    formData.append("filename", fileParams.name);
    formData.append("itemId", fileParams.id as string);
    const file = fileList[0]?.originFileObj || fileList[0];
    if (!file) {
      message.error('请选择文件');
      return;
    }
    formData.append("file", file as FileType, file.name);
    setUploading(true);
    console.log(uploading);
    const { code, data } = await reqUploadAvatar(formData);
    if (code === 200) {
      setUploading(false);
      setFileList([{
        uid: data.url as string,
        name: '学员头像',
        status: 'done',
        url: data.url,
      }]);
      message.success('操作成功');
      modalProps!.reload();
      setModalVisiable(false);
    }
  };

  const props: UploadProps = {
    beforeUpload: () => {
      return false;
    },
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    onChange: ({ fileList: newFileList }) => {
      console.log(newFileList, '$$$$newFileList');
      return setFileList(newFileList);
    },
    onPreview: async (file: UploadFile) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj as FileType);
      }

      setPreviewImage(file.url || (file.preview as string));
      setPreviewOpen(true);
    },
    fileList,
  };
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  return (
    <ModalForm<StudentItem>
      width={800}
      title={modalTitle}
      form={form}
      open={modalVisiable}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => setModalVisiable(false),
      }}
      submitTimeout={2000}
      onFinish={submitFinish}
    >
      <ProForm.Group>
        <ProFormText width="md" name="username" label="学员名称" placeholder="请输入学员名称" rules={[
          {
            required: true,
          },
        ]} initialValue={rowFormItem?.username} />
        <ProFormDigit
          width="md"
          label="年龄"
          name="age"
          min={1}
          max={100}
          fieldProps={{ precision: 0 }}
          rules={[
            {
              required: true,
            },
          ]}
          placeholder="请输入学员年龄"
          initialValue={rowFormItem?.age}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText width="md" name="address" label="学员住址" placeholder="请输入学员住址信息" rules={[
          {
            required: true,
          },
        ]} initialValue={rowFormItem?.address} />
        <ProFormSelect
          width="md"
          name="sex"
          label="性别"
          request={async () => [
            { label: '男', value: 1 },
            { label: '女', value: 0 },
          ]}
          placeholder="请选择学员性别"
          rules={[{ required: true }]}
          initialValue={rowFormItem?.sex}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText width="md" name="hobby" label="兴趣爱好" placeholder="请输入兴趣爱好" rules={[
          {
            required: true,
          },
        ]} initialValue={rowFormItem?.hobby} />
        <ProFormText width="md" name="school" label="学校名称" placeholder="请输入学校名称" rules={[
          {
            required: true,
          },
        ]} initialValue={rowFormItem?.school} />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          width="md"
          name="big"
          label="个头大小"
          request={async () => [
            { label: '大', value: 1 },
            { label: '小', value: 0 },
          ]}
          placeholder="请选择个头大小"
          rules={[{ required: true }]}
          initialValue={rowFormItem?.big}
        />
        <ProFormDateTimePicker width="md" name="time" label="档案时间" placeholder="请选择入学时间" rules={[
          {
            required: true,
          },
        ]} initialValue={rowFormItem?.time} />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText width="md" name="color" label="性格色彩" placeholder="输入 #1890ff 16进制颜色值" rules={[
          {
            required: true,
          },
        ]} initialValue={rowFormItem?.color || '#1890ff'} />
        <ProFormUploadButton
          name="avatarUrl"
          label="学员头像"
          max={1}
          fieldProps={{
            name: 'file',
            listType: 'picture-card',
            ...props
          }}
          extra="最大不超过2MB"
          rules={[
            {
              required: true,
              message: '请选择学员头像'
            },
          ]} initialValue={rowFormItem?.avatarUrl}
        />
        {previewImage && (
          <Image
            wrapperStyle={{ display: 'none' }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(''),
            }}
            src={previewImage}
          />
        )}
      </ProForm.Group>
    </ModalForm>
  );
};

export default forwardRef(ModalStudent)