import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export async function PATCH(
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

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    if (!formId) {
      return new NextResponse('Form ID is required', { status: 400 })
    }

    const formExists = await prisma.form.findUnique({
      where: {
        id: formId,
      },
    })

    if (!formExists) {
      return new NextResponse('Form not found', { status: 404 })
    }

    if (formExists.userId !== userId) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    const formContent = JSON.parse(formExists.content)

    if (formContent.length === 0) {
      return new NextResponse('Form is empty', { status: 400 })
    }

    const form = await prisma.form.update({
      where: {
        id: formId,
      },
      data: {
        isPublished: true,
      },
    })

    return NextResponse.json(form)
  } catch (error) {
    console.error('[FORM_ID_PATCH]', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
