'use client'

import { deleteBMIRecord, updateBMIRecord } from '@/app/actions/bmi'
import { useState } from 'react'
import toast from 'react-hot-toast'

type BMIRecord = {
  id: number
  weight: number
  height: number
  bmi_value: number
  recorded_at: string
}

function getBMIStatus(bmi: number) {
  if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-600' }
  if (bmi < 25) return { label: 'Normal', color: 'text-green-600' }
  if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-600' }
  return { label: 'Obese', color: 'text-red-600' }
}

export default function BMIHistoryList({ records }: { records: BMIRecord[] }) {
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<{ weight: number; height: number; date: string }>({ weight: 0, height: 0, date: '' })

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this record?')) return
    
    setDeletingId(id)
    await deleteBMIRecord(id)
    setDeletingId(null)
  }

  const startEdit = (record: BMIRecord) => {
    setEditingId(record.id)
    setEditForm({
      weight: record.weight,
      height: record.height,
      date: new Date(record.recorded_at).toISOString().split('T')[0]
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return

    const formData = new FormData()
    formData.append('id', editingId.toString())
    formData.append('weight', editForm.weight.toString())
    formData.append('height', editForm.height.toString())
    formData.append('date', editForm.date)

    const result = await updateBMIRecord(null, formData)
    if (result?.success) {
        toast.success(result.message)
        setEditingId(null)
    } else if (result?.message) {
        toast.error(result.message)
    }
  }

  if (records.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50">
        <p className="text-sm">No records found.</p>
        <p className="mt-1 text-sm font-semibold text-gray-900">Start by adding your first BMI record!</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/80">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Weight (kg)
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Height (cm)
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                BMI
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {records.map((record) => {
              const isEditing = editingId === record.id
              const status = getBMIStatus(record.bmi_value)

              if (isEditing) {
                return (
                  <tr key={record.id} className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <input
                        type="date"
                        value={editForm.date}
                        onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                        className="block w-full rounded-lg border-gray-200 bg-white px-2 py-1 text-xs focus:border-gray-900 focus:ring-0"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <input
                        type="number"
                        step="0.1"
                        value={editForm.weight}
                        onChange={(e) => setEditForm({...editForm, weight: parseFloat(e.target.value)})}
                        className="block w-20 rounded-lg border-gray-200 bg-white px-2 py-1 text-xs focus:border-gray-900 focus:ring-0"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <input
                        type="number"
                        step="0.1"
                        value={editForm.height}
                        onChange={(e) => setEditForm({...editForm, height: parseFloat(e.target.value)})}
                        className="block w-20 rounded-lg border-gray-200 bg-white px-2 py-1 text-xs focus:border-gray-900 focus:ring-0"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      -
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                      -
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <button
                        onClick={handleUpdate}
                        className="text-green-600 hover:text-green-900 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                )
              }

              return (
                <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(record.recorded_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {record.weight}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.height}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {record.bmi_value}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      status.color.replace('text-', 'bg-').replace('600', '100') + ' ' + status.color.replace('600', '800')
                    }`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <button
                      onClick={() => startEdit(record)}
                      className="text-gray-400 hover:text-gray-900 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(record.id)}
                      disabled={deletingId === record.id}
                      className="text-gray-400 hover:text-red-600 disabled:opacity-30 transition-colors"
                    >
                      {deletingId === record.id ? '...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
