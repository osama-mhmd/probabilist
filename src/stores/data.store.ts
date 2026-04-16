import type { StatisticalDistribution } from '@/types'
import { Store } from '@tanstack/store'

interface ProbabilityState {
  rawBase64: string | null
  fileName: string | null
  tasks: StatisticalDistribution | null
  isProcessing: boolean
}

export const probabilityStore = new Store<ProbabilityState>({
  rawBase64: null,
  fileName: null,
  tasks: null,
  isProcessing: false,
})

export const setRawData = (base64: string, name: string) => {
  probabilityStore.setState((state) => ({
    ...state,
    rawBase64: base64,
    fileName: name,
    isProcessing: true,
  }))
}

export const setTransformedTasks = (tasks: StatisticalDistribution) => {
  probabilityStore.setState((state) => ({
    ...state,
    tasks: tasks,
    isProcessing: false,
  }))
}

export const resetStore = () => {
  probabilityStore.setState(() => ({
    rawBase64: null,
    fileName: null,
    tasks: null,
    isProcessing: false,
  }))
}
