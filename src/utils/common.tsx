import { customAlphabet } from 'nanoid'

// generate id from [a-z0-9]{8}
export const uuid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 8)

// sleep
export const sleep = (ms: number = 1000) => new Promise<void>((resolve) => setTimeout(resolve, ms))
