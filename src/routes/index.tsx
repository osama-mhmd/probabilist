import { createFileRoute, Link } from '@tanstack/react-router'
import "./css/home.css";

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main className="container">

      <h1 className="title">Probabilist</h1>

      <p className="subtitle">
        A modern statistical analysis web application inspired by SPSS.
      </p>

      <p className="description">
        The system helps you analyze data using probability models such as
        binomial distribution, variance, expected value, and more.
      </p>

      <div className="items">

        <div className="item">
          <h3>🏗 Engineering</h3>
          <p>
            Analyze system reliability, component failure, and uptime probability.
          </p>
        </div>

        <div className="item">
          <h3>🏥 Medical</h3>
          <p>
            Evaluate clinical experiments and success rates in treatments.
          </p>
        </div>

      </div>

      <div className="buttons">

        <Link to="/dashboard" className="btn primary">
          Go to Dashboard
        </Link>

        <Link to="/preview" className="btn">
          Preview
        </Link>

      </div>

    </main>
  )
}
