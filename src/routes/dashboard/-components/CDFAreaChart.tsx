'use strict'

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

interface CDFChartProps {
  data: {
    n: number
    p: number[] // Individual probabilities
  }
}

const chartConfig = {
  cumulative: {
    label: 'Cumulative Prob.',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

export function CDFAreaChart({ data }: CDFChartProps) {
  // Calculate cumulative values
  let runningTotal = 0
  const chartData = data.p.map((val, index) => {
    runningTotal += val
    return {
      step: `k=${index}`,
      cumulative: Number(runningTotal.toFixed(4)),
    }
  })

  return (
    <ChartContainer config={chartConfig} className="min-h-48 w-full">
      <AreaChart
        data={chartData}
        margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
      >
        <defs>
          <linearGradient id="fillCumulative" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-cumulative)"
              stopOpacity={0.3}
            />
            <stop
              offset="95%"
              stopColor="var(--color-cumulative)"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="step" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} domain={[0, 1]} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="stepAfter"
          dataKey="cumulative"
          stroke="var(--color-cumulative)"
          fill="url(#fillCumulative)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  )
}
