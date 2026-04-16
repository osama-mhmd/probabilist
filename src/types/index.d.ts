export interface StatisticalDistribution {
  sector: 'engineering' | 'medicine'

  n: number
  p: number | number[]
  k: number
}
