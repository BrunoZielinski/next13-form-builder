import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { prisma } from '@/lib/prisma'
import { FormBuilder } from './_components/form-builder'

interface PageProps {
  params: {
    formId: string
  }
}

export default async function Page({ params }: PageProps) {
  const { userId } = auth()

  if (!userId) return redirect('/sign-in')

  const form = await prisma.form.findUnique({
    where: {
      userId,
      id: params.formId,
    },
  })

  if (!form) return redirect('/')

  return <FormBuilder data={form} />
}
