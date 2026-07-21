'use client'

import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { getAttendancesForMeeting } from '@/app/actions/attendance'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'
import { ShieldCheck, Tv, Users, Wifi } from 'lucide-react'

type Attendance = {
  id: string
  meetingId: string
  name: string
  role: string
  phone: string
  scannedAt: Date
}

export default function DisplayScreen({ meetingId, meetingTitle, originUrl }: { meetingId: string, meetingTitle: string, originUrl: string }) {
  const [attendees, setAttendees] = useState<Attendance[]>([])

  useEffect(() => {
    async function fetchAttendees() {
      try {
        const data = await getAttendancesForMeeting(meetingId)
        // Format the database date strings/objects to Javascript Date objects
        const formattedData = data.map(item => ({
          ...item,
          scannedAt: new Date(item.scannedAt)
        }))
        setAttendees(formattedData)
      } catch (error) {
        console.error(error)
      }
    }

    fetchAttendees()
    const interval = setInterval(fetchAttendees, 3000)
    return () => clearInterval(interval)
  }, [meetingId])

  const attendUrl = `${originUrl}/attend/${meetingId}`

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800 p-6 gap-6 overflow-hidden">
      {/* Left side: Premium QR Code Display in Light Mode */}
      <div className="w-1/2 flex flex-col justify-between bg-white border border-slate-200 rounded-3xl p-8 relative shadow-sm">
        {/* Glow overlay */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Top Branding info */}
        <div className="flex items-center justify-between relative z-10 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-xl text-blue-600 border border-blue-100">
              <Tv className="w-6 h-6" />
            </div>
            <div>
              <span className="font-moul text-sm text-blue-600 block leading-tight">ប្រព័ន្ធវត្តមានស្វ័យប្រវត្ត</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-medium">Real-time Display</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-semibold">
            <Wifi className="w-3.5 h-3.5 animate-pulse" /> ដំណើរការផ្ទាល់
          </div>
        </div>

        {/* Core QR Display */}
        <div className="flex-1 flex flex-col justify-center items-center my-6 relative z-10">
          <h1 className="font-moul text-2xl sm:text-3xl text-center text-slate-900 leading-normal max-w-lg mb-4">
            {meetingTitle}
          </h1>
          <p className="text-slate-500 text-lg mb-8 text-center">សូមប្រើប្រាស់ទូរសព្ទដៃ ស្កេន QR Code ខាងក្រោម ដើម្បីចុះវត្តមាន</p>

          <div className="p-6 bg-white border-8 border-slate-100 rounded-[32px] shadow-[0_15px_30px_rgba(0,0,0,0.05)] hover:scale-[1.02] transition-transform duration-500">
            <QRCodeSVG value={attendUrl} size={300} level="H" includeMargin={true} />
          </div>
        </div>

        {/* Footer Info / Link */}
        <div className="border-t border-slate-100 pt-4 text-center relative z-10">
          <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">តំណភ្ជាប់ផ្ទាល់ / Direct URL</p>
          <span className="text-blue-600 font-mono text-base font-semibold tracking-wide">
            {attendUrl}
          </span>
        </div>
      </div>

      {/* Right side: Real-time Live Stream List in Light Mode */}
      <div className="w-1/2 flex flex-col bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        {/* Live List Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <div className="bg-slate-50 p-2 rounded-xl text-slate-500 border border-slate-100">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-moul text-base text-slate-800 block leading-tight">បញ្ជីវត្តមានដែលបានចុះ</h2>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-medium">Attendee Roster</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-500 text-sm font-semibold">សរុប</span>
            <span className="bg-blue-50 text-blue-600 font-extrabold px-5 py-1.5 rounded-2xl text-2xl border border-blue-100">
              {attendees.length} <span className="text-xs font-normal text-blue-400">នាក់</span>
            </span>
          </div>
        </div>

        {/* Scrollable Live List */}
        <div className="flex-1 overflow-hidden bg-slate-50/50">
          <ScrollArea className="h-[calc(100vh-140px)]">
            <div className="p-6 space-y-4">
              {attendees.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-slate-400">
                  <div className="w-16 h-16 rounded-full border border-dashed border-slate-200 flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-slate-300 stroke-1" />
                  </div>
                  <p className="text-lg text-slate-600">មិនទាន់មានការចុះឈ្មោះវត្តមានឡើយទេ</p>
                  <p className="text-xs text-slate-400 mt-1">រង់ចាំការស្កេនពីទូរសព្ទដៃ...</p>
                </div>
              ) : (
                attendees.map((a, i) => {
                  const getRoleBadge = (role: string) => {
                    switch (role) {
                      case 'នាយក':
                        return (
                          <span className="bg-amber-500/10 border border-amber-500/20 text-amber-600 text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> នាយក
                          </span>
                        )
                      case 'នាយករង':
                        return (
                          <span className="bg-purple-500/10 border border-purple-500/20 text-purple-650 text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> នាយករង
                          </span>
                        )
                      case 'លេខា':
                        return (
                          <span className="bg-blue-500/10 border border-blue-500/20 text-blue-600 text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            លេខា
                          </span>
                        )
                      case 'បុគ្គលិកទីចាត់ការ':
                        return (
                          <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            បុគ្គលិកទីចាត់ការ
                          </span>
                        )
                      default:
                        return null
                    }
                  }
                  const badge = getRoleBadge(a.role);
                  return (
                    <div 
                      key={a.id} 
                      className="flex items-center justify-between p-4 bg-white border border-slate-150 hover:border-slate-200 hover:bg-slate-50/55 rounded-2xl shadow-sm transition-all duration-300 animate-in slide-in-from-right-8 duration-500"
                      style={{ animationDelay: `${Math.min(i * 40, 400)}ms` }}
                    >
                      <div className="flex items-center gap-4">
                        {/* Number Index */}
                        <span className="text-xs font-semibold text-slate-500 bg-slate-50 w-7 h-7 rounded-full flex items-center justify-center border border-slate-100">
                          {attendees.length - i}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            {a.name}
                            {badge}
                          </span>
                          {!badge && (
                            <span className="text-xs text-slate-500 mt-0.5">{a.role}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex flex-col justify-center">
                        <span className="text-sm font-mono text-slate-700 font-medium">{a.phone}</span>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {format(a.scannedAt, 'hh:mm:ss a')}
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
