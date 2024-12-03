import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Space, message, Popconfirm } from 'antd';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import { useRef, useState } from 'react';
import { reqRoleList, reqSaveRole, reqDelRole, reqBatchPermission } from '@/api/role'
import ModalRole from './components/ModalRole';
import ModalAssign from './components/ModalAssign';
import dayjs from 'dayjs';

export default () => {
  const columns: ProColumns<RoleItem>[] = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
      align: 'center',
      fieldProps: {
        placeholder: '请输入角色名称'
      }
    },
    {
      title: '备注信息',
      dataIndex: 'remark',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      align: 'center',
      hideInSearch: true,
      sorter: true,
      width: 200,
      valueType: 'dateTime',
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      align: 'center',
      width: 300,
      render: (_, record) => [
        <Space style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          {
            record.id !== 1 ? (
              <><Button size='small' onClick={() => assignModal(record)}>分配权限</Button><Button size='small' onClick={() => editModal(record)}>编辑角色</Button><Popconfirm
                title="删除提示"
                description="确认要删除该角色吗?"
                onConfirm={() => delModal(record)}
                onCancel={() => message.info('取消操作')}
                okText="确定"
                cancelText="取消"
              >
                <Button danger size='small'>删除角色</Button>
              </Popconfirm></>
            ) : <span style={{color: 'rgba(0, 0, 0, 0.45)'}}>——</span>
          }
        </Space >
        ,
      ],
    },
  ];
  const actionRef = useRef<ActionType>();
  const ModalRoleRef = useRef<any>();
  const ModalAssignRef = useRef<any>();

  const updateTableList = async (params: any): Promise<any> => {
    const { code, data } = await reqRoleList({
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
  const addModal = () => {
    ModalRoleRef.current!.acceptParams({
      api: reqSaveRole,
      reload: actionRef.current?.reload,
      rowData: {
        roleName: '',
        remark: '',
        updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
    })
  }
  const editModal = (rowData: RoleItem) => {
    ModalRoleRef.current!.acceptParams({
      api: reqSaveRole,
      reload: actionRef.current?.reload,
      rowData: { ...rowData, updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss') }
    })
  }
  const delModal = async (rowData: any) => {
    const { code } = await reqDelRole({
      ids: [rowData.id!],
    });
    if (code === 200) {
      message.success('删除成功');
      actionRef.current?.reload();
    }
  }

  const assignModal = (rowData: RoleItem) => {
    ModalAssignRef.current!.acceptParams({
      api: reqBatchPermission,
      reload: actionRef.current?.reload,
      rowData
    })
    console.log(rowData, '@@2rowData');
  }
  return (
    <div>
      <ProTable<RoleItem>
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
        headerTitle="角色列表"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={addModal}
            type="primary"
          >
            添加角色
          </Button>,
        ]}
      />
      <ModalRole ref={ModalRoleRef} />
      <ModalAssign ref={ModalAssignRef} />
    </div>
  );
};
