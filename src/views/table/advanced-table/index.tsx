import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Dropdown, Space } from 'antd';
import { useRef, useState, useEffect } from 'react';
import { reqStudentList } from '@/api/student'
import useTableHeight from '@/hooks/useTableHeight'
import dayjs from 'dayjs';


const columns: ProColumns<StudentItem>[] = [
  {
    title: '学员名称',
    dataIndex: 'username',
    align: 'center'
  },
  {
    title: '年龄',
    dataIndex: 'age',
    align: 'center',
    sorter: true,
    hideInSearch: true
  },
  {
    title: '个头大小',
    dataIndex: 'bigLabel',
    align: 'center'
  },
  {
    title: '性格色彩',
    dataIndex: 'color',
    align: 'center'
  },
  {
    title: '兴趣',
    dataIndex: 'hobby',
    align: 'center'
  },
  {
    title: '性别',
    dataIndex: 'sexLabel',
    align: 'center'
  },
  {
    title: '学校',
    dataIndex: 'school',
    align: 'center'
  },
  {
    title: '档案时间',
    dataIndex: 'time',
    align: 'center',
    sorter: true,
    width: 160
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    align: 'center',
    width: 300,
    render: (text, record, _, action) => [
      <Space style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Button size='small'>编辑</Button>
        <Button size='small'>删除</Button>
      </Space >
      ,
    ],
  },
];

export default () => {
  const actionRef = useRef<ActionType>();
  const [scrollY, setScrollY] = useState<number | string>('auto')
  const [collapsed, setCollapsed] = useState(true)
  const toggleCollapsed = (val: boolean) => {
    setCollapsed(val)
  }
  useEffect(() => {
    const h = useTableHeight({
      extraHeight: 200,
      id: null
    });
    setScrollY(h);
  }, [])
  useEffect(() => {
    const h = useTableHeight({
      extraHeight: 200,
      id: null
    });
    setScrollY(h);
  }, [collapsed])
  return (
    <ProTable<StudentItem>
      tableLayout='fixed'
      scroll={
        {
          y: scrollY,
          scrollToFirstRowOnChange: true
        }
      }
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params, sort, filter): Promise<any> => {
        console.log(params, sort, filter);
        const { code, data } = await reqStudentList({
          ...params,
          currentPage: params.current,
          pageSize: params.pageSize,
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
        }
      }}
      rowKey="id"
      search={{
        labelWidth: 100,
        onCollapse: toggleCollapsed
      }}
      options={{
        setting: {
          listsHeight: 400,
        },
      }}
      form={{
        // 由于配置了 transform，提交的参数与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      pagination={{
        pageSize: 10,
        onChange: (page) => console.log(page),
      }}
      dateFormatter="string"
      headerTitle="高级表格"
      toolBarRender={() => [
        <Button
          key="button"
          icon={<PlusOutlined />}
          onClick={() => {
            actionRef.current?.reload();
          }}
          type="primary"
        >
          新建
        </Button>,
      ]}
    />
  );
};
