import {
  ModalForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Form, message } from 'antd';
import { reqWorkPostList } from '@/api/workPost'
import { useState, useImperativeHandle, forwardRef, Ref } from 'react';

type ModalProps = {
  api: (params: AccountItem) => Promise<Res.SaveAccountRes>,
  reload: () => {},
  rowData: AccountItem
}

const ModalAccount = ({ }, ref: Ref<unknown>) => {
  const [form] = Form.useForm<AccountItem>();
  const [modalVisiable, setModalVisiable] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalProps, setModalProps] = useState<ModalProps>()
  const [rowFormItem, setRowFormItem] = useState<AccountItem>()
  const acceptParams = (params: ModalProps) => {
    const row = params.rowData;
    console.log(row, 'rtoowakskda');
    
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
      ]} initialValue={rowFormItem?.username} fieldProps={{
        maxLength: 7,
        showCount: true
      }}/>
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
      <ProFormSelect
        name="workPostId"
        label="所属岗位"
        request={async () => {
          const { code, data } = await reqWorkPostList({
            currentPage: 1,
            pageSize: 100,
          });
          if (code === 200) {
            return data.list;
          } else {
            return []
          }
        }}
        fieldProps={{
          fieldNames: {
            label: 'description',
            value: 'workPostId',
          },
        }}
        debounceTime={1000}
        placeholder="请选择所属岗位"
        rules={[{ required: true, message: '请选择所属岗位' }]}
        initialValue={rowFormItem?.workPostId}
      />
    </ModalForm>
  );
};

export default forwardRef(ModalAccount);