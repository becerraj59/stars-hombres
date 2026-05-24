// components/layout/Layout.jsx
import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getWhatsAppLink } from '../../lib/utils'

export default function Layout({ children, title, description, canonical }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const siteTitle = title ? `${title} | Stars Hombres` : 'Stars Hombres | Indumentaria Masculina Premium'
  const metaDesc = description || 'Trajes, camisas, sweaters y calzado masculino de alta calidad. Envíos a todo el país. 12 cuotas sin interés con Tarjeta Naranja. Córdoba, Argentina.'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const categories = [
   { href: '/catalogo?temporada=verano', label: 'Verano' },
      { href: '/catalogo?temporada=otono-invierno', label: 'Otoño-Invierno 2026' },
      { href: '/oportunidades', label: 'Oportunidades' },
      { href: '/catalogo', label: 'Todo' }
  ]
  return (
    <>
      <Head>
        <title>{siteTitle}</title>
        <meta name="description" content={metaDesc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Stars Hombres" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.ico" />
        {canonical && <link rel="canonical" href={canonical} />}
      </Head>

      {/* Announcement Bar */}
      <div className="bg-brand-gold text-brand-black text-center py-2 px-4 text-xs tracking-luxury font-body font-500">
        ENVÍO GRATIS EN COMPRAS SUPERIORES A $180.000 · 12 CUOTAS SIN INTERÉS CON TARJETA NARANJA
      </div>

      {/* Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-brand-black/95 backdrop-blur-md shadow-lg shadow-black/50' : 'bg-brand-charcoal'
        } border-b border-brand-graphite`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex flex-col">
              <span className="font-display text-2xl lg:text-3xl text-brand-white tracking-wide leading-none">
                STARS
              </span>
              <span className="font-body text-[10px] tracking-luxury text-brand-gold uppercase">
                Hombres
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {categories.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="font-body text-sm tracking-wide text-brand-pearl hover:text-brand-gold transition-colors duration-200 uppercase"
                >
                  {cat.label}
                </Link>
              ))}
              <Link
                href="/catalogo"
                className="font-body text-sm tracking-wide text-brand-pearl hover:text-brand-gold transition-colors duration-200 uppercase"
              >
                Todo
              </Link>
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366] hover:text-brand-black px-4 py-2 text-xs font-body font-600 tracking-wide transition-all duration-200 uppercase"
              >
                <WhatsAppIcon />
                WhatsApp
              </a>

              {/* Mobile menu */}
              <button
                className="lg:hidden text-brand-pearl p-2"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Menú"
              >
                <div className="w-6 h-5 flex flex-col justify-between">
                  <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                  <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                  <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden bg-brand-charcoal border-t border-brand-graphite">
            <div className="px-4 py-4 space-y-1">
              {categories.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 font-body text-sm tracking-wide text-brand-pearl hover:text-brand-gold border-b border-brand-graphite uppercase"
                >
                  {cat.label}
                </Link>
              ))}
              <Link
                href="/catalogo"
                onClick={() => setMenuOpen(false)}
                className="block py-3 font-body text-sm tracking-wide text-brand-pearl hover:text-brand-gold uppercase"
              >
                Ver todo
              </Link>
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 mt-4 bg-[#25D366] text-brand-black px-4 py-3 text-sm font-body font-600 uppercase tracking-wide"
              >
                <WhatsAppIcon />
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        )}
      </header>

      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-brand-charcoal border-t border-brand-graphite mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="font-display text-3xl text-brand-white tracking-wide mb-1">STARS</div>
              <div className="font-body text-[10px] tracking-luxury text-brand-gold uppercase mb-4">Hombres</div>
              <p className="font-body text-sm text-brand-silver leading-relaxed">
                Elegancia masculina. Vestí con presencia. Indumentaria de alta calidad para el hombre moderno.
              </p>
              <p className="font-body text-sm text-brand-silver mt-4">
                📍 Rivera Indarte 139, Local 20 - Galería Cervantes, Córdoba
              </p>
            </div>

            <div>
              <h4 className="font-body text-xs tracking-luxury text-brand-gold uppercase mb-6">Categorías</h4>
              <ul className="space-y-3">
                {categories.map((cat) => (
                  <li key={cat.href}>
                    <Link href={cat.href} className="font-body text-sm text-brand-silver hover:text-brand-white transition-colors">
                      {cat.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-body text-xs tracking-luxury text-brand-gold uppercase mb-6">Atención al cliente</h4>
              <ul className="space-y-3">
                <li>
                  <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer"
                    className="font-body text-sm text-brand-silver hover:text-[#25D366] transition-colors">
                    💬 WhatsApp
                  </a>
                </li>
                <li className="font-body text-sm text-brand-silver">Lun–Sáb: 10:00 a 20:00</li>
                <li className="font-body text-sm text-brand-silver">✈️ Envíos a todo el país</li>
                <li className="font-body text-sm text-brand-silver">💳 12 cuotas sin interés</li>
              </ul>
            </div>
          </div>

          <div className="gold-divider my-10" />
          <p className="font-body text-xs text-brand-silver text-center tracking-wide">
            © {new Date().getFullYear()} Stars Hombres. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href={getWhatsAppLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-200"
        aria-label="Contactar por WhatsApp"
      >
        <WhatsAppIcon size={28} />
      </a>
    </>
  )
}

function WhatsAppIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}
