'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { submitAttendance } from '@/app/actions/attendance'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { CheckCircle2, User, Phone, Briefcase, Award } from 'lucide-react'

const formSchema = z.object({
  name: z.string().min(2, 'សូមបញ្ចូលឈ្មោះពិតប្រាកដ'),
  role: z.string().min(1, 'សូមជ្រើសរើសតួនាទី'),
  phone: z.string().min(8, 'លេខទូរសព្ទមិនត្រឹមត្រូវ').max(15, 'លេខទូរសព្ទវែងពេក'),
})

export default function AttendForm({ meetingId, meetingTitle }: { meetingId: string, meetingTitle: string }) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      role: '',
      phone: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true)
      await submitAttendance({
        meetingId,
        name: values.name,
        role: values.role,
        phone: values.phone,
      })

      // Save to localStorage history
      try {
        const history = JSON.parse(localStorage.getItem('attendance_history') || '[]')
        const newRecord = {
          meetingId,
          meetingTitle,
          role: values.role,
          scannedAt: new Date().toISOString()
        }
        const filteredHistory = history.filter((h: { meetingId: string }) => h.meetingId !== meetingId)
        localStorage.setItem('attendance_history', JSON.stringify([newRecord, ...filteredHistory]))
      } catch (e) {
        console.error('Failed to save attendance history:', e)
      }

      setSubmitted(true)
    } catch (error) {
      console.error(error)
      alert('មានបញ្ហាក្នុងការចុះវត្តមាន សូមព្យាយាមម្តងទៀត!')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <Card className="w-full max-w-md mx-auto overflow-hidden border-0 shadow-2xl rounded-3xl bg-white animate-in fade-in zoom-in duration-500">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-center text-white flex flex-col items-center">
          <div className="bg-white/20 p-4 rounded-full mb-4 backdrop-blur-sm">
            <CheckCircle2 className="w-16 h-16 text-white" />
          </div>
          <h2 className="font-moul text-xl mb-1">ចុះវត្តមានជោគជ័យ</h2>
          <span className="text-xs uppercase tracking-wider text-green-100">Attendance Confirmed</span>
        </div>
        <CardContent className="p-8 text-center">
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            លោកគ្រូ/អ្នកគ្រូ បានចុះវត្តមានសម្រាប់កិច្ចប្រជុំ៖<br/>
            <span className="font-bold text-slate-800 text-base mt-2 block">« {meetingTitle} »</span>
          </p>
          <div className="text-xs text-slate-400 bg-slate-50 py-3 px-4 rounded-xl inline-block">
            ម៉ោងកត់ត្រា៖ {new Date().toLocaleTimeString('kh-KH', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden border-0 shadow-2xl rounded-3xl bg-white">
      {/* Brand Header */}
      <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-950 p-8 text-center text-white relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="bg-white/10 p-3 rounded-2xl mb-3 backdrop-blur-sm">
            <Award className="w-8 h-8 text-blue-300" />
          </div>
          <h2 className="font-moul text-lg sm:text-xl text-blue-100 leading-normal">ចុះវត្តមានកិច្ចប្រជុំ</h2>
          <p className="text-xs text-blue-200/80 mt-1 line-clamp-1">
            ប្រធានបទ៖ <span className="font-semibold text-white">{meetingTitle}</span>
          </p>
        </div>
      </div>

      <CardContent className="p-6 sm:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Name Input */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-slate-600 text-sm font-medium flex items-center gap-1.5">
                    <User className="w-4 h-4 text-slate-400" />
                    ឈ្មោះ-នាមត្រកូល
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="ឧទាហរណ៍៖ គឹម ហេង" 
                      className="h-12 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all px-4 text-slate-800" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
            
            {/* Role Select */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-slate-600 text-sm font-medium flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    តួនាទី
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all px-4 text-slate-800">
                        <SelectValue placeholder="ជ្រើសរើសតួនាទី" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl shadow-xl">
                      <SelectItem value="សិក្ខាបនធារី" className="py-2.5">សិក្ខាបនធារី</SelectItem>
                      <SelectItem value="នាយក" className="py-2.5">នាយក</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
            
            {/* Phone Input */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-slate-600 text-sm font-medium flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-slate-400" />
                    លេខទូរសព្ទ
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="ឧទាហរណ៍៖ 012 345 678" 
                      type="tel" 
                      className="h-12 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all px-4 text-slate-800" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/10 hover:shadow-blue-600/20 transition-all duration-200 mt-2" 
              disabled={loading}
            >
              {loading ? 'កំពុងបញ្ជូនវត្តមាន...' : 'បញ្ជាក់ការចុះវត្តមាន'}
            </Button>
          </form>
        </Form>
      </CardContent>
      
      <CardFooter className="flex justify-center border-t py-4 bg-slate-50/50">
        <p className="text-[10px] sm:text-xs text-slate-400 text-center uppercase tracking-wider">
          ប្រព័ន្ធគ្រប់គ្រងវត្តមាន © {new Date().getFullYear()}
        </p>
      </CardFooter>
    </Card>
  )
}
