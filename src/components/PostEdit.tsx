/**
 * @name PostEdit
 * @description
 * @author darcrand
 */

'use client'
import { PostItem, Result } from '@/types'
import { http } from '@/utils/http'
import { useMutation, useQuery } from '@tanstack/react-query'
import MDEditor from '@uiw/react-md-editor'
import { Button, Input, Space } from 'antd'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PostEdit(props: { id?: string }) {
  const router = useRouter()
  const { id } = props
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const { data: detail } = useQuery({
    enabled: !!id,
    queryKey: ['post', 'detail', id],
    queryFn: async () => {
      const res = await http.get<Result<PostItem>>(`/api/post/${id}`)
      return res.data?.data
    },
  })

  useEffect(() => {
    if (detail) {
      setTitle(detail.title)
      setContent(detail.content || '')
    }
  }, [detail])

  const { mutate: onSubmit } = useMutation({
    mutationFn: async () => {
      if (!title.trim() || !content.trim()) return

      if (id) {
        await http.patch(`/api/post/${id}`, { id, title, content })
      } else {
        const createdId = await http.post<Result<string>>('/api/post', { title, content })
        router.replace(`/post/${createdId.data?.data}/edit`)
      }
    },
  })

  return (
    <>
      <section className='flex flex-col h-screen'>
        <header className='flex items-center m-2'>
          <Input
            className='!w-3/4'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={30}
            placeholder='input post title'
          />

          <Space className='ml-auto'>
            <Button type='primary' onClick={() => onSubmit()}>
              Save
            </Button>
          </Space>
        </header>

        <MDEditor
          className='flex-1'
          value={content}
          onChange={(val) => setContent(val || '')}
          textareaProps={{
            placeholder: 'Please enter Markdown text',
          }}
        />
      </section>
    </>
  )
}
