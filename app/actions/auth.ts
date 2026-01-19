'use server'

import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { createSession, deleteSession } from '@/lib/session'

export async function register(prevState: unknown, formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  const errors: Record<string, string[]> = {}

  if (!username || username.length < 3) {
    errors.username = ['Username must be at least 3 characters']
  }
  if (!password || password.length < 6) {
    errors.password = ['Password must be at least 6 characters']
  }
  if (password !== confirmPassword) {
    errors.confirmPassword = ['Passwords do not match']
  }

  if (Object.keys(errors).length > 0) {
    return { errors }
  }

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { username }
  })

  if (existingUser) {
    return {
      errors: {
        username: ['Username already exists']
      }
    }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create user
  await prisma.user.create({
    data: {
      username,
      password_hash: hashedPassword
    }
  })

  redirect('/login')
}

export async function login(prevState: unknown, formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (!username || !password) {
    return {
      message: 'Please enter both username and password'
    }
  }

  const user = await prisma.user.findUnique({
    where: { username }
  })

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return {
      message: 'Invalid username or password'
    }
  }

  await createSession(user.id.toString())
  redirect('/dashboard')
}

export async function logout() {
  await deleteSession()
  redirect('/login')
}
