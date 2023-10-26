import * as z from 'zod'

export const formSchema = z.object({
  description: z.string().trim().optional(),
  name: z.string().trim().min(1, 'Field is required'),
})

export type FormSchemaType = z.infer<typeof formSchema>
