export interface GoogleSession {
  user: GoogleUser
  expires: number
  iat: number
}
export type GoogleUser = {
  id: string
  accounts: GoogleAccount[]
}

export type GoogleAccount = {
  name: string
  picture: string
  providerId: string
  providerAccountId: string
  email: string
  accessToken: string
  refreshToken: string
  userId: string
}
