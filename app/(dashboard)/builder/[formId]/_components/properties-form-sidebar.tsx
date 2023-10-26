'use client'

import { AiOutlineClose } from 'react-icons/ai'

import { Button } from '@/components/ui/button'
import { useDesigner } from '@/hooks/use-designer'
import { Separator } from '@/components/ui/separator'
import { FormElements } from '@/components/form-elements'

export const PropertiesFormSidebar = () => {
  const { selectedElement, setSelectedElement } = useDesigner()

  if (!selectedElement) return null

  const PropertiesForm = FormElements[selectedElement?.type].propertiesComponent

  return (
    <div className="flex flex-col p-2">
      <div className="flex justify-between items-center">
        <p className="text-sm text-foreground/70">Element properties</p>

        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            setSelectedElement(null)
          }}
        >
          <AiOutlineClose />
        </Button>
      </div>

      <Separator className="mb-4" />

      <PropertiesForm elementInstance={selectedElement} />
    </div>
  )
}
