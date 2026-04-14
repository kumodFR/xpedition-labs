'use client'
import { useState, useCallback } from 'react'

type ServiceKey = 'compass' | 'trek' | 'autopilot'
type TierKey = 'lite' | 'standard' | 'deep'

interface CardData {
  name: string
  desc: string
  tag: string
  price: string
  deliverables: string[]
}

const tierData: Record<ServiceKey, Record<TierKey, CardData[]>> = {
  compass: {
    lite: [
      { name: 'Desktop Research & Assumption Audit', desc: 'Secondary research across your market to surface key assumptions. We deliver a structured hypothesis log highlighting the riskiest bets your idea rests on — before any workshop time is spent.', deliverables: ['Market landscape brief','Hypothesis log (10–15 assumptions ranked)','Risk heat-map'], tag: 'Research', price: '₹75K' },
      { name: 'Single Validation Workshop', desc: 'One focused 3-hour workshop covering problem-market fit and initial customer willingness to pay. Designed for founders who need a fast sanity check before committing further resources.', deliverables: ['Problem-market fit scorecard','WTP signal assessment','Session recording & notes'], tag: 'Workshop', price: '₹1.2L' },
      { name: 'Summary Recommendation', desc: 'A concise findings email with a clear go / pivot / stop recommendation backed by evidence gathered during research and the workshop. Enough clarity to decide your next move.', deliverables: ['Findings email with recommendation','Key risk summary','Suggested next steps'], tag: 'Signal', price: '₹50K' }
    ],
    standard: [
      { name: 'Hypothesis Mapping & Research', desc: 'We conduct deep secondary research across your market, map every assumption your idea rests on, and build a structured hypothesis log before a single workshop begins. No wasted sessions — every conversation is loaded.', deliverables: ['Full market & competitor scan','Hypothesis log (25+ assumptions)','Stakeholder interview guide','Pre-workshop briefing deck'], tag: 'Pre-workshop', price: '₹1.5L' },
      { name: 'Workshop-Led Validation', desc: 'Four focused workshops covering problem-market fit, customer discovery and willingness to pay, unit economics and revenue model stress-testing, and GTM entry point alongside team readiness. Evidence gathered. Assumptions challenged.', deliverables: ['4 structured workshops (3 hrs each)','Customer discovery framework','Unit economics model','GTM entry-point map'], tag: 'Validation', price: '₹3L' },
      { name: 'Go / Pivot / Stop Signal', desc: 'All findings synthesised into a PDF findings report with a clear, evidence-backed recommendation — go, pivot, or stop. If the signal is green, a 90-day next-steps plan is ready to move. A debrief session closes the engagement.', deliverables: ['PDF findings report','Evidence-backed recommendation','90-day action plan','Founder debrief session'], tag: 'Recommendations', price: '₹1.5L' }
    ],
    deep: [
      { name: 'Primary + Secondary Deep Research', desc: "Beyond desk research — we conduct expert interviews, customer discovery calls, and competitive teardowns. A full intelligence package mapping market dynamics, adjacent opportunities, and latent demand signals your competitors aren't tracking.", deliverables: ['Expert interview transcripts (5–8)','Competitive teardown deck','Demand signal analysis','TAM/SAM/SOM model','Opportunity map'], tag: 'Intelligence', price: '₹3L' },
      { name: 'Six Workshops + Prototype Testing', desc: 'Six intensive workshops plus real prototype testing with target users. Covers problem-market fit, customer segments, pricing architecture, unit economics under multiple scenarios, GTM sequencing, and founder-market fit assessment. Real signals from real users.', deliverables: ['6 workshops + 2 prototype test sessions','Clickable prototype','User feedback synthesis','Pricing architecture model','Founder-market fit assessment'], tag: 'Deep Validation', price: '₹5L' },
      { name: 'Strategy Deck + Investor-Ready Brief', desc: 'A full strategy deck, 90-day roadmap with milestones, and an investor-ready brief — everything needed to walk into a room with conviction. Includes two rounds of revision and a live presentation rehearsal.', deliverables: ['Full strategy deck (40+ slides)','90-day milestone roadmap','Investor-ready 1-pager','2 revision rounds','Presentation rehearsal session'], tag: 'Investor-Ready', price: '₹3.5L' }
    ]
  },
  trek: {
    lite: [
      { name: 'Monthly GTM Advisory', desc: 'Structured monthly sessions focused on channel strategy, pricing validation, and distribution design. You get a GTM playbook tailored to your stage, plus async support between sessions for quick decisions.', deliverables: ['Monthly strategy session (2 hrs)','GTM playbook document','Async support (email/chat)','Quarterly review deck'], tag: 'Growth', price: '₹1L/mo' },
      { name: 'Quarterly Ops & Finance Review', desc: 'Quarterly deep-dives into operational health — SOP coverage, unit economics tracking, burn rate analysis, and team utilisation. Templates and frameworks provided; execution stays with your team.', deliverables: ['Quarterly ops review session','SOP templates library','Unit economics tracker','Burn management dashboard'], tag: 'Operations', price: '₹75K/qtr' },
      { name: 'Fundraise Prep Package', desc: 'Investor narrative review, data room checklist, and pitch deck feedback. Designed for founders who have the story but need it sharpened for investor conversations.', deliverables: ['Pitch deck review (2 rounds)','Data room checklist','Investor narrative feedback','Mock Q&A session'], tag: 'Capital', price: '₹1.5L' }
    ],
    standard: [
      { name: 'GTM, Growth & Product', desc: 'Channel strategy, pricing models, distribution design, and the path to the first ten paying customers. Alongside this, product roadmap prioritisation, user feedback loops, and competitive positioning — built to compound.', deliverables: ['Weekly growth sprints','Channel experiment pipeline','Pricing model + scenario analysis','Product roadmap (quarterly)','Competitive positioning map'], tag: 'Growth', price: '₹2.5L/mo' },
      { name: 'Operations, Finance & People', desc: 'SOPs, field systems, and process infrastructure built once and deployed properly. Unit economics discipline, burn management, and cash flow rigour. Team design, hiring plan, and the performance frameworks that hold a growing company together.', deliverables: ['Full SOP library','Finance operating model','Hiring plan + JDs','Performance framework','Weekly ops sync'], tag: 'Operations', price: '₹2L/mo' },
      { name: 'Fundraising & Milestone Close', desc: 'Investor narrative, data room, and warm introductions. Each Trek milestone is defined upfront and validated on completion — commercial tranches released as you progress. Equity is a natural outcome of deep engagement, never pitched.', deliverables: ['Investor deck + narrative','Data room setup','Warm investor intros (5–10)','Term sheet review','Milestone validation framework'], tag: 'Capital', price: '₹3L' }
    ],
    deep: [
      { name: 'Embedded Growth Team', desc: 'An Xpedition growth operator embedded in your team — running weekly sprints, managing channel experiments, owning conversion funnels, and building the growth engine with you, not just advising on it. Live analytics dashboard included.', deliverables: ['Embedded growth operator','Weekly sprint execution','Live analytics dashboard','Channel A/B testing','Monthly growth report to founders'], tag: 'Growth', price: '₹4.5L/mo' },
      { name: 'Full Ops + Fractional CFO', desc: 'Embedded operations manager plus fractional CFO. From field-level SOPs to board-level financial reporting — every system built, monitored, and iterated. Hiring pipeline fully managed through offer stage.', deliverables: ['Embedded ops manager','Fractional CFO (8 hrs/week)','Full hiring pipeline management','Board-ready financial reports','Cash flow forecasting model'], tag: 'Operations', price: '₹4L/mo' },
      { name: 'End-to-End Fundraise + Board Setup', desc: 'Complete fundraise management — from narrative crafting through term sheet negotiation to close. Post-raise, we set up board governance, investor reporting cadence, and the operating rhythm that institutional investors expect.', deliverables: ['Full fundraise management','Term sheet negotiation support','Board governance setup','Investor reporting framework','Post-raise operating rhythm'], tag: 'Capital', price: '₹5L + success fee' }
    ]
  },
  autopilot: {
    lite: [
      { name: 'AI Monitoring Dashboards', desc: 'AI agents connected to your core business data — surfacing anomalies, trends, and signals across three functions of your choice. Weekly intelligence digest delivered automatically. A watching layer that never sleeps.', deliverables: ['AI agents on 3 functions','Weekly intelligence digest','Anomaly detection alerts','Quarterly insight report'], tag: 'Intelligence', price: '₹2L/mo' },
      { name: 'Strategy Calls + Async Support', desc: "Bi-weekly strategy calls with an Xpedition operator, informed by AI-surfaced insights. Between calls, async support for decisions that can't wait. The lightest touch of the human layer, backed by full intelligence.", deliverables: ['Bi-weekly strategy calls','AI-powered briefing before each call','Async decision support','Monthly executive summary'], tag: 'Advisory', price: '₹1.5L/mo' },
      { name: 'Autopilot Onboarding', desc: 'Transition from Trek to Autopilot — connecting your systems, training AI agents on your data, and establishing the intelligence baseline. A one-time setup that becomes the foundation for always-on operations.', deliverables: ['System integration (5 platforms)','AI agent training & calibration','Intelligence baseline report','Handover documentation'], tag: 'Setup', price: '₹3L one-time' }
    ],
    standard: [
      { name: 'Embedded Intelligence Across Every Function', desc: 'AI agents connected to company data, email, platforms, and field systems — synthesising signals across GTM, operations, finance, people, product, fundraising, brand, and strategy. Always on. Always watching. Surfacing what matters before it becomes a problem.', deliverables: ['AI agents across all 8 functions','Real-time signal synthesis','Proactive alert system','Monthly intelligence report','Quarterly strategy recalibration'], tag: 'Intelligence', price: '₹4L/mo' },
      { name: 'The Xpedition Human Layer', desc: 'Xpedition team embedded across functions — handling judgment, execution, and strategy that AI cannot. Indistinguishable to the CXO whether an insight came from an agent or a person. One function. Running the business together, every day.', deliverables: ['Embedded operator (20 hrs/week)','Weekly execution sprints','Cross-functional coordination','Escalation handling','CXO briefing pack'], tag: 'Execution', price: '₹3.5L/mo' },
      { name: 'From Trek to Autopilot', desc: "Autopilot is not a cold engagement — it activates from Trek. The intelligence layer built during co-travel becomes the operating system. Compass validated the idea. Trek built the company. Autopilot runs it at full intelligence. You've always been navigating toward this.", deliverables: ['Full system integration','Intelligence layer activation','Operating rhythm design','Team training & handover','Transition support (4 weeks)'], tag: 'CAIO Function', price: '₹5L one-time' }
    ],
    deep: [
      { name: 'Custom AI + Predictive Forecasting', desc: "Custom-trained models on your proprietary data — going beyond monitoring into prediction. Revenue forecasting, churn prediction, demand sensing, and scenario modelling. Your business doesn't just have intelligence; it has foresight.", deliverables: ['Custom ML models (3–5)','Predictive dashboards','Scenario modelling engine','Real-time anomaly detection','Monthly model retraining'], tag: 'Deep Intelligence', price: '₹7L/mo' },
      { name: 'Full-Time Embedded CAIO Team', desc: "A dedicated Xpedition team functioning as your Chief AI Officer's office — strategy, execution, and judgment across every function, every day. 24/7 operational coverage. Board-level reporting. The full weight of Xpedition inside your company.", deliverables: ['Dedicated team (3–4 people)','24/7 ops coverage','Board-level reporting','Function head coordination','Quarterly business reviews'], tag: 'Full Ops', price: '₹8L/mo' },
      { name: 'Digital Twin + Autonomous Ops', desc: 'A complete digital twin of your operations — every process modelled, every metric tracked, every decision informed. Autonomous workflows handle routine operations; humans focus on strategy and relationships. The final form of Autopilot.', deliverables: ['Full digital twin build','Autonomous workflow engine','Decision intelligence layer','Executive command centre','Annual strategy offsites (2)'], tag: 'Autonomous', price: '₹10L/mo + equity' }
    ]
  }
}

