import WhatsAppIcon from './WhatsAppIcon.jsx';
import { getWhatsAppUrl } from '../../utils/whatsapp.js';

const DEFAULT_MESSAGE = 'Hi Famous Hardware, I have a question about your products.';

// Always-visible contact shortcut, separate from the cart/order WhatsApp flows — this one is
// for general enquiries while browsing.
const FloatingWhatsAppButton = () => {
  const url = getWhatsAppUrl(DEFAULT_MESSAGE);
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-card-hover hover:scale-105 transition-all"
    >
      <WhatsAppIcon className="w-7 h-7" />
    </a>
  );
};

export default FloatingWhatsAppButton;
