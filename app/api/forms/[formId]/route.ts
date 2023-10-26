import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export async function PUT(
  req: Request,
  {
    params,
  }: {
    params: {
      formId: string
    }
  },
) {
  try {
    const { userId } = auth()
    const { formId } = params
    const { content } = await req.json()

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    if (!formId) {
      return new NextResponse('Form ID is required', { status: 400 })
    }

    if (!content) {
      return new NextResponse('Content is required', { status: 400 })
    }

    const formExists = await prisma.form.findUnique({
      where: {
        id: formId,
      },
    })

    if (!formExists) {
      return new NextResponse('Form not found', { status: 404 })
    }

    const form = await prisma.form.update({
      where: {
        id: formId,
      },
      data: {
        content,
      },
    })

    return NextResponse.json(form)
  } catch (error) {
    console.error('[FORM_ID_PUT]', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
