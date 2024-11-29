import {
  ModalForm,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Form, message } from 'antd';
import { useState, useImperativeHandle, forwardRef, ForwardedRef } from 'react';

type ModalProps = {
  api: (params: WorkPostItem) => Promise<any>,
  reload: () => {},
  rowData: WorkPostItem
}

const ModalAccount = ({ }, ref: ForwardedRef<any>) => {
  const [form] = Form.useForm<WorkPostItem>();
  const [modalVisiable, setModalVisiable] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalProps, setModalProps] = useState<ModalProps>()
  const [rowFormItem, setRowFormItem] = useState<WorkPostItem>()
  const acceptParams = (params: ModalProps) => {
    const row = params.rowData;
    setRowFormItem(row);
    setModalProps(params)
    if (row.workPostId) {
      setModalTitle("编辑岗位")
    } else {
      setModalTitle('新增岗位')
    }
    setModalVisiable(true);
  };

  const submitFinish = async (values: WorkPostItem) => {
    console.log({
      ...rowFormItem,
      ...values,
    }, '@@@rowFormItem');
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
    <ModalForm<WorkPostItem>
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
      <ProFormText name="workPostName" label="岗位名称" placeholder="请输入岗位名称" rules={[
        {
          required: true,
        },
      ]} initialValue={rowFormItem?.workPostName} />
      <ProFormText
        name="workPostNum"
        label="岗位编号"
        placeholder="请输入岗位编号"
        rules={[
          {
            required: true,
          },
        ]}
        initialValue={rowFormItem?.workPostNum}
      />
      <ProFormTextArea
        name="description"
        label="岗位描述"
        placeholder="请填写岗位描述"
        initialValue={rowFormItem?.description}
        fieldProps={{
          rows: 4,
          maxLength: 50,
          showCount: true
        }}
      />
    </ModalForm>
  );
};

export default forwardRef(ModalAccount)