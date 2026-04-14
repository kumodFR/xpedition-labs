'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const CompassSVG = () => (
  <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto">
    <circle cx="50" cy="48" r="18" stroke="#8A96A3" strokeWidth="1.2" fill="none"/>
    <circle cx="50" cy="48" r="4"  stroke="#8A96A3" strokeWidth="1"   fill="none"/>
    <circle cx="50" cy="48" r="1.8" fill="#CC3A3A"/>
    <polygon points="50,8 46.5,38 50,34 53.5,38"   fill="#CC3A3A" opacity="0.9"/>
    <polygon points="50,88 46.5,58 50,62 53.5,58"  fill="#8A96A3" opacity="0.5"/>
    <polygon points="90,48 60,44.5 64,48 60,51.5"  fill="#8A96A3" opacity="0.5"/>
    <polygon points="10,48 40,44.5 36,48 40,51.5"  fill="#8A96A3" opacity="0.5"/>
    <line x1="50" y1="26" x2="50" y2="30" stroke="#8A96A3" strokeWidth="0.8"/>
    <line x1="50" y1="66" x2="50" y2="70" stroke="#8A96A3" strokeWidth="0.8"/>
    <line x1="28" y1="48" x2="32" y2="48" stroke="#8A96A3" strokeWidth="0.8"/>
    <line x1="68" y1="48" x2="72" y2="48" stroke="#8A96A3" strokeWidth="0.8"/>
  </svg>
)

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)
  const pathname = usePathname()
  const isDark   = pathname === '/services'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setOpen(false)

  // colour tokens per theme
  const linkColor   = isDark ? 'text-[rgba(232,230,224,0.52)]' : 'text-[#5A6A7A]'
  const linkHover   = isDark ? 'hover:text-[#e8e6e0]'          : 'hover:text-[#1C2A44]'
  const logoColor   = isDark ? 'text-[#e8e6e0]'                : 'text-[#1C2A44]'
  const subColor    = isDark ? 'text-[rgba(232,230,224,0.52)]'  : 'text-[#8A96A3]'
  const barColor    = isDark ? 'bg-[#e8e6e0]'                   : 'bg-[#1C2A44]'
  const ctaBg       = isDark ? 'bg-[#e8e6e0] text-[#0d1b2e] hover:bg-[#c8921a] hover:text-white' : 'bg-[#1C2A44] text-[#F9FBFD] hover:bg-[#2A3D5C]'
  const mobileMenuBg= isDark ? 'bg-[#0d1b2e]' : 'bg-[#F9FBFD]'

  const scrolledClass = scrolled
    ? isDark
      ? 'bg-[rgba(13,27,46,0.95)] backdrop-blur-xl border-b border-white/[0.07]'
      : 'bg-[rgba(249,251,253,0.85)] backdrop-blur-xl border-b border-[rgba(28,42,68,0.08)]'
    : ''

  const navPy = scrolled ? 'py-4' : 'py-5'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-12 ${navPy} transition-all duration-[400ms] w-full box-border max-md:px-6 ${scrolledClass}`}>

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5">
        <CompassSVG />
        <div className={`font-[Outfit,sans-serif] text-[0.95rem] font-bold tracking-[0.18em] uppercase ${logoColor}`}>
          Xpedition
          <span className={`font-normal tracking-[0.25em] text-[0.6rem] block -mt-0.5 ${subColor}`}>L A B S</span>
        </div>
      </Link>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-10" id="navLinks">
        {['/#approach','/#ecosystem','/#team','/#partner'].map((href, i) => (
          <Link key={href} href={href} onClick={closeMenu}
            className={`nav-link-line font-[Outfit,sans-serif] text-[0.82rem] font-medium tracking-[0.06em] uppercase transition-colors duration-300 ${linkColor} ${linkHover}`}>
            {['Approach','Ecosystem','Team','Partner'][i]}
          </Link>
        ))}
        <Link href="/services" onClick={closeMenu}
          className={`nav-link-line font-[Outfit,sans-serif] text-[0.82rem] font-medium tracking-[0.06em] uppercase transition-colors duration-300 ${linkColor} ${linkHover}`}>
          Services
        </Link>
        <a href="https://mail.google.com/mail/?view=cm&to=ypr@xpeditionlabs.com"
           target="_blank" rel="noopener" onClick={closeMenu}
           className={`${ctaBg} font-[Outfit,sans-serif] text-[0.8rem] font-semibold px-6 py-2.5 rounded-md transition-all duration-300 inline-block`}>
          Get in Touch
        </a>
      </div>

      {/* Hamburger */}
      <button
        className="flex md:hidden flex-col gap-[5px] p-[5px] bg-transparent border-none cursor-pointer z-[101]"
        aria-label="Menu"
        onClick={() => setOpen(o => !o)}
      >
        <span className={`block w-6 h-[2px] transition-all duration-300 ${barColor} ${open ? 'rotate-45 translate-x-[5px] translate-y-[5px]' : ''}`}/>
        <span className={`block w-6 h-[2px] transition-all duration-300 ${barColor} ${open ? 'opacity-0' : ''}`}/>
        <span className={`block w-6 h-[2px] transition-all duration-300 ${barColor} ${open ? '-rotate-45 translate-x-[5px] -translate-y-[5px]' : ''}`}/>
      </button>

      {/* Mobile overlay */}
      {open && (
        <div className={`fixed inset-0 ${mobileMenuBg} flex flex-col justify-center items-center gap-8 z-[99]`}>
          {['/#approach','/#ecosystem','/#team','/#partner'].map((href, i) => (
            <Link key={href} href={href} onClick={closeMenu}
              className={`font-[Outfit,sans-serif] text-[1.1rem] font-medium tracking-[0.06em] uppercase ${linkColor} ${linkHover}`}>
              {['Approach','Ecosystem','Team','Partner'][i]}
            </Link>
          ))}
          <Link href="/services" onClick={closeMenu}
            className={`font-[Outfit,sans-serif] text-[1.1rem] font-medium tracking-[0.06em] uppercase ${linkColor} ${linkHover}`}>
            Services
          </Link>
          <a href="https://mail.google.com/mail/?view=cm&to=ypr@xpeditionlabs.com"
             target="_blank" rel="noopener" onClick={closeMenu}
             className={`${ctaBg} font-[Outfit,sans-serif] text-[0.8rem] font-semibold px-6 py-2.5 rounded-md`}>
            Get in Touch
          </a>
        </div>
      )}
    </nav>
  )
}
