import AuthLayoutClient from './AuthLayoutClient'

export function generateStaticParams() {
  return [
    { slug: 'signup', path: '/auth/signup' },
    { slug: 'signin', path: '/auth/signin' },
    { slug: 'pincheck', path: '/auth/pincheck' },
    { slug: 'welcome', path: '/auth/welcome' }
  ]
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthLayoutClient>{children}</AuthLayoutClient>
}