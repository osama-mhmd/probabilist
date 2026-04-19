'use strict'

import { cn } from '@/lib/utils'
import type { Entity } from '@/types'

interface SidebarParams {
  entities: Entity[]
  currentEntity: string | null
  changeEntity: (entity: string) => void
}

export function Sidebar({
  entities,
  currentEntity,
  changeEntity,
}: SidebarParams) {
  const getEntitiesBySector = (sector: 'engineering' | 'medicine') =>
    entities.filter((e) => e.sector === sector)

  const engineeringEntities = getEntitiesBySector('engineering')
  const medicineEntities = getEntitiesBySector('medicine')

  const ListItem = ({ entity }: { entity: Entity }) => (
    <li
      className={cn(
        'py-3 px-4 cursor-pointer transition-colors',
        currentEntity === entity.id ? 'bg-accent' : 'hover:bg-accent/50',
      )}
      onClick={() => changeEntity(entity.id)}
      key={entity.id}
    >
      {entity.name}
    </li>
  )

  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-4 mb-2">
      {children}
    </p>
  )

  return (
    <aside className="sticky top-0 h-screen gap-4 bg-card border-r max-w-sm w-full p-8 pt-12 flex flex-col">
      <h1 className="font-semibold font-mono uppercase text-2xl">
        Probabilist
      </h1>
      <hr />

      <div className="flex flex-col gap-6 overflow-y-auto">
        {engineeringEntities.length > 0 && (
          <div>
            <SectionLabel>Engineering</SectionLabel>
            <ul className="flex flex-col gap-1">
              {engineeringEntities.map((entity) => (
                <ListItem key={entity.id} entity={entity} />
              ))}
            </ul>
          </div>
        )}

        {medicineEntities.length > 0 && (
          <div>
            <SectionLabel>Medicine</SectionLabel>
            <ul className="flex flex-col gap-1">
              {medicineEntities.map((entity) => (
                <ListItem key={entity.id} entity={entity} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </aside>
  )
}
