const columns = [
  {
    title: 'Shop',
    links: ['Hardware', 'Sanitary', 'Lightings', 'Featured Products']
  },
  {
    title: 'Help',
    links: ['Track Order', 'Returns', 'Shipping Info', 'Contact Us']
  }
];

const trustPoints = [
  { label: 'Genuine Products', icon: 'M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z' },
  { label: 'Secure Payments', icon: 'M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 1 0-8 0v4h8z' },
  { label: 'Easy Store Returns', icon: 'M3 10h11a5 5 0 0 1 0 10H9m-6-10 4-4m-4 4 4 4' },
  { label: 'Local Store Pickup', icon: 'M3 9l9-6 9 6M4 10v9h16v-9' }
];

const Footer = () => (
  <footer className="bg-ink-900 text-ink-300 mt-20">
    <div className="border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-7 grid grid-cols-2 md:grid-cols-4 gap-6">
        {trustPoints.map((point) => (
          <div key={point.label} className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-brand-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={point.icon} />
              </svg>
            </span>
            <span className="text-xs sm:text-sm text-ink-300 font-medium leading-tight">{point.label}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-4 py-12 grid sm:grid-cols-2 md:grid-cols-4 gap-10">
      <div>
        <div className="flex items-center gap-2.5 mb-3">
          <span className="w-9 h-9 rounded-lg bg-brand-gradient flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </span>
          <p className="text-white font-display font-bold text-lg">Famous Hardware</p>
        </div>
        <p className="text-sm text-ink-400 leading-relaxed">
          Your trusted neighborhood store for Hardware, Sanitary &amp; Lighting needs in Kodinhi.
        </p>
      </div>

      {columns.map((col) => (
        <div key={col.title}>
          <p className="text-white font-semibold text-sm mb-3">{col.title}</p>
          <ul className="space-y-2 text-sm">
            {col.links.map((link) => (
              <li key={link}>
                <span className="hover:text-brand-400 transition-colors cursor-pointer">{link}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div>
        <p className="text-white font-semibold text-sm mb-3">Visit Us</p>
        <p className="text-sm text-ink-400 leading-relaxed">
          Kodinhi, Kerala
          <br />
          Open all days, 9 AM – 8 PM
        </p>
      </div>
    </div>

    <div className="border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-5 text-xs text-ink-500 flex flex-col sm:flex-row justify-between gap-2">
        <p>&copy; {new Date().getFullYear()} Famous Hardware, Kodinhi. All rights reserved.</p>
        <p>Hardware &middot; Sanitary &middot; Lightings</p>
      </div>
    </div>
  </footer>
);

export default Footer;
