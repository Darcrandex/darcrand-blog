/**
 * @name UserEditModal
 * @description
 * @author darcrand
 */

'use client'
import { UserItem } from '@/types'
import { sleep } from '@/utils/common'
import { http } from '@/utils/http'
import { useIsMutating, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToggle } from 'ahooks'
import { Form, Input, Modal } from 'antd'
import { omit } from 'lodash-es'
import { useEffect } from 'react'

const FORM_ID = 'user-edit-form'

export default function UserEditModal(props: {
  data?: UserItem
  renderTrigger: (onOpen: () => void) => React.ReactNode
}) {
  const isEdit = Boolean(props.data?.id)
  const [open, { toggle }] = useToggle(false)
  const isPending = useIsMutating({ mutationKey: ['user', 'edit'] }) > 0

  return (
    <>
      {props.renderTrigger(toggle)}

      <Modal
        title={isEdit ? 'Update User' : 'Create User'}
        open={open}
        onCancel={toggle}
        destroyOnClose
        okButtonProps={{ form: FORM_ID, htmlType: 'submit', loading: isPending }}
      >
        <FormContent data={props.data} onSuccess={toggle} />
      </Modal>
    </>
  )
}

function FormContent(props: { data?: UserItem; onSuccess?: () => void }) {
  const [form] = Form.useForm()
  const isEdit = Boolean(props.data?.id)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (props.data) {
      form.setFieldsValue(omit(props.data, 'password'))
    } else {
      form.resetFields()
    }
  }, [form, props.data])

  const submitMutaion = useMutation({
    mutationKey: ['user', 'edit'],
    mutationFn: async () => {
      const values = await form.validateFields()

      if (isEdit) {
        await http.patch(`/api/user/${props.data?.id}`, values)
      } else {
        await http.post('/api/user', values)
      }

      // 数据库更新有延迟
      await sleep(2000)
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['user', 'all'] })
      props.onSuccess?.()
    },
  })

  return (
    <>
      <Form name={FORM_ID} form={form} autoComplete='off' layout='vertical' onFinish={submitMutaion.mutate}>
        <Form.Item name='id' hidden>
          <Input />
        </Form.Item>

        <Form.Item name='name' label='Name' required rules={[{ required: true, message: 'Please input name!' }]}>
          <Input />
        </Form.Item>

        <Form.Item
          name='email'
          label='Email'
          required
          rules={[
            { required: true, message: 'Please input email!' },
            { type: 'email', message: 'Please input valid email!' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='password'
          label='Password'
          hidden={isEdit}
          required={!isEdit}
          rules={[{ required: !isEdit, message: 'Please input password!' }]}
        >
          <Input.Password maxLength={20} />
        </Form.Item>
      </Form>
    </>
  )
}
