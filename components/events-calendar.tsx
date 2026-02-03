'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar as CalendarIcon, X, Sparkles, Trophy, Users, Gift } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Event {
  id: string
  date: Date
  title: string
  description: string
  type: 'tournament' | 'meetup' | 'sale' | 'special'
  location?: string
}

// Mock events - you can replace this with data from your database
const mockEvents: Event[] = [
  {
    id: '1',
    date: new Date(2026, 0, 25), // Jan 25, 2026
    title: 'Weekly Trading Meetup',
    description: 'Join us for our weekly Pokemon card trading session! Bring your cards and trade with fellow collectors.',
    type: 'meetup',
    location: 'Barcelona, Spain',
  },
  {
    id: '2',
    date: new Date(2026, 1, 8), // Feb 8, 2026
    title: 'Pokemon TCG Tournament',
    description: 'Competitive tournament with prizes! All skill levels welcome. Registration opens 2 weeks before.',
    type: 'tournament',
    location: 'Barcelona, Spain',
  },
  {
    id: '3',
    date: new Date(2026, 1, 14), // Feb 14, 2026
    title: 'Valentine\'s Day Special Sale',
    description: '20% off on all cards! Perfect time to find that special card for your collection or gift.',
    type: 'sale',
  },
  {
    id: '4',
    date: new Date(2026, 1, 22), // Feb 22, 2026
    title: 'New Set Release Party',
    description: 'Celebrate the latest Pokemon TCG set release with us! Early access to new products.',
    type: 'special',
    location: 'Barcelona, Spain',
  },
]

const eventTypeConfig = {
  tournament: { icon: Trophy, color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  meetup: { icon: Users, color: 'bg-purple-600/20 text-purple-300 border-purple-600/30' },
  sale: { icon: Gift, color: 'bg-purple-700/20 text-purple-200 border-purple-700/30' },
  special: { icon: Sparkles, color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
}

export function EventsCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const today = new Date()
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Get events for a specific date
  const getEventsForDate = (date: Date): Event[] => {
    return mockEvents.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    )
  }

  // Check if date has events
  const hasEvents = (date: Date): boolean => {
    return getEventsForDate(date).length > 0
  }

  // Navigate months
  const previousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1))
  }

  // Handle date click
  const handleDateClick = (day: number) => {
    const clickedDate = new Date(year, month, day)
    const events = getEventsForDate(clickedDate)
    
    if (events.length > 0) {
      setSelectedDate(clickedDate)
      setSelectedEvent(events[0]) // Show first event, or you could show a list
    }
  }

  // Generate calendar days
  const days = []
  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  return (
    <div className="w-full mt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-card rounded-lg border border-border p-5 shadow-lg"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10">
              <CalendarIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-heading font-bold">Upcoming Events</h2>
              <p className="text-sm text-muted-foreground">Join our Pokemon community events!</p>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="space-y-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={previousMonth}
              className="hover:bg-primary/10 h-8 w-8 p-0"
            >
              ←
            </Button>
            <h3 className="text-lg font-semibold">
              {monthNames[month]} {year}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextMonth}
              className="hover:bg-primary/10 h-8 w-8 p-0"
            >
              →
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-muted-foreground py-1"
              >
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {days.map((day, index) => {
              if (day === null) {
                return <div key={index} className="h-10" />
              }

              const date = new Date(year, month, day)
              const isToday =
                date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear()
              const hasEvent = hasEvents(date)
              const isPast = date < today && !isToday

              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={cn(
                    'h-10 rounded text-xs font-medium transition-all duration-200',
                    'hover:scale-105 hover:bg-primary/10',
                    isToday && 'bg-primary/20 border border-primary',
                    hasEvent && !isPast && 'bg-purple-500/20 border border-purple-500/40 hover:bg-purple-500/30',
                    isPast && 'opacity-40 cursor-not-allowed',
                    !hasEvent && !isToday && 'hover:bg-muted'
                  )}
                >
                  <div className="flex flex-col items-center justify-center h-full py-0.5">
                    <span className={cn(
                      isToday && 'text-primary font-bold text-xs',
                      hasEvent && !isPast && 'text-purple-300 font-semibold text-xs',
                      !hasEvent && !isToday && 'text-foreground text-xs'
                    )}>
                      {day}
                    </span>
                    {hasEvent && !isPast && (
                      <div className="w-1 h-1 rounded-full bg-purple-400 mt-0.5" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Event List */}
          <div className="mt-5 space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground mb-3">Upcoming Events</h4>
            {mockEvents
              .filter((event) => event.date >= today)
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .slice(0, 3)
              .map((event) => {
                const EventIcon = eventTypeConfig[event.type].icon
                return (
                  <motion.button
                    key={event.id}
                    onClick={() => {
                      setSelectedDate(event.date)
                      setSelectedEvent(event)
                    }}
                    className={cn(
                      'w-full text-left p-2.5 rounded border transition-all duration-200',
                      'hover:scale-[1.01] hover:shadow-sm',
                      eventTypeConfig[event.type].color
                    )}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="p-1.5 rounded bg-purple-500/20 flex-shrink-0">
                        <EventIcon className="w-4 h-4 text-purple-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-purple-200">
                            {event.date.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                          {event.location && (
                            <>
                              <span className="text-purple-400/50 text-xs">•</span>
                              <span className="text-xs text-purple-300/70 truncate">{event.location}</span>
                            </>
                          )}
                        </div>
                        <h5 className="font-semibold text-sm text-purple-100 truncate">
                          {event.title}
                        </h5>
                      </div>
                    </div>
                  </motion.button>
                )
              })}
          </div>
        </div>
      </motion.div>

      {/* Event Popup Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSelectedEvent(null)
                setSelectedDate(null)
              }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
            >
              <div className="bg-card border-2 border-purple-500/50 rounded-lg shadow-2xl p-4 relative">
                {/* Close button */}
                <button
                  onClick={() => {
                    setSelectedEvent(null)
                    setSelectedDate(null)
                  }}
                  className="absolute top-3 right-3 p-1 rounded-md hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Event Icon */}
                <div className="mb-3">
                  <div className="inline-flex p-2 rounded-lg bg-gradient-to-br from-purple-500/30 to-purple-600/30 border border-purple-500/40">
                    {(() => {
                      const EventIcon = eventTypeConfig[selectedEvent.type].icon
                      return <EventIcon className="w-5 h-5 text-purple-300" />
                    })()}
                  </div>
                </div>

                {/* Event Content */}
                <div className="space-y-2">
                  <div>
                    <h3 className="text-xl font-heading font-bold text-foreground mb-1.5">
                      {selectedEvent.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        <span>
                          {selectedEvent.date.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      {selectedEvent.location && (
                        <>
                          <span>•</span>
                          <span>{selectedEvent.location}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border">
                    <p className="text-sm text-foreground leading-relaxed">
                      {selectedEvent.description}
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="pt-3">
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-sm"
                      onClick={() => {
                        // You can add navigation or action here
                        console.log('Event action clicked')
                      }}
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
