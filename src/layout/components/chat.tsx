import {
  Attachments,
  Bubble,
  Prompts,
  Sender,
  Welcome,
  useXAgent,
  useXChat,
  XRequest,
  type BubbleProps
} from '@ant-design/x';
import markdownit from 'markdown-it';
import { createStyles } from 'antd-style';
import React from 'react';
import CloudUploadOutlined from '@ant-design/icons/CloudUploadOutlined';
import FireOutlined from '@ant-design/icons/FireOutlined';
import NotificationOutlined from '@ant-design/icons/NotificationOutlined';
import PaperClipOutlined from '@ant-design/icons/PaperClipOutlined';
import ReadOutlined from '@ant-design/icons/ReadOutlined';
import ProfileOutlined from '@ant-design/icons/ProfileOutlined';
import UserAddOutlined from '@ant-design/icons/UserAddOutlined';
import { Flex, Badge, Button, Spin, Image, type GetProp, type GetRef, type UploadProps, Space, message } from 'antd';
import { SSEFields } from '@ant-design/x/es/x-stream';
import { Attachment } from '@ant-design/x/es/attachments';
import { isIndexOfFiles, isMdelement } from '@/utils/tool';
import { userStore } from '@/store';
import { BubbleContentType } from '@ant-design/x/es/bubble/interface';
import { useSnapshot } from 'valtio';
import { ClearOutlined, CopyOutlined, SyncOutlined } from '@ant-design/icons';

const md = markdownit({ html: true, breaks: true });

const renderMarkdown: BubbleProps<JSX.Element>['messageRender'] = (content: JSX.Element) => (
  isMdelement(content) ? <p dangerouslySetInnerHTML={{ __html: md.renderInline(content) }}></p> : content
);

// https://api.siliconflow.cn/v1/chat/completions
// https://api.chatanywhere.tech/v1/chat/completions
const aiConfig = {
  BASE_URL: ' https://api.siliconflow.cn',
  PATH: '/v1/chat/completions',
  MODEL: 'Qwen/QVQ-72B-Preview',
  // MODEL: 'gpt-3.5-turbo',
  // MODEL: 'Qwen/QwQ-32B',
  API_KEY: "Bearer sk-egddhgwyygueidskftjyqltrcezjhwdjpfzbdndojvrmitaa"
  // API_KEY: "sk-XKL1YHDdy9VHWZeDdiXNbswkHumM2fllSe7JH5ZR3v8oL8El"
}
const exampleRequest = XRequest({
  baseURL: aiConfig.BASE_URL + aiConfig.PATH,
  model: aiConfig.MODEL,

  /** 🔥🔥 Its dangerously! */
  dangerouslyApiKey: aiConfig.API_KEY,
});

