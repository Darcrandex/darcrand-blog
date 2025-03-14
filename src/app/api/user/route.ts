import { UserItem } from '@/types'
import { uuid } from '@/utils'
import { compareHash, hashData } from '@/utils/sha'
import { neon } from '@neondatabase/serverless'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ message: 'error', data: null }, { status: 403, statusText: 'Forbidden' })
  }

  const msg = 'hello'
  const hashed = hashData(msg)
  const isValid = compareHash(msg, hashed)

  const sql = neon(process.env.DATABASE_URL!)
  const res = await sql('SELECT * FROM admins;')

  return NextResponse.json({
    message: 'Success',
    data: res,
    d: {
      msg,
      hashed,
      isValid,
    },
  })
}

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ message: 'error', data: null }, { status: 403, statusText: 'Forbidden' })
  }

  const sql = neon(process.env.DATABASE_URL!)

  const body: Omit<UserItem, 'id'> = await req.json()
  const id = uuid(8)
  await sql('INSERT INTO user (id, name, email, password) VALUES ($1, $2, $3, $4);', [
    id,
    body.name,
    body.email,
    body.password,
  ])

  return NextResponse.json({ message: 'Success', data: id })
}
