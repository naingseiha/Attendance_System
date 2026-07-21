import { getMeetingById } from '@/app/actions/meeting'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import PrintButton from './PrintButton'

export default async function ReportPage({ params }: { params: { meetingId: string } }) {
  const meeting = await getMeetingById(params.meetingId)

  if (!meeting) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 print:bg-white print:p-0 print:py-0">
      
      {/* Print Controls (hidden on print) */}
      <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-150 print:hidden">
        <div>
          <span className="text-sm font-semibold text-slate-800">របាយការណ៍កិច្ចប្រជុំផ្លូវការ</span>
          <p className="text-xs text-slate-400 mt-0.5">បោះពុម្ពជាឯកសារ A4 សម្រាប់រក្សាទុក ឬជូននាយកភាព</p>
        </div>
        <PrintButton />
      </div>

      {/* A4 Paper format */}
      <div className="bg-white w-[210mm] min-h-[297mm] mx-auto shadow-2xl px-16 py-16 print:shadow-none print:mx-0 print:w-full print:px-8 print:py-8 text-slate-900">
        
        {/* Ministry Letterhead */}
        <div className="flex justify-between items-start mb-12">
          {/* Left Letterhead (Ministry / Org) - Pushed down by mt-10 (approx. 3-4 line height) */}
          <div className="text-center space-y-1.5 mt-10">
            <h3 
              contentEditable 
              suppressContentEditableWarning
              className="font-moul text-xs sm:text-sm text-slate-800 outline-none border-b border-dashed border-transparent hover:border-slate-350 focus:border-blue-500 focus:bg-blue-50/30 px-2 py-0.5 rounded transition-all print:border-none print:bg-transparent print:p-0 cursor-text"
            >
              ក្រសួងអប់រំ យុវជន និងកីឡា
            </h3>
            <p 
              contentEditable 
              suppressContentEditableWarning
              className="text-xs font-semibold text-slate-600 outline-none border-b border-dashed border-transparent hover:border-slate-350 focus:border-blue-500 focus:bg-blue-50/30 px-2 py-0.5 rounded transition-all print:border-none print:bg-transparent print:p-0 cursor-text"
            >
              វិទ្យាល័យ ហ៊ុនសែន ស្វាយធំ
            </p>
            <div className="w-16 h-[0.5px] bg-slate-300 mx-auto mt-2" />
          </div>

          {/* Right Letterhead (Kingdom Slogan) */}
          <div className="text-center space-y-1.5">
            <h2 className="font-moul text-sm text-slate-950">ព្រះរាជាណាចក្រកម្ពុជា</h2>
            <h3 className="font-moul text-xs text-slate-850">ជាតិ សាសនា ព្រះមហាក្សត្រ</h3>
            <div className="flex justify-center items-center gap-1 mt-2">
              <span className="text-[10px] text-slate-500 font-mono tracking-widest">oOo</span>
            </div>
          </div>
        </div>

        {/* Report Title */}
        <div className="text-center mb-10 space-y-3">
          <h1 className="font-moul text-xl text-slate-950 leading-relaxed">របាយការណ៍វត្តមានអ្នកចូលរួមប្រជុំ</h1>
          <div className="inline-block bg-slate-50 border px-6 py-2 rounded-xl text-sm font-medium">
            ប្រធានបទ៖ <span className="font-bold text-slate-900">{meeting.title}</span>
          </div>
          <p className="text-xs text-slate-500">
            កាលបរិច្ឆេទប្រជុំ៖ {format(new Date(meeting.date), 'dd/MM/yyyy')}
          </p>
        </div>

        {/* Summary / Description */}
        {meeting.description && (
          <div className="mb-10 bg-slate-50/50 border border-slate-100 p-5 rounded-2xl">
            <h4 className="font-moul text-xs text-slate-800 mb-2.5">ខ្លឹមសារសង្ខេបកិច្ចប្រជុំ៖</h4>
            <p className="text-sm text-slate-700 indent-8 leading-relaxed text-justify">
              {meeting.description}
            </p>
          </div>
        )}

        {/* Table of Attendees */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-moul text-xs text-slate-800">
              បញ្ជីឈ្មោះអ្នកចូលរួមសរុប
            </h4>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border">
              សរុប {meeting.attendances.length} នាក់
            </span>
          </div>

          <table className="w-full border-collapse border border-slate-200 text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-700">
                <th className="border border-slate-200 py-3 px-2 text-center w-12 font-semibold whitespace-nowrap">ល.រ</th>
                <th className="border border-slate-200 py-3 px-4 text-left font-semibold min-w-[240px] whitespace-nowrap">ឈ្មោះ និងនាមត្រកូល</th>
                <th className="border border-slate-200 py-3 px-3 text-center w-28 font-semibold whitespace-nowrap">តួនាទី</th>
                <th className="border border-slate-200 py-3 px-4 text-center w-36 font-semibold whitespace-nowrap">លេខទូរសព្ទ</th>
                <th className="border border-slate-200 py-3 px-3 text-center w-28 font-semibold whitespace-nowrap">ម៉ោងចុះវត្តមាន</th>
                <th className="border border-slate-200 py-3 px-2 text-center w-20 font-semibold whitespace-nowrap">ផ្សេងៗ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {meeting.attendances.map((a, i) => (
                <tr key={a.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="border border-slate-200 py-3.5 px-2 text-center text-slate-500 font-medium text-xs">{i + 1}</td>
                  <td className="border border-slate-200 py-3.5 px-4 font-bold text-slate-855 whitespace-nowrap">{a.name}</td>
                  <td className="border border-slate-200 py-3.5 px-3 text-center text-slate-600 font-medium text-xs">{a.role}</td>
                  <td className="border border-slate-200 py-3.5 px-4 text-center font-mono text-xs text-slate-600">{a.phone}</td>
                  <td className="border border-slate-200 py-3.5 px-3 text-center text-xs text-slate-500">
                    {format(new Date(a.scannedAt), 'HH:mm')}
                  </td>
                  <td className="border border-slate-200 py-3.5 px-2 text-center"></td>
                </tr>
              ))}
              {meeting.attendances.length === 0 && (
                <tr>
                  <td colSpan={6} className="border border-slate-200 py-8 text-center text-slate-400 text-xs italic">
                    មិនទាន់មានទិន្នន័យអ្នកចូលរួមនៅឡើយទេ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Signatures */}
        <div className="flex justify-between mt-16 pt-8 text-sm">
          <div className="text-center w-56 space-y-1">
            <p className="font-semibold text-slate-500 text-xs">បានឃើញ និងឯកភាព</p>
            <p className="font-moul text-xs text-slate-800 pb-20">នាយកសាលា / ប្រធានស្ថាប័ន</p>
            <p className="font-bold border-t border-slate-300 pt-2 border-dotted text-slate-400 text-[10px] uppercase tracking-wider">signature & stamp</p>
          </div>
          <div className="text-center w-56 space-y-1">
            <p className="text-xs text-slate-500 italic">រាជធានីភ្នំពេញ, ថ្ងៃទី.......ខែ.......ឆ្នាំ.......</p>
            <p className="font-semibold text-slate-500 text-xs">អ្នកធ្វើរបាយការណ៍</p>
            <p className="font-moul text-xs text-slate-800 pb-20">ហត្ថលេខា និងឈ្មោះ</p>
            <p className="font-bold border-t border-slate-300 pt-2 border-dotted text-slate-400 text-[10px] uppercase tracking-wider">signature & name</p>
          </div>
        </div>

      </div>
    </div>
  )
}
