// lib/mercadopago.js
// Mercado Pago SDK v2 integration

const { MercadoPagoConfig, Preference, Payment } = require('mercadopago')

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
  options: { timeout: 5000 },
})

/**
 * Crea una preferencia de pago en Mercado Pago
 * @param {Object} orderData - Datos del pedido
 */
async function createPreference(orderData) {
  const preference = new Preference(client)

  const items = orderData.items.map((item) => ({
    id: item.sku,
    title: `${item.productName} - Talle ${item.size} - ${item.color}`,
    description: item.productName,
    quantity: item.quantity,
    unit_price: item.price,
    currency_id: 'ARS',
  }))

  const preferenceData = {
    items,
    payer: {
      name: orderData.customerName,
      email: orderData.customerEmail,
      phone: {
        area_code: '351',
        number: orderData.customerPhone || '',
      },
    },
    payment_methods: {
      installments: 12,
      excluded_payment_types: [],
      // Naranja X cuotas sin interés (configurable desde el panel MP)
    },
    back_urls: {
      success: `${process.env.NEXT_PUBLIC_SITE_URL}/orden/confirmacion?order=${orderData.orderNumber}`,
      failure: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout?error=pago_fallido`,
      pending: `${process.env.NEXT_PUBLIC_SITE_URL}/orden/pendiente?order=${orderData.orderNumber}`,
    },
    auto_return: 'approved',
    external_reference: orderData.orderNumber,
    notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/orders/webhook`,
    statement_descriptor: 'STARS HOMBRES',
    expires: false,
  }

  const result = await preference.create({ body: preferenceData })
  return result
}

/**
 * Obtiene detalles de un pago por ID
 */
async function getPaymentInfo(paymentId) {
  const payment = new Payment(client)
  return await payment.get({ id: paymentId })
}

module.exports = { createPreference, getPaymentInfo }
