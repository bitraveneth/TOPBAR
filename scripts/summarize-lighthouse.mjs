import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const reportsDir = join(process.cwd(), 'lighthouse-reports')
const files = process.argv.slice(2)

function scorePct(value) {
  return value == null ? '—' : Math.round(value * 100)
}

function auditDisplay(audit) {
  if (!audit) return '—'
  if (typeof audit.numericValue === 'number') {
    const unit = audit.numericUnit === 'millisecond' ? 'ms' : audit.numericUnit || ''
    return `${Math.round(audit.numericValue)}${unit}`
  }
  return audit.displayValue || '—'
}

for (const file of files) {
  const path = join(reportsDir, file)
  if (!existsSync(path)) {
    console.log(`\n## ${file}\nMISSING\n`)
    continue
  }

  const report = JSON.parse(readFileSync(path, 'utf8'))
  const cats = report.categories
  const audits = report.audits

  console.log(`\n## ${file}`)
  console.log(`URL: ${report.finalDisplayedUrl || report.requestedUrl}`)
  console.log(`Performance: ${scorePct(cats.performance?.score)}`)
  console.log(`Accessibility: ${scorePct(cats.accessibility?.score)}`)
  console.log(`Best Practices: ${scorePct(cats['best-practices']?.score)}`)
  console.log(`SEO: ${scorePct(cats.seo?.score)}`)
  console.log(`FCP: ${auditDisplay(audits['first-contentful-paint'])}`)
  console.log(`LCP: ${auditDisplay(audits['largest-contentful-paint'])}`)
  console.log(`TBT: ${auditDisplay(audits['total-blocking-time'])}`)
  console.log(`CLS: ${auditDisplay(audits['cumulative-layout-shift'])}`)
  console.log(`Speed Index: ${auditDisplay(audits['speed-index'])}`)
}
