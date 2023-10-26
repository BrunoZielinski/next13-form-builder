import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { prisma } from '@/lib/prisma'
import { FormElementInstance } from '@/components/form-elements'
import { FormSubmitComponent } from './_components/form-submit-component'

interface PageProps {
  params: {
    shareUrl: string
  }
}

export default async function Page({ params }: PageProps) {
  const { userId } = auth()

  const form = await prisma.form.update({
    where: {
      isPublished: true,
      shareUrl: params.shareUrl,
    },
    data: {
      visits: {
        increment: userId ? 0 : 1,
      },
    },
    select: {
      id: true,
      content: true,
    },
  })

  if (!form) return redirect('/')

  const formContent = JSON.parse(form.content) as FormElementInstance[]

  return <FormSubmitComponent formId={form.id} content={formContent} />
}
