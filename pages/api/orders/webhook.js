// pages/api/orders/webhook.js
import db from '../../../lib/db'
import { getPaymentInfo } from '../../../lib/mercadopago'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { type, data } = req.body

  if (type === 'payment' && data?.id) {
    try {
      const payment = await getPaymentInfo(data.id)
      const orderNumber = payment.external_reference
      const status = payment.status // approved, pending, rejected

      const statusMap = {
        approved: { payment_status: 'paid', order_status: 'confirmed' },
        pending: { payment_status: 'pending', order_status: 'pending' },
        rejected: { payment_status: 'rejected', order_status: 'cancelled' },
        refunded: { payment_status: 'refunded', order_status: 'cancelled' },
      }

      const { payment_status, order_status } = statusMap[status] || { payment_status: status, order_status: 'pending' }

      await db.query(
        `UPDATE orders 
         SET payment_status = $1, order_status = $2, mp_payment_id = $3, updated_at = NOW()
         WHERE order_number = $4`,
        [payment_status, order_status, String(data.id), orderNumber]
      )

      // If rejected, restore stock
      if (status === 'rejected') {
        const orderResult = await db.query(
          `SELECT items FROM orders WHERE order_number = $1`,
          [orderNumber]
        )
        if (orderResult.rows[0]) {
          const items = orderResult.rows[0].items
          for (const item of items) {
            await db.query(
              `UPDATE product_variants SET stock = stock + $1 WHERE sku = $2`,
              [item.quantity, item.sku]
            )
          }
        }
      }

      console.log(`✅ Webhook: Order ${orderNumber} → ${payment_status}`)
    } catch (err) {
      console.error('Webhook error:', err)
    }
  }

  res.status(200).json({ received: true })
}

export const config = { api: { bodyParser: true } }
