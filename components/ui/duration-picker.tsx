"use client"

import React from "react"
import { addMinutes, format } from "date-fns"
import { Clock, Plus, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DurationPickerProps {
  startTime?: Date
  endTime?: Date
  onEndTimeChange: (endTime: Date | undefined) => void
  label?: string
  className?: string
  disabled?: boolean
  serviceDuration?: number // Duration in minutes from selected service
}

export function DurationPicker({
  startTime,
  endTime,
  onEndTimeChange,
  label = "Duration",
  className,
  disabled = false,
  serviceDuration,
}: DurationPickerProps) {
  // Common duration options in minutes
  const durationOptions = [
    { value: 15, label: "15 minutes" },
    { value: 30, label: "30 minutes" },
    { value: 45, label: "45 minutes" },
    { value: 60, label: "1 hour" },
    { value: 90, label: "1.5 hours" },
    { value: 120, label: "2 hours" },
    { value: 180, label: "3 hours" },
    { value: 240, label: "4 hours" },
  ]

  // Calculate current duration in minutes
  const currentDuration = startTime && endTime 
    ? Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60))
    : serviceDuration || 60

  const handleDurationChange = (durationMinutes: number) => {
    if (startTime) {
      const newEndTime = addMinutes(startTime, durationMinutes)
      onEndTimeChange(newEndTime)
    }
  }

  const adjustDuration = (adjustment: number) => {
    const newDuration = Math.max(15, currentDuration + adjustment)
    handleDurationChange(newDuration)
  }

  // Auto-set duration when service duration is provided
  React.useEffect(() => {
    if (serviceDuration && startTime && (!endTime || Math.abs(currentDuration - serviceDuration) > 5)) {
      handleDurationChange(serviceDuration)
    }
  }, [serviceDuration, startTime])

  return (
    <div className={cn("space-y-3", className)}>
      <Label>{label}</Label>
      
      {/* Duration Display */}
      <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/30">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">
          {currentDuration} minutes
        </span>
        {endTime && (
          <span className="text-sm text-muted-foreground ml-auto">
            Ends at {format(endTime, "h:mm a")}
          </span>
        )}
      </div>

      {/* Quick Duration Buttons */}
      <div className="grid grid-cols-4 gap-2">
        {durationOptions.slice(0, 4).map((option) => (
          <Button
            key={option.value}
            variant={currentDuration === option.value ? "default" : "outline"}
            size="sm"
            className="text-xs"
            onClick={() => handleDurationChange(option.value)}
            disabled={disabled || !startTime}
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* Duration Selector */}
      <Select
        value={currentDuration.toString()}
        onValueChange={(value) => handleDurationChange(parseInt(value))}
        disabled={disabled || !startTime}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select duration" />
        </SelectTrigger>
        <SelectContent>
          {durationOptions.map((option) => (
            <SelectItem key={option.value} value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Fine-tune Duration */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => adjustDuration(-15)}
          disabled={disabled || !startTime || currentDuration <= 15}
        >
          <Minus className="h-3 w-3" />
          15m
        </Button>
        <span className="text-sm text-muted-foreground px-2">Fine-tune</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => adjustDuration(15)}
          disabled={disabled || !startTime}
        >
          <Plus className="h-3 w-3" />
          15m
        </Button>
      </div>

      {serviceDuration && (
        <div className="text-xs text-muted-foreground text-center">
          Service default: {serviceDuration} minutes
        </div>
      )}
    </div>
  )
}
