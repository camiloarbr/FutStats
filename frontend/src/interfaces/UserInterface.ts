// @author: Camilo | FutStats

export interface UserInterface {
  id: number
  username: string
  email: string
  passwordHash: string
  role: 'admin' | 'user'
  createdAt: Date
  isActive: boolean
}

export type CreateUserDTO = Omit<UserInterface, 'id' | 'createdAt'>
