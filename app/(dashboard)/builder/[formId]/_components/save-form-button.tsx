'use client'

import axios from 'axios'
import { useState } from 'react'
import { HiSaveAs } from 'react-icons/hi'
import { FaSpinner } from 'react-icons/fa'
import { useParams, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { useDesigner } from '@/hooks/use-designer'

export const SaveFormButton = () => {
  const params = useParams()
  const router = useRouter()
  const { elements } = useDesigner()

  const [isLoading, setIsLoading] = useState(false)

  const updateFormContent = async () => {
    if (elements.length === 0 || isLoading) return

    try {
      setIsLoading(true)
      await axios.put(`/api/forms/${params.formId}`, {
        content: JSON.stringify(elements),
      })

      router.refresh()

      toast({
        title: 'Success',
        description: 'Your form has been saved.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: 'Something went wrong while saving the form.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      className="gap-2"
      onClick={updateFormContent}
      disabled={isLoading || elements.length === 0}
    >
      <HiSaveAs className="w-4 h-4" />
      Save
      {isLoading && <FaSpinner className="w-4 h-4 animate-spin" />}
    </Button>
  )
}
