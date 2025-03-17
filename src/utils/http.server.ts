'use server'

import { headers } from 'next/headers'

export async function serverFetch<T = any>(url: string, init?: RequestInit) {
  const headersList = await headers()
  const hostname = headersList.get('x-forwarded-host')

  const reqUrl = url.startsWith('http') ? url : `http://${hostname}${url}`
  const res = await fetch(reqUrl, init)
  const data = await res.json()

  return data as T
}
