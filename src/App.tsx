import { useState, useEffect, useRef } from 'react'
import LegalPage from './LegalPage'

const WA_LINK = `https://wa.me/971555617442?text=${encodeURIComponent("Assalamu Alaikum, I would like to enquire about your online Qur'an classes.")}`

// ─── Professional colour palette ────────────────────────────────────────────
const BLACK       = '#122056'   // page text colour (2766 C)
const YELLOW      = '#5B65DC'   // accent (2726 C) – buttons, links, cards
const YELLOW_LT   = '#EEEFFD'   // secondary buttons / list elements
const ACCENT_HOVER = '#4A54C4'  // darker accent for hover states
const CREAM       = '#FAFAFD'   // page background
const PINK        = '#EEEFFD'
const CYAN        = '#E4E7FB'
const HEADING     = '#122056'
const BODY        = '#122056'
const MUTED       = '#6D7697'
const BORDER_LT   = '#E7E9FB'
const BORDER_DK   = '#122056'
const YELLOW_TINT = 'rgba(91,101,220,0.30)'

// Compatibility aliases (kept so the rest of the file reads the new palette)
const GOLD       = YELLOW
const GOLD_LIGHT = YELLOW_LT
const GOLD_PALE  = CREAM
const DARK       = BLACK
const GREEN      = BLACK
const BORDER     = YELLOW_TINT

// ─── Utilities ────────────────────────────────────────────────────────────────

// Scroll reveal — fades/slides elements in and out as they cross the viewport
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => setVis(e.isIntersecting),
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' },
    )
    obs.observe(el); return () => obs.disconnect()
  }, [])
  return { ref, vis }
}

type RevealDir = 'up' | 'down' | 'left' | 'right' | 'zoom'

function Reveal({ children, delay = 0, dir = 'up' }: { children: React.ReactNode; delay?: number; dir?: RevealDir }) {
  const { ref, vis } = useReveal()
  const hidden: Record<RevealDir, string> = {
    up: 'translateY(32px)',
    down: 'translateY(-32px)',
    left: 'translateX(48px)',
    right: 'translateX(-48px)',
    zoom: 'scale(0.88)',
  }
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'none' : hidden[dir],
      transition: `opacity 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms, filter 0.7s ease ${delay}ms`,
      willChange: 'opacity, transform',
      filter: vis ? 'blur(0)' : 'blur(5px)',
    }}>
      {children}
    </div>
  )
}

// Animated count-up when scrolled into view
function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [val, setVal] = useState(0)
  const [started, setStarted] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setStarted(true); obs.disconnect() }
    }, { threshold: 0.4 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  useEffect(() => {
    if (!started) return
    const dur = 1400
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(eased * to))
      if (p < 1) requestAnimationFrame(tick)
    }
    const raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [started, to])
  return <span ref={ref}>{val}{suffix}</span>
}

// Back to top floating button
function BackToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 420)
    window.addEventListener('scroll', fn, { passive: true })
    fn()
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300"
      style={{
        background: GOLD,
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 8px 24px rgba(91,101,220,0.4)',
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.7)',
        pointerEvents: show ? 'auto' : 'none',
        fontFamily: 'var(--font-sans)',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = ACCENT_HOVER; e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)' }}
      onMouseLeave={e => { e.currentTarget.style.background = GOLD; e.currentTarget.style.transform = 'translateY(0) scale(1)' }}>
      <i className="fas fa-arrow-up" />
    </button>
  )
}

// Section eyebrow label
function EyeBrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  const c = dark ? GOLD_LIGHT : GOLD
  const bg = dark ? 'rgba(91,101,220,0.15)' : 'rgba(91,101,220,0.1)'
  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-4" style={{ background: bg, border: `1px solid ${dark ? 'rgba(238,239,253,0.3)' : 'rgba(91,101,220,0.25)'}` }}>
      {/* <div className="w-1.5 h-1.5 rounded-full" style={{ background: c }} /> */}
      <span className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: c, fontFamily: 'var(--font-sans)' }}>{children}</span>
    </div>
  )
}

// Buttons
function BtnSolid({ href, children }: { href: string; children: React.ReactNode }) {
  const [h, setH] = useState(false)
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="btn-shine inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold rounded-xl no-underline transition-all duration-300"
      style={{ background: h ? ACCENT_HOVER : GOLD, color: '#fff', boxShadow: h ? '0 10px 24px rgba(91,101,220,0.4)' : '0 4px 14px rgba(91,101,220,0.25)', transform: h ? 'translateY(-2px)' : 'translateY(0)', fontFamily: 'var(--font-sans)' }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>{children}</a>
  )
}

function BtnOutline({ href, children, dark = false }: { href: string; children: React.ReactNode; dark?: boolean }) {
  const [h, setH] = useState(false)
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="btn-shine inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold rounded-xl no-underline transition-all duration-300"
      style={{ border: `1.5px solid ${h ? ACCENT_HOVER : (dark ? '#fff' : GOLD)}`, color: h ? ACCENT_HOVER : (dark ? '#fff' : GOLD), background: h ? 'rgba(91,101,220,0.08)' : 'transparent', transform: h ? 'translateY(-2px)' : 'translateY(0)', fontFamily: 'var(--font-sans)' }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>{children}</a>
  )
}

function PillEnroll({ href, children }: { href: string; children: React.ReactNode }) {
  const [h, setH] = useState(false)
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="btn-shine inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-full no-underline transition-all duration-200"
      style={{ background: h ? ACCENT_HOVER : GOLD, color: '#fff', boxShadow: h ? '0 6px 16px rgba(91,101,220,0.35)' : 'none', transform: h ? 'translateY(-2px)' : 'translateY(0)', fontFamily: 'var(--font-sans)' }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>{children}</a>
  )
}

// Star row
function Stars({ color = GOLD }: { color?: string }) {
  return (
    <span className="flex gap-0.5">
      {[...Array(5)].map((_, i) => <i key={i} className="fas fa-star text-xs" style={{ color }} />)}
    </span>
  )
}

