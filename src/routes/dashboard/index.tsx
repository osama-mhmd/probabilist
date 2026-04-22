import { createFileRoute } from '@tanstack/react-router'
import { MainContents, Sidebar } from './-components'
import { useState, useEffect } from 'react'
import { Transition } from '@/components/Transition'

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [currentEntity, setCurrentEntity] = useState<string | null>(null)

  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    const storageKey = 'dashboard_statistics'
    const savedDataString = localStorage.getItem(storageKey)
    if (savedDataString) {
      const parsedData = JSON.parse(savedDataString)
      setData(
        parsedData.filter(
          ({ p }: { p: number | number[] }) => typeof p !== 'number',
        ),
      )
    }
  }, [])

  return (
    <main className="flex">
      <Sidebar
        entities={data}
        currentEntity={currentEntity}
        changeEntity={setCurrentEntity}
      />
      <Transition key={currentEntity}>
        <MainContents data={data} entity={currentEntity} />
      </Transition>
    </main>
  )
}
