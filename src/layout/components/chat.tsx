import {
  Attachments,
  Bubble,
  Conversations,
  Prompts,
  Sender,
  Welcome,
  useXAgent,
  useXChat,
  XRequest
} from '@ant-design/x';
import Markdown from 'react-markdown';
import { createStyles } from 'antd-style';
import React, { useEffect } from 'react';

import CloudUploadOutlined from '@ant-design/icons/CloudUploadOutlined';
import CommentOutlined from '@ant-design/icons/CommentOutlined';
import FireOutlined from '@ant-design/icons/FireOutlined';
import HeartOutlined from '@ant-design/icons/HeartOutlined';
import PaperClipOutlined from '@ant-design/icons/PaperClipOutlined';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import ReadOutlined from '@ant-design/icons/ReadOutlined';
import SmileOutlined from '@ant-design/icons/SmileOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import UserAddOutlined from '@ant-design/icons/UserAddOutlined';
import { Badge, Button, Spin, type GetProp, Space } from 'antd';
import { SSEFields } from '@ant-design/x/es/x-stream';

// https://api.siliconflow.cn/v1/chat/completions
// https://api.chatanywhere.tech/v1/chat/completions
const aiConfig = {
  BASE_URL: 'https://api.chatanywhere.tech',
  PATH: '/v1/chat/completions',
  MODEL: 'gpt-3.5-turbo',
  // MODEL: 'Qwen/QwQ-32B',
  // API_KEY: "Bearer sk-egddhgwyygueidskftjyqltrcezjhwdjpfzbdndojvrmitaa"
  API_KEY: "sk-XKL1YHDdy9VHWZeDdiXNbswkHumM2fllSe7JH5ZR3v8oL8El"
}

const exampleRequest = XRequest({
  baseURL: aiConfig.BASE_URL + aiConfig.PATH,
  model: aiConfig.MODEL,

  /** 🔥🔥 Its dangerously! */
  dangerouslyApiKey: aiConfig.API_KEY
});


const renderTitle = (icon: React.ReactElement, title: string) => (
  <Space align="start">
    {icon}
    <span>{title}</span>
  </Space>
);

const defaultConversationsItems = [
  {
    key: '0',
    label: '临时会话',
  },
];

const useStyle = createStyles(({ token, css }) => {
  return {
    layout: css`
      width: 100%;
      height: auto;
      min-width: 800px;
      border-radius: ${token.borderRadius}px;
      display: flex;
      background: ${token.colorBgContainer};
      font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;

      .ant-prompts {
        color: ${token.colorText};
      }
    `,
    menu: css`
      background: ${token.colorBgLayout}80;
      width: 310px;
      height: 100%;
      display: flex;
      flex-direction: column;
    `,
    conversations: css`
      padding: 0 12px;
      flex: 1;
      overflow-y: auto;
    `,
    chat: css`
      height: 100%;
      width: 100%;
      max-width: 700px;
      margin: 0 auto;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      padding: ${token.paddingLG}px;
      gap: 16px;
    `,
    messages: css`
      flex: 1;
    `,
    placeholder: css`
      padding-top: 32px;
    `,
    sender: css`
      box-shadow: ${token.boxShadow};
    `,
    logo: css`
      display: flex;
      height: 72px;
      align-items: center;
      justify-content: start;
      padding: 0 24px;
      box-sizing: border-box;

      img {
        width: 24px;
        height: 24px;
        display: inline-block;
      }

      span {
        display: inline-block;
        margin: 0 8px;
        font-weight: bold;
        color: ${token.colorText};
        font-size: 16px;
      }
    `,
    addBtn: css`
      background: #1677ff0f;
      border: 1px solid #1677ff34;
      width: calc(100% - 24px);
      margin: 0 12px 24px 12px;
    `,
  };
});

