'use client'

import copy from 'copy-to-clipboard'

import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { Input } from '@/components/ui/input'
import { ImShare } from 'react-icons/im'

interface FormLinkShareProps {
  shareUrl: string
}

export const FormLinkShare = ({ shareUrl }: FormLinkShareProps) => {
  return (
    <div className="flex items-center flex-grow gap-4">
      <Input
        readOnly
        value={`${process.env.NEXT_PUBLIC_APP_URL}/submit/${shareUrl}`}
      />

      <Button
        className="max-w-[200px] w-full"
        onClick={() => {
          copy(`${process.env.NEXT_PUBLIC_APP_URL}/submit/${shareUrl}`)
          toast({
            title: 'Copied to clipboard',
            description: 'The form link has been copied to your clipboard.',
          })
        }}
      >
        <ImShare className="w-4 h-4 mr-2" />
        Share link
      </Button>
    </div>
  )
}
