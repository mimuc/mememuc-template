import { useLocalStorage } from './useLocalStorage'
import AuthContext from '../hooks/useAuth'
import { LoggedInUser } from '../types/types'

export const useUser = () => {
    const { user  } = AuthContext()
    const { setItem, removeItem } = useLocalStorage()

    const addUser = (user: LoggedInUser) => {
        // TODO: Might need to encrypt user
        setItem('user', JSON.stringify(user))
    }

    const removeUser = () => {
        removeItem('user')
    }

    return { user, addUser, removeUser }
}
