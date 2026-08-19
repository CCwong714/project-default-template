import { HomePage } from 'src/features/home'
import { AppShell } from 'src/shared/layouts/AppShell'
import { NotFoundPage } from 'src/shared/pages/NotFoundPage'

export function AppRouter() {
  const isHomePath =
    window.location.pathname === '/' ||
    window.location.pathname === '/ja' ||
    window.location.pathname === '/ja/'
  const page = isHomePath ? <HomePage /> : <NotFoundPage />
  return <AppShell>{page}</AppShell>
}
