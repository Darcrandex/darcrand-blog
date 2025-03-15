import { UserItem } from '@/types'
import { neon } from '@neondatabase/serverless'
import { first } from 'lodash-es'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ message: 'error', data: null }, { status: 403, statusText: 'Forbidden' })
  }

  const sql = neon(process.env.DATABASE_URL!)
  const { id } = await params
  const res = await sql('SELECT * FROM admins WHERE id = $1;', [id])

  const matched = first(res)

  if (!matched) {
    return NextResponse.json({ message: 'error', data: null }, { status: 404, statusText: 'Not Found' })
  }

  return NextResponse.json({
    message: 'Success',
    data: matched,
  })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ message: 'error', data: null }, { status: 403, statusText: 'Forbidden' })
  }

  const sql = neon(process.env.DATABASE_URL!)
  const { id } = await params
  await sql('DELETE FROM admins WHERE id = $1;', [id])

  return NextResponse.json({
    message: 'Success',
    data: id,
  })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ message: 'error', data: null }, { status: 403, statusText: 'Forbidden' })
  }

  const sql = neon(process.env.DATABASE_URL!)
  const { id } = await params

  const body: UserItem = await req.json()
  await sql('UPDATE admins SET name = $1, email = $2, password = $3 WHERE id = $4;', [
    body.name,
    body.email,
    body.password,
    id,
  ])

  return NextResponse.json({
    message: 'Success',
    data: id,
  })
}
