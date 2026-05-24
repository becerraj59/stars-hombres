// pages/index.js
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Layout from '../components/layout/Layout'
import ProductCard from '../components/ui/ProductCard'
import { formatPrice, getWhatsAppLink, CATEGORY_LABELS } from '../lib/utils'

export default function Home({ featuredProducts, testimonials }) {
  const [activeCategory, setActiveCategory] = useState(null)

  
  const categories = [
    { key: 'verano', label: 'Verano', icon: '☀️', desc: 'Camisas, remeras, chombas y más' },
    { key: 'camisas', label: 'Camisas', icon: '👔', desc: 'Elegancia en cada detalle' },
    { key: 'sweaters', label: 'Sweaters', icon: '🧥', desc: 'Calidez con estilo' },
    
  ]

  return (
    <Layout>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center bg-brand-black overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A84C' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Gold accent line */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-brand-gold to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-up">
              <p className="font-body text-xs tracking-luxury text-brand-gold uppercase mb-6">
                ✦ Indumentaria Masculina Premium
              </p>
              <h1 className="font-display text-5xl lg:text-7xl xl:text-8xl text-brand-white leading-none mb-6">
                Elegancia<br />
                <em className="text-brand-gold not-italic">masculina.</em><br />
                <span className="text-4xl lg:text-5xl xl:text-6xl">Vestí con<br />presencia.</span>
              </h1>
              <p className="font-body text-base text-brand-silver leading-relaxed mb-10 max-w-md">
                Trajes, camisas y accesorios de primera calidad para el hombre que entiende que la ropa habla antes que las palabras.
              </p>

              {/* Benefits */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <div className="flex items-center gap-2 text-brand-pearl">
                  <span className="text-brand-gold text-lg">💳</span>
                  <span className="font-body text-sm">12 cuotas sin interés</span>
                </div>
                <div className="flex items-center gap-2 text-brand-pearl">
                  <span className="text-brand-gold text-lg">📦</span>
                  <span className="font-body text-sm">Envíos a todo el país</span>
                </div>
                <div className="flex items-center gap-2 text-brand-pearl">
                  <span className="text-brand-gold text-lg">💬</span>
                  <span className="font-body text-sm">Asesoramiento personalizado</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/catalogo"
                  className="inline-flex items-center justify-center gap-2 bg-brand-gold text-brand-black font-body font-600 text-sm tracking-luxury px-8 py-4 hover:bg-brand-gold-light transition-colors duration-200 uppercase"
                >
                  Comprar ahora →
                </Link>
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 border border-[#25D366] text-[#25D366] font-body font-600 text-sm tracking-wide px-8 py-4 hover:bg-[#25D366] hover:text-brand-black transition-all duration-200 uppercase"
                >
                  <WhatsAppIcon />
                  Hablar por WhatsApp
                </a>
              </div>
            </div>

            {/* Hero image placeholder / decorative */}
            <div className="hidden lg:block relative">
              <div className="relative h-[600px] bg-brand-charcoal overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800"
                  alt="Stars Hombres - Elegancia masculina"
                  className="w-full h-full object-cover opacity-80"
                />
                {/* Gold overlay frame */}
                <div className="absolute inset-4 border border-brand-gold/20" />
                <div className="absolute bottom-6 left-6 right-6 bg-brand-black/80 backdrop-blur-sm px-6 py-4">
                  <p className="font-display text-xl text-brand-white">Ambo Clásico Negro</p>
                  <p className="font-body text-sm text-brand-gold">desde {formatPrice(189000)}</p>
                </div>
              </div>
              {/* Decorative gold dots */}
              <div className="absolute -top-4 -right-4 w-32 h-32 border border-brand-gold/30" />
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-brand-gold/5" />
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="bg-brand-charcoal border-y border-brand-graphite py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '💳', title: '12 cuotas sin interés', sub: 'Tarjeta Naranja' },
              { icon: '🚚', title: 'Envíos a todo el país', sub: 'Gratis en compras +$150k' },
              { icon: '✓', title: 'Calidad garantizada', sub: 'Materiales premium' },
              { icon: '💬', title: 'Atención personalizada', sub: 'Lun–Sáb 10 a 20hs' },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-4">
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <p className="font-body font-600 text-sm text-brand-white">{item.title}</p>
                  <p className="font-body text-xs text-brand-silver">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="font-body text-xs tracking-luxury text-brand-gold uppercase mb-3">Selección</p>
            <h2 className="font-display text-4xl lg:text-5xl text-brand-white">Productos Destacados</h2>
          </div>
          <Link
            href="/catalogo"
            className="hidden sm:flex font-body text-sm tracking-wide text-brand-gold border-b border-brand-gold pb-1 hover:text-brand-gold-light transition-colors uppercase"
          >
            Ver todo →
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 text-center sm:hidden">
          <Link href="/catalogo" className="inline-block border border-brand-gold text-brand-gold font-body text-sm tracking-luxury px-8 py-3 uppercase hover:bg-brand-gold hover:text-brand-black transition-all">
            Ver todo el catálogo →
          </Link>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20 bg-brand-charcoal">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="font-body text-xs tracking-luxury text-brand-gold uppercase mb-3">Colección</p>
            <h2 className="font-display text-4xl lg:text-5xl text-brand-white">Categorías</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.key}
                href={`/catalogo?categoria=${cat.key}`}
                className="group relative bg-brand-graphite hover:bg-brand-gold/10 border border-brand-graphite hover:border-brand-gold transition-all duration-300 p-8 flex flex-col items-center text-center"
              >
                <span className="text-5xl mb-4">{cat.icon}</span>
                <h3 className="font-display text-xl text-brand-white group-hover:text-brand-gold transition-colors mb-2">
                  {cat.label}
                </h3>
                <p className="font-body text-xs text-brand-silver">{cat.desc}</p>
                <span className="mt-4 font-body text-[10px] tracking-luxury text-brand-gold uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                  Ver →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PROMOTIONAL BANNER */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="relative bg-brand-charcoal border border-brand-gold/30 p-12 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'repeating-linear-gradient(45deg, #C9A84C 0, #C9A84C 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px'}} />
          <div className="relative">
            <p className="font-body text-xs tracking-luxury text-brand-gold uppercase mb-4 animate-gold-shimmer">
              ✦ Oferta especial ✦
            </p>
            <h2 className="font-display text-3xl lg:text-5xl text-brand-white mb-4">
              12 cuotas sin interés<br />
              <em className="text-brand-gold not-italic">en toda la colección</em>
            </h2>
            <p className="font-body text-brand-silver text-base mb-8 max-w-xl mx-auto">
              Con Tarjeta Naranja X en compras realizadas en nuestro local o tienda online. Consultá disponibilidad.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/catalogo"
                className="bg-brand-gold text-brand-black font-body font-600 text-sm tracking-luxury px-10 py-4 hover:bg-brand-gold-light transition-colors uppercase"
              >
                Ver colección
              </Link>
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-brand-white/30 text-brand-white font-body text-sm tracking-wide px-10 py-4 hover:border-brand-gold hover:text-brand-gold transition-all uppercase"
              >
                Consultar
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-brand-charcoal">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="font-body text-xs tracking-luxury text-brand-gold uppercase mb-3">Reseñas</p>
            <h2 className="font-display text-4xl lg:text-5xl text-brand-white">Lo que dicen nuestros clientes</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-brand-graphite p-8 relative">
                <div className="absolute top-6 right-6 text-brand-gold/20 font-display text-6xl leading-none">"</div>
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <svg key={star} className={`w-4 h-4 ${star <= t.rating ? 'text-brand-gold' : 'text-brand-graphite'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="font-body text-brand-pearl text-sm leading-relaxed mb-6 relative z-10">
                  {t.comment}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-gold/20 rounded-full flex items-center justify-center">
                    <span className="font-body font-600 text-brand-gold text-sm">
                      {t.customer_name.charAt(0)}
                    </span>
                  </div>
                  <p className="font-body font-600 text-brand-white text-sm">{t.customer_name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCAL VISIT CTA */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-body text-xs tracking-luxury text-brand-gold uppercase mb-4">Visitanos</p>
            <h2 className="font-display text-4xl text-brand-white mb-6">
              También podés venir<br />al local físico
            </h2>
            <p className="font-body text-brand-silver mb-6 leading-relaxed">
              Probate la ropa, recibí asesoramiento personalizado y llevate tu outfit el mismo día. Estamos en Córdoba Capital.
            </p>
            <div className="space-y-3 mb-8">
              <p className="font-body text-sm text-brand-pearl flex items-center gap-2">
                📍 <span>Córdoba, Argentina</span>
              </p>
              <p className="font-body text-sm text-brand-pearl flex items-center gap-2">
                🕐 <span>Lun–Vie: 9:30 a 19:00 · Sáb: 9:30 a 14:00</span>
              </p>
              <p className="font-body text-sm text-brand-pearl flex items-center gap-2">
                📞 <span>Consultas por WhatsApp</span>
              </p>
            </div>
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-brand-black font-body font-600 text-sm tracking-wide px-8 py-4 hover:bg-[#128C7E] hover:text-brand-white transition-colors uppercase"
            >
              <WhatsAppIcon />
              Consultar horarios y dirección
            </a>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
              'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400',
            ].map((img, i) => (
              <div key={i} className={`overflow-hidden ${i === 0 ? 'mt-6' : '-mt-6'}`}>
                <img src={img} alt="Local Stars Hombres" className="w-full aspect-[3/4] object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

export async function getStaticProps() {
  try {
    const db = require('../lib/db')

    const productsResult = await db.query(
      `SELECT p.id, p.slug, p.name, p.category, p.base_price, p.images, p.featured,
        COALESCE(json_agg(
          json_build_object('id', pv.id, 'sku', pv.sku, 'size', pv.size, 'color', pv.color, 'color_hex', pv.color_hex, 'stock', pv.stock)
        ) FILTER (WHERE pv.id IS NOT NULL), '[]') as variants,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(r.id) FILTER (WHERE r.approved = true) as review_count
       FROM products p
       LEFT JOIN product_variants pv ON pv.product_id = p.id
       LEFT JOIN reviews r ON r.product_id = p.id AND r.approved = true
       WHERE p.active = true AND p.featured = true
       GROUP BY p.id
       ORDER BY p.created_at DESC
       LIMIT 4`
    )

    const reviewsResult = await db.query(
      `SELECT r.customer_name, r.rating, r.comment FROM reviews r
       WHERE r.approved = true ORDER BY r.created_at DESC LIMIT 6`
    )

    return {
      props: {
        featuredProducts: productsResult.rows,
        testimonials: reviewsResult.rows,
      },
      revalidate: 60,
    }
  } catch (err) {
    console.error('getStaticProps error:', err)
    return {
      props: {
        featuredProducts: [],
        testimonials: [
          { customer_name: 'Martín G.', rating: 5, comment: 'Calidad increíble, quedó perfecto para el casamiento de mi hermano.' },
          { customer_name: 'Rodrigo P.', rating: 5, comment: 'El corte es impecable. Lo usé en una reunión de negocios y recibí muchos elogios.' },
          { customer_name: 'Santiago L.', rating: 4, comment: 'Muy buena calidad de tela. Entrega rápida y bien empaquetado.' },
        ],
      },
      revalidate: 60,
    }
  }
}
