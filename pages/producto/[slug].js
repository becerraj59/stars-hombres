// pages/producto/[slug].js
import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '../../components/layout/Layout'
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

  const sizes = [...new Set(product.variants.map((v) => v.size))]
  const colors = [...new Map(product.variants.map((v) => [v.color, { color: v.color, color_hex: v.color_hex }])).values()]

  const selectedVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  )

  const stockStatus = selectedVariant ? getStockStatus(selectedVariant.stock) : null
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

  return (
    <Layout title={product.name} description={product.description} canonical={productUrl}>
      <Head>
        {product.images?.[0] && <meta property="og:image" content={product.images[0]} />}
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
          <div>
            <div className="aspect-[3/4] bg-brand-charcoal overflow-hidden mb-3 relative">
              {product.images?.[activeImage] ? (
                <img src={product.images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-brand-silver">Sin imagen</div>
              )}
              {selectedVariant && stockStatus?.urgent && (
                <div className="absolute top-4 left-4 bg-brand-black/80 px-3 py-2">
                  <p className="font-body text-xs text-brand-gold">{stockStatus.label}</p>
                </div>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)}
                    className={`aspect-square w-16 overflow-hidden border-2 transition-colors ${i === activeImage ? 'border-brand-gold' : 'border-transparent'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <p className="font-body text-xs tracking-luxury text-brand-gold uppercase">{product.category}</p>
              {avgRating && (
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((s) => (
                    <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(avgRating) ? 'text-brand-gold' : 'text-brand-graphite'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="font-body text-xs text-brand-silver ml-1">({product.reviews.length})</span>
                </div>
              )}
            </div>

            <h1 className="font-display text-3xl lg:text-4xl text-brand-white mb-4">{product.name}</h1>

            <div className="mb-6">
              <p className="font-body font-600 text-3xl text-brand-white">{formatPrice(price)}</p>
              <div className="mt-2 space-y-1">
                {installments.map((plan) => (
                  <p key={plan.count} className="font-body text-sm text-brand-silver">
                    <span className="text-brand-gold font-600">{plan.count}x {plan.amountFormatted}</span> sin interés con Tarjeta Naranja
                  </p>
                ))}
              </div>
            </div>

            <div className="gold-divider mb-6" />

            <div className="mb-5">
              <p className="font-body text-sm text-brand-pearl uppercase tracking-wide mb-3">
                Color {selectedColor && <span className="text-brand-gold">– {selectedColor}</span>}
              </p>
              <div className="flex flex-wrap gap-2">
                {colors.map(({ color, color_hex }) => (
                  <button key={color} onClick={() => setSelectedColor(color)} title={color}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === color ? 'border-brand-gold scale-110' : 'border-brand-graphite hover:border-brand-silver'}`}
                    style={{ backgroundColor: color_hex || '#333' }} />
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="font-body text-sm text-brand-pearl uppercase tracking-wide mb-3">
                Talle {selectedSize && <span className="text-brand-gold">– {selectedSize}</span>}
              </p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => {
                  const inStock = product.variants.some((v) => v.size === size && v.stock > 0)
                  return (
                    <button key={size} onClick={() => setSelectedSize(size)} disabled={!inStock}
                      className={`font-body text-sm px-4 py-2.5 border transition-all ${
                        selectedSize === size ? 'border-brand-gold bg-brand-gold text-brand-black'
                        : inStock ? 'border-brand-graphite text-brand-silver hover:border-brand-silver hover:text-brand-white'
                        : 'border-brand-graphite/30 text-brand-silver/30 cursor-not-allowed line-through'
                      }`}>{size}</button>
                  )
                })}
              </div>
            </div>

            {selectedVariant && (
              <p className={`font-body text-sm mb-4 ${stockStatus.color}`}>
                {stockStatus.available ? '●' : '○'} {stockStatus.label}
              </p>
            )}

            {error && <p className="font-body text-sm text-red-400 mb-4">{error}</p>}

            <div className="flex flex-col gap-3 mb-6">
              <button onClick={handleAddToCart}
                className={`w-full font-body font-600 text-sm tracking-luxury py-4 transition-all uppercase ${added ? 'bg-green-600 text-white' : 'bg-brand-gold text-brand-black hover:bg-brand-gold-light'}`}>
                {added ? '✓ Agregado al carrito' : 'Comprar con Mercado Pago'}
              </button>
              <Link href="/checkout"
                onClick={handleAddToCart}
                className="w-full border border-brand-graphite text-brand-pearl font-body font-500 text-sm tracking-wide py-4 text-center hover:border-brand-silver transition-colors uppercase">
                Pagar por transferencia bancaria
              </Link>
              <a href={waLink} target="_blank" rel="noopener noreferrer"
                className="w-full bg-[#25D366]/10 border border-[#25D366]/40 text-[#25D366] font-body font-500 text-sm tracking-wide py-4 text-center hover:bg-[#25D366] hover:text-brand-black transition-all uppercase flex items-center justify-center gap-2">
                💬 Consultar por WhatsApp
              </a>
            </div>

            <div className="border-t border-brand-graphite pt-6">
              <h2 className="font-body text-sm uppercase tracking-wide text-brand-pearl mb-3">Descripción</h2>
              <p className="font-body text-sm text-brand-silver leading-relaxed">{product.description}</p>
            </div>

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

        {product.reviews?.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-3xl text-brand-white mb-8">Reseñas de clientes</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.reviews.map((review, i) => (
                <div key={i} className="bg-brand-charcoal p-6">
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

        {related?.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-3xl text-brand-white mb-8">También te puede interesar</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {related.map((p) => (
                <Link key={p.id} href={`/producto/${p.slug}`} className="group block bg-brand-charcoal hover:bg-brand-graphite transition-colors duration-300 overflow-hidden">
                  <div className="aspect-[3/4] overflow-hidden bg-brand-graphite">
                    {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />}
                  </div>
                  <div className="p-4">
                    <p className="font-body text-xs text-brand-gold uppercase tracking-wide mb-1">{p.category}</p>
                    <h3 className="font-display text-lg text-brand-white group-hover:text-brand-gold transition-colors">{p.name}</h3>
                    <p className="font-body font-600 text-brand-white mt-1">{formatPrice(p.base_price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  )
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export async function getStaticProps({ params }) {
  try {
    const db = require('../../lib/db')

    const productResult = await db.query(
      `SELECT p.id, p.slug, p.name, p.description, p.category, p.base_price, p.images, p.featured,
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
      props: {
        product: JSON.parse(JSON.stringify(product)),
        related: JSON.parse(JSON.stringify(relatedResult.rows)),
      },
      revalidate: 30,
    }
  } catch (err) {
    console.error(err)
    return { notFound: true }
  }
}