const renderTitle = (icon: React.ReactElement, title: string) => (
  <Space align="start">
    {icon}
    <span>{title}</span>
  </Space>
);
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const useStyle = createStyles(({ token, css }) => {
  return {
    layout: css`
      width: 100%;
      height: auto;
      min-width: 530px;
      border-radius: ${token.borderRadius}px;
      display: flex;
      background: ${token.colorBgContainer};
      font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;

      .ant-prompts {
        color: ${token.colorText};
      }
    `,
    chat: css`
      height: 100%;
      width: 100%;
      margin: 0 auto;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      padding: ${token.paddingXS}px;
      gap: 16px;
    `,
    messages: css`
      flex: 1;
    `,
    placeholder: css`
      width: 100%;
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
  };
});

const placeholderPromptsItems: GetProp<typeof Prompts, 'items'> = [
  {
    key: '1',
    label: renderTitle(<ReadOutlined style={{ color: '#1890FF' }} />, '文档指南'),
    description: '你想了解哪门技术框架?',
    children: [
      {
        key: '1-1',
        icon: <ProfileOutlined />,
        description: `Vue技术框架开发文档`,
      },
      {
        key: '1-2',
        icon: <ProfileOutlined />,
        description: `React技术框架开发文档`,
      },
      {
        key: '1-3',
        icon: <ProfileOutlined />,
        description: `Node技术框架开发文档`,
      },
    ],
  },
  {
    key: '2',
    label: renderTitle(<FireOutlined style={{ color: '#FF4D4F' }} />, '热门话题'),
    description: '你关注哪些热点新闻?',
    children: [
      {
        key: '2-1',
        icon: <NotificationOutlined />,
        description: `普通人存款多少可以躺平`,
      },
      {
        key: '2-2',
        icon: <NotificationOutlined />,
        description: `不会被AI替代的职业有哪些`,
      },
      {
        key: '2-3',
        icon: <NotificationOutlined />,
        description: `北京第三代社保卡更换指南`,
      },
    ],
  },
];


const Independent: React.FC = () => {
  const uStore = useSnapshot(userStore);
  // ==================== Style ====================
  const { styles } = useStyle();

  // ==================== State ====================
  const [headerOpen, setHeaderOpen] = React.useState(false);

  const [content, setContent] = React.useState('');

  const [attachedFiles, setAttachedFiles] = React.useState<GetProp<typeof Attachments, 'items'>>(
    [],
  );

  // ==================== Runtime ====================
  const [agent] = useXAgent({
    request: async ({ message }, { onSuccess, onUpdate }) => {
      const params: {
        role: string;
        content: Attachment[] | { type: string; text: string | undefined | BubbleContentType }[];
      } = {
        role: 'user',
        content: []
      }
      console.log(isIndexOfFiles(message as string), message, messages, items, 'ceshi')
      if (isIndexOfFiles(message as string)) {
        const jsContentObj = JSON.parse(message as string);
        console.log(jsContentObj, '参数附件')
        const { content, files, oldMsgList } = jsContentObj;
        const questionList = oldMsgList.filter((item: any) => item && typeof item.content == 'string')
        const textParam = [{ type: 'text', text: content }]
        if (files.length > 0) {
          const paramFiles = files.map((item: { name: string; url: string; }) => {
            return {
              type: "image_url",
              image_url: {
                url: item.url,
              }
            }
          })
          params.content = [
            ...questionList.map((item: { content: any; }) => {
              return {
                type: 'text',
                text: item.content
              }
            }),
            ...paramFiles,
            ...textParam
          ]
        } else {
          if (oldMsgList.length > 0) {
            params.content = [
              ...questionList.map((item: { content: any; }) => {
                return {
                  type: 'text',
                  text: item.content
                }
              }),
              ...textParam
            ];
          } else {
            params.content = textParam;
          }
        }
      } else {
        params.content = [
          { type: 'text', text: message }
        ]
      }
      /**
       * 模拟请求延迟
       */
      setTimeout(() => {
        onUpdate('loading');
      }, 500);

      await exampleRequest.create(
        {
          messages: [params],
          // response_format: {"type": "json_object"}
        },
        {
          onSuccess: function (chunks: any): void {
            const fullContent = chunks[0].choices[0].message.content;
            onSuccess(fullContent);
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

  const [messageApi, contextHolder] = message.useMessage();

  const { onRequest, messages, setMessages } = useXChat({
    agent,
  });

  // ==================== Event ====================
  const onCopyResult = (content: any) => {
    console.log(content, '###messages')
    const text = content;
    navigator.clipboard.writeText(text);
    messageApi.success('复制成功');
  };

  const roles: GetProp<typeof Bubble.List, 'roles'> = {
    ai: {
      placement: 'start',
      header: "狗尾巴花的尖",
      avatar: {
        icon: <img
          src="./favicon.svg"
          draggable={false}
          alt="logo"
        />, style: { background: '#fff' }
      },
      typing: { step: 5, interval: 20 },
      style: {
        maxWidth: 530,
        marginInlineEnd: 16
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
      header: uStore.userInfo.username,
      avatar: { icon: <UserAddOutlined />, style: { background: '#3170FF' } },
      style: {
        maxWidth: 530,
        marginInlineStart: 16
      },
    },
  };
  const onPromptsItemClick: GetProp<typeof Prompts, 'onItemClick'> = (info) => {
    onRequest(info.data.description as string);
  };

  const handleFileChange: GetProp<typeof Attachments, 'onChange'> = (info) => {
    console.log(info, 'info附件')
    if (info.file.size) {
      const currentFile = {
        ...info.file,
        name: info.file.name,
        url: ''
      }
      getBase64(info.file as FileType, (url) => {
        currentFile.url = url
      });
      return setAttachedFiles([...attachedFiles, currentFile]);
    } else {
      return setAttachedFiles(info.fileList);
    }
  }


  // ==================== Nodes ====================
  const placeholderNode = (
    <Space direction="vertical" align="center" size={16} className={styles.placeholder}>
      <Welcome
        variant="borderless"
        icon="https://www.flowertip.site/pro/favicon.svg"
        title="你好, 我是AI智能交互助手"
        description="我是狗尾巴花的尖，FlowerTip Admin AI 智能对话交互助手"
        style={{
          width: '530px'
        }}
      />
      <Prompts
        title="你想要做什么?"
        items={placeholderPromptsItems}
        styles={{
          list: {
            width: '530px',
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
    console.log(item, '@@@@item')
    const { id, message, status } = item;
    let msgContent = '';
    if (status === 'local' && isIndexOfFiles(message as string)) {
      const jsContentObj = JSON.parse(message as string);
      msgContent = jsContentObj;
    } else {
      msgContent = message;
    }
    return {
      key: id,
      loading: message == 'loading',
      role: status === 'local' ? 'local' : 'ai',
      content: msgContent,
      footer: (status == 'local' || message == 'loading') ? null : (<Space size="small">
        <Button color="primary" variant="outlined" size="small" icon={<CopyOutlined />} onClick={() => onCopyResult(msgContent)}>复制内容</Button>
      </Space>),
      messageRender: (content: any) => {
        if (status == 'local') {
          if (content.files && content.files.length > 0) {
            const diyComponent = (
              <div style={{ width: '250px' }}>
                {
                  content.files.map((item: any, index: number) => {
                    return <Image key={index} width={250} src={item.url} style={{ display: 'block' }} />
                  })
                }
                <p>{content.content}</p>
              </div>
            )
            return renderMarkdown(diyComponent);
          } else {
            const msg = typeof content == 'string' ? content : content.content;
            return renderMarkdown(msg);
          }
        } else {
          return renderMarkdown(content);
        }
      },
    }
  });

  const attachmentsNode = (
    <Badge dot={attachedFiles.length > 0 && !headerOpen}>
      <Button type="text" icon={<PaperClipOutlined />} onClick={() => setHeaderOpen(!headerOpen)} />
    </Badge>
  );

  const attachmentsRef = React.useRef<GetRef<typeof Attachments>>(null)
  const senderRef = React.useRef<GetRef<typeof Sender>>(null);

  const senderHeader = (
    <Sender.Header
      title="图片上传"
      open={headerOpen}
      onOpenChange={setHeaderOpen}
      styles={{
        content: {
          padding: 0,
        },
      }}
    >
      <Attachments
        ref={attachmentsRef}
        items={attachedFiles}
        beforeUpload={() => false}
        onChange={handleFileChange}
        placeholder={(type) =>
          type === 'drop'
            ? { title: '选取图片' }
            : {
              icon: <CloudUploadOutlined />,
              title: '上传图片',
              description: '点击上传图片或者拖动图片上传',
            }
        }
        getDropContainer={() => senderRef.current?.nativeElement}
      />
    </Sender.Header>
  );

  const onSubmit = async (nextContent: string) => {
    if (!nextContent) return;
    const from = {
      content: nextContent,
      files: attachedFiles,
      oldMsgList: items.map((item: any) => {
        return {
          content: item.content
        }
      })
    }
    const jsonStrContent = JSON.stringify(from);
    onRequest(jsonStrContent);
    setContent('');
    setAttachedFiles([]);
    setHeaderOpen(false);
  };

  // ==================== Render =================
  return (
    <div className={styles.layout}>
      <div className={styles.chat} style={{ whiteSpace: 'pre-line', height: '800px', overflowY: 'auto' }}>
        {/* 🌟 消息列表 */}
        <Bubble.List
          // 🌟 消息列表
          items={items.length > 0 ? items : [{ content: placeholderNode, variant: 'borderless' }]}
          roles={roles}
          className={styles.messages}
        />
        {/* 清空对话按钮 */}
        <Flex gap={12} align="start" vertical={false} style={{ width: '100%' }}>
          <Button
            color="primary"
            variant="outlined"
            icon={<SyncOutlined />}
            onClick={() => {
              setAttachedFiles([]);
              setHeaderOpen(false);
              setContent('');
            }}
          >
            清空输入
          </Button>
          <Button
            color="danger"
            variant="outlined"
            icon={<ClearOutlined />}
            onClick={() => {
              setMessages([]);
            }}
          >
            清空对话
          </Button>
        </Flex>
        {/* 🌟 输入框 */}
        <Sender
          value={content}
          header={senderHeader}
          onSubmit={onSubmit}
          onChange={setContent}
          onPasteFile={(file) => {
            getBase64(file as FileType, (url) => {
              const fileObj = {
                name: file.name,
                url
              }
              setAttachedFiles([...attachedFiles, fileObj] as Attachment[]);
              setHeaderOpen(true);
            });
          }}
          prefix={attachmentsNode}
          loading={agent.isRequesting()}
          className={styles.sender}
        />
      </div>
      {contextHolder}
    </div>
  );
};

export default Independent;