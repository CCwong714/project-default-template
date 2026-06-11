import type { RouteObject } from 'react-router-dom'

import { HomePage } from '@/features/home'
import { AppShell } from '@/shared/layouts/AppShell'
import { NotFoundPage } from '@/shared/pages/NotFoundPage'

export const appRoutes: RouteObject[] = [
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]
