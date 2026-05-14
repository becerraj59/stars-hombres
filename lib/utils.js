// lib/utils.js

/**
 * Formatea precio en ARS
 */
export function formatPrice(amount) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Calcula cuotas para Tarjeta Naranja (sin interés)
 * Naranja X ofrece hasta 12 cuotas sin interés en comercios adheridos
 */
export function calculateInstallments(price) {
  const plans = [
    { count: 3, label: '3 cuotas sin interés', hasInterest: false },
    { count: 6, label: '6 cuotas sin interés', hasInterest: false },
    { count: 12, label: '12 cuotas sin interés', hasInterest: false },
  ]

  return plans.map((plan) => ({
    ...plan,
    amount: Math.ceil(price / plan.count),
    total: price,
    amountFormatted: formatPrice(Math.ceil(price / plan.count)),
    totalFormatted: formatPrice(price),
  }))
}

/**
 * Genera el link de WhatsApp con mensaje prearmado
 */
export function getWhatsAppLink(product = null, productUrl = null) {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5493513000000'
  let message = 'Hola! Vi su tienda Stars Hombres y quiero consultar sobre sus productos.'
  
  if (product && productUrl) {
    message = `Hola! Vi este producto en Stars Hombres y quiero más información: ${product} - ${productUrl}`
  }
  
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

/**
 * Genera número de orden único
 */
export function generateOrderNumber() {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const random = Math.floor(Math.random() * 9000) + 1000
  return `STR${year}${month}${random}`
}

/**
 * Trunca texto
 */
export function truncate(text, maxLength = 120) {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

/**
 * Construye URL canónica del producto
 */
export function getProductUrl(slug) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://starshombres.com.ar'
  return `${base}/producto/${slug}`
}

/**
 * Mapea categorías a labels en español
 */
export const CATEGORY_LABELS = {
  trajes: 'Trajes & Ambos',
  camisas: 'Camisas',
  sweaters: 'Sweaters',
  zapatos: 'Calzado',
}

/**
 * Umbrales de stock para mostrar urgencia
 */
export function getStockStatus(stock) {
  if (stock === 0) return { label: 'Sin stock', color: 'text-red-500', urgent: false, available: false }
  if (stock <= 2) return { label: `¡Última unidad!`, color: 'text-brand-gold animate-gold-shimmer', urgent: true, available: true }
  if (stock <= 5) return { label: `Solo ${stock} disponibles`, color: 'text-orange-400', urgent: true, available: true }
  return { label: 'En stock', color: 'text-green-400', urgent: false, available: true }
}

/**
 * Schema markup para producto (SEO)
 */
export function getProductSchema(product, variant = null) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    brand: {
      '@type': 'Brand',
      name: 'Stars Hombres',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'ARS',
      price: product.base_price,
      availability: variant
        ? variant.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock'
        : 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Stars Hombres',
      },
    },
    aggregateRating: product.reviews?.length > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: (product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length).toFixed(1),
      reviewCount: product.reviews.length,
    } : undefined,
  }
}
