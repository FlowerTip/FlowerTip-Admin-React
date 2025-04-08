import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Image, Button, Space, Popconfirm, message } from 'antd';
import { useRef, useState } from 'react';
import { reqStudentList, reqSaveStudent, reqDelStudent } from '@/api/student'
import dayjs from 'dayjs';
import ModalStudent from './components/ModalStudent';
type TableResData = { data: StudentItem[], success: boolean; total: number; }
export default () => {
  const columns: ProColumns<StudentItem>[] = [
    {
      title: '学员头像',
      dataIndex: 'avatarUrl',
      align: 'center',
      render: (_, record) => (<Image
        width={80}
        height={80}
        src={record.avatarUrl}
      />),
      hideInSearch: true,
      width: 160
    },
    {
      title: '学员名称',
      dataIndex: 'username',
      align: 'center',
      fieldProps: {
        placeholder: '请输入学员名称'
      },
      width: 160
    },
    {
      title: '年龄',
      dataIndex: 'age',
      align: 'center',
      sorter: true,
      hideInSearch: true,
      width: 160
    },
    {
      title: '个头大小',
      dataIndex: 'big',
      align: 'center',
      valueType: 'select',
      fieldProps: {
        options: [
          {
            label: '大',
            value: 1,
          },
          {
            label: '小',
            value: 0,
          },
        ],
        placeholder: '请选择个头大小'
      },
      width: 160
    },
    {
      title: '性格色彩',
      dataIndex: 'color',
      align: 'center',
      render: (_, record) => (
        <div style={{ display: 'inline-block', width: '30px', height: '30px', backgroundColor: record.color, verticalAlign: 'middle' }}></div>
      ),
      hideInSearch: true,
      width: 160
    },
    {
      title: '兴趣',
      dataIndex: 'hobby',
      align: 'center',
      fieldProps: {
        placeholder: '请输入兴趣爱好'
      },
      render: (_, record) => (
        <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>{record.hobby}</span>
      ),
      width: 160,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      align: 'center',
      valueType: 'select',
      fieldProps: {
        options: [
          {
            label: '男',
            value: 1,
          },
          {
            label: '女',
            value: 0,
          },
        ],
        placeholder: '请选择性别'
      },
      width: 160
    },
    {
      title: '学校',
      dataIndex: 'school',
      align: 'center',
      fieldProps: {
        placeholder: '请输入学校名称'
      },
      width: 160,
    },
    {
      title: '档案时间',
      dataIndex: 'time',
      align: 'center',
      sorter: true,
      width: 200,
      valueType: 'dateTime',
      fieldProps: {
        placeholder: '请选择档案时间'
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      align: 'center',
      width: 160,
      render: (_, record) => [
        <Space style={{ width: '100%', display: 'flex', justifyContent: 'center' }} key={record.id}>
          <Button size='small' onClick={() => editModal(record)}>编辑</Button>
          <Popconfirm
            title="删除提示"
            description="确认要删除该学员吗?"
            onConfirm={() => delModal(record)}
            onCancel={() => message.info('取消操作')}
            okText="确定"
            cancelText="取消"
          >
            <Button danger size='small'>删除</Button>
          </Popconfirm>
        </Space >
        ,
      ],
    },
  ];
  const ModalStudentRef = useRef<any>(null);
  const addModal = () => {
    ModalStudentRef.current!.acceptParams({
      api: reqSaveStudent,
      reload: actionRef.current?.reload,
      rowData: {}
    })
  }
  const editModal = (rowData: StudentItem) => {
    ModalStudentRef.current!.acceptParams({
      api: reqSaveStudent,
      reload: actionRef.current?.reload,
      rowData: { ...rowData, time: dayjs(rowData.time).format('YYYY-MM-DD HH:mm:ss') }
    })
  }
  const delModal = async (rowData: StudentItem) => {
    const { code } = await reqDelStudent({
      ids: [(rowData.id as number)!],
    });
    if (code === 200) {
      message.success('删除成功');
      actionRef.current?.reload();
    }
  }
  const actionRef = useRef<ActionType>();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10
  })
  return (
    <>
      <ProTable<StudentItem>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params): Promise<TableResData> => {
          const { code, data } = await reqStudentList({
            currentPage: params.current,
            ...params
          });
          if (code === 200) {
            return {
              data: data.list.map(item => {
                return {
                  ...item,
                  bigLabel: item.big ? "大" : "小",
                  sexLabel: item.sex ? "男" : "女",
                  time: dayjs(item.time).format("YYYY-MM-DD HH:mm:ss"),
                }
              }),
              success: true,
              total: data.total
            }
          } else {
            return {
              data: [],
              success: false,
              total: 0
            }
          }
        }}
        rowKey="id"
        search={{
          labelWidth: 100,
        }}
        options={{
          setting: {
            listsHeight: 400,
          },
          fullScreen: true
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
        headerTitle="学员列表"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={addModal}
            type="primary"
          >
            添加学员
          </Button>,
        ]}
      />
      <ModalStudent ref={ModalStudentRef} />
    </>
  );
};
