import type { Entity } from '@/types'

export const ENGINEERING_TEST_DATA: Entity[] = [
  {
    id: 'eng-1',
    name: 'High-Availability Cluster',
    sector: 'engineering',
    n: 4,
    p: [0.999, 0.999, 0.99, 0.95],
    k: 3,
    variance: 0.0573,
  },
  {
    id: 'eng-2',
    name: 'Edge Gateway',
    sector: 'engineering',
    n: 3,
    p: [0.85, 0.85, 0.9],
    k: 1,
    variance: 0.345,
  },
  {
    id: 'eng-3',
    name: 'Safety Sensor Array',
    sector: 'engineering',
    n: 3,
    p: [0.9999, 0.9999, 0.9999],
    k: 2,
    variance: 0.0003,
  },
]

export const MEDICINE_TEST_DATA: Entity[] = [
  {
    id: 'med-1',
    name: 'Phase I Safety Trial',
    sector: 'medicine',
    n: 20,
    p: 0.95,
    k: 19,
    variance: 0.95,
  },
  {
    id: 'med-2',
    name: 'Vaccine Efficacy Study',
    sector: 'medicine',
    n: 500,
    p: 0.75,
    k: 400,
    variance: 93.75,
  },
  {
    id: 'med-3',
    name: 'Rare Disease Treatment',
    sector: 'medicine',
    n: 12,
    p: 0.4,
    k: 6,
    variance: 2.88,
  },
]
