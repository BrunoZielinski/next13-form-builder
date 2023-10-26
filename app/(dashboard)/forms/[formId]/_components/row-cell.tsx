'use client'

import { ReactNode } from 'react'
import { format } from 'date-fns'

import { Badge } from '@/components/ui/badge'
import { TableCell } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { ElementsType } from '@/components/form-elements'

interface RowCellProps {
  value: string
  type: ElementsType
}

export const RowCell = ({ value, type }: RowCellProps) => {
  let node: ReactNode = value

  switch (type) {
    case 'DateField':
      if (!value) break
      const date = new Date(value)
      node = <Badge variant="outline">{format(date, 'dd/MM/yyyy')}</Badge>
      break

    case 'CheckboxField':
      const checked = value === 'true' ? true : false
      node = <Checkbox disabled checked={checked} />
      break

    default:
      break
  }

  return <TableCell>{node}</TableCell>
}
