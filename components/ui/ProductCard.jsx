// components/ui/ProductCard.jsx
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice, getStockStatus } from '../../lib/utils'

export default function ProductCard({ product }) {
  const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0
  const stockStatus = getStockStatus(totalStock)
  const avgRating = parseFloat(product.avg_rating || 0)
  const reviewCount = parseInt(product.review_count || 0)

  const installment12 = Math.ceil(product.base_price / 12)

  return (
    <Link href={`/producto/${product.slug}`} className="group block bg-brand-charcoal hover:bg-brand-graphite transition-colors duration-300 overflow-hidden">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-brand-graphite">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-silver">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.featured && (
            <span className="bg-brand-gold text-brand-black text-[9px] font-body font-700 tracking-luxury px-2 py-1 uppercase">
              Destacado
            </span>
          )}
          {stockStatus.urgent && stockStatus.available && (
            <span className="bg-brand-black/80 text-brand-gold text-[9px] font-body tracking-wide px-2 py-1 uppercase">
              {stockStatus.label}
            </span>
          )}
          {totalStock === 0 && (
            <span className="bg-brand-black/80 text-brand-silver text-[9px] font-body tracking-wide px-2 py-1 uppercase">
              Sin stock
            </span>
          )}
        </div>

        {/* Quick action overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-black/80 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <span className="font-body text-xs tracking-luxury text-brand-white uppercase">Ver producto →</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Rating */}
        {reviewCount > 0 && (
          <div className="flex items-center gap-1 mb-2">
            {[1,2,3,4,5].map((star) => (
              <svg
                key={star}
                className={`w-3 h-3 ${star <= Math.round(avgRating) ? 'text-brand-gold' : 'text-brand-graphite'}`}
                fill="currentColor" viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="font-body text-[10px] text-brand-silver ml-1">({reviewCount})</span>
          </div>
        )}

        <p className="font-body text-[10px] tracking-luxury text-brand-gold uppercase mb-1">
          {product.category}
        </p>
        <h3 className="font-display text-lg text-brand-white group-hover:text-brand-gold transition-colors leading-tight mb-2">
          {product.name}
        </h3>
        <div className="flex items-baseline justify-between">
          <div>
            <p className="font-body font-600 text-brand-white text-lg">
              {formatPrice(product.base_price)}
            </p>
            <p className="font-body text-[10px] text-brand-silver">
              12 cuotas sin interés de {formatPrice(installment12)}
            </p>
          </div>
        </div>

        {/* Color swatches preview */}
        {product.variants && (
          <div className="flex gap-1 mt-3">
            {[...new Map(product.variants.map(v => [v.color, v])).values()].slice(0, 5).map((v) => (
              <div
                key={v.color}
                className="w-4 h-4 rounded-full border border-brand-silver/30"
                style={{ backgroundColor: v.color_hex || '#333' }}
                title={v.color}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
