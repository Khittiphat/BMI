'use client'

import { useActionState, useEffect } from 'react'
import { login } from '@/app/actions/auth'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [state, action, isPending] = useActionState(login, undefined)

  useEffect(() => {
    if (state?.message) {
      toast.error(state.message)
    }
  }, [state])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F3F4F6] p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-900/5 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Please enter your details to sign in
          </p>
        </div>
        
        <form action={action} className="space-y-5">
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:bg-white focus:ring-0 sm:text-sm transition-all duration-200 ease-in-out"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:bg-white focus:ring-0 sm:text-sm transition-all duration-200 ease-in-out"
                placeholder="••••••••"
              />
            </div>
          </div>

          {state?.message && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500 text-center">
              {state.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="group relative flex w-full justify-center rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 active:scale-[0.98]"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign in'
            )}
          </button>

          <div className="text-center text-sm">
            <span className="text-gray-500">Don&apos;t have an account? </span>
            <Link href="/register" className="font-semibold text-gray-900 hover:underline hover:text-black transition-colors">
              Create account
            </Link>
          </div>
        </form>
      </div>
      
      <div className="mt-8 flex flex-col items-center space-y-2 text-center text-xs text-gray-400 font-mono">
        <div className="rounded-full bg-white/50 px-4 py-2 border border-gray-200/50 backdrop-blur-sm">
          <p>username : poreiei</p>
          <p>password : 1234500</p>
          <p className="mt-1 opacity-50">67162110556-4</p>
        </div>
      </div>
    </div>
  )
}
