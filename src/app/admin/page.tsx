/**
 * @name AdminManage
 * @description
 * @author darcrand
 */

'use client'
import { Result, UserItem } from '@/types'
import { http } from '@/utils/http'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Form, Input, Modal, Popconfirm, Table, TableProps } from 'antd'
import { omit } from 'lodash-es'
import React, { useEffect, useState } from 'react'

export default function AdminManage() {
  const { data: list, isPending } = useQuery({
    queryKey: ['user', 'all'],
    queryFn: async () => {
      const res = await fetch('/api/user')
      const data: Result<UserItem[]> = await res.json()
      return data.data
    },
  })

  const queryClient = useQueryClient()
  const { mutate: onRemove } = useMutation({
    mutationFn: async (body: UserItem) => {
      await http.delete(`/api/user/${body.id}`)
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['user', 'all'] })
    },
  })

  const columns: TableProps<UserItem>['columns'] = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Password', dataIndex: 'password' },
    {
      title: 'Operations',
      render: (_, record) => (
        <>
          <FormModal
            data={record}
            renderTrigger={(onOpen) => (
              <Button type='link' onClick={onOpen}>
                update
              </Button>
            )}
          />

          <Popconfirm title='Are you sure remove ?' onConfirm={() => onRemove(record)}>
            <Button type='link'>remove</Button>
          </Popconfirm>

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
      <FormModal />

      <Table columns={columns} dataSource={list} rowKey='id' loading={isPending} />
    </>
  )
}

function FormModal(props: { data?: UserItem; renderTrigger?: (onOpen: () => void) => React.ReactNode }) {
  const [form] = Form.useForm()
  const isEdit = Boolean(props.data)
  const title = isEdit ? 'Update User' : 'Create User'
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (open && form && props.data) {
      form.setFieldsValue(omit(props.data, 'password'))
    }

    if (!open && form) {
      form.resetFields()
    }
  }, [props.data, form, open])

  const mutation = useMutation({
    mutationFn: async () => {
      const values = await form.validateFields()

      if (isEdit) {
        await http.patch(`/api/user/${props.data?.id}`, values)
      } else {
        http.post('/api/user', values)
      }
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['user', 'all'] })
      setOpen(false)
    },
  })

  return (
    <>
      {props.renderTrigger ? (
        props.renderTrigger(() => setOpen(true))
      ) : (
        <Button onClick={() => setOpen(true)}>{title}</Button>
      )}

      <Modal
        open={open}
        title={title}
        onCancel={() => setOpen(false)}
        onOk={() => mutation.mutate()}
        okButtonProps={{ loading: mutation.isPending }}
        destroyOnClose
      >
        <Form form={form} layout='vertical' onFinish={mutation.mutate}>
          <Form.Item name='id' hidden>
            <Input />
          </Form.Item>
          <Form.Item name='name' label='Name'>
            <Input />
          </Form.Item>
          <Form.Item name='email' label='Email'>
            <Input />
          </Form.Item>
          <Form.Item name='password' label='Password' hidden={isEdit}>
            <Input.Password maxLength={20} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

function PasswordModal(props: { data: UserItem; renderTrigger: (onOpen: () => void) => React.ReactNode }) {
  const [form] = Form.useForm()
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (open && form) {
      form.resetFields()
    }
  }, [open, form])

  const mutation = useMutation({
    mutationFn: async () => {
      const values = await form.validateFields()
      await http.patch(`/api/user/${props.data.id}/password`, values)
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['user', 'all'] })
      setOpen(false)
    },
  })

  return (
    <>
      {props.renderTrigger(() => setOpen(true))}

      <Modal
        open={open}
        title='Update Password'
        onCancel={() => setOpen(false)}
        onOk={() => mutation.mutate()}
        okButtonProps={{ loading: mutation.isPending }}
        destroyOnClose
      >
        <Form form={form} layout='vertical' onFinish={mutation.mutate}>
          <Form.Item name='oldPassword' label='Old Password'>
            <Input.Password maxLength={20} />
          </Form.Item>
          <Form.Item name='newPassword' label='NewPassword'>
            <Input.Password maxLength={20} />
          </Form.Item>
          <Form.Item name='confirmPassword' label='ConfirmPassword'>
            <Input.Password maxLength={20} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
