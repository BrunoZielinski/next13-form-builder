'use client'

import axios from 'axios'
import { useState } from 'react'
import { FaIcons } from 'react-icons/fa'
import { useParams, useRouter } from 'next/navigation'
import { MdOutlinePublish, MdOutlineUnpublished } from 'react-icons/md'

import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'

import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog'

interface PublishFormButtonProps {
  isPublished: boolean
  isAllowedToPublish: boolean
}

export const PublishFormButton = ({
  isPublished,
  isAllowedToPublish,
}: PublishFormButtonProps) => {
  const params = useParams()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)

  const publishForm = async () => {
    if (isLoading || !isAllowedToPublish) return

    try {
      setIsLoading(true)
      await axios.patch(`/api/forms/${params.formId}/publish`)

      router.refresh()

      toast({
        title: 'Success',
        description: 'Your form is now available to the public.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: 'Something went wrong while publishing the form.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          disabled={isLoading || !isAllowedToPublish}
          className="gap-2 text-white bg-gradient-to-r from-indigo-400 to-cyan-400"
        >
          {isPublished ? (
            <MdOutlineUnpublished className="w-4 h-4" />
          ) : (
            <MdOutlinePublish className="w-4 h-4" />
          )}

          {isPublished ? 'Published' : 'Publish'}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>

          <AlertDialogDescription>
            This action cannot be undone. After publishing ypu will not be apple
            to edit the form. <br />
            <br />
            <span className="font-medium">
              By publishing this form you will make it available to the public
              and you will be able to collect submissions.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            className="gap-2"
            disabled={isLoading || !isAllowedToPublish}
            onClick={e => {
              e.preventDefault()
              publishForm()
            }}
          >
            Proceed {isLoading && <FaIcons className="w-4 h-4 animate-spin" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
