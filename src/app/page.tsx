'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

const delays = ['reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3', 'reveal-delay-4'] as const

const CompassHero = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[72px] h-auto">
    <circle cx="50" cy="50" r="20" stroke="#8A96A3" strokeWidth="1.2" fill="none"/>
    <circle cx="50" cy="50" r="4.5" stroke="#8A96A3" strokeWidth="1" fill="none"/>
    <circle cx="50" cy="50" r="2" fill="#CC3A3A"/>
    <polygon points="50,6 46,40 50,35 54,40"  fill="#CC3A3A" opacity="0.9"/>
    <polygon points="50,94 46,60 50,65 54,60" fill="#8A96A3" opacity="0.45"/>
    <polygon points="94,50 60,46 65,50 60,54" fill="#8A96A3" opacity="0.45"/>
    <polygon points="6,50 40,46 35,50 40,54"  fill="#8A96A3" opacity="0.45"/>
    <line x1="50" y1="26" x2="50" y2="30" stroke="#8A96A3" strokeWidth="0.8"/>
    <line x1="50" y1="70" x2="50" y2="74" stroke="#8A96A3" strokeWidth="0.8"/>
    <line x1="26" y1="50" x2="30" y2="50" stroke="#8A96A3" strokeWidth="0.8"/>
    <line x1="70" y1="50" x2="74" y2="50" stroke="#8A96A3" strokeWidth="0.8"/>
  </svg>
)

