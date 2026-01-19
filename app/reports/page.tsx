import { getReportData } from '@/app/actions/report'
import TrendChart from '@/components/TrendChart'
import Link from 'next/link'
import MobileReportTabs from '@/components/MobileReportTabs'

export default async function ReportPage(props: {
  searchParams: Promise<{ view?: string }>
}) {
  const searchParams = await props.searchParams;
  const view = (searchParams.view || 'daily') as 'daily' | 'weekly' | 'monthly' | 'yearly'
  
  const data = await getReportData(view)

  const tabs = [
    { name: 'Daily', id: 'daily' },
    { name: 'Weekly', id: 'weekly' },
    { name: 'Monthly', id: 'monthly' },
    { name: 'Yearly', id: 'yearly' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <h1 className="text-xl font-bold text-blue-600">MIS Reports</h1>
            <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Tabs */}
          <div className="mb-8">
            <MobileReportTabs currentView={view} />
            <div className="hidden sm:block">
              <nav className="isolate flex divide-x divide-gray-200 rounded-lg shadow" aria-label="Tabs">
                {tabs.map((tab, tabIdx) => (
                  <Link
                    key={tab.name}
                    href={`/reports?view=${tab.id}`}
                    className={`
                      ${view === tab.id ? 'text-gray-900 bg-gray-50' : 'text-gray-500 hover:text-gray-700 bg-white'}
                      group relative min-w-0 flex-1 overflow-hidden py-4 px-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10
                      ${tabIdx === 0 ? 'rounded-l-lg' : ''}
                      ${tabIdx === tabs.length - 1 ? 'rounded-r-lg' : ''}
                    `}
                    aria-current={view === tab.id ? 'page' : undefined}
                  >
                    <span>{tab.name}</span>
                    <span
                      aria-hidden="true"
                      className={`${view === tab.id ? 'bg-blue-500' : 'bg-transparent'} absolute inset-x-0 bottom-0 h-0.5`}
                    />
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Charts */}
          <div className="space-y-8">
            <TrendChart data={data} title={`${view.charAt(0).toUpperCase() + view.slice(1)} Trends (Weight & BMI)`} />
            
            {/* Summary Table */}
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Summary Data</h3>
              </div>
              <div className="border-t border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Weight</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg BMI</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Records Count</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.map((item) => (
                        <tr key={item.name}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.weight} kg</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.bmi}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
