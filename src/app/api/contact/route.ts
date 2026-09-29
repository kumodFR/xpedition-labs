import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Handles the Contact form on the homepage (public/xpedition-labs.html).

// Resend API key (same account as farminsta-web)
const RESEND_API_KEY = "re_hbRE4rat_BJixJ5ER5vzzNR84KuD9FAzu"
const resend = new Resend(RESEND_API_KEY)

const FROM = 'Xpedition Labs Website <demo@farminsta.com>'
const TO = ['ypr@xpeditionlabs.com']
const CC = ['sales@farminsta.com']

type ContactFields = {
  name: string
  organisation: string
  email: string
  type: string
  message: string
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
  const field = (key: keyof ContactFields) => String(raw[key] ?? '').trim()
  return {
    name: field('name'),
    organisation: field('organisation'),
    email: field('email'),
    type: field('type'),
    message: field('message'),
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

    if (!fields.name || !fields.email || !fields.message) {
      return respond(400, { error: 'Please fill in your name, email and message.' })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      return respond(400, { error: 'Please enter a valid email address.' })
    }

    const { error } = await resend.emails.send({
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
