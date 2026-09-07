import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

const StorefrontLayout = () => (
  <div className="min-h-screen flex flex-col bg-ink-50 font-sans">
    <Header />
    <div className="flex-1">
      <Outlet />
    </div>
    <Footer />
  </div>
);

export default StorefrontLayout;
