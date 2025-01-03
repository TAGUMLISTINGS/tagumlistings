"use client"

// components
import CalendarControls from "@/components/agent/appointments/controls"
import AppointmentsView from "@/components/agent/appointments/view"
import EventItem from "@/components/agent/appointments/event-item"
import MonthView from "@/components/agent/appointments/month"
import WeekView from "@/components/agent/appointments/week"
import DayView from "@/components/agent/appointments/day"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"

// hooks
import { useState, useEffect, useMemo } from "react"

// utils
import { addDays, addMonths, addWeeks, format } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"

// type
import type { AppointmentDate, Appointment } from "@/lib/types"
import type React from "react"

export type CalendarView = "month" | "week" | "day" | "appointments"

interface CalendarProps {
  events: Appointment[]
  appointmentDates: AppointmentDate[]
}

const AppointmentCalendar = ({
  events: initialEvents,
  appointmentDates,
}: CalendarProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [view, setView] = useState<CalendarView>("month")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState(
    initialEvents.map((event) => ({
      ...event,
      description: event.description || "",
    })),
  )

  useEffect(() => {
    if (searchQuery) {
      const encodedQuery = encodeURIComponent(searchQuery.toLowerCase())
      const regex = new RegExp(encodedQuery, "i")
      const filteredEvents = initialEvents
        .filter(
          (event) =>
            regex.test(encodeURIComponent(event.user.toLowerCase())) ||
            regex.test(
              encodeURIComponent(event.description?.toLowerCase() || ""),
            ),
        )
        .map((event) => ({
          ...event,
          description: event.description || "",
        }))
      setEvents(filteredEvents)
    } else {
      setEvents(
        initialEvents.map((event) => ({
          ...event,
          description: event.description || "",
        })),
      )
    }
  }, [searchQuery, initialEvents])

  const changeDate = (amount: number) => {
    if (view === "month") {
      setCurrentDate(addMonths(currentDate, amount))
    } else if (view === "week") {
      setCurrentDate(addWeeks(currentDate, amount))
    } else if (view === "day") {
      setCurrentDate(addDays(currentDate, amount))
    }
  }

  const upcomingEvents = useMemo(() => {
    return events
      .filter((event) => event.date >= new Date())
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5)
  }, [events])

  return (
    <Card className="container mx-auto p-2 md:p-6 max-w-7xl bg-card shadow-lg">
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex flex-col justify-center items-center">
          <CalendarControls
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            changeDate={changeDate}
            view={view}
            setView={setView}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-2xl md:text-3xl mb-6 font-bold dark:text-white"
      >
        {format(currentDate, "MMMM yyyy")}
      </motion.div>
      <div className="flex flex-col md:flex-row">
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="md:block w-full md:w-64 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg md:mr-4 mb-4 md:mb-0"
            >
              <h2 className="text-lg font-bold mb-4">Upcoming Events</h2>
              <ScrollArea className="h-64 md:h-[calc(100vh-400px)]">
                {upcomingEvents.map((event) => (
                  <EventItem key={event.id} event={event} showDate />
                ))}
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex-grow">
          <AnimatePresence mode="wait">
            {view === "month" && (
              <MonthView events={events} currentDate={currentDate} />
            )}
            {view === "week" && (
              <WeekView events={events} currentDate={currentDate} />
            )}
            {view === "day" && (
              <DayView events={events} currentDate={currentDate} />
            )}
            {view === "appointments" && (
              <AppointmentsView
                events={events}
                appointmentDates={appointmentDates}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </Card>
  )
}

export default AppointmentCalendar
