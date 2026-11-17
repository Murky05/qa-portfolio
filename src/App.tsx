import { useEffect, useState } from "react";

type TestCase = {
  id: string;
  title: string;
  priority: string;
  type: string;
  preconditions: string;
  steps: string[];
  expectedResult: string;
};

type SamplePayload = {
  source: string;
  model: string;
  story: string;
  cases: TestCase[];
};

const FEATURES = [
  {
    title: "Page Object Model",
    body: "Login, inventory, cart, and checkout pages keep selectors and flows reusable.",
  },
  {
    title: "Shared fixtures",
    body: "A logged-in inventory fixture boots every cart and checkout scenario cleanly.",
  },
  {
    title: "Data-driven negatives",
    body: "JSON rows drive locked-out, blank, and mismatched credential checks.",
  },
  {
    title: "Cross-browser CI shape",
    body: "Chromium and Firefox projects run against live SauceDemo with traces on retry.",
  },
];

const REPORT = {
  suite: "SauceDemo ecommerce smoke + regression",
  environment: "https://www.saucedemo.com",
  browsers: "Chromium, Firefox",
  passed: "20",
  failed: "0",
  skipped: "0",
  verdict: "Pass — 20/20 in ~10.1s (2026-11-17)",
};

export default function App() {
  const [sample, setSample] = useState<SamplePayload | null>(null);
  const [sampleError, setSampleError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/sample-test-cases.json")
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<SamplePayload>;
      })
      .then((data) => {
        if (!cancelled) setSample(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setSampleError(err instanceof Error ? err.message : "Failed to load sample");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="page">
      <div className="atmosphere" aria-hidden="true" />
      <div className="grid-fade" aria-hidden="true" />

      <header className="topbar">
        <a className="brand-mark" href="#top">
          QA Lab
        </a>
        <nav className="nav">
          <a href="#framework">Framework</a>
          <a href="#generator">Generator</a>
          <a href="#report">Report</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <p className="eyebrow reveal">Portfolio demo</p>
          <h1 className="brand-hero reveal delay-1">QA Automation Demo</h1>
          <p className="lede reveal delay-2">
            Playwright coverage for SauceDemo plus an AI-assisted test-case generator —
            packaged as a runnable portfolio lab.
          </p>
          <div className="cta-row reveal delay-3">
            <a className="btn primary" href="#framework">
              Explore the framework
            </a>
            <a className="btn ghost" href="#generator">
              View generated cases
            </a>
          </div>
          <div className="hero-plane" aria-hidden="true">
            <div className="hero-scan" />
            <pre className="hero-code">
{`npx playwright test
✓ Login  · valid + negative paths
✓ Cart   · add / remove / sort
✓ Checkout · happy path + validation`}
            </pre>
          </div>
        </section>

        <section id="framework" className="section">
          <div className="section-intro">
            <h2>Playwright framework</h2>
            <p>
              End-to-end specs against the public SauceDemo storefront, organized with
              page objects, fixtures, and JSON-driven negatives.
            </p>
          </div>

          <ul className="feature-list">
            {FEATURES.map((feature) => (
              <li key={feature.title}>
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </li>
            ))}
          </ul>

          <div className="run-block">
            <h3>How to run</h3>
            <pre>
{`npm install
npx playwright install
npm test
npm run test:headed   # optional UI watch`}
            </pre>
          </div>
        </section>

        <section id="generator" className="section">
          <div className="section-intro">
            <h2>AI test-case generator</h2>
            <p>
              Feed a user story into <code>npm run generate</code>. With an OpenAI key it
              calls the API; without one it falls back to a deterministic mock so the demo
              always runs. Generated cases still need human review.
            </p>
          </div>

          <div className="run-block">
            <h3>Generate</h3>
            <pre>
{`cp .env.example .env   # optional
npm run generate
# writes test-cases.json, test-cases.csv,
# and public/sample-test-cases.json`}
            </pre>
          </div>

          <div className="sample-panel">
            <div className="sample-head">
              <h3>Sample output</h3>
              {sample ? (
                <p>
                  Source: <strong>{sample.source}</strong> · model{" "}
                  <strong>{sample.model}</strong> · {sample.cases.length} cases
                </p>
              ) : sampleError ? (
                <p className="warn">Could not load sample: {sampleError}</p>
              ) : (
                <p>Loading sample-test-cases.json…</p>
              )}
            </div>

            {sample && (
              <>
                <blockquote className="story">{sample.story}</blockquote>
                <ol className="case-list">
                  {sample.cases.map((c) => (
                    <li key={c.id}>
                      <div className="case-meta">
                        <span className="case-id">{c.id}</span>
                        <span className={`pill type-${c.type}`}>{c.type}</span>
                        <span className="pill muted">{c.priority}</span>
                      </div>
                      <h4>{c.title}</h4>
                      <p className="expected">{c.expectedResult}</p>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </div>
        </section>

        <section id="report" className="section report-section">
          <div className="section-intro">
            <h2>QA report summary</h2>
            <p>
              Latest execution notes for the SauceDemo suite. Full narrative lives in the
              docs.
            </p>
          </div>

          <dl className="report-grid">
            <div>
              <dt>Suite</dt>
              <dd>{REPORT.suite}</dd>
            </div>
            <div>
              <dt>Environment</dt>
              <dd>
                <a href={REPORT.environment} target="_blank" rel="noreferrer">
                  {REPORT.environment}
                </a>
              </dd>
            </div>
            <div>
              <dt>Browsers</dt>
              <dd>{REPORT.browsers}</dd>
            </div>
            <div>
              <dt>Passed</dt>
              <dd id="report-passed">{REPORT.passed}</dd>
            </div>
            <div>
              <dt>Failed</dt>
              <dd id="report-failed">{REPORT.failed}</dd>
            </div>
            <div>
              <dt>Verdict</dt>
              <dd>{REPORT.verdict}</dd>
            </div>
          </dl>

          <p className="docs-links" id="docs">
            Full write-up: <code>docs/qa-report.md</code> · plan:{" "}
            <code>docs/test-plan.md</code> in the repository.
          </p>
          <p className="docs-note">
            Clone the repo to open the Markdown docs alongside the Playwright HTML report
            from <code>npm run report</code>.
          </p>
        </section>
      </main>

      <footer className="footer">
        <p>QA Automation Demo · Playwright + Vite · human-reviewed AI cases</p>
      </footer>
    </div>
  );
}
