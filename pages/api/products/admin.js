// pages/api/products/admin.js
import db from '../../../lib/db'
import { requireAdmin } from '../../../lib/auth'

async function handler(req, res) {
  // GET - List all products for admin
  if (req.method === 'GET') {
    try {
      const result = await db.query(
        `SELECT p.*,
          COALESCE(json_agg(
            json_build_object(
              'id', pv.id, 'sku', pv.sku, 'size', pv.size,
              'color', pv.color, 'color_hex', pv.color_hex, 'stock', pv.stock
            ) ORDER BY pv.size
          ) FILTER (WHERE pv.id IS NOT NULL), '[]') as variants
         FROM products p
         LEFT JOIN product_variants pv ON pv.product_id = p.id
         GROUP BY p.id
         ORDER BY p.created_at DESC`
      )
      res.status(200).json({ products: result.rows })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

  // POST - Create product
  else if (req.method === 'POST') {
    const { name, slug, description, category, base_price, images, featured, variants } = req.body
    try {
      const productResult = await db.query(
        `INSERT INTO products (slug, name, description, category, base_price, images, featured)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [slug, name, description, category, base_price, images, featured || false]
      )
      const productId = productResult.rows[0].id

      if (variants && variants.length > 0) {
        for (const v of variants) {
          await db.query(
            `INSERT INTO product_variants (product_id, sku, size, color, color_hex, stock)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [productId, v.sku, v.size, v.color, v.color_hex || '#000000', v.stock || 0]
          )
        }
      }

      res.status(201).json({ id: productId })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }

  // PUT - Update product
  else if (req.method === 'PUT') {
    const { id, name, description, base_price, images, featured, active, variants } = req.body
    try {
      await db.query(
        `UPDATE products SET name=$1, description=$2, base_price=$3, images=$4, featured=$5, active=$6
         WHERE id=$7`,
        [name, description, base_price, images, featured, active, id]
      )

      // Update variant stocks
      if (variants) {
        for (const v of variants) {
          await db.query(
            `UPDATE product_variants SET stock=$1 WHERE id=$2`,
            [v.stock, v.id]
          )
        }
      }

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
