import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main className="text-3xl flex p-12 justify-center items-center">
      <h1>Probabilist</h1>
    </main>
  )
}
