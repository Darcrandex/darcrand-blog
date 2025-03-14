import { PostItem } from '@/types'
import { uuid } from '@/utils'
import { neon } from '@neondatabase/serverless'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const isDev = process.env.NODE_ENV === 'development'
  const sql = neon(process.env.DATABASE_URL!)
  const res = await sql('SELECT * FROM post;')

  return NextResponse.json({
    message: 'Success',
    data: res,
    isDev,
  })
}

export async function POST(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!)

  const body: Omit<PostItem, 'id'> = await req.json()
  const id = uuid(8)
  const res = await sql('INSERT INTO post (id, title, cover, content) VALUES ($1, $2, $3, $4);', [
    id,
    body.title,
    body.cover,
    body.content,
  ])

  return NextResponse.json({
    message: 'Success',
    data: res,
  })
}
