import {
  ModalForm,
  ProFormDigit,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { Form, message } from 'antd';
import { useState, useImperativeHandle, forwardRef, ForwardedRef } from 'react';
import { reqDepartmentList } from '@/api/department'
type ModalProps = {
  api: (params: DepartMentItem) => Promise<any>,
  reload: () => {},
  rowData: DepartMentItem
}

const ModalAccount = ({ }, ref: ForwardedRef<any>) => {
  const [form] = Form.useForm<DepartMentItem>();
  const [modalVisiable, setModalVisiable] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalProps, setModalProps] = useState<ModalProps>()
  const [rowFormItem, setRowFormItem] = useState<DepartMentItem>()
  const acceptParams = (params: ModalProps) => {
    const row = params.rowData;
    setRowFormItem(row);
    setModalProps(params)
    if (row.departmentId) {
      setModalTitle("编辑部门")
    } else {
      setModalTitle('新增部门')
    }

    console.log(row, 'rtoowakskda');

    setModalVisiable(true);
  };

  const submitFinish = async (values: DepartMentItem) => {
    console.log(values, 'asdasd');



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
    <ModalForm<DepartMentItem>
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
      <ProFormTreeSelect
        name="parentId"
        label="上级部门"
        allowClear
        request={async () => {
          const { code, data } = await reqDepartmentList({});
          if (code === 200) {
            return [{
              departmentName: '当前单位',
              departmentId: 0,
              description: '当前登录账号所在的企业单位',
              parentId: null,
              children: data.list
            }];
          } else {
            return []
          }
        }}
        debounceTime={1000}
        placeholder="请选择上级部门"
        fieldProps={{
          showSearch: true,
          filterTreeNode: true,
          labelInValue: true,
          autoClearSearchValue: true,
          treeNodeFilterProp: 'departmentName',
          fieldNames: {
            label: 'departmentName',
            value: 'departmentId',
          },
        }}
        rules={[{ required: true, message: '请选择上级部门' }]}
        initialValue={rowFormItem?.parentId}
        disabled={rowFormItem?.parentId ? true : false}
      />
      <ProFormText name="departmentName" label="部门名称" placeholder="请输入部门名称" rules={[
        {
          required: true,
        },
      ]} initialValue={rowFormItem?.departmentName} />
      <ProFormDigit
        name="sort"
        label="排序"
        placeholder="请输入排列序号"
        rules={[
          {
            required: true,
          },
        ]}
        initialValue={rowFormItem?.sort}
      />
      <ProFormTextArea
        name="description"
        label="部门描述"
        placeholder="请填写部门描述"
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