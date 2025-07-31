"use client"

import React, { useState } from "react"
import { format, addMinutes, startOfDay, setHours, setMinutes } from "date-fns"
import { Calendar as CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DateTimePickerProps {
  date?: Date
  onDateChange: (date: Date | undefined) => void
  label?: string
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function DateTimePicker({
  date,
  onDateChange,
  label,
  placeholder = "Pick a date and time",
  className,
  disabled = false,
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Generate time options (every 15 minutes)
  const timeOptions = React.useMemo(() => {
    const options = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = setMinutes(setHours(new Date(), hour), minute)
        options.push({
          value: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
          label: format(time, 'h:mm a'),
          time: { hour, minute }
        })
      }
    }
    return options
  }, [])

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      if (date) {
        // Preserve the time when changing date
        const newDate = new Date(selectedDate)
        newDate.setHours(date.getHours())
        newDate.setMinutes(date.getMinutes())
        onDateChange(newDate)
      } else {
        // Set default time to 9:00 AM if no time was set
        const newDate = setMinutes(setHours(selectedDate, 9), 0)
        onDateChange(newDate)
      }
    } else {
      onDateChange(undefined)
    }
  }

  const handleTimeSelect = (timeValue: string) => {
    const [hour, minute] = timeValue.split(':').map(Number)
    if (date) {
      const newDate = new Date(date)
      newDate.setHours(hour)
      newDate.setMinutes(minute)
      onDateChange(newDate)
    } else {
      // If no date is set, use today with the selected time
      const newDate = setMinutes(setHours(new Date(), hour), minute)
      onDateChange(newDate)
    }
  }

  const currentTimeValue = date 
    ? `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
    : undefined

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              <span className="flex items-center gap-2">
                {format(date, "PPP")}
                <Clock className="h-3 w-3 text-muted-foreground" />
                {format(date, "h:mm a")}
              </span>
            ) : (
              placeholder
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start" onInteractOutside={(e) => e.preventDefault()}>
          <div className="flex" onClick={(e) => e.stopPropagation()}>
            {/* Calendar Section */}
            <div className="p-3 border-r">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                disabled={(date) => date < startOfDay(new Date())}
                initialFocus
              />
            </div>
            
            {/* Time Section */}
            <div className="p-3 w-48">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Time</Label>
                <Select value={currentTimeValue} onValueChange={handleTimeSelect}>
                  <SelectTrigger className="w-full" onClick={(e) => e.stopPropagation()}>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60" onCloseAutoFocus={(e) => e.preventDefault()}>
                    {timeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Quick Time Buttons */}
              <div className="mt-4 space-y-2">
                <Label className="text-xs text-muted-foreground">Quick times</Label>
                <div className="grid grid-cols-2 gap-1">
                  {[
                    { label: "9:00 AM", hour: 9, minute: 0 },
                    { label: "10:00 AM", hour: 10, minute: 0 },
                    { label: "1:00 PM", hour: 13, minute: 0 },
                    { label: "2:00 PM", hour: 14, minute: 0 },
                    { label: "3:00 PM", hour: 15, minute: 0 },
                    { label: "4:00 PM", hour: 16, minute: 0 },
                  ].map((quickTime) => (
                    <Button
                      key={quickTime.label}
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        const timeValue = `${quickTime.hour.toString().padStart(2, '0')}:${quickTime.minute.toString().padStart(2, '0')}`
                        handleTimeSelect(timeValue)
                      }}
                    >
                      {quickTime.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="p-3 border-t flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onDateChange(undefined)
                setIsOpen(false)
              }}
            >
              Clear
            </Button>
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                setIsOpen(false)
              }}
              disabled={!date}
            >
              Done
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

interface TimePickerProps {
  time?: Date
  onTimeChange: (time: Date | undefined) => void
  label?: string
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function TimePicker({
  time,
  onTimeChange,
  label,
  placeholder = "Select time",
  className,
  disabled = false,
}: TimePickerProps) {
  const timeOptions = React.useMemo(() => {
    const options = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeDate = setMinutes(setHours(new Date(), hour), minute)
        options.push({
          value: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
          label: format(timeDate, 'h:mm a'),
        })
      }
    }
    return options
  }, [])

  const currentTimeValue = time 
    ? `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`
    : undefined

  const handleTimeSelect = (timeValue: string) => {
    const [hour, minute] = timeValue.split(':').map(Number)
    const newTime = setMinutes(setHours(new Date(), hour), minute)
    onTimeChange(newTime)
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <Select value={currentTimeValue} onValueChange={handleTimeSelect} disabled={disabled}>
        <SelectTrigger className="w-full">
          <Clock className="mr-2 h-4 w-4" />
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="max-h-60">
          {timeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
