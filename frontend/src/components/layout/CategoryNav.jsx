import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios.js';

const FALLBACK_CATEGORIES = [
  { name: 'Hardware', slug: 'hardware' },
  { name: 'Sanitary', slug: 'sanitary' },
  { name: 'Lightings', slug: 'lightings' }
];

const ICONS = {
  hardware: (
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  ),
  sanitary: <path d="M4 12h16M6 12V6a2 2 0 0 1 2-2h2v3M6 12v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6" />,
  lightings: (
    <>
      <path d="M9 18h6M10 22h4" />
      <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z" />
    </>
  )
};

const CategoryNav = () => {
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);

  useEffect(() => {
    api
      .get('/categories')
      .then(({ data }) => {
        if (data.categories?.length) setCategories(data.categories);
      })
      .catch(() => {});
  }, []);

  return (
    <nav className="bg-ink-900">
      <div className="max-w-7xl mx-auto px-4 flex gap-1 text-sm font-medium overflow-x-auto">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            to={`/?category=${cat.slug}`}
            className="flex items-center gap-2 py-2.5 px-3 whitespace-nowrap text-ink-300 hover:text-white hover:bg-white/5 rounded-md transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-brand-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {ICONS[cat.slug] || <circle cx="12" cy="12" r="9" />}
            </svg>
            {cat.name}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default CategoryNav;
