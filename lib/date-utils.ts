import { format, formatDistance, differenceInYears } from 'date-fns'

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return 'N/A'
  return format(new Date(date), 'MMM d, yyyy')
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return 'N/A'
  return format(new Date(date), 'MMM d, yyyy h:mm a')
}

export function formatTime(date: Date | string | null | undefined): string {
  if (!date) return 'N/A'
  return format(new Date(date), 'h:mm a')
}

export function getAge(dob: Date | string): number {
  return differenceInYears(new Date(), new Date(dob))
}

export function getTimeAgo(date: Date | string | null | undefined): string {
  if (!date) return 'N/A'
  return formatDistance(new Date(date), new Date(), { addSuffix: true })
}

export function calculateDuration(start: Date | string | null | undefined, end: Date | string | null | undefined): string {
  if (!start || !end) return 'N/A'
  const minutes = Math.floor((new Date(end).getTime() - new Date(start).getTime()) / 60000)
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return `${hours}h ${remainingMinutes}m`
}
