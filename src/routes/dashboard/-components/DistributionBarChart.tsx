'use strict'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

interface DistributionBarChartProps {
  data: {
    n: number
    p: number[]
  }
}

const chartConfig = {
  probability: {
    label: 'Probability',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

export function DistributionBarChart({ data }: DistributionBarChartProps) {
  const chartData = data.p.map((val, index) => ({
    component: `p${index + 1}`,
    probability: val,
  }))

  return (
    <ChartContainer config={chartConfig} className="min-h-44 w-full">
      <BarChart
        accessibilityLayer
        data={chartData}
        margin={{
          top: 20,
          right: 20,
          left: 20,
          bottom: 20,
        }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="component"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          domain={[0, 1]}
          tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="probability" fill="var(--color-probability)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
