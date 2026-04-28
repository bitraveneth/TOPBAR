/**
 * One-time: create an Auth user and set profiles.role = 'admin'.
 * Needs service role key (server only — never use in Vite / the browser).
 *
 * Usage:
 *   node scripts/create-admin.mjs
 *   node scripts/create-admin.mjs you@domain.com
 *   node scripts/create-admin.mjs you@domain.com 104028 admin
 *   node scripts/create-admin.mjs you@domain.com 104028 owner
 *
 * Env (in .env):
 *   VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createClient } from '@supabase/supabase-js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

function loadDotEnv() {
  const path = join(root, '.env')
  if (!existsSync(path)) return
  const raw = readFileSync(path, 'utf8')
  for (const line of raw.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let val = trimmed.slice(eq + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (!(key in process.env)) process.env[key] = val
  }
}

loadDotEnv()

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const email = process.argv[2] || 'admin@topbar.local'
const password = process.argv[3] || '104028'
const roleArg = (process.argv[4] || 'admin').toLowerCase()
const profileRole = roleArg === 'owner' ? 'owner' : 'admin'

if (!url || !serviceKey) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env')
  console.error('Get the service role key from Supabase → Project Settings → API (keep it secret).')
  process.exit(1)
}

if (password.length < 6) {
  console.error('Password must be at least 6 characters (Supabase default).')
  process.exit(1)
}

const supabase = createClient(url, serviceKey)

async function findUserIdByEmail(em) {
  const target = em.toLowerCase()
  let page = 1
  const perPage = 200
  for (;;) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage })
    if (error) return null
    const u = data.users.find((x) => (x.email || '').toLowerCase() === target)
    if (u) return u.id
    if (data.users.length < perPage) break
    page += 1
  }
  return null
}

const { data: created, error: createErr } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
})

let id = created?.user?.id

if (createErr) {
  const duplicate = /already been registered|already exists|duplicate/i.test(createErr.message)
  if (duplicate) {
    id = await findUserIdByEmail(email)
    if (!id) {
      console.error('createUser:', createErr.message)
      console.error('Could not find existing user id for', email)
      process.exit(1)
    }
    const { error: pwdErr } = await supabase.auth.admin.updateUserById(id, {
      password,
      email_confirm: true,
    })
    if (pwdErr) {
      console.error('updateUser (password):', pwdErr.message)
      process.exit(1)
    }
    console.log('User already existed; password reset and role updated.')
  } else {
    console.error('createUser:', createErr.message)
    process.exit(1)
  }
}

if (!id) {
  console.error('No user id returned.')
  process.exit(1)
}

const { error: upErr } = await supabase
  .from('profiles')
  .update({ role: profileRole, email })
  .eq('id', id)

if (upErr) {
  console.error('profiles update:', upErr.message)
  process.exit(1)
}

console.log(createErr ? 'Staff account ready (existing user).' : 'Staff account created.')
console.log('  Email:', email)
console.log('  Password:', password)
console.log('  Role:', profileRole, '(admin and owner can use /admin)')
console.log('  Sign in at /admin/login')
