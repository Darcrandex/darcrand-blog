'use client'
import { UserItem } from '@/types'
import { sleep } from '@/utils/common'
import { http } from '@/utils/http'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Popconfirm } from 'antd'
import { useState } from 'react'

export default function UserRemoveBtn(props: { data: UserItem }) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const { mutate: onRemove, isPending } = useMutation({
    mutationFn: async (body: UserItem) => {
      await http.delete(`/api/user/${body.id}`)
      await sleep()
    },

    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['user', 'all'] })
      setOpen(false)
    },
  })

  return (
    <Popconfirm
      open={open}
      onCancel={() => setOpen(false)}
      title='Are you sure remove ?'
      onConfirm={() => onRemove(props.data)}
      okButtonProps={{ loading: isPending }}
    >
      <Button type='link' onClick={() => setOpen(true)}>
        remove
      </Button>
    </Popconfirm>
  )
}
