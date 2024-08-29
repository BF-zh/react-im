import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import zhCN from 'antd/locale/zh_CN'
import { RouterProvider } from 'react-router-dom'
import { App, ConfigProvider } from 'antd'
import { routers } from './router.tsx'
import 'uno.css'
import 'virtual:uno.css'
import '@unocss/reset/tailwind-compat.css'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        cssVar: true,
        token: {
          colorBgContainer: 'rgba(255, 255, 255, .4)',
          colorBgElevated: 'rgba(255, 255, 255, .7)',
        },
        components: {
          Button: {
            defaultColor: '#fff',
            fontWeight: 'bold',
          },
        },
      }}
      locale={zhCN}
    >
      <App>
        <RouterProvider router={routers} />
      </App>
    </ConfigProvider>
  </StrictMode>,
)
