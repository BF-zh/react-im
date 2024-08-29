import { MessageOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import { useMemo, useState } from 'react'

type TMenuKey = 'message' | 'connect'
interface TMenu {
  icon: React.ForwardRefExoticComponent<any>
  title: string
  key: TMenuKey
}
const menus: TMenu[] = [
  {
    icon: MessageOutlined,
    title: '消息',
    key: 'message',
  },
  {
    icon: UserOutlined,
    title: '联系人',
    key: 'connect',
  },
]
const chatList = Array.from({ length: 100 }).map((_, index) => ({
  title: `聊天${index}`,
  key: index,
}))

const messageList = Array.from({ length: 100 }).map((_, index) => ({
  content: `消息${index}`.repeat(index + 1),
  time: '2023-12-12 12:12:12',
  name: `用户${index}`,
  avatar: 'https://q1.qlogo.cn/g?b=qq&nk=2581807417&s=100',
  key: index,
  uid: index,
}))
console.log(messageList)

function UserChatList() {
  console.log('render')
  return (
    <>
      {chatList.map(chat => (
        <div className="flex items-center p-xs " key={chat.key}>
          <img className="w-40px rounded-full" src="https://q1.qlogo.cn/g?b=qq&nk=2581807417&s=100" alt="Logo" />
          <div className="flex flex-col">
            <span>{chat.title}</span>
            <span className="text-xs text-white/40">最近消息</span>
          </div>
        </div>
      ))}
    </>
  )
}

export function Component() {
  const [current, setCurrentMenu] = useState<TMenuKey>('message')
  const Memo = useMemo(UserChatList, [])
  return (
    <div className="flex h-full c-white">
      <div className="sm-(p-sm flex flex-col items-center bg-black/10) hidden ">
        <img className="w-60px rounded-full" src="https://q1.qlogo.cn/g?b=qq&nk=2581807417&s=100" alt="Logo" />
        <ul className="flex flex-col gap-sm">
          {menus.map(Com => (
            <li
              onClick={() => setCurrentMenu(Com.key)}
              className={current === Com.key
                ? 'w-40px bg-white/20 text-blue aspect-ratio-1 shadow-2xl rounded-md'
                : 'w-40px  aspect-ratio-1 rounded-md'}
              title={Com.title}
              key={Com.key}
            >
              <Com.icon className="w-full h-full text-25px items-center justify-center"></Com.icon>
            </li>
          ))}
        </ul>
      </div>
      <div className="md-(max-w-250px) flex flex-col w-full p-xs ">
        {/* 收索 */}
        <div className="mb-sm">
          <Input size="large" placeholder="搜索" prefix={<SearchOutlined style={{ color: 'lightslategrey' }} />} />
        </div>
        <div className="h-full of-auto">
          {current === 'message' ? Memo : '联系人'}
        </div>
      </div>
      <div className="md-(flex flex-col w-full) hidden bg-black/5">
        {/* 收索 */}
        <div className="p-sm bg-black/5">
          <span>北风</span>
        </div>
        <div className="flex-1 of-auto p-sm">
          {messageList.map(msg => (
            <div
              className={msg.uid % 2 === 0
                ? 'flex items-start gap-xs pl-50px flex-row-reverse my-sm'
                : 'flex items-start gap-xs pr-50px my-sm'}
              key={msg.key}
            >
              <img src={msg.avatar} alt="" className="w-40px rounded-full" />
              <div>
                <div className={
                  msg.uid % 2 === 0
                    ? 'flex items-center gap-xs c-white/70 text-12px flex-row-reverse mb-8px'
                    : 'flex items-center gap-xs c-white/70 text-12px mb-8px'
                }
                >
                  <span>{msg.name}</span>
                </div>
                <div className={msg.uid % 2 === 0
                  ? 'bg-sky/10 shadow-md  px-xs py-8px rounded-md'
                  : 'bg-black/7 shadow-md px-xs py-8px rounded-md'}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-black/5">
          123134
        </div>
      </div>
    </div>

  )
}
