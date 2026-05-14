// pages/api/products/[slug].js
import db from '../../../lib/db'

export default async function handler(req, res) {
  const { slug } = req.query

  if (req.method === 'GET') {
    try {
      const productResult = await db.query(
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
          COALESCE(
            json_agg(
              json_build_object(
                'id', r.id,
                'customer_name', r.customer_name,
                'rating', r.rating,
                'comment', r.comment,
                'created_at', r.created_at
              ) ORDER BY r.created_at DESC
            ) FILTER (WHERE r.id IS NOT NULL AND r.approved = true),
            '[]'
          ) as reviews
        FROM products p
        LEFT JOIN product_variants pv ON pv.product_id = p.id
        LEFT JOIN reviews r ON r.product_id = p.id
        WHERE p.slug = $1 AND p.active = true
        GROUP BY p.id`,
        [slug]
      )

      if (!productResult.rows[0]) {
        return res.status(404).json({ error: 'Producto no encontrado' })
      }

      // Related products
      const product = productResult.rows[0]
      const relatedResult = await db.query(
        `SELECT p.id, p.slug, p.name, p.base_price, p.images, p.category
         FROM products p
         WHERE p.category = $1 AND p.slug != $2 AND p.active = true
         LIMIT 4`,
        [product.category, slug]
      )

      res.status(200).json({
        product,
        related: relatedResult.rows,
      })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Error al obtener producto' })
    }
  } else {
    res.status(405).end()
  }
}
