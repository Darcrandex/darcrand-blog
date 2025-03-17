/**
 * @name AdminManage
 * @description
 * @author darcrand
 */

'use client'
import PasswordModal from '@/components/PasswordModal'
import UserEditModal from '@/components/UserEditModal'
import UserRemoveBtn from '@/components/UserRemoveBtn'
import { Result, UserItem } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { Button, Table, TableProps } from 'antd'

export default function AdminManage() {
  const { data: list, isPending } = useQuery({
    queryKey: ['user', 'all'],
    queryFn: async () => {
      const res = await fetch('/api/user')
      const data: Result<UserItem[]> = await res.json()
      return data.data
    },
  })

  const columns: TableProps<UserItem>['columns'] = [
    { title: 'Name', dataIndex: 'name', width: 200 },
    { title: 'Email', dataIndex: 'email', width: 250 },
    { title: 'Password', dataIndex: 'password', width: 250, ellipsis: true },
    {
      title: 'Operations',
      render: (_, record) => (
        <>
          <UserEditModal
            data={record}
            renderTrigger={(onOpen) => (
              <Button type='link' onClick={onOpen}>
                update
              </Button>
            )}
          />

          <UserRemoveBtn data={record} />

          <PasswordModal
            data={record}
            renderTrigger={(onOpen) => (
              <Button type='link' onClick={onOpen}>
                password
              </Button>
            )}
          />
        </>
      ),
    },
  ]

  return (
    <>
      <section className='m-4'>
        <UserEditModal
          renderTrigger={(onOpen) => (
            <Button disabled={!!list?.length && list.length >= 10} onClick={onOpen}>
              Create User
            </Button>
          )}
        />
        <Table
          className='mt-4'
          columns={columns}
          dataSource={list}
          rowKey='id'
          loading={isPending}
          pagination={{ hideOnSinglePage: true }}
        />
      </section>
    </>
  )
}
