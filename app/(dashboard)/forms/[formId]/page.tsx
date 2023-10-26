import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { prisma } from '@/lib/prisma'
import { StatsCards } from '@/components/stats-cards'
import { VisitButton } from './_components/visit-button'
import { FormLinkShare } from './_components/form-link-share'
import { SubmissionsTable } from './_components/submissions-table'

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
    include: {
      formSubmissions: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  if (!form) return redirect('/')

  const { visits, submissions } = form

  let submissionRate = 0

  if (visits > 0) {
    submissionRate = (submissions / visits) * 100
  }

  const bounceRate = 100 - submissionRate

  return (
    <>
      <div className="py-10 border-t border-b border-muted">
        <div className="container flex justify-between">
          <h1 className="text-4xl font-bold truncate">{form.name}</h1>

          <VisitButton shareUrl={form.shareUrl} />
        </div>

        <div className="py-4 border-b border-muted">
          <div className="container flex items-center justify-between gap-2">
            <FormLinkShare shareUrl={form.shareUrl} />
          </div>
        </div>

        <div className="container pt-8">
          <StatsCards
            data={{
              visits,
              bounceRate,
              submissions,
              submissionRate,
            }}
          />
        </div>
      </div>

      <div className="container pt-10">
        <SubmissionsTable data={form} />
      </div>
    </>
  )
}
