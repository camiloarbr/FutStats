// @author: Camilo | FutStats
// 1. External imports

// 2. Internal imports
import type { UserInterface } from '@/interfaces/UserInterface'

export type CreateUserDTO = Omit<UserInterface, 'id' | 'createdAt'>
export type UpdateUserDTO = Partial<Omit<UserInterface, 'id' | 'createdAt'>>
