import { HomePage } from 'src/features/home'
import { NotFoundPage } from 'src/shared/pages/NotFoundPage'

export const appRoutes = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
] as const
