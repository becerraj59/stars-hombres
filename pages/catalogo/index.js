// pages/catalogo/index.js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/layout/Layout'
import ProductCard from '../../components/ui/ProductCard'
import { CATEGORY_LABELS } from '../../lib/utils'

export default function CatalogPage() {
  const router = useRouter()
  const { categoria, talle, color, precio } = router.query

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    categoria: categoria || '',
    talle: talle || '',
    color: color || '',
    precio: precio || '',
  })

  useEffect(() => {
    setFilters({
      categoria: categoria || '',
      talle: talle || '',
      color: color || '',
      precio: precio || '',
    })
  }, [categoria, talle, color, precio])

  useEffect(() => {
    fetchProducts()
  }, [filters])

  async function fetchProducts() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.categoria) params.set('category', filters.categoria)
      const res = await fetch(`/api/products?${params.toString()}`)
      const data = await res.json()

      let prods = data.products || []

      // Client-side size filter
      if (filters.talle) {
        prods = prods.filter((p) => p.variants?.some((v) => v.size === filters.talle))
      }

      // Client-side price filter
      if (filters.precio) {
        const [min, max] = filters.precio.split('-').map(Number)
        prods = prods.filter((p) => {
          if (max) return p.base_price >= min && p.base_price <= max
          return p.base_price >= min
        })
      }

      setProducts(prods)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function applyFilter(key, value) {
    const newFilters = { ...filters, [key]: value === filters[key] ? '' : value }
    setFilters(newFilters)

    const query = {}
    if (newFilters.categoria) query.categoria = newFilters.categoria
    if (newFilters.talle) query.talle = newFilters.talle
    if (newFilters.color) query.color = newFilters.color
    if (newFilters.precio) query.precio = newFilters.precio
    router.push({ pathname: '/catalogo', query }, undefined, { shallow: true })
  }

  const categoryTitle = filters.categoria ? CATEGORY_LABELS[filters.categoria] : 'Todos los productos'

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '38', '40', '42', '44', '46', '48', '50', '52']
  const priceRanges = [
    { label: 'Hasta $50.000', value: '0-50000' },
    { label: '$50k–$100k', value: '50000-100000' },
    { label: '$100k–$200k', value: '100000-200000' },
    { label: 'Más de $200k', value: '200000' },
  ]

  return (
    <Layout
      title={categoryTitle}
      description={`Comprá ${categoryTitle.toLowerCase()} de alta calidad en Stars Hombres. Envíos a todo el país. 12 cuotas sin interés.`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <p className="font-body text-xs tracking-luxury text-brand-gold uppercase mb-2">Catálogo</p>
          <h1 className="font-display text-4xl text-brand-white">{categoryTitle}</h1>
          <p className="font-body text-brand-silver text-sm mt-2">{products.length} productos</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-brand-charcoal p-6 sticky top-24">
              <h2 className="font-body text-xs tracking-luxury text-brand-gold uppercase mb-6">Filtros</h2>

              {/* Category */}
              <div className="mb-6">
                <h3 className="font-body text-sm text-brand-pearl uppercase tracking-wide mb-3">Categoría</h3>
                <div className="space-y-2">
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => applyFilter('categoria', key)}
                      className={`block w-full text-left font-body text-sm px-3 py-2 transition-colors ${
                        filters.categoria === key
                          ? 'bg-brand-gold text-brand-black'
                          : 'text-brand-silver hover:text-brand-white'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div className="mb-6">
                <h3 className="font-body text-sm text-brand-pearl uppercase tracking-wide mb-3">Talle</h3>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => applyFilter('talle', size)}
                      className={`font-body text-xs px-3 py-2 border transition-all ${
                        filters.talle === size
                          ? 'border-brand-gold bg-brand-gold text-brand-black'
                          : 'border-brand-graphite text-brand-silver hover:border-brand-silver'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <h3 className="font-body text-sm text-brand-pearl uppercase tracking-wide mb-3">Precio</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => applyFilter('precio', range.value)}
                      className={`block w-full text-left font-body text-sm px-3 py-2 transition-colors ${
                        filters.precio === range.value
                          ? 'bg-brand-gold text-brand-black'
                          : 'text-brand-silver hover:text-brand-white'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear filters */}
              {(filters.categoria || filters.talle || filters.precio) && (
                <button
                  onClick={() => {
                    setFilters({ categoria: '', talle: '', color: '', precio: '' })
                    router.push('/catalogo', undefined, { shallow: true })
                  }}
                  className="w-full font-body text-xs tracking-wide text-brand-silver border border-brand-graphite py-2 hover:border-brand-gold hover:text-brand-gold transition-all uppercase"
                >
                  ✕ Limpiar filtros
                </button>
              )}
            </div>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-brand-charcoal animate-pulse aspect-[3/4]" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-display text-2xl text-brand-silver mb-4">Sin resultados</p>
                <p className="font-body text-brand-silver text-sm mb-8">No encontramos productos con estos filtros.</p>
                <button
                  onClick={() => {
                    setFilters({ categoria: '', talle: '', color: '', precio: '' })
                    router.push('/catalogo', undefined, { shallow: true })
                  }}
                  className="font-body text-sm text-brand-gold border border-brand-gold px-6 py-3 hover:bg-brand-gold hover:text-brand-black transition-all uppercase tracking-wide"
                >
                  Ver todos los productos
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
