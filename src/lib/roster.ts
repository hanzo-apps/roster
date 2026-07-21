import type { BaseRecord } from '@hanzo/base/react'

/**
 * The one org-scoped Base collection behind Roster (see schema.sql). Base adds
 * id/created/updated/owner/org; these are the domain columns the app reads/writes.
 * `avatar` is an optional image URL (empty → a colored initials avatar).
 */
export interface Person extends BaseRecord {
  name: string
  role: string
  team: string
  email: string
  avatar: string
  bio: string
}

/** The domain fields of a person, without Base's managed id/owner/org. */
export type PersonInput = Omit<Person, keyof BaseRecord>

/** Curated team hues — a team's color is a stable pick keyed by its name. */
export const PALETTE = [
  '#6366f1', // indigo
  '#0ea5e9', // sky
  '#10b981', // emerald
  '#f59e0b', // amber
  '#f43f5e', // rose
  '#8b5cf6', // violet
  '#14b8a6', // teal
  '#ec4899', // pink
] as const

/**
 * Roster's fixed LIGHT surface. A friendly directory reads best clean and airy,
 * so the chrome is a soft neutral page with white cards — explicit colors, not
 * theme tokens, so the look is the same wherever it renders.
 */
export const UI = {
  page: '#f4f6fa',
  card: '#ffffff',
  field: '#eef1f6',
  ink: '#161a22',
  muted: '#59616f',
  faint: '#9aa2b1',
  line: '#e6e9f0',
  accent: '#6366f1',
  accentInk: '#ffffff',
} as const

/** First+last initials: "Maya Chen" → "MC"; a single word → its first two. */
export function initials(name: string): string {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

/** A team's stable hue — the same name always maps to the same palette color. */
export function colorForTeam(team: string): string {
  const key = (team ?? '').trim().toLowerCase()
  return PALETTE[hash(key || 'team') % PALETTE.length]
}

/** A translucent tint of a 6-digit hex color (hex8) for chip/avatar fills. */
export function tint(hex: string, alpha = '22'): string {
  return /^#[0-9a-fA-F]{6}$/.test(hex) ? `${hex}${alpha}` : hex
}

/** Distinct team names in first-seen order — the directory's filter set. */
export function teamNames(people: Person[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const p of people) {
    const name = (p.team ?? '').trim()
    const key = name.toLowerCase()
    if (!name || seen.has(key)) continue
    seen.add(key)
    out.push(name)
  }
  return out
}

/** Free-text match across a person's fields (name/role/team/email/bio). */
export function matches(p: Person, q: string): boolean {
  const s = q.trim().toLowerCase()
  if (!s) return true
  return [p.name, p.role, p.team, p.email, p.bio].some((v) =>
    (v ?? '').toLowerCase().includes(s),
  )
}

/** "1 person" / "12 people" — a small pluralizing count label. */
export function peopleCount(n: number): string {
  return `${n} ${n === 1 ? 'person' : 'people'}`
}
