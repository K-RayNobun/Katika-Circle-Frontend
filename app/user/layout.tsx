import UserLayoutClient from './UserLayoutClient'

export function generateStaticParams() {
    return [
        { slug: 'home', path: '/user/home' },
        { slug: 'transactions', path: '/user/transactions' },
        { slug: 'awards', path: '/user/awards' },
        { slug: 'settings', path: '/user/settings' }
    ]
}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <UserLayoutClient>{children}</UserLayoutClient>
}