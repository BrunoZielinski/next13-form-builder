'use client'

import Link from 'next/link'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'

export default function Error({ error }: { error: Error }) {
  useEffect(() => {
    console.log(error)
  }, [error])

  return (
    <div className="flex w-full h-full flex-col items-center justify-center gap-4">
      <h2 className="text-destructive text-4xl text-center">
        Something went wrong!
      </h2>

      <Button asChild variant="secondary">
        <Link href="/">Go back to home</Link>
      </Button>
    </div>
  )
}
