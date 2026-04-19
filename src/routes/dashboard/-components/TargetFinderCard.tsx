'use strict'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Target, Zap } from 'lucide-react'

interface TargetFinderProps {
  initialP?: number
}

export function TargetFinderCard({ initialP = 0.95 }: TargetFinderProps) {
  const [target, setTarget] = useState<number>(0.9999)

  const calculateRequiredN = (p: number, target: number) => {
    if (p >= target) return 1
    return Math.ceil(Math.log(1 - target) / Math.log(1 - p))
  }

  const requiredN = calculateRequiredN(initialP, target)

  return (
    <Card className="border-none bg-slate-50 dark:bg-slate-900/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-tighter">
            <Target className="w-4 h-4" />
            Target Finder
          </CardTitle>
          <Badge variant="outline" className="font-mono">
            p = {initialP}
          </Badge>
        </div>
        <CardDescription>
          Adjust the target reliability to determine required redundancy.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <div className="flex justify-between text-xs font-medium">
            <span>Target Confidence</span>
            <span className="font-mono text-primary">
              {(target * 100).toFixed(3)}%
            </span>
          </div>
          <Slider
            value={[target]}
            min={0.9}
            max={0.99999}
            step={0.0001}
            onValueChange={([val]: [number]) => setTarget(val)}
            className="py-4"
          />
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">
                Required Redundancy
              </p>
              <h3 className="text-4xl font-black tracking-tighter">
                n = {requiredN}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary fill-primary" />
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            To reach{' '}
            <span className="font-bold text-foreground">
              {(target * 100).toFixed(3)}%
            </span>{' '}
            uptime with individual component reliability of {initialP}, you must
            deploy at least{' '}
            <span className="font-bold text-foreground">{requiredN}</span>{' '}
            units.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
