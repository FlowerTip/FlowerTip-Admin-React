import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Dropdown, Space } from 'antd';
import { useRef } from 'react';
import { reqAccountList } from '@/api/account'

const columns: ProColumns<AccountItem>[] = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
    align: 'center'
  },
  {
    title: '账号名称',
    dataIndex: 'username',
    align: 'center'
  },
  {
    title: '账号密码',
    dataIndex: 'password',
    align: 'center'
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
  return (
    <ProTable<AccountItem>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params, sort, filter): Promise<any> => {
        console.log(sort, filter);
        const { code, data } = await reqAccountList({
          currentPage: params.current,
          pageSize: params.pageSize,
          username: params.keyword
        });
        if (code === 200) {
          return {
            data: data.list,
            success: true,
            total: data.total
          }
        }
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
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
        pageSize: 5,
        onChange: (page) => console.log(page),
      }}
      dateFormatter="string"
      headerTitle="账号列表"
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
