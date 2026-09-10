// Builds a wa.me deep link pre-filled with the cart/order contents, so a customer can send
// their order straight to the store's WhatsApp. Requires VITE_WHATSAPP_NUMBER (digits only,
// with country code, e.g. 919876543210) to be set — see frontend/.env.example.
export const buildCartWhatsAppMessage = (cart) => {
  const lines = ['Hi Famous Hardware, I would like to order:', ''];

  cart.items.forEach((item, i) => {
    const lineTotal = (item.priceAtAdd * item.quantity).toFixed(2);
    lines.push(`${i + 1}. ${item.variantName} (SKU: ${item.sku}) x${item.quantity} — ₹${lineTotal}`);
  });

  const subtotal = cart.items.reduce((sum, item) => sum + item.priceAtAdd * item.quantity, 0);
  lines.push('', `Total: ₹${subtotal.toFixed(2)}`, '', 'Please confirm availability and delivery. Thank you!');

  return lines.join('\n');
};

export const buildOrderWhatsAppMessage = (order) => {
  const lines = [`Hi Famous Hardware, I've placed Order #${order._id.slice(-8).toUpperCase()}:`, ''];

  order.items.forEach((item, i) => {
    lines.push(`${i + 1}. ${item.variantName} (SKU: ${item.sku}) x${item.quantity} — ₹${item.lineTotal}`);
  });

  lines.push('', `Total: ₹${order.grandTotal}`, 'Payment: Cash on Delivery', '', 'Please confirm my order. Thank you!');

  return lines.join('\n');
};

export const getWhatsAppUrl = (message) => {
  const number = import.meta.env.VITE_WHATSAPP_NUMBER;
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};
