'use client'

import { z } from 'zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { BsTextParagraph } from 'react-icons/bs'
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
import { Textarea } from '../ui/textarea'

const type: ElementsType = 'ParagraphField'

const extraAttributes = {
  text: 'Text here',
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

  const { text } = element.extraAttributes

  return (
    <div className="flex flex-col w-full gap-2">
      <Label className="text-muted-foreground">Paragraph Field</Label>

      <p>{text}</p>
    </div>
  )
}

const propertiesSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, { message: 'Paragraph is required' })
    .max(500, {
      message: 'Paragraph must be less than 500 characters',
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
          name="text"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Text</FormLabel>

              <FormControl>
                <Textarea
                  {...field}
                  rows={5}
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

  const { text } = element.extraAttributes
  return <p>{text}</p>
}

export const ParagraphFieldFormElement: FormElement = {
  type,
  validate: () => true,
  formComponent: FormComponent,
  designerComponent: DesignerComponent,
  propertiesComponent: PropertiesComponent,
  designerButtonElement: {
    icon: BsTextParagraph,
    label: 'Paragraph Field',
  },
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
}
