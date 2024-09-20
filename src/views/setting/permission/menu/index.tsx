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
      fieldProps: {
        placeholder: '请输入菜单名称'
      }
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
        pagination={false}
        dateFormatter="string"
        headerTitle="菜单列表"
      />
    </div>
  );
};
