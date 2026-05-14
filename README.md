# 🌟 Stars Hombres — Tienda Online

Tienda online completa para indumentaria masculina.
Stack: Next.js 14 + Tailwind CSS + PostgreSQL + Mercado Pago

---

## ESTRUCTURA DE CARPETAS

```
stars-hombres/
├── pages/
│   ├── index.js               → Home (/)
│   ├── _app.js                → Provider global
│   ├── _document.js           → HTML base
│   ├── catalogo/
│   │   └── index.js           → Catálogo con filtros (/catalogo)
│   ├── producto/
│   │   └── [slug].js          → Detalle producto (/producto/ambo-negro)
│   ├── checkout/
│   │   └── index.js           → Checkout (/checkout)
│   ├── orden/
│   │   └── confirmacion.js    → Confirmación de orden
│   ├── admin/
│   │   └── index.js           → Panel admin (/admin)
│   └── api/
│       ├── products/
│       │   ├── index.js       → GET /api/products
│       │   ├── [slug].js      → GET /api/products/:slug
│       │   └── admin.js       → CRUD admin (protegido)
│       ├── orders/
│       │   ├── create.js      → POST crear orden
│       │   ├── index.js       → GET/PATCH pedidos (admin)
│       │   └── webhook.js     → Webhook Mercado Pago
│       └── auth/
│           ├── login.js       → POST login admin
│           └── logout.js      → POST logout
├── components/
│   ├── layout/
│   │   └── Layout.jsx         → Header + Footer + WhatsApp
│   └── ui/
│       └── ProductCard.jsx    → Card de producto
├── lib/
│   ├── db.js                  → Pool PostgreSQL
│   ├── db-setup.js            → Crear tablas + seed datos
│   ├── mercadopago.js         → SDK MP
│   ├── auth.js                → JWT middleware
│   ├── utils.js               → Helpers (formatPrice, etc)
│   └── CartContext.js         → Estado del carrito
├── styles/
│   └── globals.css            → Estilos base + fuentes
├── .env.example               → Template de variables
├── next.config.js
├── tailwind.config.js
└── vercel.json
```

---

## PASO 1 — INSTALAR DEPENDENCIAS

```bash
cd stars-hombres
npm install
```

---

## PASO 2 — CONFIGURAR BASE DE DATOS

### Opción A: PostgreSQL local (desarrollo)

1. Instalá PostgreSQL si no lo tenés
2. Creá la base de datos:
```sql
CREATE DATABASE stars_hombres;
```
3. En `.env.local`:
```
DATABASE_URL=postgresql://postgres:tupassword@localhost:5432/stars_hombres
```

### Opción B: Neon (GRATIS, recomendado para producción)

1. Entrá a https://neon.tech y creá una cuenta gratis
2. Creá un proyecto → copiá la connection string
3. En `.env.local`:
```
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/stars_hombres?sslmode=require
```

### Crear tablas y cargar datos de ejemplo:
```bash
node lib/db-setup.js
```

Esto crea:
- 6 productos con variantes (ambos, camisas, sweaters, zapatos)
- Usuario admin: admin@starshombres.com / stars2024admin
- Reviews de ejemplo

---

## PASO 3 — CONFIGURAR MERCADO PAGO

1. Entrá a https://www.mercadopago.com.ar/developers/panel/app
2. Creá una aplicación (o usá la existente)
3. En **Credenciales de producción** copiá el **Access Token**
4. En `.env.local`:
```
MP_ACCESS_TOKEN=APP_USR-xxxxxxxxxxxxxxxxxxxx
```

### Configurar cuotas sin interés (Tarjeta Naranja):
- El comercio debe estar adherido al programa de Naranja X
- En el panel de Mercado Pago → Configurar financiamiento
- También se puede configurar desde el Panel de Naranja directamente

### Webhook MP (para que se actualicen automáticamente los pagos):
1. En el panel MP → Webhooks → Agregar URL:
```
https://tudominio.com.ar/api/orders/webhook
```
2. Seleccioná el evento: **Pago** (payment)

---

## PASO 4 — COMPLETAR .env.local

```bash
cp .env.example .env.local
```

Editá `.env.local` con tus datos reales:

```env
DATABASE_URL=postgresql://...
MP_ACCESS_TOKEN=APP_USR-...
JWT_SECRET=una-cadena-larga-y-aleatoria-que-vos-elegis
NEXT_PUBLIC_SITE_URL=https://starshombres.com.ar
NEXT_PUBLIC_WHATSAPP_NUMBER=5493516000000
NEXT_PUBLIC_BANK_NAME=Banco Galicia
NEXT_PUBLIC_BANK_CBU=tu-cbu-aqui
NEXT_PUBLIC_BANK_ALIAS=STARS.HOMBRES
NEXT_PUBLIC_BANK_HOLDER=Stars Hombres S.R.L.
NEXT_PUBLIC_BANK_CUIT=30-xxxxxxxx-0
```

