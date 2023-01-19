import { completeUserData } from '../types/types'
import { LoggedInUser } from '../types/types'

export const loginBackend = async (email: string, password: string) => {
    const response = await fetch(`http://localhost:3001/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    })
    const json = await response.json()
    console.log('json: ', json)
    console.log('response: ', response)
    if (response.ok) {
        console.log('JSON')
        let userObj: LoggedInUser = json.userDetails
        return {
            userObj,
            ok: true,
        }
    } else {
        console.log(json)
        return { ok: false, message: json.message }
    }
}

export const signUpBackend = async ({
    username,
    user_first_name,
    user_last_name,
    email,
    street,
    city,
    state,
    zipCode,
    country,
    file,
}: completeUserData) => {
    console.log('test')
    console.log(city)

    let formData = new FormData()
    formData.append('username', username)
    formData.append('user_first_name', user_first_name)
    formData.append('user_last_name', user_last_name)
    formData.append('email', email)
    formData.append('street', street)
    formData.append('city', city)
    formData.append('state', state)
    formData.append('zipCode', zipCode)
    formData.append('country', country)
    // formData.append('roles', ['lender', 'borrower']) // TODO: add roles to form
    formData.append('file', file)

    console.log(formData)

    const response = await fetch(`http://localhost:3001/users/signup`, {
        method: 'POST',
        body: formData,
    })
    const json = await response.json()

    console.log(response)
    if (response.ok) {
        return { userObj: json.userDetails, ok: true }
    } else {
        console.log(json)
        return { ok: false, message: json.message }
    }
}

export const premlimSignUpBackend = async (email: string, password: string) => {
    console.log('test')
    const response = await fetch(`http://localhost:3001/users/prelimsignup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })

    const json = await response.json()

    console.log('json: ', json)

    if (response.ok) {
        return { ok: response.ok }
    } else {
        console.log(json)
        return { ok: false, message: json.message }
    }
}

export const verifyEmailBackend = async (
    email: string | undefined,
    tokenid: string | undefined
) => {
    const response = await fetch(
        `http://localhost:3001/users/verification/` + email + '/' + tokenid,
        {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }
    )
    const json = await response.json()
    if (response.ok) {
        console.log('is GPOOD')
        return { ok: true }
    } else {
        return { ok: false, message: json.message }
    }
}

export const changePasswordBackend = async (
    email: string,
    password: string,
    oldpassword: string,
    token: string
) => {
    const response = await fetch(`http://localhost:3001/users/changepassword`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, password, oldpassword }),
    })

    const json = await response.json()

    console.log('json: ', json)

    if (response.ok) {
        return { ok: response.ok, newToken: json.token }
    } else {
        console.log(json)
        return { ok: false, message: json.message }
    }
}

export const checkTokenBackend = async (token: string) => {
    const response = await fetch(`http://localhost:3001/users/checktoken`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })

    const json = await response.json()

    console.log('json: ', json)

    if (response.ok) {
        return { ok: response.ok, newToken: json.token }
    } else {
        console.log(json)
        return { ok: false, message: json.message }
    }
}

export const updateFieldsBackend = async (
    fields: Partial<completeUserData>,
    token: string,
    email: string,
    file?: File
) => {
    console.log('here')
    console.log(fields)
    let formData = new FormData()
    formData.append('email', email)
    formData.append('fields', JSON.stringify(fields))
    console.log(file)
    if (file) {
        formData.append('file', file)
    }

    const response = await fetch(`http://localhost:3001/users/update`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    })

    const json = await response.json()

    console.log('json: ', json)

    if (response.ok) {
        return { ok: true, userObj: json.userDetails }
    } else {
        console.log(json)
        return { ok: false, message: json.message }
    }
}
