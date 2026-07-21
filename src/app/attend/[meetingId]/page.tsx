import { getMeetingById } from '@/app/actions/meeting'
import AttendForm from './AttendForm'
import { notFound } from 'next/navigation'

export default async function AttendPage({ params }: { params: { meetingId: string } }) {
  const meeting = await getMeetingById(params.meetingId)

  if (!meeting) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <AttendForm meetingId={meeting.id} meetingTitle={meeting.title} />
    </main>
  )
}
