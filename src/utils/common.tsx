import { customAlphabet } from 'nanoid'

// generate id from [a-z0-9]{8}
export const uuid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 8)
