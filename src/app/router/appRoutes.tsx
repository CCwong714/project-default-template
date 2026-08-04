import type { RouteObject } from 'react-router-dom'
import { HomePage } from 'src/features/home'
import { AboutPage, ProjectPage } from 'src/features/portfolio'
import { AppShell } from 'src/shared/layouts/AppShell'
import { NotFoundPage } from 'src/shared/pages/NotFoundPage'

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
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'projects/:slug',
        element: <ProjectPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]
