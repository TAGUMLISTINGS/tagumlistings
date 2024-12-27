"use client"

// components
import Navbar from "@/components/layouts/agent/navbar"

export interface ContentLayoutProps {
  children: React.ReactNode
  title: string
}

const ContentLayout = ({ children, title }: ContentLayoutProps) => {
  return (
    <div>
      <Navbar title={title} />
      <div className="container pt-8 pb-4 px-4 sm:px-8">{children}</div>
    </div>
  )
}

export default ContentLayout
