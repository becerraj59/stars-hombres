// lib/CartContext.js
import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('stars_cart')
      if (saved) setCart(JSON.parse(saved))
    } catch {}
  }, [])

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('stars_cart', JSON.stringify(cart))
  }, [cart])

  function addToCart(item) {
    // item: { sku, productId, productSlug, productName, size, color, colorHex, price, image }
    setCart((prev) => {
      const existing = prev.find((c) => c.sku === item.sku)
      if (existing) {
        return prev.map((c) =>
          c.sku === item.sku ? { ...c, quantity: c.quantity + 1 } : c
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  function removeFromCart(sku) {
    setCart((prev) => prev.filter((c) => c.sku !== sku))
  }

  function updateQuantity(sku, quantity) {
    if (quantity <= 0) {
      removeFromCart(sku)
      return
    }
    setCart((prev) => prev.map((c) => (c.sku === sku ? { ...c, quantity } : c)))
  }

  function clearCart() {
    setCart([])
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
