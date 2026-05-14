// pages/api/products/index.js
import db from '../../../lib/db'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const { category, featured, search, limit = 50, offset = 0 } = req.query

  try {
    let whereConditions = ['p.active = true']
    let params = []
    let paramCount = 1

    if (category) {
      whereConditions.push(`p.category = $${paramCount}`)
      params.push(category)
      paramCount++
    }

    if (featured === 'true') {
      whereConditions.push(`p.featured = true`)
    }

    if (search) {
      whereConditions.push(`(p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`)
      params.push(`%${search}%`)
      paramCount++
    }

    const whereClause = whereConditions.length ? 'WHERE ' + whereConditions.join(' AND ') : ''

    const productsQuery = await db.query(
      `SELECT 
        p.*,
        COALESCE(json_agg(
          json_build_object(
            'id', pv.id,
            'sku', pv.sku,
            'size', pv.size,
            'color', pv.color,
            'color_hex', pv.color_hex,
            'stock', pv.stock,
            'price_override', pv.price_override
          ) ORDER BY pv.size, pv.color
        ) FILTER (WHERE pv.id IS NOT NULL), '[]') as variants,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(r.id) FILTER (WHERE r.approved = true) as review_count
      FROM products p
      LEFT JOIN product_variants pv ON pv.product_id = p.id
      LEFT JOIN reviews r ON r.product_id = p.id AND r.approved = true
      ${whereClause}
      GROUP BY p.id
      ORDER BY p.featured DESC, p.created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      [...params, parseInt(limit), parseInt(offset)]
    )

    res.status(200).json({
      products: productsQuery.rows,
      total: productsQuery.rows.length,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al obtener productos' })
  }
}
