import { useState, useRef, useCallback, useEffect } from 'react'
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { transformCSV, transformExcel } from '@/lib/data'

type InputMethod = 'manual' | 'csv' | 'excel' | null

interface ManualFormState {
  name: string
  n: string
  p: string[]
  k: string
}

export const Route = createFileRoute('/preview/')({ component: RouteComponent })

function RouteComponent() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/preview/' })
  const sector = (search as any).sector as 'engineering' | 'medicine'

  const [activeMethod, setActiveMethod] = useState<InputMethod>(null)
  const [manualForm, setManualForm] = useState<ManualFormState>({
    name: '',
    n: '',
    p: [],
    k: '',
  })

  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sync p array length with n
  useEffect(() => {
    const nVal = parseInt(manualForm.n) || 0
    if (nVal >= 0) {
      setManualForm((prev) => {
        const newP = [...prev.p]
        if (newP.length < nVal) {
          return {
            ...prev,
            p: [...newP, ...Array(nVal - newP.length).fill('')],
          }
        } else if (newP.length > nVal) {
          return { ...prev, p: newP.slice(0, nVal) }
        }
        return prev
      })
    }
  }, [manualForm.n])

  const readFileAsBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve((reader.result as string).split(',')[1])
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  const handleFileProcess = useCallback(
    async (file: File) => {
      setError(null)
      setFileName(file.name)
      const isCSV = file.name.endsWith('.csv')
      const isXLSX = file.name.endsWith('.xlsx') || file.name.endsWith('.xls')

      if (!isCSV && !isXLSX) {
        setError('Unsupported format. Upload a .csv or .xlsx file.')
        return
      }

      setActiveMethod(isCSV ? 'csv' : 'excel')
      setIsLoading(true)

      try {
        const base64 = await readFileAsBase64(file)
        const rawTasks = isCSV
          ? await transformCSV(base64)
          : await transformExcel(base64)

        // Ensure tasks have ID and Name if missing from transformation
        const tasksWithMeta = (
          Array.isArray(rawTasks) ? rawTasks : [rawTasks]
        ).map((t) => ({
          ...t,
          id: t.id || crypto.randomUUID(),
          name:
            t.name || `Task_${file.name}_${Math.floor(Math.random() * 1000)}`,
          sector,
        }))

        const storageKey = 'dashboard_statistics'
        const existingDataString = localStorage.getItem(storageKey)
        let existingArray = existingDataString
          ? JSON.parse(existingDataString)
          : []
        existingArray = existingArray.concat(tasksWithMeta)

        localStorage.setItem(storageKey, JSON.stringify(existingArray))
        navigate({ to: '/dashboard' })
      } catch (e) {
        setError('Transformation failed. Verify file schema.')
        setIsLoading(false)
      }
    },
    [navigate, sector],
  )

  const handleManualSubmit = useCallback(async () => {
    const n = parseInt(manualForm.n)
    const k = parseInt(manualForm.k)
    const pValues = manualForm.p.map((v) => parseFloat(v))

    if (!manualForm.name || !n || !k || pValues.length !== n) {
      setError('All fields (including Name) are required.')
      return
    }

    if (pValues.some(isNaN)) {
      setError('All p values must be valid decimals.')
      return
    }

    setIsLoading(true)
    setError(null)

    const task = {
      id: crypto.randomUUID(),
      name: manualForm.name,
      sector,
      n,
      p: pValues,
      k,
    }

    const storageKey = 'dashboard_statistics'
    const existingDataString = localStorage.getItem(storageKey)
    const existingArray = existingDataString
      ? JSON.parse(existingDataString)
      : []

    existingArray.push(task)
    localStorage.setItem(storageKey, JSON.stringify(existingArray))

    navigate({ to: '/dashboard' })
  }, [manualForm, sector, navigate])

  const handlePChange = (index: number, value: string) => {
    setManualForm((prev) => {
      const newP = [...prev.p]
      newP[index] = value
      return { ...prev, p: newP }
    })
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFileProcess(file)
    },
    [handleFileProcess],
  )

  const sectorLabel = sector === 'engineering' ? 'Engineering' : 'Medicine'
  const sectorGlyph = sector === 'engineering' ? '◈' : '◎'

  return (
    <div className="min-h-screen bg-[#080808] text-[#e8e8e0] font-mono selection:bg-[#e8e8e0] selection:text-[#080808]">
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />

      <div className="relative z-10 border-b border-[#1e1e1e]">
        <div className="mx-auto max-w-5xl px-8 py-5 flex items-center justify-between">
          <span className="text-[10px] tracking-[0.3em] text-[#3a3a3a] uppercase">
            Probabilist / Preview
          </span>
          <div className="flex items-center gap-3">
            <span className="text-[10px] tracking-[0.25em] text-[#c8c8b8] uppercase border border-[#2a2a2a] px-2 py-0.5">
              {sectorGlyph} {sectorLabel}
            </span>
          </div>
        </div>
      </div>

      <main className="relative z-10 mx-auto max-w-5xl px-8 pt-20 pb-24">
        <div className="mb-16">
          <p className="text-[10px] tracking-[0.4em] text-[#3a3a3a] uppercase mb-4">
            01 — Input Configuration
          </p>
          <h1
            className="text-5xl leading-[1.05] tracking-[-0.03em] text-[#e8e8e0] mb-4"
            style={{ fontFamily: '"Courier New", Courier, monospace' }}
          >
            Define your
            <br />
            <span className="text-[#5a5a4a]">statistical task.</span>
          </h1>
        </div>

        <div className="grid grid-cols-3 gap-px bg-[#1a1a1a] border border-[#1a1a1a] mb-12">
          {(['manual', 'csv', 'excel'] as InputMethod[]).map((method, i) => {
            const labels: Record<
              string,
              { title: string; sub: string; glyph: string }
            > = {
              manual: {
                title: 'Manual',
                sub: 'Direct parameter entry',
                glyph: '⌨',
              },
              csv: { title: 'CSV', sub: 'Comma-separated values', glyph: '⊞' },
              excel: {
                title: 'Excel',
                sub: '.xlsx / .xls workbook',
                glyph: '⊟',
              },
            }
            const item = labels[method!]
            const isActive = activeMethod === method

            return (
              <button
                key={method}
                onClick={() => {
                  setActiveMethod(method)
                  setError(null)
                  setFileName(null)
                  if (method === 'csv' || method === 'excel')
                    fileInputRef.current?.click()
                }}
                className={`group relative p-8 text-left transition-colors duration-150 outline-none ${isActive ? 'bg-[#e8e8e0] text-[#080808]' : 'bg-[#0d0d0d] text-[#4a4a3a] hover:bg-[#111111] hover:text-[#c8c8b8]'}`}
              >
                <span className="block text-2xl mb-5 leading-none">
                  {item.glyph}
                </span>
                <span className="block text-[11px] tracking-[0.3em] uppercase mb-1.5">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="block text-base font-normal">
                  {item.title}
                </span>
                <span
                  className={`block text-[10px] mt-1 ${isActive ? 'text-[#4a4a3a]' : 'text-[#2e2e2e]'}`}
                >
                  {item.sub}
                </span>
              </button>
            )
          })}
        </div>

        {activeMethod === 'manual' && (
          <div className="border border-[#1a1a1a] animate-in fade-in duration-200">
            <div className="bg-[#0d0d0d] p-8 border-b border-[#1a1a1a]">
              <label className="block text-[10px] tracking-[0.3em] text-[#3a3a3a] uppercase mb-3">
                Task Name
              </label>
              <input
                type="text"
                placeholder="Unique identifier for this task"
                value={manualForm.name}
                onChange={(e) =>
                  setManualForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full bg-transparent border-b border-[#2a2a2a] pb-2 text-[#e8e8e0] outline-none focus:border-[#6a6a5a]"
              />
            </div>
            <div className="grid grid-cols-2 gap-px bg-[#1a1a1a]">
              <div className="bg-[#0d0d0d] p-8">
                <label className="block text-[10px] tracking-[0.3em] text-[#3a3a3a] uppercase mb-3">
                  n (Sample Size)
                </label>
                <input
                  type="number"
                  value={manualForm.n}
                  onChange={(e) =>
                    setManualForm((prev) => ({ ...prev, n: e.target.value }))
                  }
                  className="w-full bg-transparent border-b border-[#2a2a2a] pb-2 text-[#e8e8e0] outline-none"
                />
              </div>
              <div className="bg-[#0d0d0d] p-8">
                <label className="block text-[10px] tracking-[0.3em] text-[#3a3a3a] uppercase mb-3">
                  k (Successes)
                </label>
                <input
                  type="text"
                  value={manualForm.k}
                  onChange={(e) =>
                    setManualForm((prev) => ({ ...prev, k: e.target.value }))
                  }
                  className="w-full bg-transparent border-b border-[#2a2a2a] pb-2 text-[#e8e8e0] outline-none"
                />
              </div>
            </div>
            <div className="bg-[#080808] border-t border-[#1a1a1a] p-8">
              <label className="block text-[10px] tracking-[0.3em] text-[#3a3a3a] uppercase mb-6">
                Probability Array p[n]
              </label>
              <div className="grid grid-cols-5 gap-4">
                {manualForm.p.map((val, idx) => (
                  <div key={idx} className="flex flex-col gap-2">
                    <span className="text-[9px] text-[#3a3a3a]">p[{idx}]</span>
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => handlePChange(idx, e.target.value)}
                      className="bg-transparent border-b border-[#2a2a2a] text-sm py-1 outline-none focus:border-[#6a6a5a]"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="px-8 py-6 flex items-center justify-end border-t border-[#1a1a1a]">
              <button
                onClick={handleManualSubmit}
                disabled={isLoading}
                className="px-6 py-2.5 bg-[#e8e8e0] text-[#080808] text-[10px] tracking-[0.3em] uppercase hover:bg-[#c8c8b8] disabled:opacity-30"
              >
                {isLoading ? 'Processing...' : 'Compute →'}
              </button>
            </div>
          </div>
        )}

        {(activeMethod === 'csv' || activeMethod === 'excel') && (
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border border-dashed cursor-pointer transition-colors duration-150 py-20 text-center ${isDragging ? 'border-[#6a6a5a] bg-[#0f0f0f]' : 'border-[#2a2a2a] bg-[#0d0d0d]'}`}
          >
            <p className="text-sm text-[#4a4a3a] tracking-[-0.01em]">
              {fileName || `Drop ${activeMethod} here or click to browse`}
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".csv,.xlsx,.xls"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFileProcess(file)
          }}
        />

        {error && (
          <div className="mt-4 border border-[#4a2a2a] bg-[#0f0808] px-5 py-3 text-[11px] text-[#8a4a4a]">
            {error}
          </div>
        )}
      </main>
    </div>
  )
}
