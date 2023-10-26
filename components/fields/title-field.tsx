'use client'

import { z } from 'zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { LuHeading1 } from 'react-icons/lu'
import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDesigner } from '@/hooks/use-designer'

import {
  FormElement,
  ElementsType,
  FormElementInstance,
} from '@/components/form-elements'

import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'

const type: ElementsType = 'TitleFIeld'

const extraAttributes = {
  title: 'Title field',
}

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes
}

const DesignerComponent = ({
  elementInstance,
}: {
  elementInstance: FormElementInstance
}) => {
  const element = elementInstance as CustomInstance

  const { title } = element.extraAttributes

  return (
    <div className="flex flex-col w-full gap-2">
      <Label className="text-muted-foreground">Title Field</Label>

      <p className="text-xl">{title}</p>
    </div>
  )
}

const propertiesSchema = z.object({
  title: z.string().trim().min(1, { message: 'Title is required' }).max(50, {
    message: 'Title must be less than 50 characters',
  }),
})

type PropertiesFromSchemaType = z.infer<typeof propertiesSchema>

const PropertiesComponent = ({
  elementInstance,
}: {
  elementInstance: FormElementInstance
}) => {
  const { updateElement } = useDesigner()

  const element = elementInstance as CustomInstance

  const form = useForm<PropertiesFromSchemaType>({
    mode: 'onBlur',
    defaultValues: element.extraAttributes,
    resolver: zodResolver(propertiesSchema),
  })

  useEffect(() => {
    form.reset(element.extraAttributes)
  }, [element, form])

  const applyChanges = (value: PropertiesFromSchemaType) => {
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        ...value,
      },
    })
  }

  return (
    <Form {...form}>
      <form
        onBlur={form.handleSubmit(applyChanges)}
        onSubmit={e => {
          e.preventDefault()
        }}
      >
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>

              <FormControl>
                <Input
                  {...field}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.currentTarget.blur()
                    }
                  }}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

const FormComponent = ({
  elementInstance,
}: {
  elementInstance: FormElementInstance
}) => {
  const element = elementInstance as CustomInstance

  const { title } = element.extraAttributes
  return <p className="text-xl">{title}</p>
}

export const TitleFIeldFormElement: FormElement = {
  type,
  validate: () => true,
  formComponent: FormComponent,
  designerComponent: DesignerComponent,
  propertiesComponent: PropertiesComponent,
  designerButtonElement: {
    icon: LuHeading1,
    label: 'Title Field',
  },
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
}
