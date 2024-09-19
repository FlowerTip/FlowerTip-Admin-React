import {
  ModalForm,
  ProFormText,
} from '@ant-design/pro-components';
import { Form, message } from 'antd';
import { useState, useImperativeHandle, forwardRef } from 'react';

type ModalProps = {
  api: (params: AccountItem) => Promise<any>,
  reload: () => {},
  rowData: AccountItem
}

const ModalAccount = ({ }, ref: any) => {
  const [form] = Form.useForm<AccountItem>();
  const [modalVisiable, setModalVisiable] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalProps, setModalProps] = useState<ModalProps>()
  const [rowFormItem, setRowFormItem] = useState<AccountItem>()
  const acceptParams = (params: ModalProps) => {
    const row = params.rowData;
    setRowFormItem(row);
    setModalProps(params)
    if (row.id) {
      setModalTitle("编辑用户")
    } else {
      setModalTitle('新增用户')
    }
    setModalVisiable(true);
  };

  const submitFinish = async (values: AccountItem) => {
    const { code } = await modalProps!.api({
      ...rowFormItem,
      ...values,
    });
    if (code === 200) {
      message.success('操作成功');
      modalProps!.reload();
      setModalVisiable(false);
      return true;
    }
  }

  useImperativeHandle(ref, () => ({
    acceptParams
  }))

  return (
    <ModalForm<AccountItem>
      width={500}
      title={modalTitle}
      form={form}
      open={modalVisiable}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => setModalVisiable(false),
      }}
      submitTimeout={2000}
      onFinish={submitFinish}
    >
      <ProFormText name="username" label="账号名称" placeholder="请输入账号名称" rules={[
        {
          required: true,
        },
      ]} initialValue={rowFormItem?.username} />
      <ProFormText.Password
        name="password"
        label="账号密码"
        placeholder="请输入账号密码"
        rules={[
          {
            required: true,
          },
        ]}
        initialValue={rowFormItem?.password}
      />
    </ModalForm>
  );
};

export default forwardRef(ModalAccount)