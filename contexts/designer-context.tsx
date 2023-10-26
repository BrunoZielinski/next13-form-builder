'use client'

import {
  Dispatch,
  useState,
  ReactNode,
  createContext,
  SetStateAction,
} from 'react'

import { FormElementInstance } from '@/components/form-elements'

type DesignerContextType = {
  elements: FormElementInstance[]
  removeElement: (id: string) => void
  selectedElement: FormElementInstance | null
  setElements: Dispatch<SetStateAction<FormElementInstance[]>>
  addElement: (index: number, element: FormElementInstance) => void
  updateElement: (id: string, element: FormElementInstance) => void
  setSelectedElement: Dispatch<SetStateAction<FormElementInstance | null>>
}

export const DesignerContext = createContext<DesignerContextType | null>(null)

export const DesignerContextProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [elements, setElements] = useState<FormElementInstance[]>([])
  const [selectedElement, setSelectedElement] =
    useState<FormElementInstance | null>(null)

  const addElement = (index: number, element: FormElementInstance) => {
    setElements(prevElements => {
      const newElements = [...prevElements]
      newElements.splice(index, 0, element)
      return newElements
    })
  }

  const updateElement = (id: string, element: FormElementInstance) => {
    setElements(prevElements => {
      const newElements = [...prevElements]
      const index = newElements.findIndex(element => element.id === id)
      newElements.splice(index, 1, element)
      return newElements
    })
  }

  const removeElement = (id: string) => {
    setElements(prevElements => {
      const newElements = [...prevElements]
      const index = newElements.findIndex(element => element.id === id)
      newElements.splice(index, 1)
      return newElements
    })
  }

  return (
    <DesignerContext.Provider
      value={{
        elements,
        addElement,
        setElements,
        updateElement,
        removeElement,
        selectedElement,
        setSelectedElement,
      }}
    >
      {children}
    </DesignerContext.Provider>
  )
}
