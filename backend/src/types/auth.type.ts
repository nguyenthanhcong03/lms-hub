export interface registrationData {
  email: string
  password: string
  username: string
}

export interface LoginData {
  email: string
  password: string
}

export interface UpdateAuthMeParams {
  username?: string
  email?: string
  phone?: string
  avatar?: string
}
