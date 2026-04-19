'use strict'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface HeatmapProps {
  maxN?: number
  pRange?: number[]
}

export function RedundancyHeatmap({
  maxN = 8,
  pRange = [0.9, 0.95, 0.98, 0.99, 0.999],
}: HeatmapProps) {
  const nValues = Array.from({ length: maxN }, (_, i) => i + 1)

  const getReliability = (p: number, n: number) => 1 - Math.pow(1 - p, n)

  const getColor = (val: number) => {
    if (val >= 0.99999) return 'bg-emerald-500 text-emerald-950'
    if (val >= 0.999) return 'bg-emerald-400/80'
    if (val >= 0.99) return 'bg-emerald-300/60'
    if (val >= 0.95) return 'bg-amber-200/50'
    return 'bg-slate-100 dark:bg-slate-800'
  }

  return (
    <div className="px-0">
      <div className="grid gap-1">
        <div className="flex mb-2">
          <div className="w-16" />
          {nValues.map((n) => (
            <div key={n} className="flex-1 text-center text-[10px] font-bold">
              n={n}
            </div>
          ))}
        </div>
        {pRange.map((p) => (
          <div key={p} className="flex gap-1">
            <div className="w-16 text-[10px] flex items-center font-medium">
              p={p}
            </div>
            {nValues.map((n) => {
              const reliability = getReliability(p, n)
              const isFiveNines = reliability >= 0.99999

              return (
                <TooltipProvider key={`${p}-${n}`}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          'flex-1 h-10 rounded-sm flex items-center justify-center text-[9px] transition-colors cursor-default',
                          getColor(reliability),
                        )}
                      >
                        {isFiveNines ? '5/9s' : reliability.toFixed(4)}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        n: {n}, p: {p}
                      </p>
                      <p className="font-bold">
                        Result: {(reliability * 100).toFixed(5)}%
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