// Card SVG icons per service
const compassIcons = [
  <svg key="c1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="12" x2="15" y2="14"/></svg>,
  <svg key="c2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  <svg key="c3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
]
const trekIcons = [
  <svg key="t1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><path d="M3 12h18M3 6h18M3 18h18"/></svg>,
  <svg key="t2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  <svg key="t3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>,
]
const autopilotIcons = [
  <svg key="a1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  <svg key="a2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/><line x1="20" y1="8" x2="20" y2="14"/></svg>,
  <svg key="a3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
]

const serviceIcons: Record<ServiceKey, JSX.Element[]> = {
  compass: compassIcons,
  trek: trekIcons,
  autopilot: autopilotIcons,
}

const accentColors: Record<ServiceKey, string> = {
  compass: '#2dd4a0',
  trek: '#e0729a',
  autopilot: '#c8921a',
}

const cardBgs: Record<ServiceKey, string> = {
  compass: 'bg-[#0e2235]',
  trek: 'bg-[#1c1508]',
  autopilot: 'bg-[#1e0d18]',
}

const dotColors: Record<ServiceKey, string> = {
  compass: 'bg-[#2dd4a0]',
  trek: 'bg-[#e0729a]',
  autopilot: 'bg-[#c8921a]',
}

const deliverablesClass: Record<ServiceKey, string> = {
  compass: 'deliverables-compass',
  trek: 'deliverables-trek',
  autopilot: 'deliverables-autopilot',
}

