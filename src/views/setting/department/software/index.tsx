import React, { useRef, useMemo, useState } from 'react';
import { Input, Tree } from 'antd';
import type { TreeDataNode } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Space, message, Popconfirm } from 'antd';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import { reqBatchRole, reqAccountList, reqSaveAccount, reqDelAccount } from '@/api/account'
import ModalAccount from './components/ModalAccount';
import RoleModal from './components/RoleModal';

import './index.scss';

const { Search } = Input;

const x = 3;
const y = 2;
const z = 1;
const defaultData: TreeDataNode[] = [];

const generateData = (_level: number, _preKey?: React.Key, _tns?: TreeDataNode[]) => {
  const preKey = _preKey || '0';
  const tns = _tns || defaultData;

  const children: React.Key[] = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({ title: key, key });
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(level, key, tns[index].children);
  });
};
generateData(z);

const dataList: { key: React.Key; title: string }[] = [];
const generateList = (data: TreeDataNode[]) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { key } = node;
    dataList.push({ key, title: key as string });
    if (node.children) {
      generateList(node.children);
    }
  }
};
generateList(defaultData);

const getParentKey = (key: React.Key, tree: TreeDataNode[]): React.Key => {
  let parentKey: React.Key;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey!;
};

const Software: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');


  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchValue(value);
  };

  const treeData = useMemo(() => {
    const loop = (data: TreeDataNode[]): TreeDataNode[] =>
      data.map((item) => {
        const strTitle = item.title as string;
        const index = strTitle.indexOf(searchValue);
        const beforeStr = strTitle.substring(0, index);
        const afterStr = strTitle.slice(index + searchValue.length);
        const title =
          index > -1 ? (
            <span key={item.key}>
              {beforeStr}
              <span className="site-tree-search-value">{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span key={item.key}>{strTitle}</span>
          );
        if (item.children) {
          return { title, key: item.key, children: loop(item.children) };
        }

        return {
          title,
          key: item.key,
        };
      });

    return loop(defaultData);
  }, [searchValue]);


  const columns: ProColumns<AccountItem>[] = [
    {
      title: '账号名称',
      dataIndex: 'username',
      align: 'center',
      fieldProps: {
        placeholder: '请输入账号名称'
      }
    },
    {
      title: '账号密码',
      dataIndex: 'password',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      align: 'center',
      width: 300,
      render: (_, record) => [
        <Space style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Button size='small' onClick={() => batchModal(record)}>分配角色</Button>
          <Button size='small' onClick={() => editModal(record)}>编辑账号</Button>
          <Popconfirm
            title="删除提示"
            description="确认要删除该账号吗?"
            onConfirm={() => delModal(record)}
            onCancel={() => message.info('取消操作')}
            okText="确定"
            cancelText="取消"
          >
            <Button danger size='small'>删除账号</Button>
          </Popconfirm>
        </Space >
        ,
      ],
    },
  ];
  const actionRef = useRef<ActionType>();
  const ModalAccountRef = useRef<any>();
  const RoleModalRef = useRef<any>();

  const updateTableList = async (params: any): Promise<any> => {
    const { code, data } = await reqAccountList({
      currentPage: params.current,
      ...params
    });
    if (code === 200) {
      return {
        data: data.list,
        success: true,
        total: data.total
      }
    }
  }
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10
  })
  const addAccount = () => {
    ModalAccountRef.current!.acceptParams({
      api: reqSaveAccount,
      reload: actionRef.current?.reload,
      rowData: {
        username: '',
        password: '123456'
      }
    })
  }
  const editModal = (rowData: any) => {
    ModalAccountRef.current!.acceptParams({
      api: reqSaveAccount,
      reload: actionRef.current?.reload,
      rowData
    })
  }
  const delModal = async (rowData: any) => {
    const { code } = await reqDelAccount({
      ids: [rowData.id!],
    });
    if (code === 200) {
      message.success('删除成功');
      actionRef.current?.reload();
    }
  }
  const batchModal = (rowData: any) => {
    RoleModalRef.current.acceptParams({
      api: reqBatchRole,
      reload: actionRef.current?.reload,
      rowData
    })
  }

  return (
    <div className="maintenance-table">
      <div className='tree-box'>
        <Search style={{ marginBottom: 8 }} placeholder="输入关键字" onChange={onChange} />
        <Tree
          treeData={treeData}
          defaultExpandAll={true}
        />
      </div>
      <div className="right-wrap">
        <ProTable<AccountItem>
          columns={columns}
          actionRef={actionRef}
          cardBordered
          request={updateTableList}
          rowKey="id"
          search={{
            labelWidth: 'auto',
          }}
          options={{
            setting: {
              listsHeight: 400,
            },
          }}
          pagination={{
            showSizeChanger: true,
            current: pagination.current,
            pageSize: pagination.pageSize,
            onChange: (page, size) => {
              setPagination({
                current: page,
                pageSize: size
              })
            },
          }}
          dateFormatter="string"
          headerTitle="运维人员"
          toolBarRender={() => [
            <Button
              key="button"
              icon={<PlusOutlined />}
              onClick={addAccount}
              type="primary"
            >
              添加账号
            </Button>,
          ]}
        />
        <ModalAccount ref={ModalAccountRef} />
        <RoleModal ref={RoleModalRef} />
      </div>
    </div>
  )
}

export default Software;