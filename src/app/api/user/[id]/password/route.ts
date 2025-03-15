import { compareHash, hashData } from '@/utils/sha'
import { neon } from '@neondatabase/serverless'
import { first } from 'lodash-es'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ message: 'error', data: null }, { status: 403, statusText: 'Forbidden' })
  }

  const sql = neon(process.env.DATABASE_URL!)
  const { id } = await params

  const { oldPassword, newPassword } = await req.json()
  const matched = await sql('SELECT * FROM admins WHERE id = $1;', [id])
  const user = first(matched)

  if (!user) {
    return NextResponse.json({ message: 'not found user', data: null }, { status: 404, statusText: 'Not Found' })
  }

  const isValid = compareHash(oldPassword, user.password)

  if (!isValid) {
    return NextResponse.json({ message: 'password not match', data: null }, { status: 400, statusText: 'Bad Request' })
  }

  await sql('UPDATE admins SET password = $1 WHERE id = $2;', [hashData(newPassword), id])

  return NextResponse.json({
    message: 'Success',
    data: id,
  })
}
