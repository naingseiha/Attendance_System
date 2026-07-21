'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createMeeting } from '@/app/actions/meeting'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Plus, CalendarDays } from 'lucide-react'

const formSchema = z.object({
  title: z.string().min(2, 'សូមបញ្ចូលចំណងជើងការប្រជុំ'),
  description: z.string().optional(),
  date: z.string().min(1, 'សូមជ្រើសរើសកាលបរិច្ឆេទ'),
})

export default function CreateMeetingForm() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      date: new Date().toISOString().slice(0, 10),
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true)
      await createMeeting({
        title: values.title,
        description: values.description,
        date: new Date(values.date),
      })
      setOpen(false)
      form.reset()
    } catch (error) {
      console.error(error)
      alert('មានបញ្ហាក្នុងការបង្កើតការប្រជុំ!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="bg-white text-blue-900 hover:bg-blue-50 border-0 shadow-md h-11 px-6 rounded-xl font-medium transition-all duration-200">
            <Plus className="mr-2 h-5 w-5" /> បង្កើតការប្រជុំថ្មី
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[450px] rounded-2xl border-0 p-6 shadow-2xl">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="font-moul text-lg text-blue-900 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-600" />
            បង្កើតការប្រជុំថ្មី
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-slate-600 text-sm font-medium">ចំណងជើងការប្រជុំ</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="ឧ. ប្រជុំប្រចាំខែ កក្កដា" 
                      className="h-11 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all px-4" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-slate-600 text-sm font-medium">ការពិពណ៌នា (ជាជម្រើស)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="ខ្លឹមសារប្រជុំសង្ខេប..." 
                      className="h-11 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all px-4" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-slate-600 text-sm font-medium">កាលបរិច្ឆេទ</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      className="h-11 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all px-4" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-600/10 transition-all duration-200 mt-2" 
              disabled={loading}
            >
              {loading ? 'កំពុងបង្កើត...' : 'រក្សាទុកការប្រជុំ'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
