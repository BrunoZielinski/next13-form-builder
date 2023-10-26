import { UserButton } from '@clerk/nextjs'

import { Logo } from './_components/logo'
import { ThemeSwitcher } from './_components/theme-switcher'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background max-h-screen h-full">
      <nav className="flex justify-between items-center border-b border-border h-[60px] px-4 py-2">
        <Logo />

        <div className="flex gap-4 items-center">
          <ThemeSwitcher />
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </nav>

      <main className="flex w-full flex-grow">{children}</main>
    </div>
  )
}
