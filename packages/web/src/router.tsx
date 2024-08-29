import type { RouteObject } from 'react-router-dom'
import { createBrowserRouter, redirect } from 'react-router-dom'

interface AuthProvider {
  isAuthenticated: boolean
  username: null | string
  signin: (username: string) => Promise<void>
  signout: () => Promise<void>
}

export const authProvider: AuthProvider = {
  isAuthenticated: true,
  username: null,
  async signin(username: string) {
    await new Promise(r => setTimeout(r, 500)) //  delay
    authProvider.isAuthenticated = true
    authProvider.username = username
  },
  async signout() {
    await new Promise(r => setTimeout(r, 500)) //  delay
    authProvider.isAuthenticated = false
    authProvider.username = ''
  },
}

const router: RouteObject[] = [
  {
    id: 'root',
    path: '/',
    lazy: () => import('./components/Layout'),
    children: [
      {
        id: 'not-found',
        path: '*',
        lazy: () => import('./components/NotFound'),
      },
      {
        path: 'login',
        id: 'login',
        lazy: () => import('./pages/auth/Login'),
        loader() {
          if (authProvider.isAuthenticated)
            return redirect('/')
          return null
        },
      },
      {
        path: 'register',
        id: 'register',
        loader() {
          if (authProvider.isAuthenticated)
            return redirect('/')
          return null
        },
        lazy: () => import('./pages/auth/Register'),
      },
      {
        path: '/',
        lazy: () => import('./pages'),
        loader() {
          if (!authProvider.isAuthenticated)
            return redirect('/login')
          return null
        },
        children: [
          {
            path: 'contact',
            element: <div>contact</div>,
          },
        ],
      },
    ],
  },

]

export const routers = createBrowserRouter(router)
