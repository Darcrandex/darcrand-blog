/**
 * @name PostDetail
 * @description
 * @author darcrand
 */

import MarkdownView from '@/components/MarkdownView'
import { PostItem, Result } from '@/types'
import { serverFetch } from '@/utils/http.server'

export default async function PostDetail(props: { params: Promise<{ id: string }> }) {
  const id = (await props.params).id
  const res = await serverFetch<Result<PostItem>>(`/api/post/${id}`)

  return (
    <>
      <section className='w-4xl max-w-full mx-auto'>
        <pre className='hidden'>{res.data.content}</pre>

        <MarkdownView>{res.data.content}</MarkdownView>
      </section>
    </>
  )
}
