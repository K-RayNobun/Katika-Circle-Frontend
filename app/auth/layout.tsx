import AuthLayoutClient from './AuthLayoutClient'

export function generateStaticParams() {
  return [
    { slug: 'signup', path: '/auth/signup' },
    { slug: 'signin', path: '/auth/signin' },
    { slug: 'pincheck', path: '/auth/pincheck' },
    { slug: 'welcome', path: '/auth/welcome' },
    { slug: 'password_reset', path: '/auth/password_reset' },
    { slug: 'mail_check', path: '/auth/mail_check' }
  ]
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthLayoutClient>{children}</AuthLayoutClient>
}