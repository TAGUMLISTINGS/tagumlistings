"use client"

// components
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Menu, SendHorizontal, X } from "lucide-react"

// hooks
import { useEffect, useState, useRef } from "react"

// utils
import { motion, AnimatePresence } from "framer-motion"
import { clients } from "@/app/(admin)/_components/data/messages"

// types
import type { Client } from "@/app/(admin)/_components/data/messages"
import type React from "react"

interface MessagesClientProps {
  isAdmin?: boolean
}

const MessagesClient = ({ isAdmin }: MessagesClientProps) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsSidebarOpen(window.innerWidth >= 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [selectedClient])

  useEffect(() => {
    if (!isAdmin) {
      setSelectedClient({
        id: "admin",
        name: "Company Representative",
        email: "companyrepresentative@example.com",
        messages: [
          {
            id: "1",
            content: "Hello, I have a question about my account.",
            timestamp: Date.now() - 3600000,
            senderId: "1",
          },
          {
            id: "2",
            content: "Hi John, I'd be happy to help. What's your question?",
            timestamp: Date.now() - 3540000,
            senderId: "admin",
          },
          {
            id: "3",
            content:
              "I can't seem to update my billing information. Can you assist?",
            timestamp: Date.now() - 3480000,
            senderId: "1",
          },
          {
            id: "4",
            content:
              "Of course! I can guide you through the process. First, can you tell me which part you're having trouble with?",
            timestamp: Date.now() - 3420000,
            senderId: "admin",
          },
          {
            id: "5",
            content:
              "When I try to save my new credit card details, I get an error message.",
            timestamp: Date.now() - 3360000,
            senderId: "1",
          },
          {
            id: "6",
            content:
              "I see. Can you provide the exact error message you're seeing?",
            timestamp: Date.now() - 3300000,
            senderId: "admin",
          },
        ],
      })
    }
  }, [isAdmin])

  const filteredClients = isAdmin
    ? clients.filter((client) =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : []

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleSendMessage = (): void => {
    if (message.trim() && selectedClient) {
      const newMessage = {
        id: Date.now().toString(),
        content: message,
        timestamp: Date.now(),
        senderId: isAdmin ? "admin" : "1",
      }
      setSelectedClient({
        ...selectedClient,
        messages: [...selectedClient.messages, newMessage],
      })
      setMessage("")
    }
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  return (
    <Card className="rounded-lg border-none mt-6 h-[calc(100vh-100px)]">
      <CardContent
        className={`p-0 h-full ${isAdmin ? "w-auto container" : "w-full"}`}
      >
        <div className="flex h-full bg-background">
          {isAdmin && (
            <motion.div
              initial={false}
              animate={{
                width: isSidebarOpen ? (isMobile ? "100%" : "33.333%") : "64px",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`border-r border-border flex flex-col ${
                isMobile && !isSidebarOpen ? "hidden" : ""
              } ${isMobile ? "absolute" : "relative"} z-10 bg-background h-full`}
            >
              <div className="p-2 flex justify-between items-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={toggleSidebar}
                    className="w-12 h-12 flex justify-center items-center bg-green-500 hover:bg-green-400"
                  >
                    {isSidebarOpen ? (
                      <X className="text-white" size={32} />
                    ) : (
                      <Menu className="text-white" size={32} />
                    )}
                  </Button>
                </motion.div>
                {isSidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="ml-2 flex-grow"
                  >
                    <Input
                      placeholder="Search clients..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </motion.div>
                )}
              </div>
              <ScrollArea className="flex-grow">
                <AnimatePresence>
                  {filteredClients.map((client) => (
                    <motion.div
                      key={client.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                      className={`hover:bg-green-400 hover:text-white flex items-center p-2 cursor-pointer hover:bg-accent rounded-md ${
                        selectedClient?.id === client.id
                          ? "bg-accent text-white"
                          : ""
                      } ${isSidebarOpen ? "" : "justify-center"}`}
                      onClick={() => {
                        setSelectedClient(client)
                        if (isMobile) setIsSidebarOpen(false)
                      }}
                    >
                      <Avatar className="w-10 h-10 border flex-shrink-0 bg-white">
                        <div className="font-semibold flex items-center justify-center w-full h-full text-black truncate">
                          {getInitials(client.name)}
                        </div>
                      </Avatar>
                      {isSidebarOpen && (
                        <span className="ml-3 truncate">{client.name}</span>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </ScrollArea>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex-grow flex flex-col"
          >
            {selectedClient ? (
              <>
                <div className="p-4 border-b border-border flex justify-between items-center bg-secondary">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {selectedClient.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedClient.email}
                    </p>
                  </div>
                  {isAdmin && isMobile && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={toggleSidebar}
                        className="md:hidden w-12 h-12 flex justify-center items-center bg-green-500 hover:bg-green-400"
                      >
                        <Menu className="text-white" size={32} />
                      </Button>
                    </motion.div>
                  )}
                </div>
                <ScrollArea
                  className="flex-grow p-4 bg-accent/10"
                  ref={scrollAreaRef}
                >
                  <AnimatePresence>
                    {selectedClient.messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                        className={`mb-4 p-3 rounded-lg max-w-[70%] ${
                          msg.senderId === selectedClient.id
                            ? "bg-green-500 text-white"
                            : "bg-blue-500 text-white ml-auto"
                        }`}
                      >
                        <p className="break-words">{msg.content}</p>
                        <div className="text-xs mt-2 opacity-70">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </ScrollArea>
                <div className="p-4 border-t border-border flex bg-secondary">
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage()
                      }
                    }}
                    className="flex-grow mr-2"
                  />
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={handleSendMessage}
                      className="bg-green-600 text-white hover:bg-green-400"
                    >
                      <SendHorizontal size={24} />
                    </Button>
                  </motion.div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                {isAdmin
                  ? "Select a client to start messaging"
                  : "Loading chat..."}
              </div>
            )}
          </motion.div>
        </div>
      </CardContent>
    </Card>
  )
}

export default MessagesClient