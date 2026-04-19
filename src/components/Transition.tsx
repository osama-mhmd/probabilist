import { cn } from '@/lib/utils'
import { keyframes } from '@emotion/react'
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

export function Transition({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <Reveal
      keyframes={animation}
      className={cn('w-full flex-1', className)}
      duration={500}
    >
      {children}
    </Reveal>
  )
}