// ─── Navbar ────────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = [
    { label: 'Home', href: '#home' },
    { label: 'Courses', href: '#classes' },
    { label: 'Teacher', href: '#teacher' },
    { label: 'FAQ', href: '#faq' },
  ]

  return (
    <nav className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{ background: scrolled ? 'rgba(255,255,255,0.97)' : '#fff', backdropFilter: scrolled ? 'blur(16px)' : 'none', boxShadow: scrolled ? '0 1px 0 rgba(0,0,0,0.08)' : '0 1px 0 #f3f4f6' }}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between" style={{ height: 68 }}>
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2.5 no-underline">
          {/* <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: GOLD, boxShadow: '0 4px 12px rgba(91,101,220,0.3)' }}>
            <i className="fas fa-book-open text-sm" style={{ color: '#fff' }} />
          </div> */}
          <div style={{ lineHeight: 1.2 }}>
            <div className="font-extrabold tracking-[0.1em] text-sm" style={{ color: '#122056', fontFamily: 'var(--font-sans)' }}>QARI OSAMA</div>
            <div className="font-semibold text-[10px] tracking-[0.1em]" style={{ color: GOLD, fontFamily: 'var(--font-sans)' }}>ALWAJDI</div>
          </div>
        </a>

        {/* Center links */}
        <div className="hidden lg:flex items-center gap-8">
          {links.map(l => <NLink key={l.href} href={l.href}>{l.label}</NLink>)}
        </div>

        {/* Right */}
        <div className="hidden lg:flex items-center gap-3">
          <BtnSolid href={WA_LINK}>Get Started</BtnSolid>
        </div>

        {/* Hamburger */}
        <button className="lg:hidden p-2 flex flex-col gap-1.5" onClick={() => setOpen(v => !v)} aria-label="Menu">
          {[0,1,2].map(i => <span key={i} className="block h-0.5 rounded" style={{ background: DARK, width: i === 2 ? '65%' : '100%' }} />)}
        </button>
      </div>

      {/* Mobile menu */}
      <div className="lg:hidden overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? '400px' : '0', background: '#fff', borderBottom: open ? '1px solid #f3f4f6' : 'none' }}>
        <div className="px-6 py-4 flex flex-col gap-1">
          {links.map(l => (
            <a key={l.href} href={l.href} className="py-3 text-sm font-medium border-b no-underline"
              style={{ color: '#122056', borderColor: '#FAFAFD', fontFamily: 'var(--font-sans)' }} onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          <div className="mt-4"><BtnSolid href={WA_LINK}>Get Started</BtnSolid></div>
        </div>
      </div>
    </nav>
  )
}

function NLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [h, setH] = useState(false)
  return (
    <a href={href} className="nav-link text-sm font-medium no-underline transition-colors duration-150"
      style={{ color: h ? GOLD : '#122056', fontFamily: 'var(--font-sans)' }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>{children}</a>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section id="home" className="relative overflow-hidden" style={{ background: '#fff', paddingTop: 68 }}>
      {/* Decorative animated background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full anim-gradient opacity-60" style={{ background: 'radial-gradient(circle, rgba(91,101,220,0.18) 0%, transparent 70%)' }} />
        <div className="absolute top-1/3 -left-24 w-80 h-80 rounded-full anim-float-slow opacity-50" style={{ background: 'radial-gradient(circle, rgba(91,101,220,0.14) 0%, transparent 70%)' }} />
        <div className="absolute right-[10%] top-[18%] w-2 h-2 rounded-full anim-twinkle" style={{ background: GOLD }} />
        <div className="absolute left-[8%] top-[28%] w-1.5 h-1.5 rounded-full anim-twinkle" style={{ background: GOLD, animationDelay: '1s' }} />
        <div className="absolute left-[45%] bottom-[12%] w-2 h-2 rounded-full anim-twinkle" style={{ background: ACCENT_HOVER, animationDelay: '2s' }} />
        <div className="absolute right-[38%] top-[60%] w-1.5 h-1.5 rounded-full anim-twinkle" style={{ background: GOLD, animationDelay: '0.5s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-24">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-14 items-center">

          {/* Left */}
          <Reveal dir="up">
            <EyeBrow>Online Qur'an Classes · Dubai, UAE</EyeBrow>
            <h1 className="font-extrabold leading-[1.07] mb-5" style={{ fontFamily: 'var(--font-sans)', color: '#122056', fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}>
              Get World Class<br />
              Qur'an Lessons from<br />
              <span style={{ color: GOLD }}>World Class Teacher</span>
            </h1>
            <p className="text-lg leading-relaxed mb-8 max-w-lg" style={{ color: MUTED, fontFamily: 'var(--font-sans)' }}>
              Get quality Qur'an classes with Qari Osama Alwajdi. Now you can get the best Tajweed, Tilawah, Hifz and recitation lessons from anywhere in the world.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <BtnSolid href={WA_LINK}>Get Started →</BtnSolid>
              <a href="#classes" className="group-hoverable inline-flex items-center gap-3 text-sm font-semibold no-underline transition-colors duration-200" style={{ color: '#122056', fontFamily: 'var(--font-sans)' }}>
                <span className="icon-pop w-10 h-10 rounded-full flex items-center justify-center anim-bob" style={{ background: GOLD_PALE, border: `1px solid ${BORDER}` }}>
                  <i className="fas fa-play text-xs" style={{ color: GOLD }} />
                </span>
                How it works?
              </a>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2.5">
                  {[GOLD, ACCENT_HOVER, '#5F69DD'].map((c, i) => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold" style={{ background: c, boxShadow: '0 2px 6px rgba(91,101,220,0.25)' }}>
                      {['Q','S','A'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-sm font-bold" style={{ color: '#122056', fontFamily: 'var(--font-sans)' }}>Students Worldwide</div>
                  <Stars />
                </div>
              </div>
              <div className="hidden sm:block h-8 w-px bg-gray-200" />
              <div><div className="text-xl font-extrabold" style={{ color: GOLD, fontFamily: 'var(--font-sans)' }}><CountUp to={2} suffix="+" /></div><div className="text-xs" style={{ color: MUTED, fontFamily: 'var(--font-sans)' }}>Years Teaching</div></div>
              <div className="hidden sm:block h-8 w-px bg-gray-200" />
              <div><div className="text-xl font-extrabold" style={{ color: GOLD, fontFamily: 'var(--font-sans)' }}><CountUp to={4} /></div><div className="text-xs" style={{ color: MUTED, fontFamily: 'var(--font-sans)' }}>Courses Offered</div></div>
            </div>
          </Reveal>

          {/* Right — image card with floating chips */}
          <Reveal delay={120} dir="zoom">
            <div className="relative flex justify-center lg:justify-end">
              {/* Main image */}
              <div className="anim-float relative overflow-hidden rounded-3xl" style={{ width: '100%', maxWidth: 440, aspectRatio: '4/5', border: `1.5px solid ${BORDER}`, boxShadow: '0 24px 64px rgba(91,101,220,0.16)' }}>
                <img
                  src="https://images.unsplash.com/photo-1587617425953-9075d28b8c46?w=880&h=1100&fit=crop&auto=format"
                  alt="Qur'an on wooden stand"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(16,16,16,0.55) 0%, transparent 55%)' }} />
                {/* Name overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: GOLD_LIGHT, fontFamily: 'var(--font-sans)' }}>Qur'an Teacher & Reciter</div>
                  <div className="text-xl font-extrabold text-white" style={{ fontFamily: 'var(--font-sans)' }}>Qari Osama Alwajdi</div>
                  <div className="text-sm text-white/80 mt-0.5" style={{ fontFamily: 'var(--font-sans)' }}>Dubai, UAE</div>
                </div>
              </div>

              {/* Floating chip — top left (gold, Courselo yellow style) */}
              <div className="anim-bob absolute -left-6 top-10 px-4 py-3 rounded-2xl" style={{ background: GOLD, boxShadow: '0 8px 28px rgba(91,101,220,0.35)' }}>
                <div className="text-2xl font-extrabold leading-none" style={{ color: '#fff', fontFamily: 'var(--font-sans)' }}>2+</div>
                <div className="text-xs font-semibold mt-0.5" style={{ color: '#122056', fontFamily: 'var(--font-sans)' }}>Years<br/>Experience</div>
              </div>

              {/* Floating chip — bottom right (dark) */}
              <div className="anim-bob absolute -right-5 bottom-14 px-4 py-3 rounded-2xl" style={{ background: BLACK, boxShadow: '0 8px 28px rgba(0,0,0,0.2)', animationDelay: '0.6s' }}>
                <i className="fas fa-globe text-xl leading-none" style={{ color: GOLD_LIGHT }} />
                <div className="text-xs font-semibold mt-1 text-white" style={{ fontFamily: 'var(--font-sans)' }}>Students<br/>Worldwide</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ─── Trusted strip ─────────────────────────────────────────────────────────────

function TrustedStrip() {
  const countries = ['UAE', 'UK', 'USA', 'Saudi Arabia', 'Pakistan', 'Nigeria', 'Somalia']
  return (
    <section className="py-10 border-y" style={{ borderColor: '#E7E9FB' }}>
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-center mb-5" style={{ color: MUTED, fontFamily: 'var(--font-sans)' }}>
          Our Trusted Students · Proud to serve communities across the globe
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {countries.map((c, i) => (
            <span key={c} className="lift-card px-4 py-2 rounded-full text-sm font-medium cursor-default" style={{ background: '#FAFAFD', border: '1px solid #E7E9FB', color: '#122056', fontFamily: 'var(--font-sans)', animationDelay: `${i * 0.05}s`, transition: 'transform .3s ease, box-shadow .3s ease, border-color .3s ease, color .3s ease' }}>{c}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Feature Highlights (3-box row) ──────────────────────────────────────────

const HIGHLIGHTS = [
  { icon: 'fa-graduation-cap', iconBg: '#FFF7E6', iconColor: GOLD,    title: 'Best Tajweed Instruction',  desc: 'Learn accurate Qur\'anic recitation rules from an experienced, qualified teacher.' },
  { icon: 'fa-video',          iconBg: '#EEF2FF', iconColor: '#6366f1', title: 'Live Online Classes',         desc: 'Attend structured live sessions from anywhere in the world, day or night.' },
  { icon: 'fa-user',           iconBg: '#ECFDF5', iconColor: '#10b981', title: '1 to 1 Support',              desc: 'Personalized one-to-one sessions focused entirely on your learning needs.' },
]

function FeatureHighlights() {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200" style={{ border: '1px solid #E7E9FB', borderRadius: 16, overflow: 'hidden' }}>
          {HIGHLIGHTS.map((h, i) => (
            <Reveal key={h.title} delay={i * 70} dir={i % 2 === 0 ? 'up' : 'down'}>
              <div className="group-hoverable lift-card flex items-start gap-4 p-7 bg-white">
                <div className="icon-pop w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: h.iconBg }}>
                  <i className={`fas ${h.icon} text-lg`} style={{ color: h.iconColor }} />
                </div>
                <div>
                  <h3 className="text-base font-bold mb-1.5" style={{ color: '#122056', fontFamily: 'var(--font-sans)' }}>{h.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: MUTED, fontFamily: 'var(--font-sans)' }}>{h.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Classes (Our Popular Courses) ───────────────────────────────────────────

const ALL_COURSES = [
  {
    tag: 'tajweed',
    label: 'Tajweed',
    img: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=600&h=380&fit=crop&auto=format',
    imgAlt: 'Qur\'an book open',
    title: "Tajweed Fundamentals",
    desc: "Learn Tajweed rules step by step and develop accurate, beautiful Qur'anic recitation.",
    features: ["Makharij al-Huruf", "Recitation rules", "Correct pronunciation"],
    cta: "Enroll Now",
  },
  {
    tag: 'tilawah',
    label: 'Tashih Tilawah',
    img: 'https://images.unsplash.com/photo-1596125160970-6f02eeba00d3?w=600&h=380&fit=crop&auto=format',
    imgAlt: 'Qur\'an on prayer rug',
    title: "Tashih Tilawah",
    desc: "Correct your recitation, improve pronunciation and develop fluency and confidence.",
    features: ["Recitation correction", "Error identification", "Fluency development"],
    cta: "Enroll Now",
  },
  {
    tag: 'hifz',
    label: 'Hifz',
    img: 'https://images.unsplash.com/photo-1725007995235-6979cb34ff8e?w=600&h=380&fit=crop&auto=format',
    imgAlt: 'Open Qur\'an pages',
    title: "Hifz & Revision",
    desc: "Memorize, revise and strengthen your Qur'an with structured, consistent support.",
    features: ["Memorization plan", "Regular revision", "Progress tracking"],
    cta: "Start Hifz",
  },
  {
    tag: '1-to-1',
    label: '1-to-1',
    img: 'https://images.unsplash.com/photo-1670514862391-df20ad00b330?w=600&h=380&fit=crop&auto=format',
    imgAlt: 'Islamic architecture',
    title: "One-to-One Classes",
    desc: "Personal attention designed around your individual level, needs and learning goals.",
    features: ["Personalized lessons", "Children & adults", "Beginner friendly"],
    cta: "Book a Session",
  },
]

const TABS = ['All categories', 'Tajweed', 'Tashih Tilawah', 'Hifz', '1-to-1']
const TAB_MAP: Record<string, string> = { 'All categories': 'all', Tajweed: 'tajweed', 'Tashih Tilawah': 'tilawah', Hifz: 'hifz', '1-to-1': '1-to-1' }

function Classes() {
  const [active, setActive] = useState('All categories')
  const shown = active === 'All categories' ? ALL_COURSES : ALL_COURSES.filter(c => c.tag === TAB_MAP[active])

  return (
    <section id="classes" className="py-20 lg:py-24" style={{ background: '#FAFAFD' }}>
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-2"><EyeBrow>What You Will Learn</EyeBrow></div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-center mb-2" style={{ color: '#122056', fontFamily: 'var(--font-sans)' }}>Our popular courses</h2>
          <p className="text-center mb-10 max-w-xl mx-auto" style={{ color: MUTED, fontFamily: 'var(--font-sans)' }}>
            Structured Qur'an learning designed around your level, goals and pace.
          </p>

          {/* Tab filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {TABS.map(t => (
              <button key={t} onClick={() => setActive(t)}
                className={`tab-btn ${active === t ? 'tab-active' : ''} px-5 py-2.5 text-sm font-semibold rounded-full transition-all duration-200`}
                style={{
                  background: active === t ? GOLD : '#fff',
                  color: active === t ? '#fff' : '#122056',
                  border: active === t ? `1.5px solid ${GOLD}` : '1.5px solid #E7E9FB',
                  boxShadow: active === t ? '0 6px 14px rgba(91,101,220,0.25)' : 'none',
                  fontFamily: 'var(--font-sans)',
                }}
              >{t}</button>
            ))}
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {shown.map((c, i) => <CourseCard key={c.tag} c={c} delay={i * 75} />)}
        </div>

        <div className="text-center mt-10">
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
            className="see-more inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-bold no-underline transition-all duration-200"
            style={{ border: `1.5px solid ${GOLD}`, color: GOLD, background: '#fff', fontFamily: 'var(--font-sans)' }}>
            See More <i className="fas fa-arrow-right text-xs" />
          </a>
        </div>
      </div>
    </section>
  )
}

function CourseCard({ c, delay }: { c: typeof ALL_COURSES[0]; delay: number }) {
  const [hov, setHov] = useState(false)
  return (
    <Reveal delay={delay}>
      <div
        className="group-hoverable flex flex-col overflow-hidden rounded-2xl bg-white transition-all duration-300"
        style={{ border: `1px solid ${hov ? GOLD : '#E7E9FB'}`, boxShadow: hov ? '0 16px 40px rgba(91,101,220,0.18)' : '0 1px 4px rgba(0,0,0,0.05)', transform: hov ? 'translateY(-10px)' : 'translateY(0)', cursor: 'default' }}
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      >
        {/* Image */}
        <div className="relative overflow-hidden" style={{ height: 175 }}>
          <img src={c.img} alt={c.imgAlt} className="w-full h-full object-cover transition-transform duration-500" style={{ transform: hov ? 'scale(1.1) rotate(1deg)' : 'scale(1)' }} />
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold transition-transform duration-300" style={{ background: GOLD, color: '#fff', fontFamily: 'var(--font-sans)', transform: hov ? 'scale(1.08)' : 'scale(1)' }}>{c.label}</span>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-5">
          <h3 className="text-base font-bold mb-1.5 transition-colors duration-200" style={{ color: hov ? GOLD : '#122056', fontFamily: 'var(--font-sans)' }}>{c.title}</h3>
          <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: MUTED, fontFamily: 'var(--font-sans)' }}>{c.desc}</p>
          <ul className="space-y-1.5 mb-5">
            {c.features.map(f => (
              <li key={f} className="flex items-center gap-2 text-xs" style={{ color: '#122056', fontFamily: 'var(--font-sans)' }}>
                <i className="check-pop fas fa-check text-xs" style={{ color: GOLD }} />{f}
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold" style={{ color: MUTED, fontFamily: 'var(--font-sans)' }}>Online · 1-to-1</span>
            <PillEnroll href={WA_LINK}>{c.cta}</PillEnroll>
          </div>
        </div>
      </div>
    </Reveal>
  )
}

// ─── Teacher Section ──────────────────────────────────────────────────────────

function TeacherSection() {
  return (
    <section id="teacher" className="py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-3"><Reveal><EyeBrow>Your Teacher</EyeBrow></Reveal></div>
        <Reveal delay={40}><h2 className="text-4xl lg:text-5xl font-extrabold text-center mb-3" style={{ color: '#122056', fontFamily: 'var(--font-sans)' }}>Meet your highly skilled<br />Qur'an Teacher</h2></Reveal>
        <Reveal delay={80}><p className="text-center max-w-xl mx-auto mb-14" style={{ color: MUTED, fontFamily: 'var(--font-sans)' }}>We have a highly skilled, talented, experienced teacher. Your teacher will guide you throughout the course; any problem we will be there to help.</p></Reveal>

        {/* Single featured teacher card row (Courselo mentor card style) */}
        <div className="flex flex-col lg:flex-row gap-8 items-stretch max-w-5xl mx-auto">

          {/* Main teacher card — green colored photo area like Courselo */}
          <Reveal delay={0} dir="left">
            <div className="lift-card flex-1 overflow-hidden rounded-2xl" style={{ border: '1px solid #E7E9FB', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}>
              {/* Colored photo background */}
              <div className="relative overflow-hidden" style={{ height: 280, background: `linear-gradient(135deg, ${BLACK} 0%, ${GOLD} 100%)` }}>
                <img
                  src="https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=700&h=560&fit=crop&auto=format"
                  alt="Qur'an Teacher Qari Osama Alwajdi"
                  className="w-full h-full object-cover mix-blend-overlay transition-transform duration-500"
                  style={{ opacity: 0.45, transform: 'scale(1)' }}
                />
                {/* Centered icon in the photo area */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="anim-pulse-ring w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'rgba(91,101,220,0.2)', border: `2px solid rgba(91,101,220,0.5)` }}>
                    <i className="fas fa-user-tie text-3xl" style={{ color: GOLD_LIGHT }} />
                  </div>
                  <div className="text-white font-bold text-lg text-center" style={{ fontFamily: 'var(--font-sans)' }}>Qari Osama<br />Alwajdi</div>
                </div>
              </div>
              {/* Info */}
              <div className="p-5 bg-white">
                <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: GOLD, fontFamily: 'var(--font-sans)' }}>Online Qur'an Teacher · Dubai, UAE</div>
                <h3 className="text-lg font-extrabold mb-1" style={{ color: '#122056', fontFamily: 'var(--font-sans)' }}>Qari Osama Alwajdi</h3>
                <p className="text-sm mb-3" style={{ color: MUTED, fontFamily: 'var(--font-sans)' }}>Tajweed · Tashih Tilawah · Hifz & Revision</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Stars /><span className="text-xs font-semibold" style={{ color: GOLD }}>4 Courses</span></div>
                  <span className="text-xs" style={{ color: MUTED }}>2+ Years</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* About text beside the card */}
          <div className="flex-[1.6] flex flex-col justify-center">
            <Reveal delay={80}>
              <h3 className="text-2xl font-extrabold mb-4" style={{ color: '#122056', fontFamily: 'var(--font-sans)' }}>Why learn with Qari Osama?</h3>
              <p className="text-base leading-relaxed mb-4" style={{ color: MUTED, fontFamily: 'var(--font-sans)' }}>
                Qari Osama Alwajdi is a Qur'an teacher and reciter based in Dubai, UAE, dedicated to helping students develop a stronger and more accurate relationship with the Qur'an.
              </p>
              <p className="text-base leading-relaxed mb-6" style={{ color: MUTED, fontFamily: 'var(--font-sans)' }}>
                With 2+ years of teaching experience, he has taught students from different countries, offering accessible online Qur'an education tailored to different ages and learning levels.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-7">
                {[
                  { icon: 'fa-book-open',    label: "Qur'an & Tajweed" },
                  { icon: 'fa-microphone',   label: "Recitation Correction" },
                  { icon: 'fa-brain',        label: "Hifz & Revision" },
                  { icon: 'fa-user',         label: "One-to-One Classes" },
                  { icon: 'fa-children',     label: "Children & Adults" },
                  { icon: 'fa-calendar-alt', label: "Flexible Scheduling" },
                ].map(f => (
                  <div key={f.label} className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: GOLD_PALE, border: `1px solid ${BORDER}` }}>
                      <i className={`fas ${f.icon} text-sm`} style={{ color: GOLD }} />
                    </div>
                    <span className="text-sm font-medium" style={{ color: '#122056', fontFamily: 'var(--font-sans)' }}>{f.label}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <BtnSolid href={WA_LINK}>Join a Class</BtnSolid>
                <BtnOutline href={WA_LINK}><i className="fab fa-whatsapp" /> WhatsApp</BtnOutline>
              </div>
            </Reveal>
          </div>
        </div>

        {/* See More */}
        <div className="text-center mt-10">
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-bold no-underline"
            style={{ border: `1.5px solid #E7E9FB`, color: '#122056', background: '#fff', fontFamily: 'var(--font-sans)' }}>
            See More <i className="fas fa-arrow-right text-xs" style={{ color: GOLD }} />
          </a>
        </div>
      </div>
    </section>
  )
}

// ─── Why Choose Us ────────────────────────────────────────────────────────────

const WHY_ITEMS = [
  { icon: 'fa-chart-line',    title: 'Regular Progress Testing', desc: 'Students assessed every ~3 weeks to monitor growth and identify areas for improvement.' },
  { icon: 'fa-heart',         title: 'Patient Teaching',         desc: 'A calm, encouraging approach that lets every student learn at their own pace.' },
  { icon: 'fa-users',         title: 'All Age Groups',           desc: 'Classes available for children, adults, brothers and sisters at all levels.' },
  { icon: 'fa-calendar-alt',  title: 'Flexible Scheduling',      desc: 'Day and night sessions available to suit your schedule and time zone.' },
]

function WhyChooseUs() {
  return (
    <section className="py-20 lg:py-24" style={{ background: '#FAFAFD' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left image */}
          <Reveal>
            <div className="relative">
              <div className="group-hoverable overflow-hidden rounded-3xl" style={{ border: '1px solid #E7E9FB', boxShadow: '0 16px 50px rgba(0,0,0,0.08)' }}>
                <img
                  src="https://images.unsplash.com/photo-1627383604317-175d057ea58e?w=800&h=900&fit=crop&auto=format"
                  alt="Islamic calligraphy and learning"
                  className="img-zoom w-full object-cover h-64 sm:h-80 lg:h-[440px]"
                />
              </div>
              {/* Floating label */}
              <div className="label-bob absolute bottom-6 left-6 px-4 py-3 rounded-xl bg-white" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.12)', border: `1px solid ${BORDER}` }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: GOLD_PALE }}>
                    <i className="fas fa-moon text-sm" style={{ color: GOLD }} />
                  </div>
                  <div>
                    <div className="text-xs font-bold" style={{ color: '#122056', fontFamily: 'var(--font-sans)' }}>Day & Night Classes</div>
                    <div className="text-xs" style={{ color: MUTED, fontFamily: 'var(--font-sans)' }}>Flexible for all time zones</div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right — feature grid */}
          <Reveal delay={100}>
            <EyeBrow>Why Choose Us</EyeBrow>
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-3" style={{ color: '#122056', fontFamily: 'var(--font-sans)', lineHeight: 1.1 }}>
              Why People Choose us<br />
              <span style={{ color: GOLD }}>over other platforms</span>
            </h2>
            <p className="text-base mb-8" style={{ color: MUTED, fontFamily: 'var(--font-sans)' }}>
              Learning that puts your progress first, with patient instruction and personal guidance every step of the way.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {WHY_ITEMS.map((w, i) => (
                <Reveal key={w.title} delay={i * 55} dir={i % 3 === 0 ? 'up' : 'zoom'}>
                  <div className="group-hoverable lift-card p-4 rounded-xl bg-white" style={{ border: '1px solid #E7E9FB', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                    <div className="icon-pop w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: GOLD_PALE }}>
                      <i className={`fas ${w.icon} text-base`} style={{ color: GOLD }} />
                    </div>
                    <h4 className="text-sm font-bold mb-1.5" style={{ color: '#122056', fontFamily: 'var(--font-sans)' }}>{w.title}</h4>
                    <p className="text-xs leading-relaxed" style={{ color: MUTED, fontFamily: 'var(--font-sans)' }}>{w.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="text-xs p-3 rounded-lg" style={{ background: GOLD_PALE, border: `1px solid ${BORDER}`, color: '#122056', fontFamily: 'var(--font-sans)' }}>
              <i className="fas fa-info-circle mr-2" style={{ color: GOLD }} />
              <strong>Also available:</strong> Personal attention · 1-to-1 follow-up · Hifz support · 3,000+ curriculum options
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ─── Testimonials (auto-playing carousel) ─────────────────────────────────────

const TESTIMONIALS = [
  {
    tag: 'Best Platform',
    bg: '#EEEFFD', textDark: true,
    icon: 'fa-trophy',
    iconColor: '#5B65DC',
    nameColor: '#4448C0',
    quoteColor: '#122056',
  },
  {
    tag: 'Top Class Teacher',
    bg: '#E4E7FB', textDark: true,
    icon: 'fa-star',
    iconColor: '#5B65DC',
    nameColor: '#4448C0',
    quoteColor: '#122056',
  },
  {
    tag: 'Highly Recommended',
    bg: '#EEEFFD', textDark: true,
    icon: 'fa-heart',
    iconColor: '#5B65DC',
    nameColor: '#4448C0',
    quoteColor: '#122056',
  },
]

function Testimonials() {
  const [active, setActive] = useState(0)
  const count = TESTIMONIALS.length

  useEffect(() => {
    const id = setInterval(() => setActive(v => (v + 1) % count), 5000)
    return () => clearInterval(id)
  }, [count])

  const prev = () => setActive(v => (v - 1 + count) % count)
  const next = () => setActive(v => (v + 1) % count)
  const t = TESTIMONIALS[active]

  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <Reveal>
          <div className="text-center">
            <EyeBrow>Student Feedback</EyeBrow>
            <h2 className="text-4xl lg:text-5xl font-extrabold mt-0" style={{ color: '#122056', fontFamily: 'var(--font-sans)' }}>Customer Story</h2>
            <p className="mt-2 mx-auto max-w-md" style={{ color: MUTED, fontFamily: 'var(--font-sans)' }}>Our students tell stories and share about our services we provide.</p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="relative mt-10">
            <div className="p-8 sm:p-12 rounded-3xl text-center transition-all duration-300"
              style={{ background: t.bg, border: '1px solid #E7E9FB', boxShadow: '0 14px 44px rgba(16,16,16,0.08)' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(255,255,255,0.7)' }}>
                <i className={`fas ${t.icon} text-2xl`} style={{ color: t.iconColor }} />
              </div>
              <div className="flex justify-center mb-5"><Stars color={t.iconColor} /></div>
              <div className="text-lg font-extrabold mb-6" style={{ color: '#122056', fontFamily: 'var(--font-sans)' }}>{t.tag}</div>
              <p className="text-base leading-relaxed italic mb-8 max-w-2xl mx-auto" style={{ color: t.quoteColor, fontFamily: 'var(--font-sans)' }}>
                "Add verified student feedback here. These cards are designed for real testimonials to be added later."
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: t.iconColor }}>S</div>
                <div className="text-left">
                  <div className="text-sm font-bold" style={{ color: '#122056', fontFamily: 'var(--font-sans)' }}>Student Testimonial</div>
                  <div className="text-xs" style={{ color: t.nameColor, fontFamily: 'var(--font-sans)' }}>— Verified Student</div>
                </div>
              </div>
            </div>

            <button onClick={prev} aria-label="Previous testimonial"
              className="absolute left-0 sm:-left-16 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:shadow-lg"
              style={{ background: '#fff', border: '1.5px solid #E7E9FB' }}>
              <i className="fas fa-chevron-left text-xs" style={{ color: '#122056' }} />
            </button>
            <button onClick={next} aria-label="Next testimonial"
              className="absolute right-0 sm:-right-16 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:shadow-lg"
              style={{ background: '#fff', border: '1.5px solid #E7E9FB' }}>
              <i className="fas fa-chevron-right text-xs" style={{ color: '#122056' }} />
            </button>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setActive(i)} aria-label={`Go to testimonial ${i + 1}`}
                className="h-2.5 rounded-full transition-all duration-300"
                style={{ width: i === active ? 24 : 8, background: i === active ? YELLOW : '#E7E9FB' }} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ─── How It Works ─────────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    { n: '01', icon: 'fa-comment-dots',  t: 'Contact Us',           d: 'Send a message via WhatsApp to enquire about available classes.' },
    { n: '02', icon: 'fa-list-check',    t: 'Share Your Needs',      d: 'Share your age, current Qur\'an level and learning goals.' },
    { n: '03', icon: 'fa-calendar-check',t: 'Choose a Schedule',     d: 'Select a suitable day and time based on available slots.' },
    { n: '04', icon: 'fa-book-open',     t: 'Start Learning',        d: "Begin your lessons and work consistently toward your Qur'an goals." },
  ]

  return (
    <section className="py-20 lg:py-24" style={{ background: '#FAFAFD' }}>
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <div className="text-center"><EyeBrow>Simple Process</EyeBrow></div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-center mb-14" style={{ color: '#122056', fontFamily: 'var(--font-sans)' }}>
            Start Your Qur'an Journey<br /><span style={{ color: GOLD }}>in 4 Simple Steps</span>
          </h2>
        </Reveal>

        {/* Desktop horizontal */}
        <div className="hidden md:flex items-start justify-between gap-3 relative">
          <div className="absolute top-7 left-[10%] right-[10%] h-px" style={{ background: `linear-gradient(to right, ${GOLD}33, ${GOLD}88, ${GOLD}33)` }} />
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 80} dir={i % 2 === 0 ? 'up' : 'zoom'}>
              <div className="lift-card flex flex-col items-center text-center flex-1 px-3">
                <div className="anim-bob w-14 h-14 rounded-full flex items-center justify-center mb-4 relative z-10" style={{ background: '#EEEFFD', border: `2px solid ${GOLD}`, boxShadow: `0 0 0 4px #FAFAFD, 0 0 0 6px ${BORDER}`, animationDelay: `${i * 0.4}s` }}>
                  <i className={`fas ${s.icon} text-lg`} style={{ color: GOLD }} />
                </div>
                <div className="text-xs font-bold mb-1" style={{ color: GOLD, fontFamily: 'var(--font-sans)' }}>{s.n}</div>
                <h3 className="text-sm font-bold mb-1.5" style={{ color: '#122056', fontFamily: 'var(--font-sans)' }}>{s.t}</h3>
                <p className="text-xs leading-relaxed" style={{ color: MUTED, fontFamily: 'var(--font-sans)' }}>{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Mobile vertical */}
        <div className="md:hidden space-y-0">
          {steps.map((s, i) => (
            <div key={s.n} className="flex gap-5 items-start">
              <div className="flex flex-col items-center">
                <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#EEEFFD', border: `2px solid ${GOLD}` }}>
                  <i className={`fas ${s.icon} text-base`} style={{ color: GOLD }} />
                </div>
                {i < 3 && <div className="w-px flex-1 h-10 mt-1" style={{ background: `${GOLD}33` }} />}
              </div>
              <div className="pt-1.5 pb-7">
                <div className="text-xs font-bold mb-0.5" style={{ color: GOLD }}>{s.n}</div>
                <h3 className="text-sm font-bold mb-1" style={{ color: '#122056', fontFamily: 'var(--font-sans)' }}>{s.t}</h3>
                <p className="text-sm" style={{ color: MUTED, fontFamily: 'var(--font-sans)' }}>{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Stats Strip ──────────────────────────────────────────────────────────────

function StatsStrip() {
  return (
    <section className="py-16" style={{ background: DARK }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { v: '2+', num: 2, suf: '+', l: 'Years Experience',      icon: 'fa-award' },
            { v: 'Worldwide',   l: 'Students',              icon: 'fa-globe' },
            { v: '1-to-1',      l: 'Personalized Classes',  icon: 'fa-user-graduate' },
            { v: 'Day & Night', l: 'Flexible Sessions',     icon: 'fa-clock' },
          ].map((s, i) => (
            <Reveal key={s.l} delay={i * 70}>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'rgba(91,101,220,0.15)' }}>
                  <i className={`fas ${s.icon} text-lg`} style={{ color: GOLD_LIGHT }} />
                </div>
                <div className="text-3xl lg:text-4xl font-extrabold mb-1" style={{ color: GOLD_LIGHT, fontFamily: 'var(--font-sans)' }}>
                  {s.num !== undefined ? <CountUp to={s.num} suffix={s.suf || ''} /> : s.v}
                </div>
                <div className="text-sm tracking-wide uppercase" style={{ color: '#a0a0a0', fontFamily: 'var(--font-sans)', letterSpacing: '0.1em' }}>{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

const FAQS = [
  { q: "Who can join the online Qur'an classes?",  a: "Classes are available for children, adults, brothers and sisters at different learning levels." },
  { q: "Do I need to live in Dubai?",              a: "No. The classes are online and available to students from different countries." },
  { q: "Can beginners join?",                      a: "Yes. Students can begin from their current level and progress step by step." },
  { q: "Are one-to-one classes available?",        a: "Yes. Personalized one-to-one classes are available." },
  { q: "Do you teach Hifz?",                       a: "Yes. Hifz and revision support are among the available learning options." },
  { q: "Are classes available at night?",          a: "Flexible day and night sessions are available depending on scheduling." },
  { q: "How do I register?",                       a: "Contact Qari Osama through WhatsApp to enquire about available classes and scheduling." },
  { q: "How often are students tested?",           a: "Progress testing is conducted approximately every three weeks." },
]

function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section id="faq" className="py-20 lg:py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <Reveal>
          <div className="text-center"><EyeBrow>FAQ</EyeBrow></div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-center mb-14" style={{ color: '#122056', fontFamily: 'var(--font-sans)' }}>Frequently Asked<br />Questions</h2>
        </Reveal>
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <Reveal key={i} delay={i * 35}>
              <div className="lift-card overflow-hidden rounded-xl transition-all duration-300"
                style={{ border: `1.5px solid ${open === i ? GOLD : '#E7E9FB'}`, background: open === i ? GOLD_PALE : '#fff', boxShadow: open === i ? '0 8px 24px rgba(91,101,220,0.1)' : 'none' }}>
                <button
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                  onClick={() => setOpen(open === i ? null : i)}>
                  <span className="text-sm font-semibold" style={{ color: '#122056', fontFamily: 'var(--font-sans)' }}>{f.q}</span>
                  <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-200"
                    style={{ background: open === i ? GOLD : '#FAFAFD', color: open === i ? '#fff' : '#122056', transform: open === i ? 'rotate(45deg)' : 'none' }}>
                    <i className="fas fa-plus text-xs" />
                  </span>
                </button>
                <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: open === i ? '160px' : '0', opacity: open === i ? 1 : 0 }}>
                  <p className="px-6 pb-5 text-sm leading-relaxed" style={{ color: MUTED, fontFamily: 'var(--font-sans)' }}>{f.a}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Final CTA (like Courselo "Download App" section) ────────────────────────

function FinalCTA() {
  return (
    <section className="py-20 lg:py-24" style={{ background: '#FAFAFD', borderTop: '1px solid #fafafd' }}>
      <div className="max-w-3xl mx-auto px-6 text-center">
        <Reveal>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: GOLD, boxShadow: '0 8px 20px rgba(91,101,220,0.3)' }}>
            <i className="fab fa-whatsapp text-2xl" style={{ color: '#fff' }} />
          </div>
          <h2 className="text-3xl lg:text-5xl font-extrabold mb-4" style={{ color: '#122056', fontFamily: 'var(--font-sans)' }}>
            Start your Qur'an journey<br />on WhatsApp for free
          </h2>
          <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: MUTED, fontFamily: 'var(--font-sans)' }}>
            Contact Qari Osama Alwajdi now and take the first step toward better Qur'an recitation, Tajweed and memorization.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8 text-sm" style={{ color: MUTED }}>
            {[
              { i: 'fa-map-marker-alt', t: 'Dubai, UAE' },
              { i: 'fa-globe', t: 'Students Worldwide' },
              { i: 'fa-clock', t: 'Day & Night Classes' },
            ].map(c => (
              <span key={c.t} className="lift-card inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: '#fff', border: '1px solid #E7E9FB', fontFamily: 'var(--font-sans)' }}>
                <i className={`fas ${c.i} text-xs`} style={{ color: YELLOW }} />{c.t}
              </span>
            ))}
          </div>
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-sm font-extrabold no-underline transition-all duration-200"
            style={{ background: DARK, color: '#fff', fontFamily: 'var(--font-sans)', boxShadow: '0 8px 24px rgba(0,0,0,0.18)' }}>
            <i className="fab fa-whatsapp text-lg" style={{ color: '#25d366' }} />
            Contact on WhatsApp
          </a>
          <div className="mt-4 text-sm" style={{ color: MUTED, fontFamily: 'var(--font-sans)' }}>
            +971 55 561 7442
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ─── Quranic Verse ────────────────────────────────────────────────────────────

// ─── Footer ───────────────────────────────────────────────────────────────────

const SOCIAL_LINKS = [
  { p: 'Instagram', h: '@osamawjdi7',  href: 'https://instagram.com/osamawjdi7',    icon: 'fa-instagram' },
  { p: 'TikTok',    h: 'osamawjdi7',   href: 'https://tiktok.com/@osamawjdi7',      icon: 'fa-tiktok' },
  { p: 'Facebook',  h: 'osamawjdi7',   href: 'https://facebook.com/osamawjdi7',     icon: 'fa-facebook-f' },
  { p: 'YouTube',   h: 'osamawjdi7',   href: 'https://youtube.com/@osamawjdi7',     icon: 'fa-youtube' },
  { p: 'Snapchat',  h: 'zaama74',      href: 'https://snapchat.com/add/zaama74',    icon: 'fa-snapchat' },
]

function Footer() {
  return (
    <footer className="pt-14 pb-7" style={{ background: DARK, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              {/* <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: GOLD, boxShadow: '0 4px 10px rgba(91,101,220,0.3)' }}>
                <i className="fas fa-book-open text-sm" style={{ color: '#fff' }} />
              </div> */}
              <div>
                <div className="font-extrabold tracking-[0.1em] text-xs text-white" style={{ fontFamily: 'var(--font-sans)' }}>QARI OSAMA ALWAJDI</div>
                <div className="text-[10px] tracking-wide" style={{ color: '#6D7697', fontFamily: 'var(--font-sans)' }}>Qur'an · Tajweed · Hifz</div>
              </div>
            </div>
            <p className="text-xs leading-relaxed mb-4" style={{ color: '#6D7697', fontFamily: 'var(--font-sans)' }}>Online Qur'an classes for children and adults worldwide. Based in Dubai, UAE.</p>
            {/* Social icons row */}
            <div className="flex gap-2 flex-wrap">
              {SOCIAL_LINKS.map(s => (
                <a key={s.p} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="social-bounce w-8 h-8 rounded-lg flex items-center justify-center no-underline transition-all duration-150"
                  style={{ background: 'rgba(255,255,255,0.07)', color: '#a0a0a0' }}
                  title={s.p}
                  onMouseEnter={e => { e.currentTarget.style.background = GOLD_LIGHT; e.currentTarget.style.color = DARK }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#a0a0a0' }}>
                  <i className={`fab ${s.icon} text-xs`} />
                </a>
              ))}
            </div>
          </div>

          {/* About */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: GOLD_LIGHT, fontFamily: 'var(--font-sans)' }}>About</h4>
            <div className="flex flex-col gap-2.5">
              {[['Home','#home'],['Courses','#classes'],['Teacher','#teacher'],['Popular Courses','#classes']].map(([l,h]) => (
                <FLink key={l} href={h}>{l}</FLink>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: GOLD_LIGHT, fontFamily: 'var(--font-sans)' }}>Company</h4>
            <div className="flex flex-col gap-2.5">
              {[['FAQ','#faq'],['Hifz & Revision','#classes'],['Testimonials','#'],['Teaching Method','#teacher']].map(([l,h]) => (
                <FLink key={l} href={h}>{l}</FLink>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: GOLD_LIGHT, fontFamily: 'var(--font-sans)' }}>Any Questions?</h4>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 mb-4 no-underline text-xs"
              style={{ color: GOLD_LIGHT, fontFamily: 'var(--font-sans)' }}>
              <i className="fab fa-whatsapp text-base" style={{ color: '#25d366' }} /> +971 55 561 7442
            </a>
            <div className="flex flex-col gap-2">
              {SOCIAL_LINKS.map(s => (
                <a key={s.p} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="text-xs no-underline transition-colors duration-150"
                  style={{ color: '#6D7697', fontFamily: 'var(--font-sans)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = GOLD_LIGHT)}
                  onMouseLeave={e => (e.currentTarget.style.color = '#6D7697')}>
                  <i className={`fab ${s.icon} mr-1.5`} />{s.p} — {s.h}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-7" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-xs" style={{ color: '#6D7697', fontFamily: 'var(--font-sans)' }}>© {new Date().getFullYear()} Qari Osama Alwajdi. All Rights Reserved.</p>
          <div className="flex gap-5">
            {[{ l: 'Privacy Policy', h: '#privacy' }, { l: 'Website Terms', h: '#terms' }].map(l => (
              <a key={l.l} href={l.h} className="text-xs no-underline transition-colors duration-150" style={{ color: '#6D7697', fontFamily: 'var(--font-sans)' }}
                onMouseEnter={e => (e.currentTarget.style.color = GOLD_LIGHT)}
                onMouseLeave={e => (e.currentTarget.style.color = '#6D7697')}>{l.l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

function FLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [h, setH] = useState(false)
  return (
    <a href={href} className="text-xs no-underline transition-colors duration-150"
      style={{ color: h ? GOLD_LIGHT : '#6D7697', fontFamily: 'var(--font-sans)' }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>{children}</a>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

type Page = 'home' | 'privacy' | 'terms'

function getHashPage(): Page {
  const h = window.location.hash.replace(/^#\/?/, '').toLowerCase()
  if (h === 'privacy') return 'privacy'
  if (h === 'terms') return 'terms'
  return 'home'
}

function useHashPage() {
  const [page, setPage] = useState<Page>(getHashPage)
  useEffect(() => {
    const onHash = () => setPage(getHashPage())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return page
}

function HomePage() {
  return (
    <div style={{ fontFamily: 'var(--font-sans)', background: '#fff' }}>
      <Navbar />
      <Hero />
      <TrustedStrip />
      <FeatureHighlights />
      <Classes />
      <TeacherSection />
      <WhyChooseUs />
      <Testimonials />
      <StatsStrip />
      <HowItWorks />
      <FAQ />
      <FinalCTA />
      <Footer />
      <BackToTop />
    </div>
  )
}

export default function App() {
  const page = useHashPage()
  if (page === 'privacy') return <LegalPage type="privacy" />
  if (page === 'terms') return <LegalPage type="terms" />
  return <HomePage />
}