const tierBtnActive: Record<ServiceKey, string> = {
  compass: 'text-[#e8e6e0] border-[#2dd4a0] bg-[rgba(45,212,160,0.1)]',
  trek: 'text-[#e8e6e0] border-[#e0729a] bg-[rgba(224,114,154,0.1)]',
  autopilot: 'text-[#e8e6e0] border-[#c8921a] bg-[rgba(200,146,26,0.1)]',
}

const serviceLabels: Record<ServiceKey, { barLabel: string; barRight: string }> = {
  compass: { barLabel: 'Xpedition Compass — 0 → 1', barRight: 'Validate before you build' },
  trek: { barLabel: 'Xpedition Trek — 0→1 · 1→10', barRight: 'A focused journey with a destination' },
  autopilot: { barLabel: 'Xpedition Autopilot — 10 → 100', barRight: 'The embedded CAIO function' },
}

export default function ServicesPage() {
  const [activeService, setActiveService] = useState<ServiceKey>('compass')
  const [activeTiers, setActiveTiers] = useState<Record<ServiceKey, TierKey>>({
    compass: 'standard',
    trek: 'standard',
    autopilot: 'standard',
  })
  const [fading, setFading] = useState(false)

  const setTier = useCallback((service: ServiceKey, tier: TierKey) => {
    setFading(true)
    setTimeout(() => {
      setActiveTiers(prev => ({ ...prev, [service]: tier }))
      setFading(false)
    }, 300)
  }, [])

  const cards = tierData[activeService][activeTiers[activeService]]
  const icons = serviceIcons[activeService]
  const accent = accentColors[activeService]
  const cardBg = cardBgs[activeService]
  const dotColor = dotColors[activeService]
  const delClass = deliverablesClass[activeService]
  const labels = serviceLabels[activeService]
  const tierActive = tierBtnActive[activeService]
  const currentTier = activeTiers[activeService]

  return (
    <div className="bg-[#0d1b2e] text-[#e8e6e0] min-h-screen font-[Inter,system-ui,sans-serif] font-light leading-[1.7] antialiased overflow-x-hidden">
      {/* Compass rose */}
      <div className="fixed right-7 top-1/2 -translate-y-1/2 flex flex-col items-center gap-5 z-50 pointer-events-none max-md:hidden">
        {['N','E','W','S'].map((d, i) => (
          <span key={d} className={`text-[9px] font-medium tracking-[0.1em] uppercase ${i === 0 ? 'text-[#2dd4a0]' : 'text-[rgba(232,230,224,0.28)]'}`}
                style={{ writingMode: 'vertical-rl' }}>{d}</span>
        ))}
      </div>

      {/* HERO */}
      <section className="pt-[140px] px-20 pb-20 relative border-b border-white/[0.07] max-lg:px-10 max-md:pt-[90px] max-md:px-6 max-md:pb-10">
        <p className="flex items-center gap-4 text-[10px] font-medium text-[#2dd4a0] tracking-[0.2em] uppercase mb-8 before:content-[''] before:w-8 before:h-px before:bg-[#2dd4a0]">
          Our Services
        </p>
        <h1 className="font-[Cormorant_Garamond,Georgia,serif] font-light leading-[0.97] tracking-[-0.025em] text-[#e8e6e0] mb-8 max-w-[800px] text-[clamp(56px,7.5vw,104px)]">
          From <em className="italic text-[#c8921a]">Idea</em> to<br/>Full Intelligence
        </h1>
        <p className="text-[15px] font-light text-[rgba(232,230,224,0.52)] leading-[1.8] max-w-[520px] mb-12">
          Three services. One journey. We don&apos;t advise from the outside — we travel with you from the moment an idea needs validation, through the hard terrain of building, to the peak where your business runs at full intelligence.
        </p>

        {/* Service selector */}
        <div className="grid grid-cols-3 gap-px bg-white/[0.11] mt-12 max-md:grid-cols-1">
          {[
            { key: 'compass' as const, num: '01', label: '0 → 1', name: 'Compass', tagline: 'Validate before you build.', desc: 'A structured 8-week validation service — workshop-led, evidence-backed, and designed to give founders a clear go / pivot / stop signal before a single rupee is committed to building.', bg: 'bg-[#0e2235]', accent: '#2dd4a0' },
            { key: 'trek' as const, num: '02', label: '0→1 · 1→10', name: 'Trek', tagline: 'A focused journey with a destination.', desc: 'Deep co-travel with the founder or management team — milestone by milestone, across GTM, operations, finance, people, and fundraising. We earn when you progress.', bg: 'bg-[#1c1508]', accent: '#e0729a' },
            { key: 'autopilot' as const, num: '03', label: '10 → 100', name: 'Autopilot', tagline: "You've always been navigating toward this.", desc: 'An embedded CAIO function — AI agents and the Xpedition team operating as one, indistinguishable to the CXO. Every business function covered. Always on.', bg: 'bg-[#1e0d18]', accent: '#c8921a' },
          ].map((s) => {
            const isActive = activeService === s.key
            return (
              <div key={s.key}
                className={`${s.bg} flex flex-col px-9 pt-8 cursor-pointer transition-[filter] duration-200 ${isActive ? 'brightness-110' : 'hover:brightness-105'}`}
                onClick={() => setActiveService(s.key)}>
                <div className="flex gap-5 items-start pb-7">
                  <span className="font-[Cormorant_Garamond,Georgia,serif] text-[36px] font-light leading-none shrink-0 mt-1"
                        style={{ color: isActive ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)' }}>
                    {s.num}
                  </span>
                  <div>
                    <span className="block text-[9.5px] font-medium tracking-[0.12em] uppercase mb-2" style={{ color: s.accent }}>{s.label}</span>
                    <p className="font-[Cormorant_Garamond,Georgia,serif] text-[22px] font-normal text-[#e8e6e0] leading-[1.2] mb-1">{s.name}</p>
                    <p className="font-[Cormorant_Garamond,Georgia,serif] text-[13px] italic text-[rgba(232,230,224,0.52)] mb-3">{s.tagline}</p>
                    <p className="text-[12.5px] font-light text-[rgba(232,230,224,0.52)] leading-[1.65]">{s.desc}</p>
                  </div>
                </div>
                <div className="h-[2.5px] mt-auto transition-colors duration-200"
                     style={{ background: isActive ? s.accent : 'transparent' }} />
              </div>
            )
          })}
        </div>
      </section>

      {/* Service panel */}
      {/* Phase bar */}
      <div className={`${cardBg} flex items-center justify-between px-20 py-4 border-b border-white/[0.07] max-lg:px-10 max-md:px-6`}>
        <div className="flex items-center gap-2.5 text-[10px] font-medium text-[rgba(232,230,224,0.28)] tracking-[0.14em] uppercase">
          <span className={`w-1 h-1 rounded-full ${dotColor}`} />
          {labels.barLabel}
        </div>
        <div className="text-[10px] text-[rgba(232,230,224,0.28)] tracking-[0.12em] uppercase max-md:hidden">{labels.barRight}</div>
      </div>

      {/* Tier toggle */}
      <div className={`${cardBg} flex items-center gap-1 px-20 py-2.5 border-b border-white/[0.07] max-lg:px-10 max-md:px-6 max-md:flex-wrap`}>
        {(['lite', 'standard', 'deep'] as TierKey[]).map((t) => (
          <button key={t}
            onClick={() => setTier(activeService, t)}
            className={`font-[Inter,system-ui,sans-serif] text-[11px] font-medium tracking-[0.06em] uppercase px-[18px] py-1.5 rounded-full border cursor-pointer transition-all duration-200
              ${currentTier === t
                ? tierActive
                : 'border-white/[0.11] bg-transparent text-[rgba(232,230,224,0.28)] hover:text-[#e8e6e0] hover:border-white/[0.2]'
              }`}
          >
            {t === 'deep' ? 'Deep Dive' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div className={`grid grid-cols-3 gap-px bg-white/[0.07] border-b border-white/[0.07] max-lg:grid-cols-2 max-md:grid-cols-1 ${fading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
        {cards.map((card, i) => (
          <div key={`${activeService}-${currentTier}-${i}`} className={`${cardBg} relative flex flex-col p-10 transition-[filter] duration-200 hover:brightness-110`}>
            <span className="absolute top-7 right-8 font-[Cormorant_Garamond,Georgia,serif] text-[48px] font-light text-white/[0.06] leading-none pointer-events-none select-none">
              0{i + 1}
            </span>
            {/* Icon */}
            <div className="w-9 h-9 mb-5 opacity-70" style={{ color: accent }}>
              {icons[i]}
            </div>
            <h3 className="text-[16px] font-medium text-[#e8e6e0] leading-[1.3] mb-2">{card.name}</h3>
            {/* Price */}
            <div className="font-[Cormorant_Garamond,Georgia,serif] text-[20px] font-normal text-[#e8e6e0] mb-2.5 leading-[1.2]">
              {card.price} <span className="font-[Inter,system-ui,sans-serif] text-[11px] font-light text-[rgba(232,230,224,0.28)] tracking-[0.02em]">/ engagement</span>
            </div>
            <p className="text-[13px] font-light text-[rgba(232,230,224,0.52)] leading-[1.75] flex-1 mb-4">{card.desc}</p>
            {/* Deliverables */}
            <ul className={`${delClass} text-[12px] font-normal text-[rgba(232,230,224,0.52)] leading-[1.8] mb-4 pl-0 list-none`}>
              {card.deliverables.map((d, j) => (
                <li key={j}>{d}</li>
              ))}
            </ul>
            <span className="self-start text-[9.5px] font-medium tracking-[0.1em] uppercase px-2.5 py-1 border border-white/[0.11] text-[rgba(232,230,224,0.28)] transition-all duration-200 hover:text-[#e8e6e0] hover:border-white/[0.2]">
              {card.tag}
            </span>
          </div>
        ))}
      </div>

      {/* Closing quote */}
      <div className="max-w-[800px] mx-auto px-20 py-20 border-b border-white/[0.07] text-center max-lg:px-10 max-md:px-6 max-md:py-12">
        <blockquote className="font-[Cormorant_Garamond,Georgia,serif] font-light italic text-[#e8e6e0] leading-[1.5] text-[clamp(22px,3vw,36px)]">
          &quot;Every service is available as a standalone engagement or as part of the full Xpedition journey — from Compass to Trek to Autopilot.&quot;
        </blockquote>
      </div>

      {/* CTA */}
      <section className="px-20 py-28 text-center max-lg:px-10 max-md:px-6 max-md:py-12">
        <span className="block font-[Cormorant_Garamond,Georgia,serif] text-[12px] text-white/[0.07] tracking-[0.55em] mb-8">北 極 星 · 探 検</span>
        <h2 className="font-[Cormorant_Garamond,Georgia,serif] font-light text-[#e8e6e0] leading-[1.1] mb-4 text-[clamp(36px,5vw,60px)]">
          Every great company starts<br/>with a single step <em className="italic text-[#c8921a]">north.</em>
        </h2>
        <p className="text-[15px] text-[rgba(232,230,224,0.52)] font-light mx-auto mb-10 max-w-[400px] leading-[1.75]">
          Whether you&apos;re at zero or scaling past ten — we&apos;re ready to walk with you.
        </p>
        <a href="https://mail.google.com/mail/?view=cm&to=ypr@xpeditionlabs.com"
           target="_blank" rel="noopener"
           className="inline-block text-[13px] font-normal text-[#0d1b2e] bg-[#e8e6e0] px-8 py-3 tracking-[0.06em] transition-all duration-200 hover:bg-[#c8921a] hover:text-white">
          Start a Conversation
        </a>
      </section>
    </div>
  )
}
