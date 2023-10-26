'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { IoMdCheckbox } from 'react-icons/io'
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
import { Checkbox } from '../ui/checkbox'

const type: ElementsType = 'CheckboxField'

const extraAttributes = {
  required: false,
  label: 'Checkbox Field',
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

  const { helperText, label, required } = element.extraAttributes

  const id = `checkbox-${element.id}`
  return (
    <div className="flex items-start space-x-2">
      <Checkbox id={id} />
      <div className="grid gap-1.5 leading-none">
        <Label htmlFor={id}>
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>

        {helperText && (
          <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
        )}
      </div>
    </div>
  )
}

const propertiesSchema = z.object({
  required: z.boolean().default(false),
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
  const [value, setValue] = useState<boolean>(
    defaultValue === 'true' ? true : false,
  )

  useEffect(() => {
    setError(isInvalid === true)
  }, [isInvalid])

  const { helperText, label, required } = element.extraAttributes

  const id = `checkbox-${element.id}`
  return (
    <div className="flex items-start space-x-2">
      <Checkbox
        id={id}
        checked={value}
        className={cn(error && 'border-red-500')}
        onCheckedChange={checked => {
          let value = false
          if (checked === true) value = true

          setValue(value)
          if (!submitValue) return
          const stringValue = value ? 'true' : 'false'

          const valid = CheckboxFieldFormElement.validate(element, stringValue)
          setError(!valid)

          submitValue(element.id, stringValue)
        }}
      />
      <div className="grid gap-1.5 leading-none">
        <Label htmlFor={id} className={cn(error && 'text-red-500')}>
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>

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
      </div>
    </div>
  )
}

export const CheckboxFieldFormElement: FormElement = {
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
      return currentValue === 'true'
    }

    return true
  },
  designerButtonElement: {
    icon: IoMdCheckbox,
    label: 'Checkbox Field',
  },
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
}
