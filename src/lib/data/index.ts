import type { StatisticalDistribution } from '@/types'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'

export function transformCSV(base64: string): StatisticalDistribution {
  const base64Data = base64.includes(',') ? base64.split(',')[1] : base64
  const decodedText = atob(base64Data)

  const parsed = Papa.parse(decodedText, { header: true, skipEmptyLines: true })
  const row = parsed.data[0] as any

  return {
    sector: row?.sector === 'medicine' ? 'medicine' : 'engineering',
    n: Number(row?.n) || 0,
    p: Number(row?.p) || 0,
    k: Number(row?.k) || 0,
  }
}

export function transformExcel(base64: string): StatisticalDistribution {
  const base64Data = base64.includes(',') ? base64.split(',')[1] : base64

  const workbook = XLSX.read(base64Data, { type: 'base64' })
  const firstSheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[firstSheetName]

  const data = XLSX.utils.sheet_to_json(worksheet)[0] as any

  return {
    sector: data?.sector === 'medicine' ? 'medicine' : 'engineering',
    n: Number(data?.n) || 0,
    p: Number(data?.p) || 0,
    k: Number(data?.k) || 0,
  }
}
