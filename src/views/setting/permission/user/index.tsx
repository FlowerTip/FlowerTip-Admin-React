import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Space, message, Popconfirm } from 'antd';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import { useRef, useState } from 'react';
import { reqBatchRole, reqAccountList, reqSaveAccount, reqDelAccount } from '@/api/account'
import ModalAccount from './components/ModalAccount';
import RoleModal from './components/RoleModal';

export default () => {
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
    <div>
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
        headerTitle="账号列表"
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
  );
};
