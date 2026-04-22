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
  const ListItem = ({ entity }: { entity: Entity }) => (
    <li
      className={cn(
        'py-3 px-4 cursor-pointer transition-colors',
        currentEntity === entity.id ? 'bg-accent' : 'hover:bg-accent/50',
      )}
      onClick={() => changeEntity(entity.id)}
      key={entity.id}
    >
      {entity.name || <span className="text-muted-foreground">(unknown)</span>}
    </li>
  )

  return (
    <aside className="sticky top-0 h-screen gap-4 bg-card border-r max-w-sm w-full p-8 pt-12 flex flex-col">
      <h1 className="font-semibold font-mono uppercase text-2xl">
        Probabilist
      </h1>
      <hr />

      <div className="flex flex-col gap-6 overflow-y-auto">
        {entities.length > 0 && (
          <div>
            <ul className="flex flex-col gap-1">
              {entities.map((entity) => (
                <ListItem key={`${entity.id}${entity.name}`} entity={entity} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </aside>
  )
}
