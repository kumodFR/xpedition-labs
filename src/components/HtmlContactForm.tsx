'use client'

import { useEffect } from 'react'

// Cloudflare Turnstile site key (public). The matching secret key lives in
// the TURNSTILE_SECRET_KEY environment variable used by /api/contact.
const TURNSTILE_SITE_KEY = '0x4AAAAAAFOBrMgg4gbERKwI'
const TURNSTILE_SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

type Turnstile = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string
  getResponse: (widgetId: string) => string | undefined
  reset: (widgetId: string) => void
  remove: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: Turnstile
  }
}

function loadTurnstile(): Promise<Turnstile> {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  return new Promise((resolve, reject) => {
    let script = document.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE_SCRIPT}"]`)
    if (!script) {
      script = document.createElement('script')
      script.src = TURNSTILE_SCRIPT
      script.async = true
      document.head.appendChild(script)
    }
    script.addEventListener('load', () => (window.turnstile ? resolve(window.turnstile) : reject()))
    script.addEventListener('error', () => reject())
  })
}

// Submits the Contact form of the injected HTML homepage to /api/contact
// (scripts inside dangerouslySetInnerHTML never run, so it lives here).
export default function HtmlContactForm() {
  useEffect(() => {
    const form = document.getElementById('xl-contact-form') as HTMLFormElement | null
    const container = document.getElementById('xl-turnstile')
    if (!form || !container) return
    const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')
    const status = form.querySelector<HTMLElement>('.xl-form-status')

    let turnstile: Turnstile | undefined
    let widgetId: string | undefined
    let cancelled = false

    const setStatus = (state: 'success' | 'error' | '', text: string) => {
      if (!status) return
      status.dataset.state = state
      status.textContent = text
    }

    loadTurnstile()
      .then((ts) => {
        if (cancelled) return
        turnstile = ts
        // Managed mode: invisible for most visitors, a one-click check only when needed.
        widgetId = ts.render(container, {
          sitekey: TURNSTILE_SITE_KEY,
          action: 'contact',
          theme: 'light',
          appearance: 'interaction-only',
          'refresh-expired': 'auto',
        })
      })
      .catch(() => setStatus('error', 'Could not load the spam check. Please disable ad blockers for this site or refresh the page.'))

    const onSubmit = async (e: SubmitEvent) => {
      e.preventDefault()

      const token = turnstile && widgetId ? turnstile.getResponse(widgetId) : undefined
      if (!token) {
        setStatus('error', 'Please wait a moment while we verify your browser, then press Submit again.')
        return
      }

      if (button) {
        button.disabled = true
        button.textContent = 'Sending…'
      }
      setStatus('', '')

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ ...Object.fromEntries(new FormData(form)), 'cf-turnstile-response': token }),
        })
        const data = await res.json().catch(() => ({}))
        if (res.ok) {
          form.reset()
          setStatus('success', "Thank you — your message has been sent. We'll be in touch shortly.")
        } else {
          setStatus('error', data.error || 'Failed to send your message. Please try again.')
        }
      } catch {
        setStatus('error', 'Something went wrong. Please try again.')
      } finally {
        // Turnstile tokens are single-use: get a fresh one for the next submission.
        if (turnstile && widgetId) turnstile.reset(widgetId)
        if (button) {
          button.disabled = false
          button.textContent = 'Submit'
        }
      }
    }

    form.addEventListener('submit', onSubmit)
    return () => {
      cancelled = true
      form.removeEventListener('submit', onSubmit)
      if (turnstile && widgetId) turnstile.remove(widgetId)
    }
  }, [])

  return null
}
