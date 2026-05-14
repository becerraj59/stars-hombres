// lib/db-setup.js
// Run: node lib/db-setup.js

require('dotenv').config({ path: '.env.local' })
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

async function setup() {
  const client = await pool.connect()
  try {
    console.log('⚙️  Creando tablas...')

    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100) NOT NULL,
        base_price INTEGER NOT NULL,
        images TEXT[] DEFAULT '{}',
        featured BOOLEAN DEFAULT false,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS product_variants (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        sku VARCHAR(100) UNIQUE NOT NULL,
        size VARCHAR(20) NOT NULL,
        color VARCHAR(50) NOT NULL,
        color_hex VARCHAR(7),
        stock INTEGER DEFAULT 0,
        price_override INTEGER,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_number VARCHAR(20) UNIQUE NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(50),
        customer_address TEXT,
        customer_city VARCHAR(100),
        customer_province VARCHAR(100),
        items JSONB NOT NULL,
        subtotal INTEGER NOT NULL,
        shipping INTEGER DEFAULT 0,
        total INTEGER NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        payment_status VARCHAR(50) DEFAULT 'pending',
        mp_payment_id VARCHAR(100),
        mp_preference_id VARCHAR(100),
        order_status VARCHAR(50) DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id),
        customer_name VARCHAR(255) NOT NULL,
        rating INTEGER CHECK(rating >= 1 AND rating <= 5),
        comment TEXT,
        approved BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `)

    console.log('✅ Tablas creadas')
    console.log('🌱 Insertando productos de ejemplo...')

    // Seed products
    const products = [
      {
        slug: 'ambo-clasico-negro',
        name: 'Ambo Clásico Negro',
        description: 'Traje de dos piezas en paño italiano de primera calidad. Corte slim fit con hombros estructurados. Ideal para ambientes formales y eventos especiales. Incluye saco y pantalón con costuras reforzadas.',
        category: 'trajes',
        base_price: 189000,
        images: [
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
          'https://images.unsplash.com/photo-1594938298603-c8148c4b4e5f?w=800',
        ],
        featured: true,
        variants: [
          { sku: 'AMB-NEG-46-NEG', size: '46', color: 'Negro', color_hex: '#0A0A0A', stock: 3 },
          { sku: 'AMB-NEG-48-NEG', size: '48', color: 'Negro', color_hex: '#0A0A0A', stock: 4 },
          { sku: 'AMB-NEG-50-NEG', size: '50', color: 'Negro', color_hex: '#0A0A0A', stock: 2 },
          { sku: 'AMB-NEG-52-NEG', size: '52', color: 'Negro', color_hex: '#0A0A0A', stock: 1 },
          { sku: 'AMB-NEG-48-GRI', size: '48', color: 'Gris Oscuro', color_hex: '#2C2C2C', stock: 3 },
          { sku: 'AMB-NEG-50-GRI', size: '50', color: 'Gris Oscuro', color_hex: '#2C2C2C', stock: 2 },
        ],
      },
      {
        slug: 'camisa-oxford-blanca',
        name: 'Camisa Oxford Blanca',
        description: 'Camisa de algodón Oxford 100% importado. Cuello italiano clásico, botones de nácar. Corte regular fit que favorece todo tipo de contextura. Disponible en blanco y celeste.',
        category: 'camisas',
        base_price: 48000,
        images: [
          'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800',
          'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=800',
        ],
        featured: true,
        variants: [
          { sku: 'CAM-OXF-S-BLA', size: 'S', color: 'Blanco', color_hex: '#F5F5F5', stock: 8 },
          { sku: 'CAM-OXF-M-BLA', size: 'M', color: 'Blanco', color_hex: '#F5F5F5', stock: 10 },
          { sku: 'CAM-OXF-L-BLA', size: 'L', color: 'Blanco', color_hex: '#F5F5F5', stock: 7 },
          { sku: 'CAM-OXF-XL-BLA', size: 'XL', color: 'Blanco', color_hex: '#F5F5F5', stock: 5 },
          { sku: 'CAM-OXF-S-CEL', size: 'S', color: 'Celeste', color_hex: '#87CEEB', stock: 6 },
          { sku: 'CAM-OXF-M-CEL', size: 'M', color: 'Celeste', color_hex: '#87CEEB', stock: 8 },
          { sku: 'CAM-OXF-L-CEL', size: 'L', color: 'Celeste', color_hex: '#87CEEB', stock: 5 },
        ],
      },
      {
        slug: 'sweater-merino-cuello-v',
        name: 'Sweater Merino Cuello V',
        description: 'Sweater de lana merino extra-fina 100%. Cuello en V con acabado ribeteado. Caída perfecta sobre camisa o solo. Disponible en varios colores neutros para combinar con cualquier look.',
        category: 'sweaters',
        base_price: 72000,
        images: [
          'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800',
          'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=800',
        ],
        featured: true,
        variants: [
          { sku: 'SWE-MER-S-NEG', size: 'S', color: 'Negro', color_hex: '#0A0A0A', stock: 5 },
          { sku: 'SWE-MER-M-NEG', size: 'M', color: 'Negro', color_hex: '#0A0A0A', stock: 6 },
          { sku: 'SWE-MER-L-NEG', size: 'L', color: 'Negro', color_hex: '#0A0A0A', stock: 4 },
          { sku: 'SWE-MER-XL-NEG', size: 'XL', color: 'Negro', color_hex: '#0A0A0A', stock: 3 },
          { sku: 'SWE-MER-M-GRI', size: 'M', color: 'Gris', color_hex: '#8A8A8A', stock: 7 },
          { sku: 'SWE-MER-L-GRI', size: 'L', color: 'Gris', color_hex: '#8A8A8A', stock: 5 },
          { sku: 'SWE-MER-M-CAM', size: 'M', color: 'Camel', color_hex: '#C19A6B', stock: 4 },
        ],
      },
      {
        slug: 'mocasin-cuero-marron',
        name: 'Mocasín Cuero Marrón',
        description: 'Mocasín de cuero vacuno full-grain curtido al vegetal. Suela de cuero cosida a mano. Plantilla acolchada anatómica. El calzado que define un look distinguido.',
        category: 'zapatos',
        base_price: 135000,
        images: [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
          'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800',
        ],
        featured: false,
        variants: [
          { sku: 'ZAP-MOC-40-MAR', size: '40', color: 'Marrón', color_hex: '#8B4513', stock: 2 },
          { sku: 'ZAP-MOC-41-MAR', size: '41', color: 'Marrón', color_hex: '#8B4513', stock: 3 },
          { sku: 'ZAP-MOC-42-MAR', size: '42', color: 'Marrón', color_hex: '#8B4513', stock: 4 },
          { sku: 'ZAP-MOC-43-MAR', size: '43', color: 'Marrón', color_hex: '#8B4513', stock: 3 },
          { sku: 'ZAP-MOC-44-MAR', size: '44', color: 'Marrón', color_hex: '#8B4513', stock: 2 },
          { sku: 'ZAP-MOC-42-NEG', size: '42', color: 'Negro', color_hex: '#0A0A0A', stock: 3 },
          { sku: 'ZAP-MOC-43-NEG', size: '43', color: 'Negro', color_hex: '#0A0A0A', stock: 2 },
        ],
      },
      {
        slug: 'ambo-gris-perla',
        name: 'Ambo Gris Perla',
        description: 'Traje en paño gris perla de composición mixta (70% lana, 30% poliéster). Ideal para ceremonias, casamientos y eventos formales. Corte clásico elegante con tela resistente al arrugado.',
        category: 'trajes',
        base_price: 210000,
        images: [
          'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800',
          'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800',
        ],
        featured: true,
        variants: [
          { sku: 'AMB-GPE-46-GPE', size: '46', color: 'Gris Perla', color_hex: '#C8C8C8', stock: 2 },
          { sku: 'AMB-GPE-48-GPE', size: '48', color: 'Gris Perla', color_hex: '#C8C8C8', stock: 3 },
          { sku: 'AMB-GPE-50-GPE', size: '50', color: 'Gris Perla', color_hex: '#C8C8C8', stock: 2 },
          { sku: 'AMB-GPE-52-GPE', size: '52', color: 'Gris Perla', color_hex: '#C8C8C8', stock: 1 },
        ],
      },
      {
        slug: 'camisa-lino-manga-larga',
        name: 'Camisa de Lino Manga Larga',
        description: 'Camisa de lino puro importado, ideal para clima templado. Fresca, liviana y con excelente caída. Perfecta para eventos al aire libre o un look business casual sofisticado.',
        category: 'camisas',
        base_price: 58000,
        images: [
          'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800',
          'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800',
        ],
        featured: false,
        variants: [
          { sku: 'CAM-LIN-S-BEI', size: 'S', color: 'Beige', color_hex: '#D4C5A9', stock: 5 },
          { sku: 'CAM-LIN-M-BEI', size: 'M', color: 'Beige', color_hex: '#D4C5A9', stock: 7 },
          { sku: 'CAM-LIN-L-BEI', size: 'L', color: 'Beige', color_hex: '#D4C5A9', stock: 4 },
          { sku: 'CAM-LIN-XL-BEI', size: 'XL', color: 'Beige', color_hex: '#D4C5A9', stock: 3 },
          { sku: 'CAM-LIN-M-BLA', size: 'M', color: 'Blanco', color_hex: '#F5F5F5', stock: 6 },
          { sku: 'CAM-LIN-L-BLA', size: 'L', color: 'Blanco', color_hex: '#F5F5F5', stock: 5 },
        ],
      },
    ]

    for (const product of products) {
      const { variants, ...productData } = product
      const result = await client.query(
        `INSERT INTO products (slug, name, description, category, base_price, images, featured)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (slug) DO UPDATE SET
           name = EXCLUDED.name,
           description = EXCLUDED.description,
           base_price = EXCLUDED.base_price,
           featured = EXCLUDED.featured
         RETURNING id`,
        [
          productData.slug,
          productData.name,
          productData.description,
          productData.category,
          productData.base_price,
          productData.images,
          productData.featured,
        ]
      )
      const productId = result.rows[0].id

      for (const variant of variants) {
        await client.query(
          `INSERT INTO product_variants (product_id, sku, size, color, color_hex, stock)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (sku) DO UPDATE SET stock = EXCLUDED.stock`,
          [productId, variant.sku, variant.size, variant.color, variant.color_hex, variant.stock]
        )
      }
      console.log(`  ✅ ${productData.name}`)
    }

    // Seed admin
    const bcrypt = require('bcryptjs')
    const hash = await bcrypt.hash('stars2024admin', 12)
    await client.query(
      `INSERT INTO admins (email, password_hash, name)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO NOTHING`,
      ['admin@starshombres.com', hash, 'Administrador Stars']
    )
    console.log('  ✅ Admin creado: admin@starshombres.com / stars2024admin')

    // Seed approved reviews
    const reviews = [
      { product_id: 1, customer_name: 'Martín G.', rating: 5, comment: 'Calidad increíble, quedó perfecto para el casamiento de mi hermano.' },
      { product_id: 1, customer_name: 'Rodrigo P.', rating: 5, comment: 'El corte es impecable. Lo usé en una reunión de negocios y recibí muchos elogios.' },
      { product_id: 2, customer_name: 'Santiago L.', rating: 4, comment: 'Muy buena calidad de tela. Entrega rápida y bien empaquetado.' },
      { product_id: 3, customer_name: 'Tomás V.', rating: 5, comment: 'El sweater merino es una joya. Cálido pero liviano.' },
    ]

    for (const review of reviews) {
      await client.query(
        `INSERT INTO reviews (product_id, customer_name, rating, comment, approved)
         VALUES ($1, $2, $3, $4, true)`,
        [review.product_id, review.customer_name, review.rating, review.comment]
      )
    }

    console.log('\n🎉 Base de datos configurada exitosamente')
    console.log('📦 6 productos insertados con variantes completas')
    console.log('👤 Admin creado')
    console.log('⭐ Reviews de ejemplo cargados')
  } catch (err) {
    console.error('❌ Error:', err.message)
    throw err
  } finally {
    client.release()
    await pool.end()
  }
}

setup()
