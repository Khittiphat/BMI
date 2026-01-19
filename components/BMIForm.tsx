'use client'

import { useActionState, useEffect, useRef } from 'react'
import { addBMIRecord } from '@/app/actions/bmi'
import toast from 'react-hot-toast'

export default function BMIForm() {
  const [state, action, isPending] = useActionState(addBMIRecord, undefined)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success) {
      toast.success('BMI Record added successfully!')
      formRef.current?.reset()
      // Set default date to today again after reset
      const dateInput = formRef.current?.elements.namedItem('date') as HTMLInputElement
      if (dateInput) {
        dateInput.valueAsDate = new Date()
      }
    } else if (state?.message) {
      toast.error(state.message)
    }
  }, [state])

  return (
    <div className="bg-white p-6 shadow rounded-lg">
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Add New Record</h3>
      <form ref={formRef} action={action} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
              Weight (kg)
            </label>
            <input
              type="number"
              step="0.1"
              name="weight"
              id="weight"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              placeholder="e.g. 70.5"
            />
          </div>
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-700">
              Height (cm)
            </label>
            <input
              type="number"
              step="0.1"
              name="height"
              id="height"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              placeholder="e.g. 175"
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              name="date"
              id="date"
              required
              defaultValue={new Date().toISOString().split('T')[0]}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            />
          </div>
        </div>

        {state?.message && (
          <p className={`text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
            {state.message}
          </p>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isPending ? 'Saving...' : 'Save Record'}
          </button>
        </div>
      </form>
    </div>
  )
}
