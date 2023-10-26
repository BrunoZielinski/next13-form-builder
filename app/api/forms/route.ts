import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { formSchema } from '@/schemas/form'

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    const { name, description } = await req.json()

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    const validation = formSchema.safeParse({ name, description })

    if (!validation.success) {
      return new NextResponse(validation.error.message, { status: 400 })
    }

    const form = await prisma.form.create({
      data: {
        name,
        userId,
        description,
      },
    })

    return NextResponse.json(form)
  } catch (error) {
    console.error('[FORMS_POST]', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
