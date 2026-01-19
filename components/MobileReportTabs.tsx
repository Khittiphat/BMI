'use client'

import { useRouter } from 'next/navigation'

export default function MobileReportTabs({ currentView }: { currentView: string }) {
  const router = useRouter()

  const tabs = [
    { name: 'Daily', id: 'daily' },
    { name: 'Weekly', id: 'weekly' },
    { name: 'Monthly', id: 'monthly' },
    { name: 'Yearly', id: 'yearly' },
  ]

  return (
    <div className="sm:hidden">
      <label htmlFor="tabs" className="sr-only">
        Select a view
      </label>
      <select
        id="tabs"
        name="tabs"
        className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        value={currentView}
        onChange={(e) => router.push(`/reports?view=${e.target.value}`)}
      >
        {tabs.map((tab) => (
          <option key={tab.id} value={tab.id}>
            {tab.name}
          </option>
        ))}
      </select>
    </div>
  )
}
