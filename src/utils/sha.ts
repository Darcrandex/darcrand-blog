import CryptoJS from 'crypto-js'

// 哈希加密函数，使用 SHA256 算法
export const hashData = (data: string): string => {
  return CryptoJS.SHA256(data).toString()
}

// 比对函数，判断明文的哈希值是否与给定的哈希值相等
export const compareHash = (plainText: string, hashedText: string): boolean => {
  const newHash = hashData(plainText)
  return newHash === hashedText
}
