'use client'

import Link from 'next/link'
import copy from 'copy-to-clipboard'
import { Form } from '@prisma/client'
import Confetti from 'react-confetti'
import { ImSpinner2 } from 'react-icons/im'
import { useEffect, useState } from 'react'
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs'

import {
  useSensor,
  DndContext,
  useSensors,
  MouseSensor,
  TouchSensor,
} from '@dnd-kit/core'

import { Designer } from './designer'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { useDesigner } from '@/hooks/use-designer'
import { SaveFormButton } from './save-form-button'
import { PublishFormButton } from './publish-form-button'
import { DragOverlayWrapper } from './drag-overlay-wrapper'
import { PreviewDialogButton } from './preview-dialog-button'

interface FormBuilderProps {
  data: Form
}

export const FormBuilder = ({ data }: FormBuilderProps) => {
  const { setElements, setSelectedElement } = useDesigner()

  const [isReady, setIsReady] = useState(false)

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10, // 10px
    },
  })

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 300, // 300ms
      tolerance: 5, // 5px
    },
  })

  const sensors = useSensors(mouseSensor, touchSensor)

  useEffect(() => {
    if (isReady) return

    if (data.content) {
      const parsedContent = JSON.parse(data.content)
      setElements(parsedContent)
      setSelectedElement(null)
      const readyTimeout = setTimeout(() => {
        setIsReady(true)
      }, 500)

      return () => {
        clearTimeout(readyTimeout)
      }
    }
  }, [data, isReady, setElements, setSelectedElement])

  if (!isReady) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <ImSpinner2 className="w-12 h-12 animate-spin" />
      </div>
    )
  }

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/submit/${data.shareUrl}`

  if (data.isPublished) {
    return (
      <>
        <Confetti
          recycle={false}
          numberOfPieces={500}
          width={window.innerWidth}
          height={window.innerHeight}
        />

        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="max-w-md">
            <h1 className="pb-2 mb-10 text-4xl font-bold text-center border-b text-primary">
              Form is published
            </h1>

            <h2 className="text-2xl">Share this form</h2>

            <h3 className="pb-10 text-xl border-b text-muted-foreground">
              Anyone with the link can view and submit the form
            </h3>

            <div className="flex flex-col items-center w-full gap-2 pb-4 my-4 border-b">
              <Input readOnly value={shareUrl} className="w-full" />

              <Button
                className="w-full mt-w"
                onClick={() => {
                  copy(shareUrl)
                  toast({
                    title: 'Copied to clipboard',
                    description: 'Form link copied to clipboard',
                  })
                }}
              >
                Copy link
              </Button>
            </div>

            <div className="flex justify-between">
              <Button asChild variant="link">
                <Link href="/" className="gap-2">
                  <BsArrowLeft />
                  Go back home
                </Link>
              </Button>

              <Button asChild variant="link">
                <Link href={`/forms/${data.id}`} className="gap-2">
                  Form details
                  <BsArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <DndContext sensors={sensors}>
      <main className="flex flex-col w-full h-full">
        <nav className="flex items-center justify-between gap-3 p-4 border-b-2">
          <h2 className="font-medium truncate">
            <span className="mr-2 text-muted-foreground">Form:</span>
            {data.name}
          </h2>

          <div className="flex items-center gap-2">
            <PreviewDialogButton />

            {!data.isPublished && (
              <>
                <SaveFormButton />
                <PublishFormButton
                  isPublished={data.isPublished}
                  isAllowedToPublish={JSON.parse(data.content).length > 0}
                />
              </>
            )}
          </div>
        </nav>

        <div className="flex w-full flex-grow items-center justify-center relative overflow-y-hidden h-[200px] bg-accent bg-[url(/paper.svg)] dark:bg-[url(/paper-dark.svg)]">
          <Designer />
        </div>
      </main>

      <DragOverlayWrapper />
    </DndContext>
  )
}
