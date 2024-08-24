// components
import Menu from "@/app/(admin)/_components/menu"
import { Button } from "@/components/ui/button"
import SidebarToggle from "@/components/ui/sidebar-toggle"

// hooks
import { useSidebarToggle } from "@/lib/hooks/use-sidebar-toggle"
import { useStore } from "@/lib/hooks/use-store"

// utils
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

const Sidebar = () => {
  // init sidebar
  const sidebar = useStore(useSidebarToggle, (state) => state)

  if (!sidebar) return null

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
        sidebar?.isOpen === false ? "w-[90px]" : "w-72",
      )}
    >
      {/* sidebar toggle button */}
      <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} />

      <div className="relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800 ">
        <Button
          className={cn(
            "transition-transform ease-in-out duration-300 mb-1",
            sidebar?.isOpen === false ? "translate-x-1" : "translate-x-0",
          )}
          variant="link"
          asChild
        >
          {/* brand logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image
              src="/icons/icon.ico"
              alt="logo"
              priority
              height={500}
              width={500}
              sizes="100vh"
              className="object contain rounded-full size-8"
            />

            <h1
              className={cn(
                "font-bold text-lg whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300",
                sidebar?.isOpen === false
                  ? "-translate-x-96 opacity-0 hidden"
                  : "translate-x-0 opacity-100",
              )}
            >
              TagumListings
            </h1>
          </Link>
        </Button>
        {/* menu */}
        <Menu isOpen={sidebar?.isOpen} />
      </div>
    </aside>
  )
}

export default Sidebar