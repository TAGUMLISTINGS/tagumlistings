"use client"

// components
import MessageNotification from "@/components/layouts/agent/message-notification"
import SheetMenu from "@/components/layouts/agent/sheet-menu"
import UserButton from "@/components/shared/user-button"
import ThemeToggle from "@/components/ui/theme-toggle"

interface NavbarProps {
  title: string
}

const Navbar = ({ title }: NavbarProps) => {
  return (
    <header className="sticky top-0 z-20 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <nav className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
          <h1 className="font-bold text-green-600">{title}</h1>
        </div>

        <div className="flex flex-1 items-center space-x-2 justify-end">
          <MessageNotification />
          <ThemeToggle />
          <UserButton />
        </div>
      </nav>
    </header>
  )
}

export default Navbar
