import type { StatisticalDistribution } from '@/types'

export function transformCSV(base64: string): StatisticalDistribution {
  // TODO: Implement your CSV parsing logic here
  console.log(base64)

  return {
    k: 0,
    n: 0,
    p: [],
    sector: 'engineering',
  }
}

export function transformExcel(base64: string): StatisticalDistribution {
  // TODO: Implement your Excel parsing logic here
  console.log(base64)

  return {
    k: 0,
    n: 0,
    p: [],
    sector: 'engineering',
  }
}
