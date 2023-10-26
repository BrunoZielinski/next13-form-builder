'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { RxDropdownMenu } from 'react-icons/rx'
import { zodResolver } from '@hookform/resolvers/zod'
import { AiOutlineClose, AiOutlinePlus } from 'react-icons/ai'

import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { useDesigner } from '@/hooks/use-designer'
import { Separator } from '@/components/ui/separator'

import {
  FormElement,
  ElementsType,
  SubmitFunction,
  FormElementInstance,
} from '@/components/form-elements'

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select'

import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'

const type: ElementsType = 'SelectField'

const extraAttributes = {
  options: [],
  required: false,
  label: 'Select Field',
  helperText: 'Helper text',
  placeholder: 'Value here...',
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

      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
      </Select>

      {helperText && (
        <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
      )}
    </div>
  )
}

const propertiesSchema = z.object({
  required: z.boolean().default(false),
  options: z.array(z.string().trim()).default([]),
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
  const { updateElement, setSelectedElement } = useDesigner()

  const element = elementInstance as CustomInstance

  const form = useForm<PropertiesFromSchemaType>({
    mode: 'onSubmit',
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

    toast({
      title: 'Success',
      description: 'Properties updated successfully',
    })

    setSelectedElement(null)
  }

  return (
    <Form {...form}>
      <form className="space-y-3" onSubmit={form.handleSubmit(applyChanges)}>
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

        <Separator />

        <FormField
          name="options"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Options</FormLabel>

                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={e => {
                    e.preventDefault()
                    form.setValue('options', field.value.concat('New option'))
                  }}
                >
                  <AiOutlinePlus />
                  Add
                </Button>
              </div>

              <div className="flex flex-col gap-2">
                {form.watch('options').map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-1"
                  >
                    <Input
                      placeholder=""
                      value={option}
                      onChange={e => {
                        field.value[index] = e.target.value
                        field.onChange(field.value)
                      }}
                    />

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={e => {
                        e.preventDefault()
                        const newOptions = [...field.value]
                        newOptions.splice(index, 1)
                        field.onChange(newOptions)
                      }}
                    >
                      <AiOutlineClose />
                    </Button>
                  </div>
                ))}
              </div>

              <FormDescription>
                The helper text of the field. <br /> It will be displayed below
                the field.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

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

        <Separator />

        <Button type="submit" className="w-full">
          Save
        </Button>
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

  const { helperText, label, placeholder, required, options } =
    element.extraAttributes

  return (
    <FormItem>
      <Label htmlFor={element.id} className={cn(error && 'text-red-500')}>
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>

      <Select
        defaultValue={value}
        onValueChange={value => {
          setValue(value)
          if (!submitValue) return

          const valid = SelectFieldFormElement.validate(element, value)
          setError(!valid)

          submitValue(element.id, value)
        }}
      >
        <SelectTrigger className={cn('w-full', error && 'border-red-500')}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options.map(option => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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

export const SelectFieldFormElement: FormElement = {
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
    label: 'Select Field',
    icon: RxDropdownMenu,
  },
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
}
