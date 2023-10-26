import { Logo } from './_components/logo'
import { ThemeSwitcher } from './_components/theme-switcher'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-full max-h-screen min-h-screen bg-background">
      <nav className="flex justify-between items-center border-b border-border h-[60px] px-4 py-2">
        <Logo />
        <ThemeSwitcher />
      </nav>

      <main className="flex items-center justify-center flex-grow w-full p-8">
        {children}
      </main>
    </div>
  )
}
