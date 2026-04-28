// @author: Camilo | FutStats

export interface UserInterface {
  id: number
  username: string
  email: string
  role: 'admin' | 'user'
  createdAt: Date
  isActive: boolean
}
