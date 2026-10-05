import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Handles the Contact form on the homepage (public/xpedition-labs.html).
// Requires RESEND_API_KEY and TURNSTILE_SECRET_KEY in the environment
// (.env.local locally, and the hosting provider's environment variables in production).

const FROM = 'Xpedition Labs Website <demo@farminsta.com>'
const TO = ['ypr@xpeditionlabs.com']
const CC = ['sales@farminsta.com']

// Must match the <option>s of the "I am a" select in public/xpedition-labs.html.
const VISITOR_TYPES = [
  'Seed / Agricultural Company',
  'Scientist / Research Institution',
  'Biotechnology / Technology Company',
  'Investor / Strategic Partner',
  'Other',
]

const LIMITS = { name: 80, organisation: 120, email: 254, messageMin: 20, messageMax: 2000, messageWords: 3 }

// Links in the name/organisation fields are the signature of promo spam.
const LINK_PATTERN = /(https?:\/\/|www\.|->|\b[a-z0-9-]+\.(?:com|net|org|io|co|in|info|biz|xyz|ru|top|site|online|link|ly|me|app|dev)\b)/i
const LINK_PATTERN_LOOSE = /(https?:\/\/|www\.|->)/i
const EMOJI_PATTERN = /\p{Extended_Pictographic}/u

type ContactFields = {
  name: string
  organisation: string
  email: string
  type: string
  message: string
  website: string // honeypot: hidden from people, filled by bots
  turnstileToken: string
}

// Random-case strings like "alOGoGqqwhqNhxPHWGqTsZBT": one long word that keeps
// switching from lower to upper case (real names switch at most once or twice).
function looksLikeGibberish(value: string) {
  if (/\s/.test(value) || value.length < 10) return false
  const caseSwitches = value.match(/[a-z][A-Z]/g)?.length ?? 0
  return caseSwitches >= 3
}

// Rules a real person could break: returned as a message shown under the form.
function validationError(f: ContactFields): string | null {
  if (!f.name || !f.email || !f.message) return 'Please fill in your name, email and message.'
  if (f.name.length > LIMITS.name) return `Please keep your name under ${LIMITS.name} characters.`
  if (f.organisation.length > LIMITS.organisation) return `Please keep the organisation under ${LIMITS.organisation} characters.`
  if (LINK_PATTERN.test(f.name) || LINK_PATTERN_LOOSE.test(f.organisation)) return 'Please remove links from your name and organisation.'
  if (EMOJI_PATTERN.test(f.name)) return 'Please remove emoji from your name.'
  if (f.email.length > LIMITS.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) return 'Please enter a valid email address.'
  if (f.message.length > LIMITS.messageMax) return `Please keep your message under ${LIMITS.messageMax} characters.`
  if (f.message.length < LIMITS.messageMin || f.message.split(/\s+/).length < LIMITS.messageWords)
    return 'Please add a little more detail to your message.'
  return null
}

const hostOf = (url: string) => {
  try {
    return new URL(url).host
  } catch {
    return null
  }
}

// Signs of an automated submission: dropped silently (the bot is told it worked).
function spamReason(request: NextRequest, f: ContactFields): string | null {
  if (f.website) return 'honeypot filled'
  const origin = request.headers.get('origin')
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host')
  if (!origin || !host || hostOf(origin) !== host) return `foreign origin (${origin ?? 'none'})`
  if (!f.turnstileToken) return 'missing Turnstile token'
  if (!VISITOR_TYPES.includes(f.type)) return `unknown visitor type (${f.type || 'empty'})`
  if (looksLikeGibberish(f.name)) return 'gibberish name'
  return null
}

async function verifyTurnstile(token: string, secret: string, ip: string | null) {
  const body = new URLSearchParams({ secret, response: token })
  if (ip) body.set('remoteip', ip)
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body })
  const data: { success?: boolean; 'error-codes'?: string[] } = await res.json()
  if (!data.success) console.warn('Turnstile verification failed:', data['error-codes'])
  return Boolean(data.success)
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

