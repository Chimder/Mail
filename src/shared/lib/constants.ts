export const APP_TITLE = 'Acme'
export const DATABASE_PREFIX = 'acme_v3'
export const EMAIL_SENDER = '"Acme" <noreply@acme.com>'

export const redirects = {
  toHome: '/',
  toGoogleLogin: '/google/login',
  // toSignup: "/signup",
  // afterLogin: "/dashboard",
  // afterLogout: "/",
  // toVerify: "/verify-email",
  // afterVerify: "/dashboard",
} as const
