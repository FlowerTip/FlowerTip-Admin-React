import React, { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Space, message, Popconfirm } from 'antd';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import { reqDepartmentList, reqSaveDepartment, reqDelDepartMent } from '@/api/department'
import ModalAccount from './components/ModalAccount';

const Maintenance: React.FC = () => {
  const columns: ProColumns<AccountItem>[] = [
    {
      title: '部门名称',
      dataIndex: 'departmentName',
      align: 'center',
      fieldProps: {
        placeholder: '请输入部门名称'
      },
      width: 160,
    },
    {
      title: '部门编号',
      dataIndex: 'departmentId',
      align: 'center',
      hideInSearch: true,
      width: 160,
    },
    {
      title: '部门描述',
      dataIndex: 'description',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '上级部门',
      dataIndex: 'parentName',
      align: 'center',
      hideInSearch: true,
      width: 160,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      align: 'center',
      hideInSearch: true,
      sorter: true,
      valueType: 'dateTime',
      width: 160,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      align: 'center',
      hideInSearch: true,
      sorter: true,
      valueType: 'dateTime',
      width: 160,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      align: 'center',
      width: 300,
      render: (_, record) => [
        <Space style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Button size='small' onClick={() => batchModal(record)}>添加部门</Button>
          <Button size='small' onClick={() => editModal(record)}>编辑部门</Button>
          <Popconfirm
            title="删除提示"
            description="确认要删除该部门吗?"
            onConfirm={() => delModal(record)}
            onCancel={() => message.info('取消操作')}
            okText="确定"
            cancelText="取消"
          >
            <Button danger size='small'>删除部门</Button>
          </Popconfirm>
        </Space >
        ,
      ],
    },
  ];
  const actionRef = useRef<ActionType>();
  const ModalAccountRef = useRef<any>();

  const updateTableList = async (params: any): Promise<any> => {
    const { code, data } = await reqDepartmentList({
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
      api: reqSaveDepartment,
      reload: actionRef.current?.reload,
      rowData: {
        parentId: 0,
        departmentName: '',
        departmentId: '',
        sort: '',
        description: ''
      }
    })
  }
  const editModal = (rowData: any) => {
    ModalAccountRef.current!.acceptParams({
      api: reqSaveDepartment,
      reload: actionRef.current?.reload,
      rowData
    })
  }
  const delModal = async (rowData: any) => {
    const { code } = await reqDelDepartMent({
      departmentId: rowData.departmentId!,
    });
    if (code === 200) {
      message.success('删除成功');
      actionRef.current?.reload();
    }
  }
  const batchModal = (rowData: any) => {
    ModalAccountRef.current!.acceptParams({
      api: reqSaveDepartment,
      reload: actionRef.current?.reload,
      rowData: {
        parentId: rowData.departmentId,
        departmentName: '',
        departmentId: '',
        sort: '',
        description: ''
      }
    })
  }

  return (
    <>
      <ProTable<AccountItem>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={updateTableList}
        rowKey="departmentId"
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
        headerTitle="部门管理"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={addAccount}
            type="primary"
          >
            添加部门
          </Button>,
        ]}
      />
      <ModalAccount ref={ModalAccountRef} />
    </>
  )
}

export default Maintenance;