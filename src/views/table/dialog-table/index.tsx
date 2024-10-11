import React, { useMemo, useState } from 'react';
import { Input, Tree } from 'antd';
import type { TreeDataNode } from 'antd';
import Icon from '@ant-design/icons';
import EditFilled from '@ant-design/icons/EditFilled';

import './index.scss';

const { Search } = Input;

const x = 3;
const y = 2;
const z = 1;
const defaultData: TreeDataNode[] = [];

const generateData = (_level: number, _preKey?: React.Key, _tns?: TreeDataNode[]) => {
  const preKey = _preKey || '0';
  const tns = _tns || defaultData;

  const children: React.Key[] = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({ title: key, key });
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(level, key, tns[index].children);
  });
};
generateData(z);

const dataList: { key: React.Key; title: string }[] = [];
const generateList = (data: TreeDataNode[]) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { key } = node;
    dataList.push({ key, title: key as string });
    if (node.children) {
      generateList(node.children);
    }
  }
};
generateList(defaultData);

const getParentKey = (key: React.Key, tree: TreeDataNode[]): React.Key => {
  let parentKey: React.Key;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey!;
};

const DialogTable: React.FC = () => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newExpandedKeys = dataList
      .map((item) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, defaultData);
        }
        return null;
      })
      .filter((item, i, self): item is React.Key => !!(item && self.indexOf(item) === i));
    setExpandedKeys(newExpandedKeys);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  const treeData = useMemo(() => {
    const loop = (data: TreeDataNode[]): TreeDataNode[] =>
      data.map((item) => {
        const strTitle = item.title as string;
        const index = strTitle.indexOf(searchValue);
        const beforeStr = strTitle.substring(0, index);
        const afterStr = strTitle.slice(index + searchValue.length);
        const title =
          index > -1 ? (
            <span key={item.key}>
              {beforeStr}
              <span className="site-tree-search-value">{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span key={item.key}>{strTitle}</span>
          );
        if (item.children) {
          return { title, key: item.key, children: loop(item.children) };
        }

        return {
          title,
          key: item.key,
        };
      });

    return loop(defaultData);
  }, [searchValue]);

  const radioList = [
    {
      id: -1,
      label: "全部",
    },
    {
      id: 1,
      label: "待提交",
      icon: EditFilled,
    },
    {
      id: 2,
      label: "待审核",
      icon: EditFilled,
    },
    {
      id: 3,
      label: "已驳回",
      icon: EditFilled,
    },
    {
      id: 4,
      label: "已通过",
      icon: EditFilled,
    },
  ];
  const [currRadioId, setCurrRadioId] = useState<number>(-1);

  const radioClick = (id: number) => {
    setCurrRadioId(id)
  }

  const [checkboxIndex, setCheckboxIndex] = useState<number[]>([-1]);
  const checkboxClick = (id: number) => {
    const spliceIndex = checkboxIndex.findIndex((curr) => curr === id);
    if (spliceIndex !== -1) {
      checkboxIndex.splice(spliceIndex, 1);
      if (checkboxIndex.length === 0) {
        setCheckboxIndex([-1])
      }
    } else {
      if (id === -1) {
        setCheckboxIndex([id])
        return;
      }
      const currIndex = checkboxIndex.findIndex((idVal) => idVal === -1);
      currIndex !== -1 && checkboxIndex.splice(currIndex, 1);
      setCheckboxIndex([...checkboxIndex, id]);
    }
  }
  return (
    <div className="dialog-table">
      <div className='tree-box'>
        <Search style={{ marginBottom: 8 }} placeholder="输入关键字" onChange={onChange} />
        <Tree
          treeData={treeData}
          defaultExpandAll={true}
        />
      </div>
      <div className="right-wrap">
        <div className="condition">
          <span className="label">账单状态（单选）：</span>
          <div className="radio-group">
            {
              radioList.map(radio => {
                return (
                  <div className={radio.id === currRadioId ? 'radio-item active' : 'radio-item'} onClick={() => radioClick(radio.id)}>
                    <Icon component={radio.icon as React.ForwardRefExoticComponent<any>} className='radio-icon' />
                    {radio.label}
                  </div>
                )
              })
            }
          </div>
        </div>
        <div className="condition">
          <span className="label">报销状态（多选）：</span>
          <div className="checkbox-group">
            {
              radioList.map(radio => {
                return (
                  <div className={checkboxIndex.includes(radio.id) ? 'radio-item active' : 'radio-item'} onClick={() => checkboxClick(radio.id)}>
                    <Icon component={radio.icon as React.ForwardRefExoticComponent<any>} className='radio-icon' />
                    {radio.label}
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default DialogTable;