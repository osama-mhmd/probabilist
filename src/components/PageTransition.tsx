import { keyframes } from '@emotion/react'
import { useRouterState } from '@tanstack/react-router'
import { Reveal } from 'react-awesome-reveal'

const animation = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <Reveal keyframes={animation} duration={500} key={pathname}>
      {children}
    </Reveal>
  )
}
