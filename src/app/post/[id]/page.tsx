/**
 * @name PostDetail
 * @description
 * @author darcrand
 */

'use client'
import { useEffect } from 'react'

export default function PostDetail(props: { params: Promise<{ id: string }> }) {
  useEffect(() => {
    const fn = async () => {
      const { id } = await props.params
      const res = await fetch(`/api/post/${id}`)
      const data = await res.json()
      console.log(data)
    }

    fn()
  }, [props.params])

  return (
    <>
      <h1>PostDetail</h1>
    </>
  )
}
