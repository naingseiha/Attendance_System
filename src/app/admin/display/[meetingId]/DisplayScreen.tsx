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
        // Ensure standard date conversion
        const formattedData = data.map((d: { id: string; meetingId: string; name: string; role: string; phone: string; scannedAt: string | Date }) => ({
          ...d,
          scannedAt: new Date(d.scannedAt)
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
    <div className="flex h-screen bg-slate-950 text-slate-100 p-6 gap-6 overflow-hidden">
      {/* Left side: Premium QR Code Display */}
      <div className="w-1/2 flex flex-col justify-between bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 relative shadow-[0_0_50px_rgba(59,130,246,0.05)]">
        {/* Glow overlay */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Top Branding info */}
        <div className="flex items-center justify-between relative z-10 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600/20 p-2 rounded-xl text-blue-400 border border-blue-500/20">
              <Tv className="w-6 h-6" />
            </div>
            <div>
              <span className="font-moul text-sm text-blue-400 block leading-tight">ប្រព័ន្ធវត្តមានស្វ័យប្រវត្ត</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-medium">Real-time Display</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold">
            <Wifi className="w-3.5 h-3.5 animate-pulse" /> ដំណើរការផ្ទាល់
          </div>
        </div>

        {/* Core QR Display */}
        <div className="flex-1 flex flex-col justify-center items-center my-6 relative z-10">
          <h1 className="font-moul text-2xl sm:text-3xl text-center text-slate-100 leading-normal max-w-lg mb-4 text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-300">
            {meetingTitle}
          </h1>
          <p className="text-slate-400 text-lg mb-8 text-center">សូមប្រើប្រាស់ទូរសព្ទដៃ ស្កេន QR Code ខាងក្រោម ដើម្បីចុះវត្តមាន</p>

          <div className="p-6 bg-white border-8 border-slate-800 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.4)] hover:scale-[1.02] transition-transform duration-500">
            <QRCodeSVG value={attendUrl} size={300} level="H" includeMargin={true} />
          </div>
        </div>

        {/* Footer Info / Link */}
        <div className="border-t border-slate-800 pt-4 text-center relative z-10">
          <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">តំណភ្ជាប់ផ្ទាល់ / Direct URL</p>
          <span className="text-blue-400 font-mono text-base font-semibold tracking-wide">
            {attendUrl}
          </span>
        </div>
      </div>

      {/* Right side: Real-time Live Stream List */}
      <div className="w-1/2 flex flex-col bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
        {/* Live List Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="bg-slate-800 p-2 rounded-xl text-slate-400 border border-slate-700">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-moul text-base text-slate-100 block leading-tight">បញ្ជីវត្តមានដែលបានចុះ</h2>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-medium">Attendee Roster</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400 text-sm font-semibold">សរុប</span>
            <span className="bg-blue-600 text-white font-extrabold px-5 py-1.5 rounded-2xl text-2xl shadow-lg shadow-blue-600/20 border border-blue-500/30">
              {attendees.length} <span className="text-xs font-normal text-blue-200">នាក់</span>
            </span>
          </div>
        </div>

        {/* Scrollable Live List */}
        <div className="flex-1 overflow-hidden bg-slate-950/20">
          <ScrollArea className="h-[calc(100vh-140px)]">
            <div className="p-6 space-y-4">
              {attendees.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-slate-500">
                  <div className="w-16 h-16 rounded-full border border-dashed border-slate-800 flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-slate-700 stroke-1" />
                  </div>
                  <p className="text-lg">មិនទាន់មានការចុះឈ្មោះវត្តមានឡើយទេ</p>
                  <p className="text-xs text-slate-600 mt-1">រង់ចាំការស្កេនពីទូរសព្ទដៃ...</p>
                </div>
              ) : (
                attendees.map((a, i) => {
                  const isDirector = a.role === 'នាយក';
                  return (
                    <div 
                      key={a.id} 
                      className="flex items-center justify-between p-4 bg-slate-900/60 border border-slate-850 hover:border-slate-800 hover:bg-slate-900 rounded-2xl shadow-sm transition-all duration-300 animate-in slide-in-from-right-8 duration-500"
                      style={{ animationDelay: `${Math.min(i * 40, 400)}ms` }}
                    >
                      <div className="flex items-center gap-4">
                        {/* Number Index */}
                        <span className="text-xs font-semibold text-slate-600 bg-slate-950 w-7 h-7 rounded-full flex items-center justify-center border border-slate-850">
                          {attendees.length - i}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-lg font-bold text-slate-100 flex items-center gap-2">
                            {a.name}
                            {isDirector && (
                              <span className="bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" /> {a.role}
                              </span>
                            )}
                          </span>
                          {!isDirector && (
                            <span className="text-xs text-slate-400 mt-0.5">{a.role}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex flex-col justify-center">
                        <span className="text-sm font-mono text-slate-300 font-medium">{a.phone}</span>
                        <span className="text-[10px] text-slate-500 mt-1 block">
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
