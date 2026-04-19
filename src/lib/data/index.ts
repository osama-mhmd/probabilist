import type { StatisticalDistribution } from '@/types'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'

interface RawFileData {
  sector?: string
  n?: string | number
  k?: string | number
  p?: string | number
}

export function transformCSV(base64: string): StatisticalDistribution {
  const base64Data = base64.includes(',') ? base64.split(',')[1] : base64
  const decodedText = atob(base64Data)

  const parsed = Papa.parse<RawFileData>(decodedText, { header: true, skipEmptyLines: true })
  const row = parsed.data[0]

  return {
    sector: String(row?.sector).toLowerCase() === 'medicine' ? 'medicine' : 'engineering',
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

  const data = XLSX.utils.sheet_to_json<RawFileData>(worksheet)[0]

  return {
    sector: String(data?.sector).toLowerCase() === 'medicine' ? 'medicine' : 'engineering',
    n: Number(data?.n) || 0,
    p: Number(data?.p) || 0,
    k: Number(data?.k) || 0,
  }
}
