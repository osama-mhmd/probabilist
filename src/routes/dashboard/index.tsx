import { createFileRoute } from '@tanstack/react-router'
import { MainContents, Sidebar } from './-components'
import { ENGINEERING_TEST_DATA, MEDICINE_TEST_DATA } from '@/lib/constants'
import { useState } from 'react'
import { Transition } from '@/components/Transition'

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
})

export const data = [...ENGINEERING_TEST_DATA, ...MEDICINE_TEST_DATA]

function RouteComponent() {
  const [currentEntity, setCurrentEntity] = useState<string | null>(null)

  return (
    <main className="flex">
      <Sidebar
        entities={data}
        currentEntity={currentEntity}
        changeEntity={setCurrentEntity}
      />
      <Transition key={currentEntity}>
        <MainContents entity={currentEntity} />
      </Transition>
    </main>
  )
}
