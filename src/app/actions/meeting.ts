'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createMeeting(data: { title: string; description?: string; date: Date }) {
  const meeting = await prisma.meeting.create({
    data: {
      title: data.title,
      description: data.description,
      date: data.date,
    }
  })
  revalidatePath('/admin')
  return meeting
}

export async function getMeetings() {
  return await prisma.meeting.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { attendances: true }
      }
    }
  })
}

export async function getMeetingById(id: string) {
  return await prisma.meeting.findUnique({
    where: { id },
    include: {
      attendances: {
        orderBy: { scannedAt: 'desc' }
      }
    }
  })
}

export async function deleteMeeting(id: string) {
  await prisma.meeting.delete({ where: { id } })
  revalidatePath('/admin')
}
