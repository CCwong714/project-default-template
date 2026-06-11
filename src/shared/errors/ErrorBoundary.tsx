import {
  Component,
  type ErrorInfo,
  type PropsWithChildren,
  type ReactNode,
} from 'react'

type TErrorBoundaryState = {
  error: Error | null
}

export class ErrorBoundary extends Component<
  PropsWithChildren,
  TErrorBoundaryState
> {
  state: TErrorBoundaryState = {
    error: null,
  }

  static getDerivedStateFromError(error: Error): TErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled app error', error, errorInfo)
  }

  render(): ReactNode {
    if (this.state.error != null) {
      return (
        <main className="flex min-h-screen items-center justify-center px-6 py-10 text-slate-950">
          <section className="w-full max-w-xl rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
              Application error
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              Something went wrong
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Refresh the page to try again. If this keeps happening, check the
              browser console for details.
            </p>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}
