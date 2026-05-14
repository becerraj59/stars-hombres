// lib/auth.js
const jwt = require('jsonwebtoken')
const cookie = require('cookie')

const JWT_SECRET = process.env.JWT_SECRET || 'stars-hombres-secret-2024'

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

export function getTokenFromRequest(req) {
  const cookies = cookie.parse(req.headers.cookie || '')
  return cookies.admin_token || null
}

export function requireAdmin(handler) {
  return async (req, res) => {
    const token = getTokenFromRequest(req)
    if (!token) {
      return res.status(401).json({ error: 'No autorizado' })
    }
    const payload = verifyToken(token)
    if (!payload) {
      return res.status(401).json({ error: 'Token inválido' })
    }
    req.admin = payload
    return handler(req, res)
  }
}
