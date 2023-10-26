'use client'

import { useContext } from 'react'

import { DesignerContext } from '@/contexts/designer-context'

export const useDesigner = () => {
  const context = useContext(DesignerContext)

  if (!context) {
    throw new Error('useDesigner must be used within a DesignerContextProvider')
  }

  return context
}
