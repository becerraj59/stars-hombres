// pages/api/orders/create.js
import db from '../../../lib/db'
import { createPreference } from '../../../lib/mercadopago'
import { generateOrderNumber } from '../../../lib/utils'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const {
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    customerCity,
    customerProvince,
    items, // [{ sku, productId, productName, size, color, price, quantity }]
    paymentMethod, // 'mercadopago' | 'transfer'
  } = req.body

  // Validate required fields
  if (!customerName || !customerEmail || !items?.length || !paymentMethod) {
    return res.status(400).json({ error: 'Datos incompletos' })
  }

  try {
    // Validate stock for each item
    for (const item of items) {
      const variantResult = await db.query(
        `SELECT stock FROM product_variants WHERE sku = $1`,
        [item.sku]
      )
      if (!variantResult.rows[0]) {
        return res.status(400).json({ error: `Variante ${item.sku} no encontrada` })
      }
      if (variantResult.rows[0].stock < item.quantity) {
        return res.status(400).json({
          error: `Stock insuficiente para ${item.productName} - ${item.size} ${item.color}`,
        })
      }
    }

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = subtotal >= 150000 ? 0 : 5500 // Envío gratis +$150k
    const total = subtotal + shipping
    const orderNumber = generateOrderNumber()

    // Create order in DB
    const orderResult = await db.query(
      `INSERT INTO orders (
        order_number, customer_name, customer_email, customer_phone,
        customer_address, customer_city, customer_province,
        items, subtotal, shipping, total, payment_method, payment_status, order_status
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING id`,
      [
        orderNumber, customerName, customerEmail, customerPhone,
        customerAddress, customerCity, customerProvince,
        JSON.stringify(items), subtotal, shipping, total,
        paymentMethod, 'pending', 'pending',
      ]
    )
    const orderId = orderResult.rows[0].id

    // Reserve stock
    for (const item of items) {
      await db.query(
        `UPDATE product_variants SET stock = stock - $1 WHERE sku = $2`,
        [item.quantity, item.sku]
      )
    }

    let mpPreferenceId = null
    let mpInitPoint = null

    if (paymentMethod === 'mercadopago') {
      try {
        const preference = await createPreference({
          orderNumber,
          customerName,
          customerEmail,
          customerPhone,
          items,
          shipping,
          total,
        })

        mpPreferenceId = preference.id
        mpInitPoint = preference.init_point

        await db.query(
          `UPDATE orders SET mp_preference_id = $1 WHERE id = $2`,
          [mpPreferenceId, orderId]
        )
      } catch (mpErr) {
        console.error('MP Error:', mpErr)
        // Return order without MP - customer can retry
      }
    }

    res.status(201).json({
      orderId,
      orderNumber,
      total,
      shipping,
      paymentMethod,
      mpPreferenceId,
      mpInitPoint,
      // Bank data for transfer
      bankData: paymentMethod === 'transfer' ? {
        bank: process.env.BANK_NAME || 'Banco Galicia',
        cbu: process.env.BANK_CBU || '0070...',
        alias: process.env.BANK_ALIAS || 'STARS.HOMBRES',
        accountHolder: process.env.BANK_HOLDER || 'Stars Hombres S.R.L.',
        cuit: process.env.BANK_CUIT || '30-00000000-0',
        amount: total,
      } : null,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al crear el pedido' })
  }
}
