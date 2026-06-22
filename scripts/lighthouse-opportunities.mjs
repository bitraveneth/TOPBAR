import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const reportsDir = join(process.cwd(), 'lighthouse-reports')
const file = process.argv[2]

if (!file || !existsSync(join(reportsDir, file))) {
  console.error('Usage: node scripts/lighthouse-opportunities.mjs <report.json>')
  process.exit(1)
}

const report = JSON.parse(readFileSync(join(reportsDir, file), 'utf8'))
const opportunities = Object.values(report.audits)
  .filter((audit) => audit.details?.type === 'opportunity' && audit.numericValue > 0)
  .sort((a, b) => (b.numericValue || 0) - (a.numericValue || 0))
  .slice(0, 6)

console.log(`\nTop opportunities — ${file}`)
for (const audit of opportunities) {
  const savings = audit.displayValue ? ` (${audit.displayValue})` : ''
  console.log(`- ${audit.title}${savings}`)
}
