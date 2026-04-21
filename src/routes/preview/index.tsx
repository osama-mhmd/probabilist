import { useState, useRef, useCallback } from 'react'
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { transformCSV, transformExcel } from '@/lib/data'
import { setTransformedTasks } from '@/stores/data.store'

type InputMethod = 'manual' | 'csv' | 'excel' | null

interface ManualFormState {
  n: string
  p: string
  k: string
}

export const Route = createFileRoute('/preview/')({ component: RouteComponent })

function RouteComponent() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/preview/' })
  const sector = (search as any).sector as 'engineering' | 'medicine'

  const [activeMethod, setActiveMethod] = useState<InputMethod>(null)
  const [manualForm, setManualForm] = useState<ManualFormState>({
    n: '',
    p: '',
    k: '',
  })
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
        const tasks = isCSV
          ? await transformCSV(base64)
          : await transformExcel(base64)
        setTransformedTasks(tasks)
        navigate({ to: '/dashboard' })
      } catch (e) {
        setError('Transformation failed. Verify file schema.')
        setIsLoading(false)
      }
    },
    [navigate],
  )

  const handleManualSubmit = useCallback(async () => {
    const n = parseInt(manualForm.n)
    const k = parseInt(manualForm.k)
    const pRaw = manualForm.p.trim()

    if (!n || !k || !pRaw) {
      setError('All fields required.')
      return
    }

    const p = pRaw.includes(',')
      ? pRaw.split(',').map((v) => parseFloat(v.trim()))
      : parseFloat(pRaw)

    if (Array.isArray(p) ? p.some(isNaN) : isNaN(p)) {
      setError('p must be a decimal or comma-separated decimals.')
      return
    }

    setIsLoading(true)
    setError(null)

    const task = { sector, n, p, k }
    setTransformedTasks(task)
    // TODO SHABBOUR (SET LOCALSTORAGE HERE)
    navigate({ to: '/dashboard' })
  }, [manualForm, sector, navigate])

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
      {/* Grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />

      {/* Horizontal rule top */}
      <div className="relative z-10 border-b border-[#1e1e1e]">
        <div className="mx-auto max-w-5xl px-8 py-5 flex items-center justify-between">
          <span className="text-[10px] tracking-[0.3em] text-[#3a3a3a] uppercase">
            Probabilist / Preview
          </span>
          <div className="flex items-center gap-3">
            <span className="text-[10px] tracking-[0.25em] text-[#3a3a3a] uppercase">
              Sector
            </span>
            <span className="text-[10px] tracking-[0.25em] text-[#c8c8b8] uppercase border border-[#2a2a2a] px-2 py-0.5">
              {sectorGlyph} {sectorLabel}
            </span>
          </div>
        </div>
      </div>

      <main className="relative z-10 mx-auto max-w-5xl px-8 pt-20 pb-24">
        {/* Heading block */}
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
          <p className="text-[12px] text-[#3a3a3a] tracking-[0.05em] max-w-sm leading-relaxed">
            Supply distribution parameters via manual entry, CSV, or Excel. Data
            normalizes into{' '}
            <code className="text-[#6a6a5a]">StatisticalDistribution</code>.
          </p>
        </div>

        {/* Method selector */}
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
                  if (method === 'csv' || method === 'excel') {
                    fileInputRef.current?.click()
                  }
                }}
                className={[
                  'group relative p-8 text-left transition-colors duration-150 outline-none',
                  isActive
                    ? 'bg-[#e8e8e0] text-[#080808]'
                    : 'bg-[#0d0d0d] text-[#4a4a3a] hover:bg-[#111111] hover:text-[#c8c8b8]',
                ].join(' ')}
              >
                <span className="block text-2xl mb-5 leading-none">
                  {item.glyph}
                </span>
                <span
                  className={[
                    'block text-[11px] tracking-[0.3em] uppercase mb-1.5',
                    isActive
                      ? 'text-[#080808]'
                      : 'text-[#6a6a5a] group-hover:text-[#a8a898]',
                  ].join(' ')}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="block text-base font-normal tracking-[-0.01em]">
                  {item.title}
                </span>
                <span
                  className={[
                    'block text-[10px] tracking-[0.05em] mt-1',
                    isActive ? 'text-[#4a4a3a]' : 'text-[#2e2e2e]',
                  ].join(' ')}
                >
                  {item.sub}
                </span>
              </button>
            )
          })}
        </div>

        {/* Hidden file input */}
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

        {/* Manual form */}
        {activeMethod === 'manual' && (
          <div className="border border-[#1a1a1a] animate-in fade-in duration-200">
            <div className="border-b border-[#1a1a1a] px-8 py-4 flex items-center gap-3">
              <span className="text-[10px] tracking-[0.3em] text-[#3a3a3a] uppercase">
                Parameters
              </span>
              <span className="text-[10px] text-[#2a2a2a]">
                — StatisticalDistribution input
              </span>
            </div>

            <div className="grid grid-cols-3 gap-px bg-[#1a1a1a]">
              {[
                {
                  key: 'n',
                  label: 'n',
                  desc: 'Sample size / component count',
                  placeholder: '100',
                },
                {
                  key: 'p',
                  label: 'p',
                  desc: 'Success probability (or comma-list)',
                  placeholder: '0.95',
                },
                {
                  key: 'k',
                  label: 'k',
                  desc: 'Required successes',
                  placeholder: '90',
                },
              ].map(({ key, label, desc, placeholder }) => (
                <div key={key} className="bg-[#0d0d0d] p-8">
                  <label className="block text-[10px] tracking-[0.3em] text-[#3a3a3a] uppercase mb-3">
                    {label}
                  </label>
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={manualForm[key as keyof ManualFormState]}
                    onChange={(e) =>
                      setManualForm((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    className="w-full bg-transparent border-b border-[#2a2a2a] pb-2 text-[#e8e8e0] text-base tracking-[-0.01em] placeholder-[#2a2a2a] outline-none focus:border-[#6a6a5a] transition-colors"
                  />
                  <p className="mt-3 text-[10px] text-[#2e2e2e] tracking-[0.03em]">
                    {desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="px-8 py-6 flex items-center justify-between border-t border-[#1a1a1a]">
              <span className="text-[10px] text-[#2a2a2a] tracking-[0.05em]">
                Sector bound:{' '}
                <span className="text-[#4a4a3a]">{sectorLabel}</span>
              </span>
              <button
                onClick={handleManualSubmit}
                disabled={isLoading}
                className="px-6 py-2.5 bg-[#e8e8e0] text-[#080808] text-[10px] tracking-[0.3em] uppercase hover:bg-[#c8c8b8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Processing...' : 'Compute →'}
              </button>
            </div>
          </div>
        )}

        {/* File drop zone */}
        {(activeMethod === 'csv' || activeMethod === 'excel') && (
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={[
              'border border-dashed cursor-pointer transition-colors duration-150 animate-in fade-in duration-200',
              isDragging
                ? 'border-[#6a6a5a] bg-[#0f0f0f]'
                : 'border-[#2a2a2a] bg-[#0d0d0d]',
              'hover:border-[#3a3a3a]',
            ].join(' ')}
          >
            <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border border-[#3a3a3a] border-t-[#e8e8e0] rounded-full animate-spin mb-6" />
                  <p className="text-[10px] tracking-[0.3em] text-[#4a4a4a] uppercase">
                    Transforming…
                  </p>
                </>
              ) : fileName ? (
                <>
                  <span className="text-2xl mb-5">◈</span>
                  <p className="text-sm text-[#c8c8b8] tracking-[-0.01em] mb-2">
                    {fileName}
                  </p>
                  <p className="text-[10px] text-[#3a3a3a] tracking-[0.05em]">
                    Click to replace
                  </p>
                </>
              ) : (
                <>
                  <span className="text-3xl mb-6 text-[#2a2a2a]">
                    {activeMethod === 'csv' ? '⊞' : '⊟'}
                  </span>
                  <p className="text-sm text-[#4a4a3a] tracking-[-0.01em] mb-2">
                    Drop {activeMethod === 'csv' ? '.csv' : '.xlsx'} here
                  </p>
                  <p className="text-[10px] text-[#2a2a2a] tracking-[0.05em]">
                    or click to browse
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Idle state hint */}
        {!activeMethod && (
          <div className="border border-dashed border-[#161616] py-16 flex items-center justify-center">
            <p className="text-[10px] tracking-[0.3em] text-[#2a2a2a] uppercase">
              Select an input method above
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 flex items-center gap-3 px-5 py-3 border border-[#4a2a2a] bg-[#0f0808]">
            <span className="text-[#8a3a3a] text-xs">✕</span>
            <p className="text-[11px] text-[#8a4a4a] tracking-[0.05em]">
              {error}
            </p>
          </div>
        )}

        {/* Schema reference */}
        <div className="mt-16 border-t border-[#141414] pt-10">
          <p className="text-[10px] tracking-[0.3em] text-[#2a2a2a] uppercase mb-5">
            Expected schema
          </p>
          <pre className="text-[11px] text-[#3a3a3a] leading-relaxed tracking-[0.02em] overflow-x-auto">
            {`interface StatisticalDistribution {
  sector: '${sector}'
  n: number          // sample size
  p: number | number[]  // success probability
  k: number          // required successes
}`}
          </pre>
        </div>
      </main>

      {/* Bottom rule */}
      <div className="fixed bottom-0 inset-x-0 z-10 border-t border-[#141414] bg-[#080808]/80 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-8 py-4 flex items-center justify-between">
          <span className="text-[10px] tracking-[0.25em] text-[#252525] uppercase">
            Probabilist v1
          </span>
          <span className="text-[10px] tracking-[0.25em] text-[#252525] uppercase">
            {sector} / preview
          </span>
        </div>
      </div>
    </div>
  )
}
