const highlights = ['Genuine Brands', 'Fast Local Delivery', 'Easy Store Returns'];

const AuthLayout = ({ children }) => (
  <div className="min-h-[calc(100vh-64px)] grid lg:grid-cols-2">
    <div className="hidden lg:flex flex-col justify-between bg-hero-gradient text-white p-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, white 1px, transparent 1px)', backgroundSize: '26px 26px' }} />
      <div className="absolute -bottom-24 -left-16 w-72 h-72 bg-brand-500/15 rounded-full blur-3xl" />

      <div className="relative flex items-center gap-3">
        <span className="w-11 h-11 rounded-xl bg-brand-gradient flex items-center justify-center shrink-0 shadow-card">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        </span>
        <span className="font-display font-bold text-lg">Famous Hardware</span>
      </div>

      <div className="relative">
        <span className="inline-block text-brand-300 bg-white/10 border border-white/10 text-[11px] font-semibold tracking-[0.15em] uppercase px-3.5 py-1.5 rounded-full mb-5">
          Kodinhi, Kerala
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-extrabold leading-[1.15] mb-4 tracking-tight">
          Hardware, Sanitary &amp; Lighting — all in one place.
        </h2>
        <p className="text-ink-300 max-w-sm leading-relaxed">
          Sign in to track orders, save your details, and check out faster next time you shop with us.
        </p>

        <ul className="mt-8 space-y-3">
          {highlights.map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-sm text-ink-200">
              <span className="w-5 h-5 rounded-full bg-brand-500/20 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" className="w-3 h-3 text-brand-400" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-xs text-ink-500">&copy; {new Date().getFullYear()} Famous Hardware, Kodinhi</p>
    </div>

    <div className="flex items-center justify-center px-4 py-12 bg-ink-50">{children}</div>
  </div>
);

export default AuthLayout;
