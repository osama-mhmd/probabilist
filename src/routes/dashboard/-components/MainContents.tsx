'use strict'

import { type ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DistributionBarChart } from './DistributionBarChart'
import { CDFAreaChart } from './CDFAreaChart'
import { RedundancyHeatmap } from './RedundancyHeatmap'
import { TargetFinderCard } from './TargetFinderCard'

interface StatCardProps {
  title: string
  description: string
  children: ReactNode
}

const StatCard = ({ title, description, children }: StatCardProps) => (
  <Card className="space-y-2">
    <CardHeader className="gap-1">
      <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {description}
      </p>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
)

export function MainContents({
  entity: entityId,
  data,
}: {
  entity: string | null
  data: any[]
}) {
  const entity = data.find((e) => e.id === entityId)

  if (!entity) {
    return (
      <div className="flex items-center flex-col text-muted-foreground justify-center gap-2 h-96 flex-1">
        <h2 className="text-2xl tracking-wide">Entity not found</h2>
        <p className="tracking-wider">
          Please select an entity from the sidebar
        </p>
      </div>
    )
  }

  console.log(entity.p)

  const chartData = { n: entity.n, p: entity.p as number[] }

  return (
    <div className="flex-1 flex-col flex gap-8 p-12">
      <header>
        <h2 className="text-3xl font-black">{entity.name}</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Sector: Engineering Redundancy Analysis
        </p>
      </header>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <StatCard
          title="Probability Mass"
          description="Discrete distribution of individual component success rates across the system cluster."
        >
          <DistributionBarChart data={chartData} />
        </StatCard>

        <StatCard
          title="Cumulative Reliability"
          description="Analysis of system survival probability as components are added to the redundancy pool."
        >
          <CDFAreaChart data={chartData} />
        </StatCard>

        <StatCard
          title="Five-Nines Matrix"
          description="Heatmap identifying the critical intersection between redundancy (n) and reliability (p)."
        >
          <RedundancyHeatmap maxN={entity.n} pRange={chartData.p} />
        </StatCard>

        <StatCard
          title="Optimization Target"
          description="Dynamic calculator to determine the exact hardware requirements for target uptime."
        >
          <TargetFinderCard initialP={chartData.p[0]} />
        </StatCard>
      </div>
    </div>
  )
}
