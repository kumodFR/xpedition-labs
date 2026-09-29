'use client'

import { useEffect } from 'react'

// Closes the mobile menu of the injected HTML homepage after a nav link is
// tapped (scripts inside dangerouslySetInnerHTML never run, so it lives here).
export default function HtmlNavCloser() {
  useEffect(() => {
    const toggle = document.getElementById('xl-nav-toggle') as HTMLInputElement | null
    const nav = document.querySelector('.xl-nav')
    if (!toggle || !nav) return
    const close = (e: Event) => {
      if ((e.target as HTMLElement).closest('a')) toggle.checked = false
    }
    nav.addEventListener('click', close)
    return () => nav.removeEventListener('click', close)
  }, [])

  return null
}
