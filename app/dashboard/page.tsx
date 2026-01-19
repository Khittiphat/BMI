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
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-600">BMI Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden sm:block">Welcome, <b>{user?.username}</b></span>
              <Link
                href="/reports"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
              >
                View MIS Reports
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-100 transition-colors"
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
            <div className="bg-white overflow-hidden shadow rounded-lg p-5">
              <dt className="text-sm font-medium text-gray-500 truncate">Latest BMI</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {records[0]?.bmi_value || '-'}
              </dd>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg p-5">
              <dt className="text-sm font-medium text-gray-500 truncate">Current Weight</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {records[0]?.weight ? `${records[0].weight} kg` : '-'}
              </dd>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg p-5">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Records</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {records.length}
              </dd>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Form */}
            <div className="lg:col-span-1">
              <BMIForm />
            </div>

            {/* Right Column: History List */}
            <div className="lg:col-span-2">
              <BMIHistoryList records={records} />
            </div>
          </div>
          
        </div>
      </main>
    </div>
  )
}
