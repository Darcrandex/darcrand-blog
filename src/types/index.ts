export interface PostItem {
  id: string
  title: string
  cover?: string
  content?: string
}

export interface UserItem {
  id: string
  name: string
  email: string
  password: string
}

export interface Result<T = any> {
  message: string
  data: T
}
