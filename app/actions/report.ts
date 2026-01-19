'use server'

import { getSession } from '@/lib/session'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { BMIRecord } from '@prisma/client'

export async function getReportData(period: 'daily' | 'weekly' | 'monthly' | 'yearly') {
  const session = await getSession()
  if (!session?.userId) {
    redirect('/login')
  }

  const userId = parseInt(session.userId as string)
  
  // Base query: get all records for the user, ordered by date
  const records = await prisma.bMIRecord.findMany({
    where: { user_id: userId },
    orderBy: { recorded_at: 'asc' },
  })

  // Grouping logic based on period
  // Note: For a real production app with large data, aggregation should happen at DB level (SQL GROUP BY)
  // But for this project scale, JS aggregation is fine and easier to implement with Prisma/SQLite

  type GroupedData = {
    date: string
    totalWeight: number
    totalBMI: number
    count: number
    records: BMIRecord[]
  }

  const groupedData: Record<string, GroupedData> = {}

  records.forEach((record: BMIRecord) => {
    const date = new Date(record.recorded_at)
    let key = ''

    if (period === 'daily') {
      key = date.toISOString().split('T')[0] // YYYY-MM-DD
    } else if (period === 'weekly') {
      // Get ISO week number
      const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
      const dayNum = d.getUTCDay() || 7
      d.setUTCDate(d.getUTCDate() + 4 - dayNum)
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1))
      const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1)/7)
      key = `${d.getUTCFullYear()}-W${weekNo}`
    } else if (period === 'monthly') {
      key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
    } else if (period === 'yearly') {
      key = `${date.getFullYear()}`
    }

    if (!groupedData[key]) {
      groupedData[key] = {
        date: key,
        totalWeight: 0,
        totalBMI: 0,
        count: 0,
        records: []
      }
    }

    groupedData[key].totalWeight += record.weight
    groupedData[key].totalBMI += record.bmi_value
    groupedData[key].count += 1
  })

  // Calculate averages
  return Object.values(groupedData).map(item => ({
    name: item.date,
    weight: parseFloat((item.totalWeight / item.count).toFixed(2)),
    bmi: parseFloat((item.totalBMI / item.count).toFixed(2)),
    count: item.count
  }))
}
