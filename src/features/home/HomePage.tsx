import { env } from '@/shared/lib/env'

export function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12 text-slate-950">
      <section className="w-full max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
          {env.appName}
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">
          Build the first real feature here.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
          This base keeps the app shell, routing, Tailwind, strict TypeScript,
          linting, tests, and CI ready without locking the project into a
          specific product direction.
        </p>

        <div className="mt-8 flex flex-wrap gap-3 text-sm font-medium">
          <a
            href="https://vite.dev"
            className="rounded-md bg-slate-950 px-4 py-2.5 text-white transition-colors hover:bg-slate-800"
          >
            Vite docs
          </a>
          <a
            href="https://react.dev"
            className="rounded-md border border-slate-300 px-4 py-2.5 text-slate-700 transition-colors hover:border-slate-400 hover:bg-white"
          >
            React docs
          </a>
        </div>
      </section>
    </main>
  )
}
