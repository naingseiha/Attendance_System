'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { QrCode, History, Camera, Award, Clock, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react'

type AttendedMeeting = {
  meetingId: string
  meetingTitle: string
  role: string
  scannedAt: string
}

export default function UserPortal() {
  const router = useRouter()
  const [history, setHistory] = useState<AttendedMeeting[]>([])
  const [scanning, setScanning] = useState(false)
  const [scanError, setScanError] = useState<string | null>(null)

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('attendance_history')
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory))
      }
    } catch (e) {
      console.error('Failed to load history:', e)
    }
  }, [])

  // QR Scanner initialization
  useEffect(() => {
    if (!scanning) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let scanner: any = null
    
    // Programmatic load to avoid SSR issues
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Html5QrcodeScanner } = require('html5-qrcode')

    try {
      scanner = new Html5QrcodeScanner(
        'reader',
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        /* verbose= */ false
      )

      scanner.render(
        (decodedText: string) => {
          // Check if decoded text is our attendance URL
          if (decodedText.includes('/attend/')) {
            scanner.clear().then(() => {
              setScanning(false)
              // Extract the path and navigate
              const urlObj = new URL(decodedText)
              router.push(urlObj.pathname)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }).catch((err: any) => console.error(err))
          } else {
            setScanError('QR Code មិនត្រឹមត្រូវសម្រាប់ប្រព័ន្ធវត្តមាននេះទេ!')
          }
        },
        () => {
          // Silent scan errors as they occur frequently during frame analysis
        }
      )
    } catch (err) {
      console.error(err)
      setScanError('មិនអាចបើកកាមេរ៉ាបានទេ។ សូមប្រាកដថាអ្នកបានអនុញ្ញាតសិទ្ធិកាមេរ៉ា!')
    }

    return () => {
      if (scanner) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        scanner.clear().catch((err: any) => console.error('Failed to clear scanner on unmount', err))
      }
    }
  }, [scanning, router])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans">
      {/* Premium Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white shadow-md">
        <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm">
              <Award className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <span className="font-moul text-xs sm:text-sm text-blue-100 block leading-tight">ប្រព័ន្ធវត្តមានស្វ័យប្រវត្ត</span>
              <span className="text-[9px] text-blue-200/60 uppercase tracking-widest block font-medium">Teacher Portal</span>
            </div>
          </div>
          <div className="bg-white/10 text-xs px-3 py-1 rounded-full text-blue-200">
            PWA APP
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 py-8 space-y-6">
        {/* Welcome Section */}
        <div className="space-y-1 text-center py-2">
          <h2 className="text-xl font-extrabold text-slate-800">សួស្តី លោកគ្រូ/អ្នកគ្រូ!</h2>
          <p className="text-sm text-slate-500">សូមស្កេន QR Code ដើម្បីចុះវត្តមានចូលរួមកិច្ចប្រជុំ</p>
        </div>

        {/* Core Scan Action */}
        {!scanning ? (
          <Card 
            onClick={() => {
              setScanning(true)
              setScanError(null)
            }}
            className="group overflow-hidden border-0 shadow-xl rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white cursor-pointer active:scale-95 transition-all duration-300 relative py-8 px-6 text-center"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="bg-white/20 p-5 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <QrCode className="w-16 h-16 text-white" />
              </div>
              <h3 className="font-moul text-base mb-1">ស្កេន QR Code ដើម្បីចុះវត្តមាន</h3>
              <p className="text-xs text-blue-100/80 flex items-center gap-1 mt-1">
                ចុចទីនេះដើម្បីបើកកាមេរ៉ាស្កេន <ArrowRight className="w-3.5 h-3.5" />
              </p>
            </div>
          </Card>
        ) : (
          <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50 border-b p-4 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Camera className="w-4 h-4 text-blue-600" />
                កំពុងដំណើរការកាមេរ៉ា...
              </CardTitle>
              <Button 
                onClick={() => setScanning(false)} 
                variant="ghost" 
                size="sm"
                className="text-xs text-red-500 hover:bg-red-50 rounded-lg"
              >
                បិទវិញ
              </Button>
            </CardHeader>
            <CardContent className="p-4 flex flex-col items-center">
              <div id="reader" className="w-full rounded-2xl overflow-hidden border bg-slate-950" />
              
              {scanError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{scanError}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Attendance History Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="font-moul text-xs text-slate-800 flex items-center gap-2">
              <History className="w-4 h-4 text-slate-400" />
              ប្រវត្តិចូលរួមប្រជុំកន្លងមក
            </h3>
            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border">
              {history.length} កិច្ចប្រជុំ
            </span>
          </div>

          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-2xl border border-slate-100 text-slate-400 text-center">
              <Clock className="w-10 h-10 text-slate-200 mb-2 stroke-1" />
              <p className="text-xs text-slate-500">មិនទាន់មានប្រវត្តិចុះវត្តមាននៅលើឧបករណ៍នេះទេ</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((h) => (
                <div 
                  key={h.meetingId}
                  className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-600 border border-emerald-500/10">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-800 line-clamp-1">{h.meetingTitle}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        តួនាទី៖ {h.role} • {format(new Date(h.scannedAt), 'dd/MM/yyyy')}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                      បានចូលរួម
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-md mx-auto py-4 text-center text-[10px] text-slate-400 border-t bg-white">
        ប្រព័ន្ធគ្រប់គ្រងវត្តមាន © {new Date().getFullYear()} • PWA Installed Version
      </footer>
    </div>
  )
}
