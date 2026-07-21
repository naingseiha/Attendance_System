'use client'

import { Button } from '@/components/ui/button'
import { Printer, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function PrintButton() {
  const router = useRouter()

  return (
    <div className="flex gap-3">
      <Button 
        onClick={() => router.push('/admin')} 
        variant="outline" 
        className="bg-white hover:bg-slate-50 border-slate-200 text-slate-700 h-10 px-4 rounded-xl font-medium transition-all"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> ត្រឡប់ក្រោយ
      </Button>
      <Button 
        onClick={() => window.print()} 
        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/10 h-10 px-5 rounded-xl font-medium transition-all"
      >
        <Printer className="mr-2 h-4 w-4" /> បោះពុម្ពរបាយការណ៍ (A4)
      </Button>
    </div>
  )
}
