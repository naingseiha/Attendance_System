import { getMeetingById } from '@/app/actions/meeting'
import { notFound } from 'next/navigation'
import DisplayScreen from './DisplayScreen'
import { headers } from 'next/headers'

export default async function DisplayPage({ params }: { params: { meetingId: string } }) {
  const meeting = await getMeetingById(params.meetingId)
  
  if (!meeting) {
    notFound()
  }

  const headersList = headers()
  const host = headersList.get('host')
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  const originUrl = `${protocol}://${host}`

  return <DisplayScreen meetingId={meeting.id} meetingTitle={meeting.title} originUrl={originUrl} />
}
