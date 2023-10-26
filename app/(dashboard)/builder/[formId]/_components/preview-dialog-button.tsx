'use client'

import { MdPreview } from 'react-icons/md'

import { Button } from '@/components/ui/button'
import { useDesigner } from '@/hooks/use-designer'

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { FormElements } from '@/components/form-elements'

export const PreviewDialogButton = () => {
  const { elements } = useDesigner()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <MdPreview className="w-4 h-4" />
          Preview
        </Button>
      </DialogTrigger>

      <DialogContent className="flex flex-col flex-grow w-screen h-screen max-w-full max-h-screen gap-0 p-0">
        <div className="px-4 py-2 border-b">
          <p className="text-lg font-bold text-muted-foreground">
            Form Preview
          </p>

          <p className="text-sm text-muted-foreground">
            This is how your form will look like to your users.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center flex-grow p-4 bg-accent bg-[url(/paper.svg)] dark:bg-[url(/paper-dark.svg)] overflow-y-auto">
          <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background h-full w-full rounded-3xl p-8 overflow-y-auto">
            {elements.map((element, index) => {
              const FormComponent = FormElements[element.type].formComponent

              return <FormComponent key={index} elementInstance={element} />
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
