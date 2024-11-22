import {
  ModalForm,
  ProFormText,
  ProFormTextArea
} from '@ant-design/pro-components';
import { Form, message } from 'antd';
import { useState, useImperativeHandle, forwardRef, Ref } from 'react';

type ModalProps = {
  api: (params: RoleItem) => Promise<Res.BatchRoleRes>,
  reload: () => {},
  rowData: RoleItem
}

const ModalRole = ({ }, ref: Ref<unknown>) => {
  const [form] = Form.useForm<RoleItem>();
  const [modalVisiable, setModalVisiable] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalProps, setModalProps] = useState<ModalProps>()
  const [rowFormItem, setRowFormItem] = useState<RoleItem>()
  const acceptParams = (params: ModalProps) => {
    const row = params.rowData;
    setRowFormItem(row);
    setModalProps(params)
    if (row.id) {
      setModalTitle("编辑角色")
    } else {
      setModalTitle('新增角色')
    }
    setModalVisiable(true);
  };

  const submitFinish = async (values: RoleItem) => {
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
    <ModalForm<RoleItem>
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
      <ProFormText name="roleName" label="角色名称" placeholder="请输入角色名称" rules={[
        {
          required: true,
        },
      ]} initialValue={rowFormItem?.roleName} />
      <ProFormTextArea
        name="remark"
        label="备注信息"
        placeholder="请输入备注信息"
        initialValue={rowFormItem?.remark}
      />
    </ModalForm>
  );
};

export default forwardRef(ModalRole)