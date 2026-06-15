import { AppProviders } from 'src/app/providers/AppProviders'
import { AppRouter } from 'src/app/router/AppRouter'
import { ErrorBoundary } from 'src/shared/errors/ErrorBoundary'

export function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </ErrorBoundary>
  )
}
