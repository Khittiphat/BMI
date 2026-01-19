'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

type ChartData = {
  name: string
  weight: number
  bmi: number
}

export default function TrendChart({ data, title }: { data: ChartData[], title: string }) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
        <p className="text-gray-500">Not enough data to display chart</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">{title}</h3>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke="#2563eb" label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" stroke="#16a34a" label={{ value: 'BMI', angle: 90, position: 'insideRight' }} />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#2563eb" activeDot={{ r: 8 }} name="Weight" />
            <Line yAxisId="right" type="monotone" dataKey="bmi" stroke="#16a34a" name="BMI" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
