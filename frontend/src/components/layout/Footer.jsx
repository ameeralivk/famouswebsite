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

const Footer = () => (
  <footer className="bg-ink-900 text-ink-300 mt-20">
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
