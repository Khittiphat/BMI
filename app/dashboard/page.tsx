import { getSession } from '@/lib/session'
import { logout } from '@/app/actions/auth'
import prisma from '@/lib/prisma'
import BMIForm from '@/components/BMIForm'
import BMIHistoryList from '@/components/BMIHistoryList'
import { redirect } from 'next/navigation'
import Link from 'next/link'

async function getBMIRecords(userId: number) {
  const records = await prisma.bMIRecord.findMany({
    where: { user_id: userId },
    orderBy: { recorded_at: 'desc' },
  })
  return records.map(record => ({
    ...record,
    recorded_at: record.recorded_at.toISOString()
  }))
}

export default async function DashboardPage() {
  const session = await getSession()
  if (!session?.userId) {
    redirect('/login')
  }
  
  const userId = parseInt(session.userId as string)
  
  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  const records = await getBMIRecords(userId)

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <nav className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gray-900 flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h1 className="text-lg font-bold text-gray-900 tracking-tight">BMI Tracker</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 hidden sm:block">Hello, <span className="font-semibold text-gray-900">{user?.username}</span></span>
              <div className="h-4 w-px bg-gray-200 hidden sm:block"></div>
              <Link
                href="/reports"
                className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 transition-all duration-200"
              >
                Reports
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all duration-200"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-[0_2px_10px_rgb(0,0,0,0.03)] ring-1 ring-gray-900/5 transition-all hover:shadow-md">
              <dt className="text-sm font-medium text-gray-500 truncate">Latest BMI</dt>
              <dd className="mt-2 text-3xl font-bold text-gray-900 tracking-tight">
                {records[0]?.bmi_value || '-'}
              </dd>
              <div className="absolute top-6 right-6 text-gray-100">
                 <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                 </svg>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-[0_2px_10px_rgb(0,0,0,0.03)] ring-1 ring-gray-900/5 transition-all hover:shadow-md">
              <dt className="text-sm font-medium text-gray-500 truncate">Current Weight</dt>
              <dd className="mt-2 text-3xl font-bold text-gray-900 tracking-tight">
                {records[0]?.weight ? `${records[0].weight} kg` : '-'}
              </dd>
              <div className="absolute top-6 right-6 text-gray-100">
                 <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                 </svg>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-[0_2px_10px_rgb(0,0,0,0.03)] ring-1 ring-gray-900/5 transition-all hover:shadow-md">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Records</dt>
              <dd className="mt-2 text-3xl font-bold text-gray-900 tracking-tight">
                {records.length}
              </dd>
               <div className="absolute top-6 right-6 text-gray-100">
                 <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                 </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Form */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl bg-white p-6 shadow-[0_2px_10px_rgb(0,0,0,0.03)] ring-1 ring-gray-900/5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Record</h3>
                <BMIForm />
              </div>
            </div>

            {/* Right Column: History List */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-white p-6 shadow-[0_2px_10px_rgb(0,0,0,0.03)] ring-1 ring-gray-900/5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">History</h3>
                <BMIHistoryList records={records} />
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  )
}
