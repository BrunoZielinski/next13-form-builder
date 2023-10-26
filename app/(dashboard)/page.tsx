import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { prisma } from '@/lib/prisma'
import { FormCard } from './_components/form-card'
import { Separator } from '@/components/ui/separator'
import { StatsCards } from '@/components/stats-cards'
import { CreateFormButton } from './_components/create-form-button'

export default async function Page() {
  const { userId } = auth()

  if (!userId) return redirect('/sign-in')

  const stats = await prisma.form.aggregate({
    where: {
      userId,
    },
    _sum: {
      visits: true,
      submissions: true,
    },
  })

  const visits = stats._sum.visits || 0
  const submissions = stats._sum.submissions || 0

  const submissionRate = visits > 0 ? (submissions / visits) * 100 : 0
  const bounceRate = visits > 0 ? (1 - submissionRate / 100) * 100 : 0

  const forms = await prisma.form.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="container py-4">
      <StatsCards
        data={{
          visits,
          bounceRate,
          submissions,
          submissionRate,
        }}
      />

      <Separator className="my-6" />

      <h2 className="col-span-2 text-4xl font-bold">Your forms</h2>

      <Separator className="my-6" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <CreateFormButton />

        {forms.map(form => (
          <FormCard data={form} key={form.id} />
        ))}
      </div>
    </div>
  )
}
