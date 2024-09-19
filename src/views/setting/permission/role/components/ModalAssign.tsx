import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { message, Modal, Tree } from 'antd';
import type { TreeDataNode, TreeProps } from 'antd';
import { reqMenuList } from "@/api/menu";
import { reqGetPermission } from "@/api/role";

type ModalProps = {
  api: (params: any) => Promise<any>,
  reload: () => {},
  rowData: any
}
const ModalAssign = ({ }, ref: any) => {
  const [treeData, setTreeData] = useState<TreeDataNode[]>();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleOk = async () => {
    setConfirmLoading(true);
    const req = {
      roleId: modalProps?.rowData.id,
      menusId: checkedKeys,
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
  const getSelectPerssion = async (id: any) => {
    const { code, data } = await reqGetPermission({
      roleId: id as number,
    });
    if (code === 200) {
      const selectTreeIds = data.list;
      setCheckedKeys(selectTreeIds as any)
    }
  };
  const getPermission = async (params: any) => {
    const { code, data } = await reqMenuList({});
    if (code === 200 && data.list.length > 0) {
      const menus = data.list.map((item) => ({
        ...item
      }));
      setTreeData(menus as any)
      getSelectPerssion(params.id);
    }
  };
  const [modalProps, setModalProps] = useState<ModalProps>()
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const onExpand: TreeProps['onExpand'] = (expandedKeysValue) => {
    console.log('onExpand', expandedKeysValue);
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck: TreeProps['onCheck'] = (checkedKeysValue) => {
    console.log('onCheck', checkedKeysValue);
    setCheckedKeys(checkedKeysValue as React.Key[]);
  };

  const onSelect: TreeProps['onSelect'] = (selectedKeysValue, info) => {
    console.log('onSelect', info);
    setSelectedKeys(selectedKeysValue);
  };
  const [modalTitle, setModalTitle] = useState("");
  const [modalVisiable, setModalVisiable] = useState(false);
  const acceptParams = (params: ModalProps) => {
    console.log(params, '44params');
    const row = params.rowData;
    setModalTitle("分配权限")
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
      <Tree
        checkable
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onCheck={onCheck}
        checkedKeys={checkedKeys}
        onSelect={onSelect}
        selectedKeys={selectedKeys}
        treeData={treeData}
        fieldNames={
          {
            key: 'id',
            title: 'name',
            children: 'children'
          }
        }
      />
    </Modal>
  );
};

export default forwardRef(ModalAssign)