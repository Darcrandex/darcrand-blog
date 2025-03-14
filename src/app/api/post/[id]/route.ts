import { PostItem } from '@/types'
import { neon } from '@neondatabase/serverless'
import { NextRequest, NextResponse } from 'next/server'

// get post by id
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const sql = neon(process.env.DATABASE_URL!)
  const { id } = await params
  const res = await sql('SELECT * FROM post WHERE id = $1;', [id])
  return NextResponse.json({
    message: 'Success',
    data: res[0],
  })
}

// remove post by id
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const sql = neon(process.env.DATABASE_URL!)
  const { id } = await params
  const res = await sql('DELETE FROM post WHERE id = $1;', [id])

  return NextResponse.json({
    message: 'Success',
    data: res,
  })
}

// update post by id
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const sql = neon(process.env.DATABASE_URL!)
  const { id } = await params

  const body: PostItem = await req.json()
  const res = await sql('UPDATE post SET title = $1, cover = $2, content = $3 WHERE id = $4;', [
    body.title,
    body.cover,
    body.content,
    id,
  ])

  return NextResponse.json({
    message: 'Success',
    data: res,
  })
}
