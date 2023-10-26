'use client'

import { Separator } from '@/components/ui/separator'
import { FormElements } from '@/components/form-elements'
import { SidebarButtonElement } from './sidebar-button-element'

export const FormElementsSidebar = () => {
  return (
    <div>
      <p className="text-sm text-foreground/70">Drag and drop elements</p>

      <Separator className="my-2" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 place-items-center">
        <p className="col-span-1 my-2 text-sm text-muted-foreground md:col-span-2 place-self-start">
          Layout elements
        </p>

        <SidebarButtonElement formElement={FormElements.TitleFIeld} />
        <SidebarButtonElement formElement={FormElements.SubTitleField} />
        <SidebarButtonElement formElement={FormElements.ParagraphField} />
        <SidebarButtonElement formElement={FormElements.SeparatorField} />
        <SidebarButtonElement formElement={FormElements.SpacerField} />

        <p className="col-span-1 my-2 text-sm text-muted-foreground md:col-span-2 place-self-start">
          Form elements
        </p>

        <SidebarButtonElement formElement={FormElements.TextField} />
        <SidebarButtonElement formElement={FormElements.NumberField} />
        <SidebarButtonElement formElement={FormElements.TextAreaField} />
        <SidebarButtonElement formElement={FormElements.DateField} />
        <SidebarButtonElement formElement={FormElements.SelectField} />
        <SidebarButtonElement formElement={FormElements.CheckboxField} />
      </div>
    </div>
  )
}
