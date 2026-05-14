// pages/api/auth/login.js
import db from '../../../lib/db'
import { signToken } from '../../../lib/auth'
import cookie from 'cookie'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña requeridos' })
  }

  try {
    const result = await db.query(
      `SELECT * FROM admins WHERE email = $1`,
      [email.toLowerCase().trim()]
    )

    const admin = result.rows[0]
    if (!admin) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    const valid = await bcrypt.compare(password, admin.password_hash)
    if (!valid) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    const token = signToken({ id: admin.id, email: admin.email, name: admin.name })

    res.setHeader(
      'Set-Cookie',
      cookie.serialize('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      })
    )

    res.status(200).json({ success: true, name: admin.name })
  } catch (err) {
    res.status(500).json({ error: 'Error de servidor' })
  }
}