const placeholderPromptsItems: GetProp<typeof Prompts, 'items'> = [
  {
    key: '1',
    label: renderTitle(<FireOutlined style={{ color: '#FF4D4F' }} />, '热门话题'),
    description: '你想了解些什么?',
    children: [
      {
        key: '1-1',
        description: `AI的新功能?`,
      },
      {
        key: '1-2',
        description: `AGI是什么?`,
      },
      {
        key: '1-3',
        description: `文档在哪里?`,
      },
    ],
  },
  {
    key: '2',
    label: renderTitle(<ReadOutlined style={{ color: '#1890FF' }} />, '设计指南'),
    description: '如何设计好的产品?',
    children: [
      {
        key: '2-1',
        icon: <HeartOutlined />,
        description: `了解AI`,
      },
      {
        key: '2-2',
        icon: <SmileOutlined />,
        description: `设置AI角色`,
      },
      {
        key: '2-3',
        icon: <CommentOutlined />,
        description: `感觉如何`,
      },
    ],
  },
];

const senderPromptsItems: GetProp<typeof Prompts, 'items'> = [
  {
    key: '1',
    description: '热门话题',
    icon: <FireOutlined style={{ color: '#FF4D4F' }} />,
  },
  {
    key: '2',
    description: '设计指南',
    icon: <ReadOutlined style={{ color: '#1890FF' }} />,
  },
];

const roles: GetProp<typeof Bubble.List, 'roles'> = {
  ai: {
    placement: 'start',
    avatar: {
      icon: <img
        src="./favicon.svg"
        draggable={false}
        alt="logo"
      />, style: { background: '#fff' }
    },
    typing: { step: 5, interval: 20 },
    style: {
      maxWidth: 600,
      marginInlineEnd: 44,
    },
    styles: {
      footer: {
        width: '100%',
      },
    },
    loadingRender: () => (
      <Space>
        <Spin size="small" />
        我正在整理思路，请稍等...
      </Space>
    ),
  },
  local: {
    placement: 'end',
    avatar: { icon: <UserAddOutlined />, style: { background: '#3170FF' } }
  },
};

