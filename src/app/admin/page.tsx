/**
 * @name AdminManage
 * @description
 * @author darcrand
 */

'use client'

import { Result, UserItem } from '@/types'
import { useQuery } from '@tanstack/react-query'

export default function AdminManage() {
  const { data: list } = useQuery({
    queryKey: ['user', 'all'],
    queryFn: async () => {
      const res = await fetch('/api/user')
      const data: Result<UserItem[]> = await res.json()
      return data.data
    },
  })

  return (
    <>
      <h1>Admin</h1>

      <ol>{list?.map((v) => <li key={v.id}>{v.name}</li>)}</ol>
    </>
  )
}
