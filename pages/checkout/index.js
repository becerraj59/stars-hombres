// pages/checkout/index.js
import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../components/layout/Layout'
import { formatPrice, calculateInstallments } from '../../lib/utils'
import { useCart } from '../../lib/CartContext'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, total, clearCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState('mercadopago')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    customerCity: '',
    customerProvince: '',
  })

  const provinces = [
    'Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes',
    'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza',
    'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan', 'San Luis',
    'Santa Cruz', 'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucumán',
    'CABA',
  ]

  const shipping = total >= 150000 ? 0 : 5500
  const finalTotal = total + shipping

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.customerName || !form.customerEmail || !form.customerPhone) {
      setError('Completá los datos obligatorios')
      return
    }

    if (cart.length === 0) {
      setError('Tu carrito está vacío')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: cart.map((item) => ({
            sku: item.sku,
            productId: item.productId,
            productName: item.productName,
            size: item.size,
            color: item.color,
            price: item.price,
            quantity: item.quantity,
          })),
          paymentMethod,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al procesar el pedido')

      clearCart()

      if (paymentMethod === 'mercadopago' && data.mpInitPoint) {
        window.location.href = data.mpInitPoint
      } else {
        router.push(`/orden/confirmacion?order=${data.orderNumber}&method=${paymentMethod}`)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <Layout title="Carrito vacío">
        <div className="max-w-xl mx-auto px-4 py-32 text-center">
          <p className="font-display text-3xl text-brand-white mb-4">Tu carrito está vacío</p>
          <p className="font-body text-brand-silver mb-8">Agregá productos para continuar</p>
          <Link href="/catalogo" className="inline-block bg-brand-gold text-brand-black font-body font-600 text-sm tracking-luxury px-10 py-4 uppercase hover:bg-brand-gold-light transition-colors">
            Ver catálogo
          </Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Checkout">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-4xl text-brand-white mb-10">Finalizar compra</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Left: Customer data + payment */}
            <div className="lg:col-span-2 space-y-8">
              {/* Customer Data */}
              <div className="bg-brand-charcoal p-8">
                <h2 className="font-body text-xs tracking-luxury text-brand-gold uppercase mb-6">Tus datos</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-xs text-brand-silver uppercase tracking-wide mb-2 block">
                      Nombre completo *
                    </label>
                    <input
                      name="customerName"
                      value={form.customerName}
                      onChange={handleChange}
                      required
                      className="w-full bg-brand-graphite border border-brand-graphite text-brand-white font-body text-sm px-4 py-3 focus:border-brand-gold outline-none transition-colors"
                      placeholder="Juan García"
                    />
                  </div>
                  <div>
                    <label className="font-body text-xs text-brand-silver uppercase tracking-wide mb-2 block">Email *</label>
                    <input
                      name="customerEmail"
                      type="email"
                      value={form.customerEmail}
                      onChange={handleChange}
                      required
                      className="w-full bg-brand-graphite border border-brand-graphite text-brand-white font-body text-sm px-4 py-3 focus:border-brand-gold outline-none transition-colors"
                      placeholder="juan@email.com"
                    />
                  </div>
                  <div>
                    <label className="font-body text-xs text-brand-silver uppercase tracking-wide mb-2 block">
                      WhatsApp / Teléfono *
                    </label>
                    <input
                      name="customerPhone"
                      value={form.customerPhone}
                      onChange={handleChange}
                      required
                      className="w-full bg-brand-graphite border border-brand-graphite text-brand-white font-body text-sm px-4 py-3 focus:border-brand-gold outline-none transition-colors"
                      placeholder="3516000000"
                    />
                  </div>
                  <div>
                    <label className="font-body text-xs text-brand-silver uppercase tracking-wide mb-2 block">Provincia</label>
                    <select
                      name="customerProvince"
                      value={form.customerProvince}
                      onChange={handleChange}
                      className="w-full bg-brand-graphite border border-brand-graphite text-brand-white font-body text-sm px-4 py-3 focus:border-brand-gold outline-none transition-colors"
                    >
                      <option value="">Seleccioná tu provincia</option>
                      {provinces.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-body text-xs text-brand-silver uppercase tracking-wide mb-2 block">
                      Dirección de envío
                    </label>
                    <input
                      name="customerAddress"
                      value={form.customerAddress}
                      onChange={handleChange}
                      className="w-full bg-brand-graphite border border-brand-graphite text-brand-white font-body text-sm px-4 py-3 focus:border-brand-gold outline-none transition-colors"
                      placeholder="Av. Colón 1234, Córdoba"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-brand-charcoal p-8">
                <h2 className="font-body text-xs tracking-luxury text-brand-gold uppercase mb-6">Método de pago</h2>
                <div className="space-y-4">
                  {/* Mercado Pago */}
                  <label className={`flex items-start gap-4 p-5 border cursor-pointer transition-all ${
                    paymentMethod === 'mercadopago' ? 'border-brand-gold bg-brand-gold/5' : 'border-brand-graphite hover:border-brand-silver'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mercadopago"
                      checked={paymentMethod === 'mercadopago'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1 accent-brand-gold"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-body font-600 text-brand-white text-sm">Mercado Pago</span>
                        <span className="bg-[#009EE3]/20 text-[#009EE3] text-[10px] font-body px-2 py-0.5 uppercase tracking-wide">Recomendado</span>
                      </div>
                      <p className="font-body text-xs text-brand-silver">
                        Tarjeta de crédito, débito, Mercado Pago saldo. Hasta 12 cuotas sin interés con Tarjeta Naranja.
                      </p>
                      <div className="flex gap-2 mt-3">
                        {['Visa', 'Master', 'Naranja', 'MP'].map((c) => (
                          <span key={c} className="bg-brand-graphite text-brand-silver text-[9px] font-body px-2 py-1 uppercase">{c}</span>
                        ))}
                      </div>
                    </div>
                  </label>

                  {/* Transfer */}
                  <label className={`flex items-start gap-4 p-5 border cursor-pointer transition-all ${
                    paymentMethod === 'transfer' ? 'border-brand-gold bg-brand-gold/5' : 'border-brand-graphite hover:border-brand-silver'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="transfer"
                      checked={paymentMethod === 'transfer'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1 accent-brand-gold"
                    />
                    <div>
                      <p className="font-body font-600 text-brand-white text-sm mb-1">Transferencia bancaria</p>
                      <p className="font-body text-xs text-brand-silver">
                        Realizá la transferencia y envianos el comprobante por WhatsApp. Precio final sin cargos adicionales.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right: Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-brand-charcoal p-6 sticky top-24">
                <h2 className="font-body text-xs tracking-luxury text-brand-gold uppercase mb-6">Resumen del pedido</h2>

                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.sku} className="flex gap-3">
                      {item.image && (
                        <img src={item.image} alt={item.productName} className="w-16 h-20 object-cover bg-brand-graphite flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm text-brand-white font-500 leading-tight">{item.productName}</p>
                        <p className="font-body text-xs text-brand-silver mt-1">
                          Talle {item.size} · {item.color} · x{item.quantity}
                        </p>
                        <p className="font-body text-sm text-brand-gold font-600 mt-1">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="gold-divider mb-4" />

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-brand-silver">Subtotal</span>
                    <span className="text-brand-white">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-brand-silver">Envío</span>
                    <span className={shipping === 0 ? 'text-green-400' : 'text-brand-white'}>
                      {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="font-body text-xs text-brand-silver">Envío gratis en compras +$150.000</p>
                  )}
                </div>

                <div className="gold-divider mb-4" />

                <div className="flex justify-between font-body font-600 text-lg mb-2">
                  <span className="text-brand-white">Total</span>
                  <span className="text-brand-gold">{formatPrice(finalTotal)}</span>
                </div>

                {paymentMethod === 'mercadopago' && (
                  <p className="font-body text-xs text-brand-silver mb-6">
                    12 cuotas sin interés: {formatPrice(Math.ceil(finalTotal / 12))}/mes con Tarjeta Naranja
                  </p>
                )}

                {error && (
                  <p className="font-body text-xs text-red-400 mb-4">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-gold text-brand-black font-body font-600 text-sm tracking-luxury py-4 hover:bg-brand-gold-light transition-colors uppercase disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Procesando...' : paymentMethod === 'mercadopago' ? 'Ir a Mercado Pago →' : 'Confirmar pedido →'}
                </button>

                <p className="font-body text-[10px] text-brand-silver text-center mt-4">
                  🔒 Transacción segura. Tus datos están protegidos.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  )
}
