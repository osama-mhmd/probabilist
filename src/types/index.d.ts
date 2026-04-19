export interface StatisticalDistribution {
  sector: 'engineering' | 'medicine'

  n: number
  p: number | number[]
  k: number
}

export interface Entity extends StatisticalDistribution {
  id: string
  name: string
  variance: number
}
