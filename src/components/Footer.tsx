'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()
  const isDark = pathname === '/services'

  const bgClass = isDark ? 'bg-[#0d1b2e] border-white/[0.07]' : 'border-[rgba(28,42,68,0.08)]'
  const textClass = isDark ? 'text-[rgba(232,230,224,0.28)]' : 'text-[#8A96A3]'
  const hoverClass = isDark ? 'hover:text-[#e8e6e0]' : 'hover:text-[#1C2A44]'

  return (
    <footer className={`${bgClass} border-t py-6 px-12 flex justify-between items-center max-md:flex-col max-md:gap-3 max-md:text-center max-md:px-6`}>
      <span className={`text-[11.5px] ${textClass}`}>
        © 2026 Xpedition Labs · Navigating businesses to their North Star
      </span>
      <div className="flex items-center gap-7">
        <a
          href="https://mail.google.com/mail/?view=cm&to=ypr@xpeditionlabs.com"
          target="_blank"
          rel="noopener"
          className={`text-[11.5px] ${textClass} transition-colors duration-200 ${hoverClass}`}
        >
          ypr@xpeditionlabs.com
        </a>
        <Link
          href="/"
          className={`text-[11.5px] ${textClass} transition-colors duration-200 ${hoverClass}`}
        >
          Home
        </Link>
      </div>
    </footer>
  )
}
