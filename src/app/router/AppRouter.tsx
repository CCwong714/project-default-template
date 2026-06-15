import { useRoutes } from 'react-router-dom'
import { appRoutes } from 'src/app/router/appRoutes'

export function AppRouter() {
  return useRoutes(appRoutes)
}
