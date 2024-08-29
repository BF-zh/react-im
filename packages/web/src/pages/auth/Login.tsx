import { Button, Input, Popover } from 'antd'
import { useState } from 'react'
import Layout from './Layout'

type TLogin = 'QR' | 'PASSWORD'

export function Component() {
  const [loginType, setLoginType] = useState<TLogin>('PASSWORD')

  if (loginType === 'PASSWORD') {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center gap-sm h-full">
          <Input size="large" placeholder="账号"></Input>
          <Input size="large" placeholder="密码"></Input>
          <div className="flex justify-between w-full">
            <Button type="link" onClick={() => setLoginType('QR')}>扫码登陆</Button>
            <Popover
              arrow={false}
              content={(
                <div className="flex flex-col gap-sm">
                  <Button type="link">忘记密码</Button>
                  <Button type="link">注册账号</Button>
                </div>
              )}
            >
              <Button type="link">更多选项</Button>
            </Popover>
          </div>
          <Button size="large" block>登录</Button>
        </div>
      </Layout>

    )
  }
  else {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center gap-sm h-full">
          <Button type="link" onClick={() => setLoginType('PASSWORD')}>密码登录</Button>
          <Button block>扫码登录</Button>
        </div>
      </Layout>
    )
  }
}
