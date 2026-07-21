import { getMeetings } from "@/app/actions/meeting"
import { Prisma } from "@prisma/client"
import CreateMeetingForm from './CreateMeetingForm'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { format } from 'date-fns'
import { Calendar, Users, MonitorPlay, FileText, CheckSquare, Clock } from 'lucide-react'

type MeetingWithCount = Prisma.MeetingGetPayload<{
  include: {
    _count: {
      select: { attendances: true }
    }
  }
}>

export default async function AdminDashboard() {
  const meetings = await getMeetings()

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Premium Top Navigation */}
      <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div>
              <span className="font-moul text-sm sm:text-base text-blue-900 block leading-tight">ប្រព័ន្ធគ្រប់គ្រងវត្តមាន</span>
              <span className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider block">Attendance System Portal</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline-flex items-center text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
              {format(new Date(), 'dd MMMM yyyy')}
            </span>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
              AD
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Welcome & Action Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 p-8 sm:p-10 shadow-xl text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h2 className="font-moul text-xl sm:text-2xl text-blue-100 leading-normal">សូមស្វាគមន៍មកកាន់ផ្ទាំងគ្រប់គ្រង</h2>
              <p className="text-sm sm:text-base text-blue-200/90 max-w-2xl">
                បង្កើតការប្រជុំថ្មី ស្កេនវត្តមានរបស់សិក្ខាកាមបែប Real-time និងបោះពុម្ពរបាយការណ៍វត្តមានស្តង់ដារផ្លូវការ។
              </p>
            </div>
            <div className="shrink-0">
              <CreateMeetingForm />
            </div>
          </div>
        </div>

        {/* Meeting Grid Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h3 className="font-moul text-lg text-slate-800">បញ្ជីការប្រជុំសរុប</h3>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
              {meetings.length} ការប្រជុំ
            </span>
          </div>

          {meetings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
              <Calendar className="w-16 h-16 text-slate-300 mb-4 stroke-1" />
              <p className="font-medium text-lg text-slate-600 mb-1">មិនទាន់មានការប្រជុំនៅឡើយទេ</p>
              <p className="text-sm text-slate-400">សូមចុចលើប៊ូតុង &ldquo;បង្កើតការប្រជុំថ្មី&rdquo; ដើម្បីចាប់ផ្តើម</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {meetings.map((meeting: MeetingWithCount) => (
                <Card key={meeting.id} className="group overflow-hidden border border-slate-100 hover:border-blue-100 hover:shadow-[0_20px_50px_rgba(59,130,246,0.08)] bg-white rounded-2xl transition-all duration-300 flex flex-col">
                  {/* Card Header with modern gradient background overlay */}
                  <div className="p-6 pb-4 border-b border-slate-50 bg-gradient-to-b from-slate-50/50 to-transparent group-hover:from-blue-50/20 transition-all duration-300">
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <span className="inline-flex items-center text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                        <Calendar className="w-3.5 h-3.5 mr-1.5" />
                        {format(new Date(meeting.date), 'dd/MM/yyyy')}
                      </span>
                    </div>
                    <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                      {meeting.title}
                    </CardTitle>
                  </div>

                  {/* Card Body */}
                  <CardContent className="p-6 pt-4 flex-grow flex flex-col justify-between">
                    <p className="text-sm text-slate-500 line-clamp-2 min-h-[40px] mb-6">
                      {meeting.description || 'មិនមានការពិពណ៌នាបន្ថែមឡើយ។'}
                    </p>
                    
                    <div className="space-y-6">
                      {/* Attendance Stats Component */}
                      <div className="flex items-center justify-between p-4 bg-slate-50 group-hover:bg-blue-50/40 rounded-xl transition-all duration-300">
                        <div className="flex items-center text-slate-700 font-medium">
                          <Users className="w-5 h-5 mr-2 text-slate-400 group-hover:text-blue-500 transition-colors" />
                          <span className="text-sm">វត្តមានសរុប</span>
                        </div>
                        <span className="text-xl font-extrabold text-slate-900 group-hover:text-blue-700 transition-all">
                          {meeting._count.attendances} <span className="text-xs font-normal text-slate-500">នាក់</span>
                        </span>
                      </div>

                      {/* Action Links */}
                      <div className="grid grid-cols-2 gap-3">
                        <Link 
                          href={`/admin/display/${meeting.id}`} 
                          className={cn(
                            buttonVariants({ variant: "outline" }), 
                            "w-full text-slate-700 border-slate-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 h-10 rounded-xl transition-all duration-200 text-xs sm:text-sm font-medium"
                          )}
                        >
                          <MonitorPlay className="w-4 h-4 mr-2" /> បង្ហាញ
                        </Link>
                        <Link 
                          href={`/admin/report/${meeting.id}`} 
                          className={cn(
                            buttonVariants({ variant: "outline" }), 
                            "w-full text-slate-700 border-slate-200 hover:border-green-200 hover:bg-green-50 hover:text-green-600 h-10 rounded-xl transition-all duration-200 text-xs sm:text-sm font-medium"
                          )}
                        >
                          <FileText className="w-4 h-4 mr-2" /> របាយការណ៍
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-6 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400">
          ប្រព័ន្ធគ្រប់គ្រងវត្តមាន © {new Date().getFullYear()} • អភិវឌ្ឍន៍សម្រាប់ស្ថាប័នអប់រំ និងសាលារៀន
        </div>
      </footer>
    </div>
  )
}
