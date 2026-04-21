import { createFileRoute } from '@tanstack/react-router'
import { MainContents, Sidebar } from './-components'
import { ENGINEERING_TEST_DATA, MEDICINE_TEST_DATA } from '@/lib/constants'
import { useState, useEffect } from 'react'
import { Transition } from '@/components/Transition'

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
})

export const data = [...ENGINEERING_TEST_DATA, ...MEDICINE_TEST_DATA]

function RouteComponent() {
  const [currentEntity, setCurrentEntity] = useState<string | null>(null)

  const [dashboardData, setDashboardData] = useState<any[]>(data)

  useEffect(() => {
    const storageKey = 'dashboard_statistics'
    const savedDataString = localStorage.getItem(storageKey)
    if (savedDataString) {
      const parsedData = JSON.parse(savedDataString)
      setDashboardData([...parsedData, ...data])
    }
  }, [])

  return (
    <main className="flex">
      <Sidebar
        entities={dashboardData}
        currentEntity={currentEntity}
        changeEntity={setCurrentEntity}
      />
      <Transition key={currentEntity}>
        <MainContents entity={currentEntity} />
      </Transition>
    </main>
  )
}
