import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export async function POST(
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
    const { formId } = params
    const { content } = await req.json()

    if (!formId) {
      return new NextResponse('Form ID is required', { status: 400 })
    }

    if (!content) {
      return new NextResponse('Content is required', { status: 400 })
    }

    const formExists = await prisma.form.findUnique({
      where: {
        id: formId,
        isPublished: true,
      },
    })

    if (!formExists) {
      return new NextResponse('Form not found', { status: 404 })
    }

    const submission = await prisma.form.update({
      where: {
        id: formId,
        isPublished: true,
      },
      data: {
        submissions: {
          increment: 1,
        },
        formSubmissions: {
          create: {
            content,
          },
        },
      },
    })

    return NextResponse.json(submission)
  } catch (error) {
    console.error('[FORM_ID_SUBMISSION_POST]', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