---

## PASO 5 — CORRER EN DESARROLLO

```bash
npm run dev
```

Abrí http://localhost:3000

Panel admin: http://localhost:3000/admin
- Email: admin@starshombres.com
- Pass: stars2024admin

---

## PASO 6 — DEPLOY EN VERCEL (RECOMENDADO)

### Opción A: Via CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Opción B: Via GitHub

1. Subí el proyecto a GitHub
2. Entrá a https://vercel.com → New Project
3. Importá tu repositorio
4. En **Environment Variables** cargá todas las variables de `.env.local`
5. Deploy → listo

### Configurar dominio propio en Vercel:
1. Dashboard → Settings → Domains
2. Agregá: `starshombres.com.ar`
3. Configurá los DNS en tu registrador:
   - Tipo: `CNAME` → `cname.vercel-dns.com`
   - O tipo: `A` → `76.76.21.21`

---

## PASO 7 — CARGAR PRODUCTOS PROPIOS

### Desde el panel admin (/admin):
El panel actual permite editar stock de variantes existentes.

### Via base de datos (recomendado para productos nuevos):
```sql
-- Insertar producto
INSERT INTO products (slug, name, description, category, base_price, images, featured)
VALUES (
  'blazer-azul-marino',
  'Blazer Azul Marino',
  'Descripción del producto...',
  'trajes',
  165000,
  ARRAY['https://url-imagen-1.jpg', 'https://url-imagen-2.jpg'],
  true
);

-- Insertar variantes (obtener el id del producto anterior)
INSERT INTO product_variants (product_id, sku, size, color, color_hex, stock)
VALUES
  (7, 'BLZ-AZU-46-AZU', '46', 'Azul Marino', '#002366', 3),
  (7, 'BLZ-AZU-48-AZU', '48', 'Azul Marino', '#002366', 4),
  (7, 'BLZ-AZU-50-AZU', '50', 'Azul Marino', '#002366', 2);
```

### URLs de imágenes:
- Subir a Cloudinary (gratis): https://cloudinary.com
- O usar Google Drive con link público
- Formato recomendado: WebP, 800px de ancho

---

## PASO 8 — CONFIGURAR META ADS / GOOGLE ADS

### Meta Pixel (Facebook/Instagram Ads):
1. Creá el pixel en: https://business.facebook.com
2. Agregá en `pages/_document.js` dentro de `<Head>`:
```html
<script>
  !function(f,b,e,v,n,t,s)...
  // Código del pixel de Meta
</script>
```

### Google Analytics 4:
1. Creá propiedad en: https://analytics.google.com
2. Agregá en `pages/_document.js`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Google Merchant Center (para Google Shopping):
- El schema markup de producto ya está incluido automáticamente en cada página de producto
- Verificá tu dominio en Google Search Console

---

## FUNCIONALIDADES INCLUIDAS

### Frontend
- ✅ Home con hero, beneficios, productos destacados, categorías, testimonios
- ✅ Catálogo con filtros (categoría, talle, precio)
- ✅ Página de producto con selector de talle/color, stock en tiempo real
- ✅ Cálculo automático de cuotas (3, 6, 12 sin interés Naranja)
- ✅ Urgencia: "Última unidad", "Solo X disponibles"
- ✅ Reviews de clientes con rating
- ✅ Carrito persistente (localStorage)
- ✅ Checkout con validación
- ✅ Botón flotante WhatsApp global
- ✅ Header sticky con menú mobile

### Pagos
- ✅ Mercado Pago (checkout completo, cuotas)
- ✅ Transferencia bancaria (con datos bancarios post-compra)
- ✅ Webhook automático para actualizar estado de pago MP
- ✅ Reserva de stock al crear la orden

### Admin
- ✅ Login seguro con JWT + cookie httpOnly
- ✅ Dashboard con estadísticas
- ✅ Listado de pedidos con estados
- ✅ Edición de stock por variante
- ✅ Cambio de estado de pedidos y pagos

### SEO
- ✅ URLs amigables (/producto/ambo-clasico-negro)
- ✅ Meta title y description dinámicos
- ✅ Schema markup de producto (JSON-LD)
- ✅ Open Graph tags
- ✅ ISR (Incremental Static Regeneration)

---

## CREDENCIALES POR DEFECTO

Panel admin: `/admin`
- Email: `admin@starshombres.com`
- Contraseña: `stars2024admin`

**⚠️ Cambiar la contraseña antes de publicar:**
```sql
UPDATE admins 
SET password_hash = crypt('nueva-password-segura', gen_salt('bf'))
WHERE email = 'admin@starshombres.com';
```
O usando bcrypt desde Node:
```js
const bcrypt = require('bcryptjs')
const hash = await bcrypt.hash('nueva-password', 12)
// Usar el hash en el UPDATE de SQL
```

---

## SOPORTE

Para consultas sobre configuración o personalización, contactar vía el panel de administración.
