import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main className="flex p-12 flex-col justify-center gap-4 items-center">
      <h1 className="text-4xl">Probabilist</h1>
      <p className="text-2xl pb-6 max-w-[40ch] text-center text-muted-foreground">
        Probabilist is a tool designed to make your probability computing
        easier, and effective.
      </p>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/preview">Preview</Link>
    </main>
  )
}
