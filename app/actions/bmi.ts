'use server'

import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/session'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function addBMIRecord(prevState: unknown, formData: FormData) {
  const session = await getSession()
  if (!session?.userId) {
    redirect('/login')
  }

  const weight = parseFloat(formData.get('weight') as string)
  const height = parseFloat(formData.get('height') as string)
  const dateStr = formData.get('date') as string

  if (!weight || !height || !dateStr) {
    return { message: 'Please provide all required fields' }
  }

  // Calculate BMI
  // Height is in cm, convert to meters
  const heightInMeters = height / 100
  const bmiValue = weight / (heightInMeters * heightInMeters)
  const roundedBMI = parseFloat(bmiValue.toFixed(2))

  try {
    await prisma.bMIRecord.create({
      data: {
        user_id: parseInt(session.userId as string),
        weight,
        height,
        bmi_value: roundedBMI,
        recorded_at: new Date(dateStr),
      },
    })

    revalidatePath('/dashboard')
    return { message: 'Record added successfully', success: true }
  } catch (error) {
    console.error('Failed to add record:', error)
    return { message: 'Failed to add record' }
  }
}

export async function updateBMIRecord(prevState: unknown, formData: FormData) {
  const session = await getSession()
  if (!session?.userId) {
    redirect('/login')
  }

  const id = parseInt(formData.get('id') as string)
  const weight = parseFloat(formData.get('weight') as string)
  const height = parseFloat(formData.get('height') as string)
  const dateStr = formData.get('date') as string

  if (!id || !weight || !height || !dateStr) {
    return { message: 'Please provide all required fields' }
  }

  try {
    // Verify ownership
    const record = await prisma.bMIRecord.findUnique({
      where: { id },
    })

    if (!record || record.user_id !== parseInt(session.userId as string)) {
      return { message: 'Unauthorized' }
    }

    // Recalculate BMI
    const heightInMeters = height / 100
    const bmiValue = weight / (heightInMeters * heightInMeters)
    const roundedBMI = parseFloat(bmiValue.toFixed(2))

    await prisma.bMIRecord.update({
      where: { id },
      data: {
        weight,
        height,
        bmi_value: roundedBMI,
        recorded_at: new Date(dateStr),
      },
    })

    revalidatePath('/dashboard')
    return { message: 'Record updated successfully', success: true }
  } catch (error) {
    console.error('Failed to update record:', error)
    return { message: 'Failed to update record' }
  }
}

export async function deleteBMIRecord(id: number) {
  const session = await getSession()
  if (!session?.userId) {
    redirect('/login')
  }

  try {
    // Verify ownership
    const record = await prisma.bMIRecord.findUnique({
      where: { id },
    })

    if (!record || record.user_id !== parseInt(session.userId as string)) {
      return { message: 'Unauthorized' }
    }

    await prisma.bMIRecord.delete({
      where: { id },
    })

    revalidatePath('/dashboard')
    return { message: 'Record deleted successfully' }
  } catch {
    return { message: 'Failed to delete record' }
  }
}
