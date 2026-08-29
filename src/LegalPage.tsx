// ─── Legal pages (Privacy Policy & Website Terms) ─────────────────────────────

export const LEGAL_CONTENT: Record<'privacy' | 'terms', { title: string; intro: string; sections: { h: string; body: string }[] }> = {
  privacy: {
    title: 'Privacy Policy',
    intro: "This Privacy Policy explains how Qari Osama Alwajdi ('we', 'our' or 'us') collects, uses and protects your personal information when you visit this website or contact us about online Qur'an classes.",
    sections: [
      { h: 'Information We Collect', body: "We collect the information you voluntarily provide when you contact us, such as your name, phone number (via WhatsApp), email address and details you share about your learning goals. We also collect basic, non-identifying usage data such as your browser type and pages visited to help us improve the site." },
      { h: 'How We Use Your Information', body: "Your information is used solely to respond to your enquiries, manage your online Qur'an class bookings, provide the services you request, and send you relevant communication. We do not sell or rent your personal data to third parties." },
      { h: 'WhatsApp & Third-Party Services', body: 'When you contact us via WhatsApp, your conversation is handled by WhatsApp / Meta under their own privacy policy. We recommend reviewing their policies for how they process your messages.' },
      { h: 'Cookies', body: 'This website may use essential cookies or similar technologies to improve functionality and remember your preferences. You can disable cookies in your browser settings, though some parts of the site may not function as expected.' },
      { h: 'Data Security', body: 'We take reasonable technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure or destruction.' },
      { h: 'Your Rights', body: 'You may request access to, correction of, or deletion of your personal data at any time by contacting us via WhatsApp. We will respond to legitimate requests in a timely manner.' },
      { h: 'Changes to This Policy', body: 'We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.' },
    ],
  },
  terms: {
    title: 'Website Terms',
    intro: "These Website Terms govern your use of this website and the online Qur'an teaching services offered by Qari Osama Alwajdi. By accessing or using the site, you agree to these terms.",
    sections: [
      { h: 'Acceptance of Terms', body: "By using this website or contacting us, you confirm that you have read, understood and agree to be bound by these Terms. If you do not agree, please do not use the website." },
      { h: 'Services', body: "We provide online Qur'an classes including Tajweed, Hifz (memorisation), revision and recitation coaching delivered one-to-one over video calls. Availability, scheduling and pricing may change and are confirmed individually with each student." },
      { h: 'Booking & Payment', body: 'Class scheduling is arranged directly with the student. Payment terms, session durations and any refund policy are agreed on a case-by-case basis and communicated before lessons begin.' },
      { h: 'Student Conduct', body: 'Students are expected to attend scheduled sessions on time, maintain a respectful learning environment, and notify us of cancellations or rescheduling requests in advance where possible.' },
      { h: 'Intellectual Property', body: 'All content on this website, including text, graphics, logos and course material, is the property of Qari Osama Alwajdi and may not be copied, reproduced or redistributed without prior written permission.' },
      { h: 'Liability', body: "We strive to provide quality teaching, but we are not liable for any indirect or consequential losses arising from your use of the website or the services. Lessons are provided on a 'best efforts' basis." },
      { h: 'Changes to These Terms', body: 'We may revise these Terms at any time. The latest version will always be available on this page.' },
    ],
  },
}

// Palette constants (kept local to this module)
const BLACK = '#122056'
const YELLOW = '#5B65DC'
const HEADING = '#122056'
const BODY = '#122056'
const MUTED = '#6D7697'
const BORDER_LT = '#E7E9FB'

export default function LegalPage({ type }: { type: 'privacy' | 'terms' }) {
  const data = LEGAL_CONTENT[type]
  const otherHref = type === 'privacy' ? '#terms' : '#privacy'
  return (
    <div style={{ fontFamily: 'var(--font-sans)', background: '#fff', minHeight: '100%' }}>
      <header className="border-b" style={{ borderColor: BORDER_LT, background: '#FAFAFD' }}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-2.5 no-underline">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: BLACK }}>
              <span style={{ fontSize: 15, fontFamily: 'var(--font-arabic)', color: '#fff', lineHeight: 1 }}>ق</span>
            </div>
            <div className="leading-tight">
              <div className="font-extrabold" style={{ color: HEADING, fontFamily: 'var(--font-sans)' }}>Qari Osama</div>
              <div className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: MUTED, fontFamily: 'var(--font-sans)' }}>Alwajdi</div>
            </div>
          </a>
          <a href="#home" className="inline-flex items-center gap-2 text-sm font-semibold no-underline hover:underline" style={{ color: HEADING, fontFamily: 'var(--font-sans)' }}>
            <i className="fas fa-arrow-left text-xs" /> Back to Home
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 lg:py-16">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: YELLOW }} />
          <span className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: MUTED, fontFamily: 'var(--font-sans)' }}>Legal</span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-extrabold mb-3" style={{ color: HEADING, fontFamily: 'var(--font-sans)' }}>{data.title}</h1>
        <p className="text-xs mb-8" style={{ color: MUTED, fontFamily: 'var(--font-sans)' }}>Last updated: August 2026</p>
        <p className="text-base leading-relaxed mb-10" style={{ color: BODY, fontFamily: 'var(--font-sans)' }}>{data.intro}</p>

        <div className="space-y-8">
          {data.sections.map((s, i) => (
            <section key={i} className="pt-6" style={{ borderTop: `1px solid ${BORDER_LT}` }}>
              <h2 className="text-xl font-bold mb-2 flex items-center gap-3" style={{ color: HEADING, fontFamily: 'var(--font-sans)' }}>
                <span className="text-sm font-extrabold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: YELLOW, color: HEADING, fontFamily: 'var(--font-sans)' }}>{i + 1}</span>
                {s.h}
              </h2>
              <p className="text-sm leading-relaxed pl-9" style={{ color: BODY, fontFamily: 'var(--font-sans)' }}>{s.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl p-6" style={{ background: '#FAFAFD', border: `1px solid ${BORDER_LT}` }}>
          <p className="text-sm" style={{ color: MUTED, fontFamily: 'var(--font-sans)' }}>
            {type === 'privacy' ? 'See how we expect the site and our services to be used.' : 'Learn how we collect, use and protect your personal data.'}
          </p>
          <a href={otherHref} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl no-underline" style={{ background: BLACK, color: '#fff', fontFamily: 'var(--font-sans)' }}>
            {type === 'privacy' ? 'View Website Terms' : 'View Privacy Policy'}
          </a>
        </div>
      </main>

      <footer className="border-t py-8" style={{ borderColor: BORDER_LT, background: '#FAFAFD' }}>
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs" style={{ color: MUTED, fontFamily: 'var(--font-sans)' }}>© {new Date().getFullYear()} Qari Osama Alwajdi. All Rights Reserved.</p>
          <div className="flex gap-5">
            <a href="#privacy" className="text-xs no-underline" style={{ color: MUTED, fontFamily: 'var(--font-sans)' }}>Privacy Policy</a>
            <a href="#terms" className="text-xs no-underline" style={{ color: MUTED, fontFamily: 'var(--font-sans)' }}>Website Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

