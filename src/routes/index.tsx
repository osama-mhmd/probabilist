import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background px-4 py-20 text-center gap-6">
      {/* Title */}
      <h1 className="text-5xl font-extrabold tracking-tight text-foreground lg:text-6xl">
        Probabilist
      </h1>

      {/* Subtitle */}
      <p className="max-w-150 text-xl text-muted-foreground leading-relaxed">
        A modern statistical analysis web application inspired by SPSS.
      </p>

      {/* Description */}
      <p className="max-w-162.5 text-base text-muted-foreground/80">
        The system helps you analyze data using probability models such as
        binomial distribution, variance, expected value, and more.
      </p>

      {/* Items Grid */}
      <div className="flex flex-wrap justify-center gap-6 mt-8">
        {/* Engineering Card */}
        <div className="w-70 bg-card text-card-foreground border border-border rounded-xl p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
          <h3 className="text-lg font-semibold mb-3 flex items-center justify-center gap-2">
            <span>🏗</span> Engineering
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Analyze system reliability, component failure, and uptime
            probability.
          </p>
        </div>

        {/* Medical Card */}
        <div className="w-70 bg-card text-card-foreground border border-border rounded-xl p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
          <h3 className="text-lg font-semibold mb-3 flex items-center justify-center gap-2">
            <span>🏥</span> Medical
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Evaluate clinical experiments and success rates in treatments.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 mt-10">
        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          Go to Dashboard
        </Link>

        <Link
          to="/preview"
          className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          Preview
        </Link>
      </div>
    </main>
  )
}
