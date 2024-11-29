import { useState, useImperativeHandle, forwardRef, ForwardedRef } from 'react';
import { message, Modal, Checkbox } from 'antd';
import type { CheckboxProps } from 'antd';
import { reqRoleList } from "@/api/role";
import { reqGetRole } from "@/api/user";

type ModalProps = {
  api: (params: any) => Promise<any>,
  reload: () => {},
  rowData: any
}
const CheckboxGroup = Checkbox.Group;
const defaultCheckedList: string[] = [];

const RoleModal = ({ }, ref: ForwardedRef<any>) => {
  const [checkboxOptions, setCheckboxOptions] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleOk = async () => {
    setConfirmLoading(true);
    const req = {
      userId: modalProps?.rowData.id,
      rolesId: checkedList,
    };
    const { code } = await modalProps?.api(req);
    if (code === 200) {
      setConfirmLoading(false);
      message.success('分配成功')
      setModalVisiable(false);
    }
  };

  const handleCancel = () => {
    setModalVisiable(false);
  };
  const getSelectPerssion = async (id: number) => {
    const { code, data } = await reqGetRole({
      userId: id as number,
    });
    if (code === 200) {
      const selectTreeIds = data.list;
      setCheckedList(selectTreeIds as any)
    }
  };
  const getPermission = async (params: any) => {
    const { code, data } = await reqRoleList({});
    if (code === 200 && data.list.length > 0) {
      const menus = data.list.map((item) => ({
        ...item,
        label: item.roleName,
        value: item.id
      }));
      setCheckboxOptions(menus as any)
      getSelectPerssion(params.id);
    }
  };
  const [modalProps, setModalProps] = useState<ModalProps>()
  const [checkedList, setCheckedList] = useState<string[]>(defaultCheckedList);

  const checkAll = checkboxOptions.length === checkedList.length;
  const indeterminate = checkedList.length > 0 && checkedList.length < checkboxOptions.length;

  const onChange = (list: string[]) => {
    setCheckedList(list);
  };

  const onCheckAllChange: CheckboxProps['onChange'] = (e) => {
    setCheckedList(e.target.checked ? checkboxOptions.map((item: any) => item.id) : []);
  };

  const [modalTitle, setModalTitle] = useState("");
  const [modalVisiable, setModalVisiable] = useState(false);
  const acceptParams = (params: ModalProps) => {
    console.log(params, '44params');
    const row = params.rowData;
    setModalTitle("分配角色")
    setModalProps(params)
    setModalVisiable(true);
    getPermission(row);
  };

  useImperativeHandle(ref, () => ({
    acceptParams
  }))

  return (
    <Modal
      title={modalTitle}
      open={modalVisiable}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
    >
      <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
        全选
      </Checkbox>
      <div style={{ padding: '10px 0' }}>
        <CheckboxGroup options={checkboxOptions} value={checkedList} onChange={onChange} />
      </div>
    </Modal>
  );
};

export default forwardRef(RoleModal)