export default function Home() {
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('visible')
        entry.target.querySelectorAll<HTMLElement>('[data-target]').forEach(counter => {
          if (counter.dataset.counted) return
          counter.dataset.counted = 'true'
          const target = parseInt(counter.dataset.target!)
          const suffix = counter.dataset.suffix || ''
          const start  = performance.now()
          const tick   = (now: number) => {
            const p = Math.min((now - start) / 1800, 1)
            counter.textContent = Math.round(target * (1 - Math.pow(1 - p, 4))) + suffix
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        })
      })
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' })
    document.querySelectorAll('.reveal').forEach(el => observerRef.current!.observe(el))
    return () => observerRef.current?.disconnect()
  }, [])

  return (
    <div className="text-[#1C2A44] bg-[#F9FBFD] overflow-x-hidden">
      <div className="grain" />

      {/* ── HERO ── */}
      <section className="hero-bg relative min-h-screen flex flex-col justify-center items-center text-center px-8 pt-32 pb-16 overflow-hidden">
        <div className="animate-fade-down-1 mb-6"><CompassHero /></div>
        <p className="animate-fade-down-2 font-[JetBrains_Mono,monospace] text-[0.85rem] tracking-[0.5em] text-[#8A96A3] mb-5">北 極 星 · 探 検</p>
        <h1 className="animate-fade-up-3 font-[Outfit,sans-serif] font-bold text-[clamp(3rem,7vw,5.5rem)] tracking-[0.08em] uppercase leading-[1.05] text-[#1C2A44] mb-1 relative z-10">Xpedition</h1>
        <p className="animate-fade-up-4 font-[JetBrains_Mono,monospace] text-[clamp(0.9rem,1.5vw,1.1rem)] tracking-[0.85em] text-[#8A96A3] uppercase mb-10">L A B S</p>
        <p className="animate-fade-up-5 font-[Outfit,sans-serif] font-light text-[clamp(1.05rem,1.8vw,1.3rem)] text-[#5A6A7A] max-w-[540px] leading-[1.7] mb-12">Navigating Businesses To Their North Star</p>
        <a href="#approach" className="animate-fade-up-6 inline-flex items-center gap-2.5 font-[Outfit,sans-serif] font-semibold text-[0.82rem] tracking-[0.08em] uppercase text-[#1C2A44] px-9 py-4 border-[1.5px] border-[#1C2A44] rounded-md transition-all duration-[400ms] hover:bg-[#1C2A44] hover:text-[#F9FBFD] hover:-translate-y-0.5">
          Explore
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
          </svg>
        </a>
        <div className="animate-fade-in absolute bottom-8 left-1/2 -translate-x-1/2 w-px h-[50px] bg-gradient-to-b from-[#C9D6DF] to-transparent" />
      </section>

      {/* ── APPROACH ── */}
      <section className="py-28 px-12 max-w-[1200px] mx-auto w-full max-md:py-[4.5rem] max-md:px-6" id="approach">
        <div className="reveal">
          <p className="font-[JetBrains_Mono,monospace] text-[0.72rem] font-medium tracking-[0.2em] uppercase text-[#D4956A] mb-5">Our Approach</p>
          <h2 className="font-[DM_Serif_Display,Georgia,serif] text-[clamp(2.2rem,4.5vw,3.5rem)] leading-[1.15] text-[#1C2A44] mb-6">Founder-First. Product-Led.<br/>Built for Scale.</h2>
          <p className="text-[1.05rem] text-[#5A6A7A] max-w-[620px] leading-[1.8] font-light">We partner with founders to turn ideas into companies — not with theory, but with working products, real users, and systems that scale. Our venture studio model brings hands-on support across product strategy, GTM, operations, and fundraising. Every company we back starts with one thing: a product that solves a real problem.</p>
        </div>
        <div className="grid grid-cols-3 gap-6 mt-14 max-md:grid-cols-1">
          {[
            { n:'01', phase:'Phase One',   title:'0 → 1',    body:<><strong>Proof of Validity.</strong> We don't write business plans — we build products. Working alongside founders, we validate ideas through rapid productization: lean architecture, AI-enabled tools, fast iteration, and real user feedback. The goal is simple — a working product with early traction, not a pitch deck.</> },
            { n:'02', phase:'Phase Two',   title:'1 → 10',   body:<><strong>Predictable Growth.</strong> With a validated product in hand, we help founders wire up the growth engine — GTM playbooks, partnership channels, operational systems, and revenue models that compound. Every rupee invested starts to predictably produce returns.</> },
            { n:'03', phase:'Phase Three', title:'10 → 100', body:<><strong>Category Leadership.</strong> This is where companies become categories. We support founders in expanding into adjacent verticals, deepening competitive moats, productizing new offerings, and building the brand that defines the space. Our role shifts from building alongside to advising at scale.</> },
          ].map((p, i) => (
            <div key={p.n} className={`reveal ${delays[i]} relative bg-[#F9FBFD] border border-[rgba(28,42,68,0.08)] rounded-xl p-10 overflow-hidden transition-all duration-[400ms] hover:border-[rgba(28,42,68,0.15)] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(28,42,68,0.06)]`}>
              <div className="absolute top-[-0.5rem] right-4 font-[DM_Serif_Display,Georgia,serif] text-[5rem] text-[rgba(28,42,68,0.04)] leading-none pointer-events-none select-none">{p.n}</div>
              <p className="font-[JetBrains_Mono,monospace] text-[0.68rem] tracking-[0.15em] uppercase text-[#D4956A] mb-3">{p.phase}</p>
              <h3 className="font-[DM_Serif_Display,Georgia,serif] text-[2rem] text-[#1C2A44] mb-4">{p.title}</h3>
              <p className="text-[0.92rem] text-[#5A6A7A] leading-[1.75] font-light">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW WE AMPLIFY ── */}
      <section className="amplify-bg relative bg-[#111D32] overflow-hidden">
        <div className="py-28 px-12 max-w-[1200px] mx-auto w-full max-md:py-[4.5rem] max-md:px-6 relative z-10">
          <div className="reveal">
            <p className="font-[JetBrains_Mono,monospace] text-[0.72rem] font-medium tracking-[0.2em] uppercase text-[#E8B896] mb-5">How We Amplify</p>
            <h2 className="font-[DM_Serif_Display,Georgia,serif] text-[clamp(2.2rem,4.5vw,3.5rem)] leading-[1.15] text-[#F9FBFD] mb-6">Starting from Execution to Enduring Value</h2>
            <p className="text-[1.05rem] text-[rgba(249,251,253,0.6)] max-w-[620px] leading-[1.8] font-light">Every company in our ecosystem gets access to shared infrastructure, cross-leveraged networks, and the collective intelligence of the entire portfolio.</p>
          </div>
          <div className="grid grid-cols-4 gap-6 mt-14 max-lg:grid-cols-2 max-md:grid-cols-1">
            {[
              { icon:'⚙', title:'Technology',  text:'AI-first product development. Shared tech stacks, reusable modules, and engineering talent that moves across the portfolio to wherever impact is highest.' },
              { icon:'◧', title:'Systems',      text:'Operational playbooks that turn chaos into process — from hiring frameworks to finance ops to compliance. Built once, deployed across every venture.' },
              { icon:'◎', title:'Go-to-Market', text:"Channel strategy, pricing models, and distribution networks. We don't just build great products — we engineer the path from product to revenue." },
              { icon:'⬡', title:'Partnerships', text:'One relationship opens doors for the entire ecosystem. Our portfolio companies cross-sell, co-create, and share customers in ways solo startups never can.' },
            ].map((c, i) => (
              <div key={c.title} className={`reveal ${delays[i]} p-8 border border-white/[0.08] rounded-[10px] bg-white/[0.03] transition-all duration-[400ms] hover:bg-white/[0.06] hover:border-[rgba(212,149,106,0.2)] hover:-translate-y-1`}>
                <div className="w-11 h-11 rounded-[10px] bg-[rgba(212,149,106,0.12)] flex items-center justify-center mb-5 text-[1.1rem] text-[#E8B896]">{c.icon}</div>
                <h4 className="font-[Outfit,sans-serif] text-[0.95rem] font-semibold text-[#F9FBFD] mb-3">{c.title}</h4>
                <p className="text-[0.85rem] text-[rgba(249,251,253,0.5)] leading-[1.7] font-light">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ECOSYSTEM ── */}
      <section className="py-28 px-12 max-w-[1200px] mx-auto w-full max-md:py-[4.5rem] max-md:px-6" id="ecosystem">
        <div className="reveal">
          <p className="font-[JetBrains_Mono,monospace] text-[0.72rem] font-medium tracking-[0.2em] uppercase text-[#D4956A] mb-5">Our Ecosystem</p>
          <h2 className="font-[DM_Serif_Display,Georgia,serif] text-[clamp(2.2rem,4.5vw,3.5rem)] leading-[1.15] text-[#1C2A44] mb-6">Two Impact Areas. One Lab<br/>Powering the Expedition.</h2>
        </div>
        <div className="grid grid-cols-2 gap-8 mt-14 max-md:grid-cols-1">
          {[
            { color:'#3A8F7D', badge:'Health Ecosystem', title:'Connected Care',     body:"Healthcare in India is fragmented — between doctors, diagnostics, pharmacies, and patients. We're building companies that bring the entire care journey onto one connected layer. From how families access care to how providers manage it, our health portfolio is designed to make quality healthcare organized, accessible, and proactive — not reactive." },
            { color:'#D4956A', badge:'Agri Ecosystem',   title:'Field to Last Mile',  body:"India's agricultural supply chain runs on manual coordination, disconnected field teams, and information gaps. We're building companies that give agri-businesses real-time field intelligence, structured workforce management, and scalable rural distribution — from how products are monitored in the field to how they reach the last mile." },
          ].map((e, i) => (
            <div key={e.title} className={`reveal ${delays[i]} border border-[rgba(28,42,68,0.08)] rounded-[14px] p-10 bg-[#F9FBFD] transition-all duration-[400ms] hover:border-[rgba(28,42,68,0.15)] hover:shadow-[0_15px_50px_rgba(28,42,68,0.05)]`}>
              <div className="inline-flex items-center gap-2 font-[JetBrains_Mono,monospace] text-[0.68rem] tracking-[0.15em] uppercase mb-6" style={{ color: e.color }}>
                <span className="w-2 h-2 rounded-full" style={{ background: e.color }}/>
                {e.badge}
              </div>
              <h3 className="font-[DM_Serif_Display,Georgia,serif] text-[1.6rem] text-[#1C2A44] mb-4">{e.title}</h3>
              <p className="text-[0.92rem] text-[#5A6A7A] leading-[1.8] font-light">{e.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats-bg relative bg-[#1C2A44] overflow-hidden">
        <div className="py-28 px-12 max-w-[1200px] mx-auto w-full max-md:py-[4.5rem] max-md:px-6 grid grid-cols-4 gap-8 relative z-10 max-md:grid-cols-2">
          {[
            { target:10, suffix:'+', label:'Founders & Counting' },
            { target:6,  suffix:'',  label:'Live Ventures' },
            { target:10, suffix:'+', label:'Products Built' },
            { target:15, suffix:'+', label:'Industry Mentors' },
          ].map((s, i) => (
            <div key={s.label} className={`reveal ${i > 0 ? delays[i-1] : ''} text-center`}>
              <div className="font-[DM_Serif_Display,Georgia,serif] text-[clamp(2.5rem,4vw,3.2rem)] text-[#E8B896] leading-[1.2]" data-target={s.target} data-suffix={s.suffix}>0</div>
              <div className="font-[JetBrains_Mono,monospace] text-[0.68rem] tracking-[0.12em] uppercase text-[rgba(249,251,253,0.45)] mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-28 px-12 max-w-[1200px] mx-auto w-full max-md:py-[4.5rem] max-md:px-6" id="team">
        <div className="reveal">
          <p className="font-[JetBrains_Mono,monospace] text-[0.72rem] font-medium tracking-[0.2em] uppercase text-[#D4956A] mb-5">The Team</p>
          <h2 className="font-[DM_Serif_Display,Georgia,serif] text-[clamp(2.2rem,4.5vw,3.5rem)] leading-[1.15] text-[#1C2A44] mb-6">Premier Institutes.<br/>Proven Operators.</h2>
          <p className="text-[1.05rem] text-[#5A6A7A] max-w-[620px] leading-[1.8] font-light mb-8">We're not advisors who've only read case studies. We've built businesses, scaled operations, and navigated the messy reality of growing companies from zero. Our team brings deep domain expertise across agriculture, healthcare, technology, finance, and consulting.</p>
          <div className="w-[50px] h-[2px] bg-[#D4956A] mt-12" />
        </div>
      </section>

      {/* ── PARTNER ── */}
      <section className="py-28 px-12 max-w-[1200px] mx-auto w-full max-md:py-[4.5rem] max-md:px-6" id="partner">
        <div className="reveal">
          <p className="font-[JetBrains_Mono,monospace] text-[0.72rem] font-medium tracking-[0.2em] uppercase text-[#D4956A] mb-5">Three Ways We Partner</p>
          <h2 className="font-[DM_Serif_Display,Georgia,serif] text-[clamp(2.2rem,4.5vw,3.5rem)] leading-[1.15] text-[#1C2A44] mb-6">We don't just advise.<br/>We build alongside you.</h2>
        </div>
        <div className="grid grid-cols-3 gap-6 mt-14 max-md:grid-cols-1">
          {[
            { icon:'◈', title:'SaaS',                   sub:'Platform Access',  text:"Get access to our shared technology stack, tools, and automation infrastructure. Pay as you grow. Built for founders who want to move fast without reinventing the wheel." },
            { icon:'◉', title:'Consulting',              sub:'Domain Expertise', text:"Hands-on advisory from operators who've been there. GTM strategy, product architecture, fundraising prep, hiring plans — real answers, not frameworks." },
            { icon:'◇', title:'Milestone-Linked Equity', sub:'Skin in the Game', text:"We put our money where our mouth is. Equity earned only when milestones are hit. Our incentives are perfectly aligned with yours — we win when you win." },
          ].map((p, i) => (
            <div key={p.title} className={`reveal ${delays[i]} partner-card relative border border-[rgba(28,42,68,0.08)] rounded-xl p-10 bg-[#F9FBFD] transition-all duration-[400ms] hover:border-[rgba(28,42,68,0.15)] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(28,42,68,0.06)]`}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[rgba(28,42,68,0.06)] to-[rgba(201,214,223,0.3)] flex items-center justify-center mb-6 text-[1.2rem] text-[#1C2A44]">{p.icon}</div>
              <h4 className="font-[DM_Serif_Display,Georgia,serif] text-[1.25rem] text-[#1C2A44] mb-1">{p.title}</h4>
              <p className="font-[JetBrains_Mono,monospace] text-[0.7rem] tracking-[0.1em] uppercase text-[#D4956A] mb-4">{p.sub}</p>
              <p className="text-[0.9rem] text-[#5A6A7A] leading-[1.75] font-light">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-bg relative px-8 py-32 text-center overflow-hidden">
        <div className="relative z-10 reveal">
          <p className="font-[JetBrains_Mono,monospace] text-[0.72rem] font-medium tracking-[0.2em] uppercase text-[#D4956A] mb-5">Start Your Expedition</p>
          <h2 className="font-[DM_Serif_Display,Georgia,serif] text-[clamp(2.5rem,5vw,4rem)] text-[#1C2A44] mb-4">Every Great Company Starts<br/>With a Single Step North.</h2>
          <p className="text-[1.1rem] text-[#5A6A7A] font-light max-w-[480px] mx-auto leading-[1.7] mb-10">Whether you're at zero or scaling past ten — we're ready to walk with you.</p>
          <Link href="/services" className="inline-flex items-center gap-3 font-[Outfit,sans-serif] font-semibold text-[0.88rem] tracking-[0.04em] text-[#F9FBFD] bg-[#1C2A44] px-11 py-[1.1rem] rounded-lg transition-all duration-[400ms] hover:bg-[#2A3D5C] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(28,42,68,0.2)]">
            Explore More
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}
