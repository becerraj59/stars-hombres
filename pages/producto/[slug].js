// pages/producto/[slug].js
import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '../../components/layout/Layout'
import ProductCard from '../../components/ui/ProductCard'
import { formatPrice, calculateInstallments, getStockStatus, getWhatsAppLink, getProductUrl, getProductSchema } from '../../lib/utils'
import { useCart } from '../../lib/CartContext'

export default function ProductPage({ product, related }) {
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [activeImage, setActiveImage] = useState(0)
  const [added, setAdded] = useState(false)
  const [error, setError] = useState('')

  const { addToCart } = useCart()

  if (!product) return null

  // Get unique sizes and colors
  const sizes = [...new Set(product.variants.map((v) => v.size))]
  const colors = [...new Map(product.variants.map((v) => [v.color, { color: v.color, color_hex: v.color_hex }])).values()]

  // Get selected variant
  const selectedVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  )

  const stockStatus = selectedVariant
    ? getStockStatus(selectedVariant.stock)
    : null

  const price = selectedVariant?.price_override || product.base_price
  const installments = calculateInstallments(price)

  const productUrl = getProductUrl(product.slug)
  const waLink = getWhatsAppLink(product.name, productUrl)

  function handleAddToCart() {
    setError('')
    if (!selectedSize) { setError('Seleccioná un talle'); return }
    if (!selectedColor) { setError('Seleccioná un color'); return }
    if (!selectedVariant || !stockStatus?.available) { setError('Sin stock disponible'); return }

    addToCart({
      sku: selectedVariant.sku,
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      size: selectedSize,
      color: selectedColor,
      colorHex: selectedVariant.color_hex,
      price,
      image: product.images?.[0],
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const avgRating = product.reviews?.length
    ? (product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length).toFixed(1)
    : null

  const schema = getProductSchema(product, selectedVariant)

  return (
    <Layout
      title={product.name}
      description={product.description}
      canonical={productUrl}
    >
      <Head>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
        {product.images?.[0] && <meta property="og:image" content={product.images[0]} />}
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-body text-xs text-brand-silver mb-8">
          <Link href="/" className="hover:text-brand-gold">Inicio</Link>
          <span>›</span>
          <Link href="/catalogo" className="hover:text-brand-gold">Catálogo</Link>
          <span>›</span>
          <Link href={`/catalogo?categoria=${product.category}`} className="hover:text-brand-gold capitalize">
            {product.category}
          </Link>
          <span>›</span>
          <span className="text-brand-white">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="aspect-[3/4] bg-brand-charcoal overflow-hidden mb-3 relative">
              {product.images?.[activeImage] ? (
                <img
                  src={product.images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-brand-silver">
                  Sin imagen
                </div>
              )}

              {/* Stock badge */}
              {selectedVariant && stockStatus?.urgent && (
                <div className="absolute top-4 left-4 bg-brand-black/80 px-3 py-2">
                  <p className="font-body text-xs text-brand-gold animate-gold-shimmer">{stockStatus.label}</p>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`aspect-square w-16 overflow-hidden border-2 transition-colors ${
                      i === activeImage ? 'border-brand-gold' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Category & Rating */}
            <div className="flex items-center justify-between mb-2">
              <p className="font-body text-xs tracking-luxury text-brand-gold uppercase">{product.category}</p>
              {avgRating && (
                <div className="flex items-center gap-1">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map((s) => (
                      <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(avgRating) ? 'text-brand-gold' : 'text-brand-graphite'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="font-body text-xs text-brand-silver">({product.reviews.length})</span>
                </div>
              )}
            </div>

            <h1 className="font-display text-3xl lg:text-4xl text-brand-white mb-4">{product.name}</h1>

            {/* Price */}
            <div className="mb-6">
              <p className="font-body font-600 text-3xl text-brand-white">{formatPrice(price)}</p>
              <div className="mt-2 space-y-1">
                {installments.map((plan) => (
                  <p key={plan.count} className="font-body text-sm text-brand-silver">
                    <span className="text-brand-gold font-600">{plan.count}x {plan.amountFormatted}</span>
                    {' '}sin interés con Tarjeta Naranja
                  </p>
                ))}
              </div>
            </div>

            <div className="gold-divider mb-6" />

            {/* Color Selector */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-3">
                <p className="font-body text-sm text-brand-pearl uppercase tracking-wide">
                  Color {selectedColor && <span className="text-brand-gold">– {selectedColor}</span>}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {colors.map(({ color, color_hex }) => {
                  const hasVariantsForColor = selectedSize
                    ? product.variants.some((v) => v.color === color && v.size === selectedSize && v.stock > 0)
                    : product.variants.some((v) => v.color === color && v.stock > 0)

                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                      disabled={!hasVariantsForColor}
                      className={`group relative w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor === color
                          ? 'border-brand-gold scale-110'
                          : 'border-brand-graphite hover:border-brand-silver'
                      } ${!hasVariantsForColor ? 'opacity-30 cursor-not-allowed' : ''}`}
                      style={{ backgroundColor: color_hex || '#333' }}
                    >
                      {selectedColor === color && (
                        <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">✓</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-6">
              <p className="font-body text-sm text-brand-pearl uppercase tracking-wide mb-3">
                Talle {selectedSize && <span className="text-brand-gold">– {selectedSize}</span>}
              </p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => {
                  const variantsForSize = selectedColor
                    ? product.variants.filter((v) => v.size === size && v.color === selectedColor)
                    : product.variants.filter((v) => v.size === size)
                  const inStock = variantsForSize.some((v) => v.stock > 0)

                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      disabled={!inStock}
                      className={`font-body text-sm px-4 py-2.5 border transition-all ${
                        selectedSize === size
                          ? 'border-brand-gold bg-brand-gold text-brand-black'
                          : inStock
                          ? 'border-brand-graphite text-brand-silver hover:border-brand-silver hover:text-brand-white'
                          : 'border-brand-graphite/30 text-brand-silver/30 cursor-not-allowed line-through'
                      }`}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Stock status */}
            {selectedVariant && (
              <p className={`font-body text-sm mb-4 ${stockStatus.color}`}>
                {stockStatus.available ? '●' : '○'} {stockStatus.label}
              </p>
            )}

            {/* Error message */}
            {error && (
              <p className="font-body text-sm text-red-400 mb-4">{error}</p>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                className={`w-full font-body font-600 text-sm tracking-luxury py-4 transition-all uppercase ${
                  added
                    ? 'bg-green-600 text-white'
                    : 'bg-brand-gold text-brand-black hover:bg-brand-gold-light'
                }`}
              >
                {added ? '✓ Agregado al carrito' : 'Comprar con Mercado Pago'}
              </button>

              <Link
                href={added ? '/checkout' : '#'}
                onClick={(e) => {
                  if (!selectedSize || !selectedColor) {
                    e.preventDefault()
                    handleAddToCart()
                    return
                  }
                  handleAddToCart()
                }}
                className="w-full border border-brand-graphite text-brand-pearl font-body font-500 text-sm tracking-wide py-4 text-center hover:border-brand-silver transition-colors uppercase"
              >
                Pagar por transferencia bancaria
              </Link>

              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366]/10 border border-[#25D366]/40 text-[#25D366] font-body font-500 text-sm tracking-wide py-4 text-center hover:bg-[#25D366] hover:text-brand-black transition-all uppercase flex items-center justify-center gap-2"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Consultar por WhatsApp
              </a>
            </div>

            {/* Description */}
            <div className="border-t border-brand-graphite pt-6">
              <h2 className="font-body text-sm uppercase tracking-wide text-brand-pearl mb-3">Descripción</h2>
              <p className="font-body text-sm text-brand-silver leading-relaxed">{product.description}</p>
            </div>

            {/* Trust signals */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                { icon: '🚚', text: 'Envíos a todo el país' },
                { icon: '💳', text: '12 cuotas sin interés' },
                { icon: '✓', text: 'Calidad garantizada' },
                { icon: '💬', text: 'Asesoramiento WhatsApp' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 bg-brand-charcoal px-3 py-2">
                  <span>{item.icon}</span>
                  <span className="font-body text-xs text-brand-silver">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        {product.reviews?.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-3xl text-brand-white mb-8">Reseñas de clientes</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.reviews.map((review) => (
                <div key={review.id} className="bg-brand-charcoal p-6">
                  <div className="flex gap-1 mb-3">
                    {[1,2,3,4,5].map((s) => (
                      <svg key={s} className={`w-4 h-4 ${s <= review.rating ? 'text-brand-gold' : 'text-brand-graphite'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="font-body text-sm text-brand-pearl leading-relaxed mb-4">"{review.comment}"</p>
                  <p className="font-body text-xs text-brand-silver font-600">{review.customer_name}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Products */}
        {related?.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-3xl text-brand-white mb-8">También te puede interesar</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  )
}

export async function getStaticPaths() {
  try {
    const db = require('../../lib/db')
    const result = await db.query(`SELECT slug FROM products WHERE active = true`)
    return {
      paths: result.rows.map((r) => ({ params: { slug: r.slug } })),
      fallback: 'blocking',
    }
  } catch {
    return { paths: [], fallback: 'blocking' }
  }
}

export async function getStaticProps({ params }) {
  try {
    const db = require('../../lib/db')
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/products/${params.slug}`)
    
    // Fallback: direct DB query
    const productResult = await db.query(
      `SELECT p.*,
        COALESCE(json_agg(
          json_build_object('id', pv.id, 'sku', pv.sku, 'size', pv.size, 'color', pv.color, 'color_hex', pv.color_hex, 'stock', pv.stock, 'price_override', pv.price_override)
          ORDER BY pv.size, pv.color
        ) FILTER (WHERE pv.id IS NOT NULL), '[]') as variants,
        COALESCE(
          json_agg(json_build_object('id', r.id, 'customer_name', r.customer_name, 'rating', r.rating, 'comment', r.comment) ORDER BY r.created_at DESC)
          FILTER (WHERE r.id IS NOT NULL AND r.approved = true), '[]'
        ) as reviews
       FROM products p
       LEFT JOIN product_variants pv ON pv.product_id = p.id
       LEFT JOIN reviews r ON r.product_id = p.id
       WHERE p.slug = $1 AND p.active = true
       GROUP BY p.id`,
      [params.slug]
    )

    if (!productResult.rows[0]) return { notFound: true }

    const product = productResult.rows[0]
    const relatedResult = await db.query(
      `SELECT id, slug, name, base_price, images, category FROM products
       WHERE category = $1 AND slug != $2 AND active = true LIMIT 4`,
      [product.category, params.slug]
    )

    return {
      props: { product, related: relatedResult.rows },
      revalidate: 30,
    }
  } catch (err) {
    console.error(err)
    return { notFound: true }
  }
}
