'use client'
import { UserItem } from '@/types'
import { sleep } from '@/utils/common'
import { http } from '@/utils/http'
import { useIsMutating, useMutation, useQueryClient } from '@tanstack/react-query'
import { Form, Input, Modal } from 'antd'
import React, { useState } from 'react'

const FORM_ID = 'user-password-form'

export default function PasswordModal(props: {
  data: UserItem
  renderTrigger: (onOpen: () => void) => React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const isPending = useIsMutating({ mutationKey: ['user', 'password'] }) > 0

  return (
    <>
      {props.renderTrigger(() => setOpen(true))}

      <Modal
        open={open}
        title='Update Password'
        onCancel={() => setOpen(false)}
        okButtonProps={{ form: FORM_ID, htmlType: 'submit', loading: isPending }}
        destroyOnClose
      >
        <FormContent data={props.data} onSuccess={() => setOpen(false)} />
      </Modal>
    </>
  )
}

function FormContent(props: { data: UserItem; onSuccess?: () => void }) {
  const [form] = Form.useForm()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationKey: ['user', 'password'],
    mutationFn: async () => {
      const values = await form.validateFields()
      await http.patch(`/api/user/${props.data.id}/password`, values)
      await sleep()
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['user', 'all'] })
      props.onSuccess?.()
    },
  })

  return (
    <Form name={FORM_ID} form={form} layout='vertical' onFinish={mutation.mutate}>
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
  )
}
