'use client'

import { z } from 'zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { LuSeparatorHorizontal } from 'react-icons/lu'
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
import { Slider } from '../ui/slider'

const type: ElementsType = 'SpacerField'

const extraAttributes = {
  height: 20, //px
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

  const { height } = element.extraAttributes

  return (
    <div className="flex flex-col items-center w-full gap-2">
      <Label className="text-muted-foreground">Spacer field: {height}px</Label>

      <LuSeparatorHorizontal className="w-8 h-8" />
    </div>
  )
}

const propertiesSchema = z.object({
  height: z
    .number()
    .int()
    .min(1, { message: 'Height must be greater than 0' })
    .max(200, { message: 'Height must be less than 200' }),
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
          name="height"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Height (px): {form.watch('height')}</FormLabel>

              <FormControl className="pt-2">
                <Slider
                  min={1}
                  step={1}
                  max={200}
                  defaultValue={[field.value]}
                  onValueChange={value => {
                    field.onChange(value[0])
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

  const { height } = element.extraAttributes
  return (
    <div
      style={{
        width: '100%',
        height: `${height}px`,
      }}
    />
  )
}

export const SpacerFieldFormElement: FormElement = {
  type,
  validate: () => true,
  formComponent: FormComponent,
  designerComponent: DesignerComponent,
  propertiesComponent: PropertiesComponent,
  designerButtonElement: {
    label: 'Spacer field',
    icon: LuSeparatorHorizontal,
  },
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
}
