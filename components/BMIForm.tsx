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
    <div className="">
      <form ref={formRef} action={action} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="weight" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
              Weight (kg)
            </label>
            <input
              type="number"
              step="0.1"
              name="weight"
              id="weight"
              required
              className="block w-full rounded-xl border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:bg-white focus:ring-0 sm:text-sm transition-all duration-200 ease-in-out"
              placeholder="e.g. 70.5"
            />
          </div>
          <div>
            <label htmlFor="height" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
              Height (cm)
            </label>
            <input
              type="number"
              step="0.1"
              name="height"
              id="height"
              required
              className="block w-full rounded-xl border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:bg-white focus:ring-0 sm:text-sm transition-all duration-200 ease-in-out"
              placeholder="e.g. 175"
            />
          </div>
          <div>
            <label htmlFor="date" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500">
              Date
            </label>
            <input
              type="date"
              name="date"
              id="date"
              required
              defaultValue={new Date().toISOString().split('T')[0]}
              className="block w-full rounded-xl border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:bg-white focus:ring-0 sm:text-sm transition-all duration-200 ease-in-out"
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
            className="inline-flex justify-center rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200"
          >
            {isPending ? 'Saving...' : 'Save Record'}
          </button>
        </div>
      </form>
    </div>
  )
}
