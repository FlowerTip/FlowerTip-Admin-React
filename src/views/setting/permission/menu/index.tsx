import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useRef } from 'react';
import { reqMenuList } from '@/api/menu'
import { delChildren } from '@/utils/tool'

export default () => {
  const columns: ProColumns<AccountItem>[] = [
    {
      title: '菜单名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '权限值',
      dataIndex: 'code',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '菜单类型',
      dataIndex: 'typeLabel',
      align: 'center',
      hideInSearch: true
    },
  ];
  const actionRef = useRef<ActionType>();

  const updateTableList = async (params: any): Promise<any> => {
    const { code, data } = await reqMenuList({
      currentPage: params.current,
      pageSize: params.pageSize,
    });
    if (code === 200) {
      console.log(delChildren(data.list), 'delChildren(data.list)');
      
      return {
        data: delChildren(data.list),
        success: true,
      }
    }
  }
  return (
    <ProTable<AccountItem>
      style={{
        padding: '10px'
      }}
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
      pagination={false}
      dateFormatter="string"
      headerTitle="菜单列表"
    />
  );
};
