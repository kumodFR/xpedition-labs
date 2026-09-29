'use client'

import { useEffect } from 'react'

// Submits the Contact form of the injected HTML homepage to /api/contact
// (scripts inside dangerouslySetInnerHTML never run, so it lives here).
export default function HtmlContactForm() {
  useEffect(() => {
    const form = document.getElementById('xl-contact-form') as HTMLFormElement | null
    if (!form) return
    const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')
    const status = form.querySelector<HTMLElement>('.xl-form-status')

    const setStatus = (state: 'success' | 'error' | '', text: string) => {
      if (!status) return
      status.dataset.state = state
      status.textContent = text
    }

    const onSubmit = async (e: SubmitEvent) => {
      e.preventDefault()
      if (button) {
        button.disabled = true
        button.textContent = 'Sending…'
      }
      setStatus('', '')

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(Object.fromEntries(new FormData(form))),
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
        if (button) {
          button.disabled = false
          button.textContent = 'Submit'
        }
      }
    }

    form.addEventListener('submit', onSubmit)
    return () => form.removeEventListener('submit', onSubmit)
  }, [])

  return null
}
