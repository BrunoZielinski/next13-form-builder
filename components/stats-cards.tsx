import { LuView } from 'react-icons/lu'
import { FaWpforms } from 'react-icons/fa'
import { HiCursorClick } from 'react-icons/hi'
import { TbArrowBounce } from 'react-icons/tb'

import { StatsCard } from '@/components/stats-card'

interface StatsCardsProps {
  data: {
    visits: number
    bounceRate: number
    submissions: number
    submissionRate: number
  }
}

export const StatsCards = ({ data }: StatsCardsProps) => {
  return (
    <div className="grid w-full grid-cols-1 gap-4 pt-8 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total visits"
        helperText="All time form visits"
        className="shadow-md shadow-blue-600"
        value={data?.visits.toLocaleString() || ''}
        icon={<LuView className="text-blue-600" />}
      />

      <StatsCard
        title="Total submissions"
        helperText="All time form submissions"
        className="shadow-md shadow-yellow-600"
        value={data?.submissions.toLocaleString() || ''}
        icon={<FaWpforms className="text-yellow-600" />}
      />

      <StatsCard
        title="Submissions rate"
        className="shadow-md shadow-green-600"
        helperText="Visits that resulted in form submission"
        icon={<HiCursorClick className="text-green-600" />}
        value={data?.submissionRate.toLocaleString() + '%' || ''}
      />

      <StatsCard
        title="Bounce rate"
        className="shadow-md shadow-red-600"
        helperText="Visits that leave without interacting"
        value={data?.bounceRate.toLocaleString() + '%' || ''}
        icon={<TbArrowBounce className="text-red-600" />}
      />
    </div>
  )
}
