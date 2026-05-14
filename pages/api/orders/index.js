// pages/api/orders/index.js
import db from '../../../lib/db'
import { requireAdmin } from '../../../lib/auth'

async function handler(req, res) {
  if (req.method === 'GET') {
    const { status, limit = 50, offset = 0 } = req.query

    let where = ''
    let params = [parseInt(limit), parseInt(offset)]

    if (status) {
      where = `WHERE order_status = $3`
      params.push(status)
    }

    try {
      const result = await db.query(
        `SELECT * FROM orders ${where} ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
        params
      )
      const countResult = await db.query(`SELECT COUNT(*) FROM orders ${where}`, status ? [status] : [])
      
      res.status(200).json({
        orders: result.rows,
        total: parseInt(countResult.rows[0].count),
      })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

  else if (req.method === 'PATCH') {
    const { orderId, order_status, payment_status, notes } = req.body
    try {
      await db.query(
        `UPDATE orders SET 
          order_status = COALESCE($1, order_status),
          payment_status = COALESCE($2, payment_status),
          notes = COALESCE($3, notes),
          updated_at = NOW()
         WHERE id = $4`,
        [order_status, payment_status, notes, orderId]
      )
      res.status(200).json({ success: true })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

  else {
    res.status(405).end()
  }
}

export default requireAdmin(handler)
