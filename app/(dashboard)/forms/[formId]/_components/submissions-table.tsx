'use client'

import { Form, FormSubmissions } from '@prisma/client'

import { RowCell } from './row-cell'
import { ElementsType, FormElementInstance } from '@/components/form-elements'

import {
  Table,
  TableRow,
  TableBody,
  TableHead,
  TableHeader,
  TableCell,
} from '@/components/ui/table'
import { formatDistance } from 'date-fns'

type Row = {
  [key: string]: string
} & {
  submittedAt: Date
}

interface SubmissionsTableProps {
  data: Form & {
    formSubmissions: FormSubmissions[]
  }
}

export const SubmissionsTable = ({ data }: SubmissionsTableProps) => {
  const formElements = JSON.parse(data.content) as FormElementInstance[]

  const columns: {
    id: string
    label: string
    required: boolean
    type: ElementsType
  }[] = []

  formElements.forEach(element => {
    switch (element.type) {
      case 'TextField':
      case 'NumberField':
      case 'TextAreaField':
      case 'DateField':
      case 'SelectField':
      case 'CheckboxField':
        columns.push({
          id: element.id,
          type: element.type,
          label: element.extraAttributes?.label,
          required: element.extraAttributes?.required,
        })
        break

      default:
        break
    }
  })

  const rows: Row[] = []

  data.formSubmissions.forEach(submission => {
    const content = JSON.parse(submission.content)

    rows.push({
      ...content,
      submittedAt: submission.createdAt,
    })
  })

  return (
    <>
      <h1 className="my-4 text-2xl font-bold">Submissions</h1>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(column => (
                <TableHead key={column.id} className="uppercase">
                  {column.label}
                </TableHead>
              ))}

              <TableHead className="text-right uppercase text-muted-foreground">
                Submitted At{' '}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {columns.map(column => (
                  <RowCell
                    key={column.id}
                    type={column.type}
                    value={row[column.id]}
                  />
                ))}

                <TableCell className="text-muted-foreground">
                  {formatDistance(row.submittedAt, new Date(), {
                    addSuffix: true,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
