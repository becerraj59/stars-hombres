// pages/admin/index.js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { formatPrice } from '../../lib/utils'

const STATUS_LABELS = {
  pending: { label: 'Pendiente', color: 'bg-yellow-500/20 text-yellow-400' },
  confirmed: { label: 'Confirmado', color: 'bg-blue-500/20 text-blue-400' },
  paid: { label: 'Pagado', color: 'bg-green-500/20 text-green-400' },
  shipped: { label: 'Enviado', color: 'bg-purple-500/20 text-purple-400' },
  delivered: { label: 'Entregado', color: 'bg-green-700/20 text-green-300' },
  cancelled: { label: 'Cancelado', color: 'bg-red-500/20 text-red-400' },
}

const PAYMENT_STATUS = {
  pending: { label: 'Sin pagar', color: 'text-yellow-400' },
  paid: { label: 'Pagado', color: 'text-green-400' },
  rejected: { label: 'Rechazado', color: 'text-red-400' },
  refunded: { label: 'Reembolsado', color: 'text-brand-silver' },
}

export default function AdminPanel() {
  const router = useRouter()
  const [tab, setTab] = useState('orders')
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')

  // Stats
  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.order_status === 'pending').length,
    totalRevenue: orders.filter((o) => o.payment_status === 'paid').reduce((s, o) => s + o.total, 0),
    todayOrders: orders.filter((o) => {
      const today = new Date().toDateString()
      return new Date(o.created_at).toDateString() === today
    }).length,
  }

  useEffect(() => {
    // Check if logged in by attempting to fetch orders
    fetchOrders()
  }, [])

  async function handleLogin(e) {
    e.preventDefault()
    setLoginError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setIsLoggedIn(true)
      fetchOrders()
      fetchProducts()
    } catch (err) {
      setLoginError(err.message)
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    setIsLoggedIn(false)
    setOrders([])
    setProducts([])
  }

  async function fetchOrders() {
    try {
      const res = await fetch('/api/orders')
      if (res.status === 401) { setLoading(false); return }
      const data = await res.json()
      setOrders(data.orders || [])
      setIsLoggedIn(true)
    } catch {}
    setLoading(false)
  }

  async function fetchProducts() {
    try {
      const res = await fetch('/api/products/admin')
      const data = await res.json()
      setProducts(data.products || [])
    } catch {}
  }

  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders()
      fetchProducts()
    }
  }, [isLoggedIn])

  async function updateOrder(orderId, updates) {
    try {
      await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, ...updates }),
      })
      fetchOrders()
      setSelectedOrder(null)
    } catch (err) {
      alert('Error al actualizar el pedido')
    }
  }

  async function updateProductStock(productId, variantId, newStock) {
    try {
      const product = products.find((p) => p.id === productId)
      const updatedVariants = product.variants.map((v) =>
        v.id === variantId ? { ...v, stock: parseInt(newStock) } : v
      )
      await fetch('/api/products/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: productId,
          name: product.name,
          description: product.description,
          base_price: product.base_price,
          images: product.images,
          featured: product.featured,
          active: product.active,
          variants: updatedVariants,
        }),
      })
      fetchProducts()
    } catch (err) {
      alert('Error al actualizar stock')
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center px-4">
        <Head><title>Admin – Stars Hombres</title></Head>
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <div className="font-display text-4xl text-brand-white mb-1">STARS</div>
            <div className="font-body text-[10px] tracking-luxury text-brand-gold">ADMINISTRACIÓN</div>
          </div>
          <form onSubmit={handleLogin} className="bg-brand-charcoal p-8">
            <div className="mb-4">
              <label className="font-body text-xs text-brand-silver uppercase tracking-wide mb-2 block">Email</label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full bg-brand-graphite border border-brand-graphite text-brand-white font-body text-sm px-4 py-3 focus:border-brand-gold outline-none"
                required
              />
            </div>
            <div className="mb-6">
              <label className="font-body text-xs text-brand-silver uppercase tracking-wide mb-2 block">Contraseña</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                className="w-full bg-brand-graphite border border-brand-graphite text-brand-white font-body text-sm px-4 py-3 focus:border-brand-gold outline-none"
                required
              />
            </div>
            {loginError && <p className="font-body text-xs text-red-400 mb-4">{loginError}</p>}
            <button type="submit" className="w-full bg-brand-gold text-brand-black font-body font-600 text-sm tracking-luxury py-4 hover:bg-brand-gold-light transition-colors uppercase">
              Ingresar
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-black">
      <Head><title>Admin – Stars Hombres</title></Head>

      {/* Admin Header */}
      <header className="bg-brand-charcoal border-b border-brand-graphite px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-display text-xl text-brand-white">STARS</span>
          <span className="font-body text-[10px] tracking-luxury text-brand-gold uppercase">Admin</span>
        </div>
        <button onClick={handleLogout} className="font-body text-xs text-brand-silver hover:text-brand-white uppercase tracking-wide">
          Cerrar sesión
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total pedidos', value: stats.totalOrders },
            { label: 'Pendientes', value: stats.pendingOrders, alert: stats.pendingOrders > 0 },
            { label: 'Facturado (pagado)', value: formatPrice(stats.totalRevenue) },
            { label: 'Pedidos hoy', value: stats.todayOrders },
          ].map((stat) => (
            <div key={stat.label} className={`bg-brand-charcoal p-6 border ${stat.alert ? 'border-brand-gold' : 'border-brand-graphite'}`}>
              <p className="font-body text-xs text-brand-silver uppercase tracking-wide mb-2">{stat.label}</p>
              <p className={`font-display text-2xl ${stat.alert ? 'text-brand-gold' : 'text-brand-white'}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-brand-graphite">
          {['orders', 'products'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`font-body text-xs tracking-wide px-6 py-3 uppercase transition-colors ${
                tab === t ? 'text-brand-gold border-b-2 border-brand-gold' : 'text-brand-silver hover:text-brand-white'
              }`}
            >
              {t === 'orders' ? `Pedidos (${orders.length})` : `Productos (${products.length})`}
            </button>
          ))}
        </div>

        {/* ORDERS TAB */}
        {tab === 'orders' && (
          <div>
            {selectedOrder ? (
              <div className="bg-brand-charcoal p-6 border border-brand-gold/20">
                <button onClick={() => setSelectedOrder(null)} className="font-body text-xs text-brand-silver mb-6 hover:text-brand-white">
                  ← Volver
                </button>
                <h2 className="font-display text-2xl text-brand-white mb-4">Orden #{selectedOrder.order_number}</h2>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-body text-xs tracking-wide text-brand-gold uppercase mb-3">Cliente</h3>
                    <p className="font-body text-sm text-brand-white">{selectedOrder.customer_name}</p>
                    <p className="font-body text-sm text-brand-silver">{selectedOrder.customer_email}</p>
                    <p className="font-body text-sm text-brand-silver">{selectedOrder.customer_phone}</p>
                    {selectedOrder.customer_address && (
                      <p className="font-body text-sm text-brand-silver">{selectedOrder.customer_address}, {selectedOrder.customer_province}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="font-body text-xs tracking-wide text-brand-gold uppercase mb-3">Pago</h3>
                    <p className="font-body text-sm text-brand-white">{selectedOrder.payment_method === 'mercadopago' ? 'Mercado Pago' : 'Transferencia'}</p>
                    <p className="font-body text-lg text-brand-gold font-600">{formatPrice(selectedOrder.total)}</p>
                    <p className={`font-body text-sm ${PAYMENT_STATUS[selectedOrder.payment_status]?.color}`}>
                      {PAYMENT_STATUS[selectedOrder.payment_status]?.label}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-body text-xs tracking-wide text-brand-gold uppercase mb-3">Productos</h3>
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} className="flex justify-between py-2 border-b border-brand-graphite">
                      <span className="font-body text-sm text-brand-white">{item.productName} – T.{item.size} {item.color} x{item.quantity}</span>
                      <span className="font-body text-sm text-brand-silver">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-xs text-brand-silver uppercase mb-2 block">Estado del pedido</label>
                    <select
                      defaultValue={selectedOrder.order_status}
                      onChange={(e) => updateOrder(selectedOrder.id, { order_status: e.target.value })}
                      className="w-full bg-brand-graphite border border-brand-graphite text-brand-white font-body text-sm px-4 py-3 focus:border-brand-gold outline-none"
                    >
                      <option value="pending">Pendiente</option>
                      <option value="confirmed">Confirmado</option>
                      <option value="paid">Pagado</option>
                      <option value="shipped">Enviado</option>
                      <option value="delivered">Entregado</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-body text-xs text-brand-silver uppercase mb-2 block">Estado de pago</label>
                    <select
                      defaultValue={selectedOrder.payment_status}
                      onChange={(e) => updateOrder(selectedOrder.id, { payment_status: e.target.value })}
                      className="w-full bg-brand-graphite border border-brand-graphite text-brand-white font-body text-sm px-4 py-3 focus:border-brand-gold outline-none"
                    >
                      <option value="pending">Sin pagar</option>
                      <option value="paid">Pagado ✓</option>
                      <option value="rejected">Rechazado</option>
                      <option value="refunded">Reembolsado</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-brand-graphite">
                      {['Orden', 'Cliente', 'Total', 'Pago', 'Estado', 'Fecha', ''].map((h) => (
                        <th key={h} className="font-body text-[10px] tracking-luxury text-brand-gold uppercase text-left px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-brand-graphite hover:bg-brand-charcoal transition-colors">
                        <td className="px-4 py-4 font-body text-sm text-brand-gold font-500">{order.order_number}</td>
                        <td className="px-4 py-4">
                          <p className="font-body text-sm text-brand-white">{order.customer_name}</p>
                          <p className="font-body text-xs text-brand-silver">{order.customer_email}</p>
                        </td>
                        <td className="px-4 py-4 font-body text-sm text-brand-white font-500">{formatPrice(order.total)}</td>
                        <td className="px-4 py-4">
                          <span className={`font-body text-xs ${PAYMENT_STATUS[order.payment_status]?.color}`}>
                            {PAYMENT_STATUS[order.payment_status]?.label}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`font-body text-xs px-2 py-1 rounded-sm ${STATUS_LABELS[order.order_status]?.color || 'bg-brand-graphite text-brand-silver'}`}>
                            {STATUS_LABELS[order.order_status]?.label || order.order_status}
                          </span>
                        </td>
                        <td className="px-4 py-4 font-body text-xs text-brand-silver">
                          {new Date(order.created_at).toLocaleDateString('es-AR')}
                        </td>
                        <td className="px-4 py-4">
                          <button onClick={() => setSelectedOrder(order)} className="font-body text-xs text-brand-gold hover:text-brand-gold-light uppercase">
                            Ver →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {orders.length === 0 && (
                  <p className="font-body text-center text-brand-silver py-16">No hay pedidos aún</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* PRODUCTS TAB */}
        {tab === 'products' && (
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="bg-brand-charcoal border border-brand-graphite p-6">
                <div className="flex items-start gap-6">
                  {product.images?.[0] && (
                    <img src={product.images[0]} alt={product.name} className="w-20 h-24 object-cover flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-display text-lg text-brand-white">{product.name}</h3>
                      <span className={`font-body text-[10px] px-2 py-1 uppercase ${product.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {product.active ? 'Activo' : 'Oculto'}
                      </span>
                    </div>
                    <p className="font-body text-sm text-brand-gold mb-4">{formatPrice(product.base_price)}</p>

                    {/* Variant stocks */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {product.variants?.map((v) => (
                        <div key={v.id} className="bg-brand-graphite px-3 py-2">
                          <p className="font-body text-[10px] text-brand-silver uppercase">{v.size} – {v.color}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="number"
                              defaultValue={v.stock}
                              min="0"
                              className="w-16 bg-brand-black border border-brand-graphite text-brand-white text-xs font-body px-2 py-1 focus:border-brand-gold outline-none"
                              onBlur={(e) => {
                                if (parseInt(e.target.value) !== v.stock) {
                                  updateProductStock(product.id, v.id, e.target.value)
                                }
                              }}
                            />
                            <span className="font-body text-[10px] text-brand-silver">uds</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
