import {
    createContext,
    ReactNode,
    useState,
    useMemo,
    useEffect,
    useContext,
} from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LoggedInUser } from '../types/types'
import { useLocalStorage } from '../hooks/useLocalStorage'

import { completeUserData, userAuth } from '../types/types'
import {
    loginBackend,
    premlimSignUpBackend,
    signUpBackend,
    changePasswordBackend,
    verifyEmailBackend,
    updateFieldsBackend,
} from '../services/authService'
import { getErrorMessage } from '../services/helperService'
import { useUser } from '../hooks/useUser'
import { useEffectOnce } from './useEffectOnce'

const initial_user: LoggedInUser = {
    id: '',
    username: '',
    email: '',
    user_first_name: '',
    user_last_name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    profile_picture: '',
    user_description: '',
    verified: false,
    full_access: false,
    token: '',
    memberSince: '',
    last_login: '',
    roles: [],
}

// Source: https://dev.to/finiam/predictable-react-authentication-with-the-context-api-g10

interface AuthContextType {
    loading: boolean
    error?: any
    login: (user: userAuth) => void
    signUp: (formData: completeUserData) => Promise<{
        ok: boolean
    }>
    prelimSignUp: (user: userAuth) => Promise<boolean>
    updateFields: (
        fields: Partial<completeUserData>,
        file: File | undefined,
        email: string
    ) => Promise<boolean>
    changePassword: (password: string, newPassword: string) => Promise<boolean>
    verifyEmail: (email: string, token: string) => Promise<boolean>
    checkPasswordsMatch: (password: string, passwordConfirm: string) => boolean
    logout: () => void
    user: LoggedInUser
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({
    children,
}: {
    children: ReactNode
}): JSX.Element {
    const [user, setUser] = useState<LoggedInUser>(initial_user)
    const [error, setError] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [loadingInitial, setLoadingInitial] = useState<boolean>(true)
    // We are using `react-router` for this example,
    // but feel free to omit this or use the
    // router of your choice.
    const navigate = useNavigate()
    const location = useLocation()

    const { getItem } = useLocalStorage()
    const { addUser, removeUser } = useUser()

    // If we change page, reset the error state.
    useEffect(() => {
        if (error !== '') setError('')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname])

    // Checks if the user is logged in and if so, sets the user
    useEffectOnce(() => {
        let currentUser = getItem('user')
        if (currentUser) {
            let currentUserObj: LoggedInUser
            console.log(typeof currentUser)
            if (typeof currentUser === 'string') {
                currentUserObj = JSON.parse(currentUser)
            } else {
                currentUserObj = currentUser
            }
            setUser((prev) => ({ ...prev, ...currentUserObj }))
        }
        setLoadingInitial(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    })

    // reduces redundant code
    const updateUser = (newUser: LoggedInUser) => {
        setUser((prev) => ({ ...prev, ...newUser }))
        addUser(newUser)
    }

    // Flags the component loading state and posts the login
    // data to the server.
    //
    // An error means that the email/password combination is
    // not valid.
    //
    // Finally, just signal the component that loading the
    // loading state is over.
    const login = async (userForm: userAuth) => {
        setLoading(true)
        loginBackend(userForm.email, userForm.password)
            .then(({ userObj, ok, message }) => {
                if (userObj) {
                    updateUser(userObj)
                } else {
                    console.log(message)
                    throw new Error(message)
                }
                if (userObj.verified) {
                    navigate('/', { replace: true })
                } else if (userObj.verified === false) {
                    console.log('[Should navigate to complte signup]')
                    navigate('/signup/complete', { replace: true })
                }
            })
            .catch((error) => {
                let errorMessage = getErrorMessage(error)
                console.log('here')
                setError(errorMessage)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const signUp = async (formData: completeUserData) => {
        try {
            let { userObj, ok, message } = await signUpBackend(formData)
            console.log(userObj)
            if (ok) {
                updateUser(userObj)
                return { ok }
            } else {
                throw new Error(message)
            }
        } catch (error) {
            let errorMessage = getErrorMessage(error)
            setError(errorMessage)
            return { ok: false }
        }
    }

    const verifyEmail = async (email: string, tokenId: string) => {
        setLoading(true)
        console.log('verify email')
        try {
            let response = await verifyEmailBackend(email, tokenId)
            console.log(response)
            if (response.ok) {
                setUser((prev) => ({ ...prev, email: email }))
                addUser(user) // Probably doesn't work because of async
                return true
            } else {
                throw new Error(response.message)
            }
        } catch (error) {
            let errorMessage = getErrorMessage(error)
            setError(errorMessage)
            return false
        } finally {
            setLoading(false)
        }
    }

    const prelimSignUp = async (userForm: userAuth): Promise<boolean> => {
        let { email, password } = userForm
        try {
            let { ok, message } = await premlimSignUpBackend(email, password)
            if (ok) {
                return true
            } else {
                throw new Error(message)
            }
        } catch (error) {
            let errorMessage = getErrorMessage(error)
            setError(errorMessage)
            return false
        }
    }

    const updateFields = async (
        fields: Partial<completeUserData>,
        file: File | undefined,
        email: string
    ) => {
        setLoading(true)
        console.log(fields)
        try {
            let { ok, message, userObj } = await updateFieldsBackend(
                fields,
                user.token,
                email,
                file && file
            )
            if (ok && typeof userObj !== 'undefined') {
                console.log(userObj)
                updateUser(userObj)
                return true
            } else {
                console.log('Line 219 Throws Error')
                throw new Error(message)
            }
        } catch (error) {
            let errorMessage = getErrorMessage(error)
            setError(errorMessage)
            return false
        } finally {
            console.log('finally runs here')
            setLoading(false)
        }
    }

    const changePassword = async (password: string, oldPassword: string) => {
        setLoading(true)
        try {
            let { ok, message, newToken } = await changePasswordBackend(
                user.email,
                password,
                oldPassword,
                user.token
            )
            if (ok) {
                setUser((prev) => ({ ...prev, token: newToken }))
                addUser(user)
                return true
            } else {
                throw new Error(message)
            }
        } catch (error) {
            let errorMessage = getErrorMessage(error)
            setError(errorMessage)
            return false
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        console.log('logout')
        removeUser()
        setUser(initial_user)
        navigate('/login')
    }

    const checkPasswordsMatch = (password: string, confirmPassword: string) => {
        if (password === '') {
            // Here we can check password length, etc.
            setError('Please enter a password')
            return false
        } else if (password !== confirmPassword) {
            setError('Passwords do not match')
            return false
        } else {
            return true
        }
    }

    // Make the provider update only when it should.
    // We only want to force re-renders if the user,
    // loading or error states change.
    //
    // Whenever the `value` passed into a provider changes,
    // the whole tree under the provider re-renders, and
    // that can be very costly! Even in this case, where
    // you only get re-renders when logging in and out
    // we want to keep things very performant.
    const memoedValue = useMemo(
        () => ({
            user,
            loading,
            error,
            login,
            signUp,
            prelimSignUp,
            updateFields,
            changePassword,
            verifyEmail,
            checkPasswordsMatch,
            logout,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [user, loading, error]
    )

    // We only want to render the underlying app after we
    // assert for the presence of a current user.
    return (
        <AuthContext.Provider value={memoedValue}>
            {!loadingInitial && children}
        </AuthContext.Provider>
    )
}

export default function useAuth() {
    return useContext(AuthContext)
}
