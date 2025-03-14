import { neon } from '@neondatabase/serverless'
import { first } from 'lodash-es'
import { NextRequest, NextResponse } from 'next/server'

// login
export async function POST(req: NextRequest) {
  const body = await req.json()
  const sql = neon(process.env.DATABASE_URL!)

  const res = await sql('SELECT * FROM user WHERE email = $1 AND password = $2;', [body.email, body.password])

  const matched = first(res)

  if (!matched) {
    return NextResponse.json({ message: 'error', data: null }, { status: 404, statusText: 'Not Found' })
  }

  return NextResponse.json({
    message: 'Success',
    data: matched,
  })
}
