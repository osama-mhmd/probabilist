import type { StatisticalDistribution } from '@/types'

const getProbability = (p: number | number[] = 0): number => {
  if (Array.isArray(p)) {
    return Number(p[0])
  }
  return Number(p)
}

const factorial = (n: number): number => {
  if (n > 170) console.warn('Very large factorial number, may cause overflow')

  if (n <= 1) return 1
  let result = 1
  for (let i = 2; i <= n; i++) {
    result *= i
  }
  return result
}

const combination = (n: number, k: number): number => {
  return factorial(n) / (factorial(k) * factorial(n - k))
}

function getBinomialDistribution(data: StatisticalDistribution): number {
  const { n, p, k } = data
  const probability = getProbability(p)
  const prop =
    combination(n, k) *
    Math.pow(probability, k) *
    Math.pow(1 - probability, n - k)
  return Number(prop.toFixed(4))
}

function getCumulativeDistribution(data: StatisticalDistribution): number {
  const { n, p, k } = data
  const probability = getProbability(p)
  let cumulative = 0
  for (let i = 0; i <= k; i++) {
    cumulative +=
      combination(n, i) *
      Math.pow(probability, i) *
      Math.pow(1 - probability, n - i)
  }
  return Number(cumulative.toFixed(4))
}

function getRequiredN(p: number | number[], target: number): number {
  const probability = getProbability(p)
  if (probability >= 1 || target >= 1) return 1
  const n = Math.log(1 - target) / Math.log(1 - probability)
  return Math.ceil(n)
}

function getExpectedValue(n: number, p: number | number[]): number {
  const probability = getProbability(p)
  return Number((probability * n).toFixed(4))
}

function getVariance(n: number, p: number | number[]): number {
  const probability = getProbability(p)
  return Number((probability * n * (1 - probability)).toFixed(4))
}

function getStandardDeviation(n: number, p: number | number[]): number {
  const probability = getProbability(p)
  return Number(Math.sqrt(probability * n * (1 - probability)).toFixed(4))
}

export {
  getBinomialDistribution,
  getCumulativeDistribution,
  getRequiredN,
  getExpectedValue,
  getVariance,
  getStandardDeviation,
}
