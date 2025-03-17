/**
 * @name PostEdit
 * @description
 * @author darcrand
 */

'use client'
import PostEdit from '@/components/PostEdit'
import { use } from 'react'

export default function PostEditPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params)

  return <PostEdit id={id} />
}
