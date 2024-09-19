import {
  ModalForm,
  ProForm,
  ProFormText,
  ProFormDigit,
  ProFormSelect,
  ProFormDateTimePicker,
  ProFormUploadButton
} from '@ant-design/pro-components';
import { Form, message } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { useState, useImperativeHandle, forwardRef } from 'react';
import { reqUploadAvatar } from '@/api/upload'

type ModalProps = {
  api: (params: StudentItem) => Promise<any>,
  reload: () => {},
  rowData: StudentItem
}

const ModalStudent = ({ }, ref: any) => {
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
    const { code, data } = await modalProps!.api({
      ...rowFormItem,
      ...values,
    });
    if (code === 200) {
      if (fileList.length > 0) {
        handleUpload({
          name: '用户头像',
          id: data.id
        })
        message.success('操作成功');
        modalProps!.reload();
        setModalVisiable(false);
        return true;
      }
    }
  }

  useImperativeHandle(ref, () => ({
    acceptParams
  }))
  type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

  const handleUpload = async (fileParams: any) => {
    const formData = new FormData();
    formData.append("filename", fileParams.name);
    formData.append("itemId", fileParams.id as string);
    formData.append("file", fileList[0] as FileType);
    setUploading(true);
    const { code, data } = await reqUploadAvatar(formData);
    if (code === 200) {
      setUploading(false);
      setFileList([{
        uid: data.url as string,
        name: '学员头像',
        status: 'done',
        url: data.url
      }]);
    }
  };
  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      console.log(file, fileList, 'befit');
      return false;
    },
    fileList,
  };

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
        <ProFormText width="md" name="color" label="性格色彩" placeholder="请输入性格色彩" rules={[
          {
            required: true,
          },
        ]} initialValue={rowFormItem?.color} />
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
      </ProForm.Group>
    </ModalForm>
  );
};

export default forwardRef(ModalStudent)