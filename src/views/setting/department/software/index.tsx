import React, { useRef, useState, useEffect } from 'react';
import { Input, Tree } from 'antd';
import type { TreeDataNode, TreeProps } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Space, message, Popconfirm } from 'antd';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import ApartmentOutlined from '@ant-design/icons/ApartmentOutlined';
import { reqDepartmentList } from '@/api/department'
import { reqWorkPostList, reqSaveWorkPost, reqDelWorkPost } from '@/api/workPost'
import ModalAccount from './components/ModalAccount';
import './index.scss';

const { Search } = Input;
let originTreeData: DepartMentItem[] = [];

const Maintenance: React.FC = () => {
  const [treeData, setTreeData] = useState<TreeDataNode[]>([])
  const [searchValue, setSearchValue] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([])
  const getTreeData = async () => {
    const { code, data } = await reqDepartmentList({
      departmentName: searchValue,
    });
    if (code === 200) {
      originTreeData = data.origin as DepartMentItem[];
      const treeList = data.list.map((item: DepartMentItem) => {
        return {
          ...item,
          icon: <ApartmentOutlined />,
          selectable: !item.children
        }
      })

      const currSelected = treeList[0].children && treeList[0].children[0];
      setTreeData(treeList as unknown as TreeDataNode[])
      setSelectedKeys([currSelected?.departmentId] as React.Key[])
      setDefaultExpandedKeys(treeList.map(item => item.departmentId) as unknown as string[])
    }
  }

  useEffect(() => {
    selectedKeys.length > 0 && actionRef.current?.reload();
  }, [selectedKeys])
  
  useEffect(() => {
    getTreeData()
  }, [searchValue])



  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchValue(value);
  };



  const columns: ProColumns<WorkPostItem>[] = [
    {
      title: '岗位名称',
      dataIndex: 'workPostName',
      align: 'center',
      fieldProps: {
        placeholder: '请输入岗位名称'
      },
      hideInSearch: false,
      width: 120,
    },
    {
      title: '岗位编号',
      dataIndex: 'workPostNum',
      align: 'center',
      hideInSearch: true,
      width: 130,
    },
    {
      title: '所属部门',
      dataIndex: 'departmentName',
      align: 'center',
      hideInSearch: true,
      width: 160,
    },
    {
      title: '岗位描述',
      dataIndex: 'description',
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
      width: 170,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      align: 'center',
      hideInSearch: true,
      sorter: true,
      valueType: 'dateTime',
      width: 170,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      align: 'center',
      width: 220,
      render: (_, record) => [
        <Space style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Button size='small' onClick={() => editModal(record)}>编辑岗位</Button>
          <Popconfirm
            title="删除提示"
            description="确认要删除该岗位吗?"
            onConfirm={() => delModal(record)}
            onCancel={() => message.info('取消操作')}
            okText="确定"
            cancelText="取消"
          >
            <Button danger size='small'>删除岗位</Button>
          </Popconfirm>
        </Space >
        ,
      ],
    },
  ];
  const actionRef = useRef<ActionType>();
  const ModalAccountRef = useRef<any>();

  const updateTableList = async (params: Req.WorkPostListParam): Promise<any> => {
    console.log(params, '第一次请求参数');
    
    const { code, data } = await reqWorkPostList({
      currentPage: params.current,
      ...params,
      departmentId: selectedKeys[0] as number,
    });
    if (code === 200) {
      return {
        data: data.list.map(item => {
          return {
            ...item,
            departmentName: originTreeData.find(record => record.departmentId === item.departmentId)?.departmentName
          }
        }),
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
      api: reqSaveWorkPost,
      reload: actionRef.current?.reload,
      rowData: {
        workPostName: '',
        workPostNum: '',
        description: '',
        departmentId: selectedKeys[0],
      }
    })
  }
  const editModal = (rowData: WorkPostItem) => {
    ModalAccountRef.current!.acceptParams({
      api: reqSaveWorkPost,
      reload: actionRef.current?.reload,
      rowData
    })
  }
  const delModal = async (rowData: WorkPostItem) => {
    const { code } = await reqDelWorkPost({
      ids: [rowData.workPostId!],
    });
    if (code === 200) {
      message.success('删除成功');
      actionRef.current?.reload();
    }
  }
  const [defaultExpandedKeys, setDefaultExpandedKeys] = useState<string[]>([])

  const handleOnSelect: TreeProps['onSelect'] = (selectedKeys, e) => {
    console.log(selectedKeys, e);
    setSelectedKeys(selectedKeys);
    actionRef.current?.reload();
  }
  return (
    <div className="maintenance-table">
      <div className='tree-box'>
        <Search style={{ marginBottom: 8 }} placeholder="输入关键字" onChange={onChange} />
        <Tree
          showIcon
          showLine
          selectable
          expandedKeys={defaultExpandedKeys}
          selectedKeys={selectedKeys}
          treeData={treeData}
          fieldNames={
            {
              title: 'departmentName',
              key: 'departmentId',
            }
          }
          style={{
            padding: '10px 5px'
          }}
          onSelect={handleOnSelect}
        />
      </div>
      <div className="right-wrap">
        <ProTable<WorkPostItem>
          manualRequest
          columns={columns}
          actionRef={actionRef}
          cardBordered
          request={(params) => updateTableList({
            departmentId: selectedKeys[0] as number,
            ...pagination,
            ...params
          })}
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
          headerTitle="岗位管理"
          toolBarRender={() => [
            <Button
              key="button"
              icon={<PlusOutlined />}
              onClick={addAccount}
              type="primary"
            >
              添加岗位
            </Button>,
          ]}
        />
        <ModalAccount ref={ModalAccountRef} />
      </div>
    </div>
  )
}

export default Maintenance;