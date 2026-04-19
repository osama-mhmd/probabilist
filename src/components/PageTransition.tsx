import { useRouterState } from '@tanstack/react-router'
import { Transition } from './Transition'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return <Transition key={pathname}>{children}</Transition>
}