async function readFields(request: NextRequest): Promise<ContactFields> {
  const isJson = request.headers.get('content-type')?.includes('application/json')
  const raw: Record<string, unknown> = isJson
    ? await request.json()
    : Object.fromEntries(await request.formData())
  const field = (key: string) => String(raw[key] ?? '').trim()
  return {
    name: field('name'),
    organisation: field('organisation'),
    email: field('email'),
    type: field('type'),
    message: field('message'),
    website: field('website'),
    turnstileToken: field('cf-turnstile-response'),
  }
}

function renderEmail(f: ContactFields) {
  const rows = [
    { label: 'Name', value: escapeHtml(f.name) },
    { label: 'Organisation', value: escapeHtml(f.organisation) || '—' },
    { label: 'Email', value: `<a href="mailto:${escapeHtml(f.email)}" style="color: #97583D; text-decoration: none;">${escapeHtml(f.email)}</a>` },
    { label: 'I am a', value: escapeHtml(f.type) || '—' },
    { label: 'Message', value: escapeHtml(f.message).replace(/\n/g, '<br>') },
  ]

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style="margin: 0; padding: 24px 0; background-color: #F5F3F0; font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #2F353B;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 4px; overflow: hidden; border: 1px solid #E3DFD9;">
          <div style="background-color: #97583D; padding: 22px 28px;">
            <span style="display: block; color: #ffffff; font-size: 22px; font-weight: bold;">New Contact Request</span>
            <span style="display: block; color: #F6E6DC; font-size: 13px;">Xpedition Labs website · Start a Conversation</span>
          </div>
          <div style="padding: 28px;">
            ${rows
              .map(
                (r) => `
            <div style="margin-bottom: 16px;">
              <div style="font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; color: #6A6E74; margin-bottom: 6px;">${r.label}</div>
              <div style="padding: 12px 14px; background-color: #F5F3F0; border-left: 3px solid #B7775B; border-radius: 2px; font-size: 15px; color: #2F353B;">${r.value}</div>
            </div>`
              )
              .join('')}
            <div style="margin-top: 12px; padding-top: 20px; border-top: 1px solid #E3DFD9; color: #8A8F95; font-size: 12px;">
              This email was sent from the contact form on the Xpedition Labs website. Reply to respond directly to the sender.
            </div>
          </div>
        </div>
      </body>
    </html>
  `
}

export async function POST(request: NextRequest) {
  const wantsJson = request.headers.get('accept')?.includes('application/json')
  // Plain form posts (no JavaScript) get redirected back to the contact section.
  const respond = (status: number, body: Record<string, unknown>) =>
    wantsJson
      ? NextResponse.json(body, { status })
      : NextResponse.redirect(new URL(`/?contact=${status === 200 ? 'sent' : 'error'}#contact`, request.url), 303)

  try {
    const fields = await readFields(request)

    const spam = spamReason(request, fields)
    if (spam) {
      console.warn(`Contact form submission dropped: ${spam}`)
      return respond(200, { success: true })
    }

    const invalid = validationError(fields)
    if (invalid) return respond(400, { error: invalid })

    const apiKey = process.env.RESEND_API_KEY
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY
    if (!apiKey || !turnstileSecret) {
      console.error(`Missing env: ${[!apiKey && 'RESEND_API_KEY', !turnstileSecret && 'TURNSTILE_SECRET_KEY'].filter(Boolean).join(', ')}`)
      return respond(500, { error: 'Email service is not configured.' })
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? null
    if (!(await verifyTurnstile(fields.turnstileToken, turnstileSecret, ip))) {
      return respond(400, { error: 'We could not verify your submission. Please refresh the page and try again.' })
    }

    const { error } = await new Resend(apiKey).emails.send({
      from: FROM,
      to: TO,
      cc: CC,
      replyTo: fields.email,
      subject: `New contact request from ${fields.name}${fields.organisation ? ` (${fields.organisation})` : ''}`,
      html: renderEmail(fields),
    })

    if (error) {
      console.error('Resend error:', error)
      return respond(500, { error: 'Failed to send your message. Please try again.' })
    }

    return respond(200, { success: true })
  } catch (error) {
    console.error('Error processing contact request:', error)
    return respond(500, { error: 'Something went wrong. Please try again.' })
  }
}
