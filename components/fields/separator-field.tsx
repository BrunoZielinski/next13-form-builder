'use client'

import { z } from 'zod'
import { RiSeparator } from 'react-icons/ri'

import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

import { FormElement, ElementsType } from '@/components/form-elements'

const type: ElementsType = 'SeparatorField'

const DesignerComponent = () => {
  return (
    <div className="flex flex-col w-full gap-2">
      <Label className="text-muted-foreground">Separator Field</Label>
      <Separator />
    </div>
  )
}

const propertiesSchema = z.object({
  title: z.string().trim().min(1, { message: 'Title is required' }).max(50, {
    message: 'Title must be less than 50 characters',
  }),
})

const PropertiesComponent = () => {
  return <p>No properties for this element</p>
}

const FormComponent = () => {
  return <Separator />
}

export const SeparatorFieldFormElement: FormElement = {
  type,
  validate: () => true,
  formComponent: FormComponent,
  designerComponent: DesignerComponent,
  propertiesComponent: PropertiesComponent,
  designerButtonElement: {
    icon: RiSeparator,
    label: 'Separator Field',
  },
  construct: (id: string) => ({
    id,
    type,
  }),
}
