'use client'

import axios from 'axios'
import { useRouter } from 'next/navigation'
import { HiCursorClick } from 'react-icons/hi'
import { useCallback, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { FormElementInstance, FormElements } from '@/components/form-elements'
import { ImSpinner2 } from 'react-icons/im'

interface FormSubmitComponentProps {
  formId: string
  content: FormElementInstance[]
}

export const FormSubmitComponent = ({
  formId,
  content,
}: FormSubmitComponentProps) => {
  const router = useRouter()

  const formValues = useRef<{
    [key: string]: string
  }>({})

  const formErrors = useRef<{
    [key: string]: boolean
  }>({})

  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [renderKey, setRenderKey] = useState(new Date().getTime())

  const validateForm: () => boolean = useCallback(() => {
    for (const field of content) {
      const actualValue = formValues.current[field.id] || ''
      const valid = FormElements[field.type].validate(field, actualValue)

      if (!valid) {
        formErrors.current[field.id] = true
      }
    }

    if (Object.keys(formErrors.current).length > 0) {
      return false
    }

    return true
  }, [content])

  const submitValue = useCallback((key: string, value: string) => {
    formValues.current[key] = value
  }, [])

  const onSubmit = async () => {
    if (isLoading) return

    formErrors.current = {}

    const validForm = validateForm()

    if (!validForm) {
      setRenderKey(new Date().getTime())

      toast({
        title: 'Error',
        variant: 'destructive',
        description: 'Please fill all the required fields',
      })
      return
    }

    try {
      setIsLoading(true)

      await axios.post(`/api/forms/${formId}/submissions`, {
        content: JSON.stringify(formValues.current),
      })

      setSubmitted(true)

      toast({
        title: 'Success',
        description: 'Your submission has been saved',
      })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        variant: 'destructive',
        description: 'Something went wrong, please try again later',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-blue-700 rounded">
        <h1 className="text-2xl font-bold">Form submitted</h1>

        <p className="text-muted-foreground">
          Thank you for submitting this form. You can close this window now.
        </p>
      </div>
    )
  }

  return (
    <div
      key={renderKey}
      className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-blue-700 rounded"
    >
      {content.map(element => {
        const FormElement = FormElements[element.type].formComponent

        if (!FormElement) return null

        return (
          <FormElement
            key={element.id}
            elementInstance={element}
            submitValue={submitValue}
            isInvalid={formErrors.current[element.id]}
            defaultValue={formValues.current[element.id]}
          />
        )
      })}

      <Button className="mt-8" onClick={onSubmit} disabled={isLoading}>
        {isLoading ? (
          <ImSpinner2 className="mr-2 animate-spin" />
        ) : (
          <>
            <HiCursorClick className="mr-2" />
            Submit
          </>
        )}
      </Button>
    </div>
  )
}
