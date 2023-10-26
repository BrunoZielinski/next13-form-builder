'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'

interface VisitButtonProps {
  shareUrl: string
}

export const VisitButton = ({ shareUrl }: VisitButtonProps) => {
  return (
    <Button asChild className="w-[200px]">
      <Link
        target="_blank"
        href={`${process.env.NEXT_PUBLIC_APP_URL}/submit/${shareUrl}`}
      >
        Visit
      </Link>
    </Button>
  )
}
