'use client'

import { z } from 'zod'
import { Bs123 } from 'react-icons/bs'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'

import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useDesigner } from '@/hooks/use-designer'

import {
  FormElement,
  ElementsType,
  SubmitFunction,
  FormElementInstance,
} from '@/components/form-elements'

import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'

const type: ElementsType = 'NumberField'

const extraAttributes = {
  required: false,
  placeholder: '0',
  label: 'Number field',
  helperText: 'Helper text',
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

  const { helperText, label, placeholder, required } = element.extraAttributes

  return (
    <div className="flex flex-col w-full gap-2">
      <Label>
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>

      <Input type="number" readOnly disabled placeholder={placeholder} />

      {helperText && (
        <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
      )}
    </div>
  )
}

const propertiesSchema = z.object({
  required: z.boolean().default(false),
  placeholder: z.string().trim().max(50, {
    message: 'Placeholder must be less than 50 characters',
  }),
  label: z.string().trim().min(1, { message: 'Label is required' }).max(50, {
    message: 'Label must be less than 50 characters',
  }),
  helperText: z.string().trim().max(200, {
    message: 'Helper text must be less than 200 characters',
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
        className="space-y-3"
        onBlur={form.handleSubmit(applyChanges)}
        onSubmit={e => {
          e.preventDefault()
        }}
      >
        <FormField
          name="label"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>

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

              <FormDescription>
                The label of the field. <br /> It will be displayed above the
                field.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="placeholder"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placeholder</FormLabel>

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

              <FormDescription>The placeholder of the field.</FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="helperText"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Helper text</FormLabel>

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

              <FormDescription>
                The helper text of the field. <br /> It will be displayed below
                the field.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="required"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex items-center justify-between p-3 border rounded-lg shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Required</FormLabel>

                <FormDescription>
                  The helper text of the field. <br /> It will be displayed
                  below the field.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
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
  isInvalid,
  submitValue,
  defaultValue,
  elementInstance,
}: {
  isInvalid?: boolean
  defaultValue?: string
  submitValue?: SubmitFunction
  elementInstance: FormElementInstance
}) => {
  const element = elementInstance as CustomInstance

  const [error, setError] = useState(false)
  const [value, setValue] = useState(defaultValue || '')

  useEffect(() => {
    setError(isInvalid === true)
  }, [isInvalid])

  const { helperText, label, placeholder, required } = element.extraAttributes

  return (
    <FormItem>
      <Label htmlFor={element.id} className={cn(error && 'text-red-500')}>
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>

      <Input
        value={value}
        type="number"
        id={element.id}
        name={element.id}
        placeholder={placeholder}
        className={cn(error && 'border-red-500')}
        onChange={e => {
          setValue(e.target.value)
        }}
        onBlur={e => {
          if (!submitValue) return

          const valid = NumberFieldFormElement.validate(element, e.target.value)

          setError(!valid)

          if (!valid) return submitValue(element.id, '')

          submitValue(element.id, e.target.value)
        }}
      />

      {helperText && (
        <p
          className={cn(
            'text-muted-foreground text-[0.8rem]',
            error && 'text-red-500',
          )}
        >
          {helperText}
        </p>
      )}
    </FormItem>
  )
}

export const NumberFieldFormElement: FormElement = {
  type,
  formComponent: FormComponent,
  designerComponent: DesignerComponent,
  propertiesComponent: PropertiesComponent,
  validate: (
    formElement: FormElementInstance,
    currentValue: string,
  ): boolean => {
    const element = formElement as CustomInstance

    if (element.extraAttributes.required) {
      return currentValue.trim().length > 0
    }

    return true
  },
  designerButtonElement: {
    icon: Bs123,
    label: 'Number field',
  },
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
}