const Independent: React.FC = () => {
  // ==================== Style ====================
  const { styles } = useStyle();

  // ==================== State ====================
  const [headerOpen, setHeaderOpen] = React.useState(false);

  const [content, setContent] = React.useState('');

  const [conversationsItems, setConversationsItems] = React.useState(defaultConversationsItems);

  const [activeKey, setActiveKey] = React.useState(defaultConversationsItems[0].key);

  const [attachedFiles, setAttachedFiles] = React.useState<GetProp<typeof Attachments, 'items'>>(
    [],
  );

  // ==================== Runtime ====================
  const [agent] = useXAgent({
    request: async ({ message }, { onSuccess, onUpdate }) => {
      await exampleRequest.create(
        {
          messages: [{ role: 'user', content: message }],
        },
        {
          onSuccess: function (chunks: any): void {
            const fullContent = chunks[0].choices[0].message.content;
            let currentContent = '';

            const id = setInterval(() => {
              currentContent = fullContent.slice(0, currentContent.length + 10);
              onUpdate(currentContent);

              if (currentContent === fullContent) {
                clearInterval(id);
                onSuccess(fullContent);
              }
            }, 100);
          },
          onError: function (error: Error): void {
            console.log(error);
          },
          onUpdate: function (chunk: Partial<Record<SSEFields, any>>): void {
            console.log(chunk)
          }
        }
      )
    }
  });

  const { onRequest, messages, setMessages } = useXChat({
    agent,
  });

  useEffect(() => {
    if (activeKey !== undefined) {
      setMessages([]);
    }
  }, [activeKey]);

  // ==================== Event ====================
  const onSubmit = async (nextContent: string) => {
    if (!nextContent) return;
    onRequest(nextContent);
    setContent('');
  };

  const onPromptsItemClick: GetProp<typeof Prompts, 'onItemClick'> = (info) => {
    onRequest(info.data.description as string);
  };

  const onAddConversation = () => {
    setConversationsItems([
      ...conversationsItems,
      {
        key: `${conversationsItems.length}`,
        label: `当前对话${conversationsItems.length + 1}`,
      },
    ]);
    setActiveKey(`${conversationsItems.length}`);
  };

  const onConversationClick: GetProp<typeof Conversations, 'onActiveChange'> = (key) => {
    setActiveKey(key);
  };

  const handleFileChange: GetProp<typeof Attachments, 'onChange'> = (info) =>
    setAttachedFiles(info.fileList);

  // ==================== Nodes ====================
  const placeholderNode = (
    <Space direction="vertical" size={16} className={styles.placeholder}>
      <Welcome
        variant="borderless"
        icon="https://www.flowertip.site/pro/favicon.svg"
        title="你好, 我是AI智能交互助手"
        description="我是狗尾巴花的尖，FlowerTip Admin AI 智能对话交互助手"
      />
      <Prompts
        title="你想要做什么?"
        items={placeholderPromptsItems}
        styles={{
          list: {
            width: '100%',
          },
          item: {
            flex: 1,
          },
        }}
        onItemClick={onPromptsItemClick}
      />
    </Space>
  );

  const items: GetProp<typeof Bubble.List, 'items'> = messages.map((item) => {
    console.log(item, 'can')
    const { id, message, status } = item;
    return {
      key: id,
      loading: status === 'loading',
      role: status === 'local' ? 'local' : 'ai',
      content: (<Markdown>{message}</Markdown>),
    }
  });

  const attachmentsNode = (
    <Badge dot={attachedFiles.length > 0 && !headerOpen}>
      <Button type="text" icon={<PaperClipOutlined />} onClick={() => setHeaderOpen(!headerOpen)} />
    </Badge>
  );

  const senderHeader = (
    <Sender.Header
      title="附件上传"
      open={headerOpen}
      onOpenChange={setHeaderOpen}
      styles={{
        content: {
          padding: 0,
        },
      }}
    >
      <Attachments
        beforeUpload={() => false}
        items={attachedFiles}
        onChange={handleFileChange}
        placeholder={(type) =>
          type === 'drop'
            ? { title: '选取文件' }
            : {
              icon: <CloudUploadOutlined />,
              title: '上传文件',
              description: '选择或者拖动文件上传',
            }
        }
      />
    </Sender.Header>
  );

  const logoNode = (
    <div className={styles.logo}>
      <img
        src="./favicon.svg"
        draggable={false}
        alt="logo"
      />
      <span>狗尾巴花的尖</span>
    </div>
  );

  // ==================== Render =================
  return (
    <div className={styles.layout}>
      <div className={styles.menu}>
        {/* 🌟 Logo */}
        {logoNode}
        {/* 🌟 添加会话 */}
        <Button
          onClick={onAddConversation}
          type="link"
          className={styles.addBtn}
          icon={<PlusOutlined />}
        >
          新建对话
        </Button>
        {/* 🌟 会话管理 */}
        <Conversations
          menu={(conversation) => (
            {
              items: [
                {
                  label: '删除会话',
                  key: 'deleteKey',
                  icon: <DeleteOutlined />,
                },
              ],
              onClick: (menuInfo) => {
                console.log(`Click ${conversation.key} - ${menuInfo.key}`);
                const filterItems = conversationsItems.filter(item => conversation.key !== item.key);
                setConversationsItems(filterItems);
                const defaultItem = filterItems[filterItems.length - 1]
                setActiveKey(defaultItem ? defaultItem.key : '');
              },
            }
          )}
          items={conversationsItems}
          className={styles.conversations}
          activeKey={activeKey}
          onActiveChange={onConversationClick}
        />
      </div>
      <div className={styles.chat} style={{ whiteSpace: 'pre-line', height: '800px', overflowY: 'auto' }}>
        {/* 🌟 消息列表 */}
        <Bubble.List
          // 🌟 消息列表
          items={items.length > 0 ? items : [{ content: placeholderNode, variant: 'borderless' }]}
          roles={roles}
          className={styles.messages}
        />
        {/* 🌟 提示词 */}
        <Prompts items={senderPromptsItems} onItemClick={onPromptsItemClick} />
        {/* 🌟 输入框 */}
        <Sender
          value={content}
          header={senderHeader}
          onSubmit={onSubmit}
          onChange={setContent}
          prefix={attachmentsNode}
          loading={agent.isRequesting()}
          className={styles.sender}
        />
      </div>
    </div>
  );
};

export default Independent;