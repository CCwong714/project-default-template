import { HomePage } from 'src/features/home'
import { AppShell } from 'src/shared/layouts/AppShell'
import { NotFoundPage } from 'src/shared/pages/NotFoundPage'

export function AppRouter() {
  const page =
    window.location.pathname === '/' ? <HomePage /> : <NotFoundPage />
  return <AppShell>{page}</AppShell>
}
