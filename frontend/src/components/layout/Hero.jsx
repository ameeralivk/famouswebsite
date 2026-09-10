import { Link } from 'react-router-dom';

const perks = [
  { label: 'Genuine Brands', icon: 'M9 12l2 2 4-4' },
  { label: 'Store Pickup Available', icon: 'M3 9l9-6 9 6M4 10v9h16v-9' },
  { label: 'Bulk Order Pricing', icon: 'M12 2v20M2 12h20' }
];

const Hero = () => (
  <div className="relative overflow-hidden bg-hero-gradient">
    <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, white 1px, transparent 1px)', backgroundSize: '26px 26px' }} />
    <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl" />
    <div className="absolute -bottom-32 -left-16 w-72 h-72 bg-brand-600/10 rounded-full blur-3xl" />

    <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24 grid md:grid-cols-2 gap-10 items-center">
      <div className="animate-slide-up">
        <span className="inline-flex items-center gap-2 text-brand-300 bg-white/10 border border-white/10 text-[11px] font-semibold tracking-[0.15em] uppercase px-3.5 py-1.5 rounded-full mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
          Kodinhi's Trusted Store Since Day One
        </span>
        <h1 className="font-display text-4xl sm:text-5xl md:text-[3.4rem] font-extrabold text-white leading-[1.08] tracking-tight">
          Everything for your <span className="text-brand-400">home &amp; build</span>, under one roof
        </h1>
        <p className="mt-5 text-ink-300 text-base max-w-md leading-relaxed">
          Hardware, sanitaryware and lighting — quality products, honest prices, and expert advice from a name you know.
        </p>

        <div className="mt-8 flex flex-wrap gap-3.5">
          <Link to="/shop" className="bg-brand-gradient text-white font-semibold px-7 py-3.5 rounded-full shadow-card hover:opacity-90 hover:shadow-card-hover transition-all">
            Explore Products
          </Link>
          <Link to="/shop" className="bg-white/5 text-white font-semibold px-7 py-3.5 rounded-full border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all">
            Explore Lightings
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3">
          {perks.map((perk) => (
            <div key={perk.label} className="flex items-center gap-2 text-ink-300 text-sm">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-brand-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={perk.icon} />
              </svg>
              {perk.label}
            </div>
          ))}
        </div>
      </div>

      <div className="hidden md:flex justify-center">
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          {[
            { icon: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z', label: 'Hardware' },
            { icon: 'M4 12h16M6 12V6a2 2 0 0 1 2-2h2v3M6 12v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6', label: 'Sanitary' },
            { icon: 'M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z', label: 'Lightings' },
            { icon: 'M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z', label: 'Quality Assured' }
          ].map((tile) => (
            <div
              key={tile.label}
              className="bg-white/[0.07] backdrop-blur border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-3 text-center hover:bg-white/[0.1] hover:-translate-y-0.5 transition-all duration-300"
            >
              <span className="w-11 h-11 rounded-xl bg-brand-gradient flex items-center justify-center shadow-card">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={tile.icon} />
                </svg>
              </span>
              <span className="text-white text-sm font-semibold tracking-wide">{tile.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Hero;
