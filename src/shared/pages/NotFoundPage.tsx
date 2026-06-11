import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10 text-slate-950">
      <section className="w-full max-w-xl rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
          404
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Page not found
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          The route you opened does not exist. Head back home and keep building
          from the project base.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex rounded-md bg-slate-950 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          >
            Back to home
          </Link>
        </div>
      </section>
    </main>
  )
}
