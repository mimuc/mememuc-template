export type Picture = {
    id?: string
    file?: any
    src: string
    alt: string
    ImagePreviewUrl?: string
}

export type BasicData = {
    user_first_name: string
    user_last_name: string
    email: string
}

export type ProfileData = Picture & {
    username: string
    user_description: string
}

export type userAuth = {
    email: string
    password: string
}

export type Address = {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
}

export type completeUserData = ProfileData & Address & BasicData

export type LoggedInUser = {
    id: string
    username?: string
    user_first_name: string
    user_last_name: string
    email: string
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    profile_picture: string
    user_description: string
    verified: boolean
    full_access?: boolean
    token: string
    memberSince: string
    last_login?: string
    roles: string[]
}

export type Item = {
    _id: string
    item_name: string
    images: string[]
    creation_date: string
    daily_price: number // Stored in cents
    weekly_price: number // Stored in cents
    montly_price: number // Stored in cents
    published: boolean
    item_description: string
    item_category: string
    item_owner: string
}

export type NewItemUpload = {
    item_name: string
    // creation_date?: string, // wil be done on backend
    daily_price: number // Stored in cents
    weekly_price: number // Stored in cents
    montly_price: number // Stored in cents
    published: boolean
    item_owner: string
    item_description: string
    item_category:
        | 'Bikes'
        | 'Drones'
        | 'Power Tools'
        | 'Camaras and Equipment'
        | 'Kitchen'
        | 'Gardening'
        | 'Autos'
        | 'Real Estate'
        | 'Sport Equipment'
        | 'Other'
        | 'Undefined'
}

export type NestedKeyOf<T extends object> = {
    [Key in keyof T & (string | number)]: T[Key] extends object
        ? `${Key}` | `${Key}.${NestedKeyOf<T[Key]>}`
        : `${Key}`
}[keyof T & (string | number)]
