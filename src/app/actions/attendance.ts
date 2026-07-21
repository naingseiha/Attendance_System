'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function submitAttendance(data: {
  meetingId: string
  name: string
  role: string
  phone: string
}) {
  const attendance = await prisma.attendance.create({
    data: {
      meetingId: data.meetingId,
      name: data.name,
      role: data.role,
      phone: data.phone,
    }
  })
  
  // Revalidate the display screen so it updates via polling or server components
  revalidatePath(`/admin/display/${data.meetingId}`)
  revalidatePath('/admin')
  
  return attendance
}

export async function getAttendancesForMeeting(meetingId: string) {
  return await prisma.attendance.findMany({
    where: { meetingId },
    orderBy: { scannedAt: 'desc' }
  })
}
