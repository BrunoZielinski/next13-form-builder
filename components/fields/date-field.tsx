'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { BsFillCalendarDateFill } from 'react-icons/bs'

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
import { Button } from '../ui/button'
import { CalendarIcon } from '@radix-ui/react-icons'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { format } from 'date-fns'
import { Calendar } from '../ui/calendar'

const type: ElementsType = 'DateField'

const extraAttributes = {
  required: false,
  label: 'Date Field',
  helperText: 'Pick a date',
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

  return (
    <div className="flex flex-col w-full gap-2">
      <Label>
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>

      <Button
        variant="outline"
        className="justify-start w-full font-normal text-left"
      >
        <CalendarIcon className="w-4 h-4 mr-2" />
        <span>Pick a date</span>
      </Button>

      {helperText && (
        <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
      )}
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
  const [date, setDate] = useState<Date | undefined>(
    defaultValue ? new Date(defaultValue) : undefined,
  )

  useEffect(() => {
    setError(isInvalid === true)
  }, [isInvalid])

  const { helperText, label, required } = element.extraAttributes

  return (
    <FormItem>
      <Label htmlFor={element.id} className={cn(error && 'text-red-500')}>
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'justify-start w-full font-normal text-left',
              !date && 'text-muted-foreground',
              error && 'border-red-500',
            )}
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            {date ? format(date, 'dd/MM/yyyy') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="single"
            selected={date}
            onSelect={date => {
              setDate(date)

              if (!submitValue) return

              const value = date?.toISOString() || ''
              const valid = DateFieldFormElement.validate(element, value)
              setError(!valid)
              submitValue(element.id, value)
            }}
          />
        </PopoverContent>
      </Popover>

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

export const DateFieldFormElement: FormElement = {
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
    label: 'Date Field',
    icon: BsFillCalendarDateFill,
  },
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
}
