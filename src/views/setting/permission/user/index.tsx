import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Space, message, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';
import { reqBatchRole, reqAccountList, reqSaveAccount, reqDelAccount } from '@/api/account'
import ModalAccount from './components/ModalAccount';
import RoleModal from './components/RoleModal';

export default () => {
  const columns: ProColumns<AccountItem>[] = [
    {
      title: '用户名称',
      dataIndex: 'username',
      align: 'center',
      fieldProps: {
        placeholder: '请输入用户名称'
      }
    },
    {
      title: '用户密码',
      dataIndex: 'password',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '权限角色',
      dataIndex: 'roleNames',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '所属岗位',
      dataIndex: 'workPostName',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '所属部门',
      dataIndex: 'departmentName',
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
        <Space style={{ width: '100%', display: 'flex', justifyContent: 'center' }} key={record.id}>
          {
            record.username !== '系统管理员' ? (
              <><Button size='small' onClick={() => batchModal(record)}>分配角色</Button><Button size='small' onClick={() => editModal(record)}>编辑账号</Button><Popconfirm
                title="删除提示"
                description="确认要删除该账号吗?"
                onConfirm={() => delModal(record)}
                onCancel={() => message.info('取消操作')}
                okText="确定"
                cancelText="取消"
              >
                <Button danger size='small'>删除账号</Button>
              </Popconfirm></>
            ) : <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>——</span>
          }
        </Space >
        ,
      ],
    },
  ];
  const actionRef = useRef<ActionType>();
  const ModalAccountRef = useRef<any>();
  const RoleModalRef = useRef<any>();

  const updateTableList = async (params: Req.AccountListParam): Promise<any> => {
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
        password: '123456',
        workPostId: null
      }
    })
  }
  const editModal = (rowData: AccountItem) => {
    ModalAccountRef.current!.acceptParams({
      api: reqSaveAccount,
      reload: actionRef.current?.reload,
      rowData
    })
  }
  const delModal = async (rowData: AccountItem) => {
    const { code } = await reqDelAccount({
      ids: [rowData.id!],
    });
    if (code === 200) {
      message.success('删除成功');
      actionRef.current?.reload();
    }
  }
  const batchModal = (rowData: AccountItem) => {
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
