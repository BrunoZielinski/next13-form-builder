import Link from 'next/link'
import { Form } from '@prisma/client'
import { FaEdit } from 'react-icons/fa'
import { LuView } from 'react-icons/lu'
import { formatDistance } from 'date-fns'
import { FaWpforms } from 'react-icons/fa'
import { BiRightArrowAlt } from 'react-icons/bi'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardContent,
  CardDescription,
} from '@/components/ui/card'

interface FormCardProps {
  data: Form
}

export const FormCard = ({ data }: FormCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
          <span className="truncate font-bold">{data.name}</span>

          {data.isPublished && <Badge>Published</Badge>}
          {!data.isPublished && <Badge variant="destructive">Draft</Badge>}
        </CardTitle>

        <CardDescription className="flex items-center justify-between text-muted-foreground text-sm">
          {formatDistance(data.createdAt, new Date(), {
            addSuffix: true,
          })}
          {data.isPublished && (
            <span className="flex items-center gap-2">
              <LuView className="text-muted-foreground" />
              <span>{data.visits.toLocaleString()}</span>

              <FaWpforms className="text-muted-foreground" />
              <span>{data.submissions.toLocaleString()}</span>
            </span>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="h-[20px] truncate text-sm text-muted-foreground">
        {data.description || 'No description'}
      </CardContent>

      <CardFooter>
        {data.isPublished && (
          <Button asChild className="w-full mt-2 text-md gap-4">
            <Link href={`/forms/${data.id}`}>
              View submissions <BiRightArrowAlt />
            </Link>
          </Button>
        )}

        {!data.isPublished && (
          <Button
            asChild
            variant="secondary"
            className="w-full mt-2 text-md gap-4"
          >
            <Link href={`/builder/${data.id}`}>
              Edit form <FaEdit />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
