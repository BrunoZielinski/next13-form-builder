'use client'

import { useState } from 'react'
import { BiSolidTrash } from 'react-icons/bi'
import { useDndMonitor, useDraggable, useDroppable } from '@dnd-kit/core'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { idGenerator } from '@/lib/id-generator'
import { useDesigner } from '@/hooks/use-designer'
import { DesignerSidebar } from './designer-sidebar'

import {
  ElementsType,
  FormElements,
  FormElementInstance,
} from '@/components/form-elements'

export const Designer = () => {
  const {
    elements,
    addElement,
    removeElement,
    selectedElement,
    setSelectedElement,
  } = useDesigner()

  const droppable = useDroppable({
    id: 'designer-drop-area',
    data: {
      isDesignDropArea: true,
    },
  })

  useDndMonitor({
    onDragEnd: event => {
      const { active, over } = event

      if (!active || !over) return

      const isDesignerButtonElement =
        active.data?.current?.isDesignerButtonElement

      const isDroppingOverDesignerDropArea =
        over.data?.current?.isDesignDropArea

      const droppingSidebarButtonOverDesignerDropArea =
        isDesignerButtonElement && isDroppingOverDesignerDropArea

      if (droppingSidebarButtonOverDesignerDropArea) {
        const type = active.data?.current?.type
        const newElement = FormElements[type as ElementsType].construct(
          idGenerator(),
        )

        addElement(elements.length, newElement)
        return
      }

      const isDroppingOverDesignerElementTopHalf =
        over.data?.current?.isTopHalfDesignerElement

      const isDroppingOverDesignerElementBottomHalf =
        over.data?.current?.isBottomHalfDesignerElement

      const isDroppingOverDesignerElement =
        isDroppingOverDesignerElementTopHalf |
        isDroppingOverDesignerElementBottomHalf

      const droppingSidebarButtonOverDesignerElement =
        isDesignerButtonElement && isDroppingOverDesignerElement

      if (droppingSidebarButtonOverDesignerElement) {
        const type = active.data?.current?.type
        const newElement = FormElements[type as ElementsType].construct(
          idGenerator(),
        )

        const overId = over.data?.current?.elementId

        const overElementIndex = elements.findIndex(
          element => element.id === overId,
        )

        if (overElementIndex === -1) {
          throw new Error('Element not found')
        }

        let indexForNewElement = overElementIndex
        if (isDroppingOverDesignerElementBottomHalf) {
          indexForNewElement = overElementIndex + 1
        }

        addElement(indexForNewElement, newElement)
        return
      }

      const isDraggingDesignerElement = active.data?.current?.isDesignerElement

      const draggingDesignerElementOverAnotherDesignerElement =
        isDroppingOverDesignerElement && isDraggingDesignerElement

      if (draggingDesignerElementOverAnotherDesignerElement) {
        const activeId = active.data?.current?.elementId
        const overId = over.data?.current?.elementId

        const activeElementIndex = elements.findIndex(
          element => element.id === activeId,
        )

        const overElementIndex = elements.findIndex(
          element => element.id === overId,
        )

        if (activeElementIndex === -1 || overElementIndex === -1) {
          throw new Error('Element not found')
        }

        const activeElement = { ...elements[activeElementIndex] }
        removeElement(activeId)

        let indexForNewElement = overElementIndex
        if (isDroppingOverDesignerElementBottomHalf) {
          indexForNewElement = overElementIndex + 1
        }

        addElement(indexForNewElement, activeElement)
      }
    },
  })

  return (
    <div className="flex w-full h-full">
      <div
        className="w-full p-4"
        onClick={() => {
          if (selectedElement) {
            setSelectedElement(null)
          }
        }}
      >
        <div
          ref={droppable.setNodeRef}
          className={cn(
            'bg-background max-w-[920px] h-full m-auto rounded-xl flex flex-col flex-grow items-center justify-start flex-1 overflow-y-auto',
            droppable.isOver && 'ring-2 ring-primary ring-inset',
          )}
        >
          {!droppable.isOver && elements.length === 0 && (
            <p className="flex items-center flex-grow text-3xl font-bold text-muted-foreground">
              Drop here
            </p>
          )}

          {droppable.isOver && elements.length === 0 && (
            <div className="w-full p-4">
              <div className="h-[120px] rounded-md bg-primary/20"></div>
            </div>
          )}

          {elements.length > 0 && (
            <div className="flex flex-col w-full gap-2 p-4">
              {elements.map(element => (
                <DesignerElementWrapper key={element.id} element={element} />
              ))}
            </div>
          )}
        </div>
      </div>

      <DesignerSidebar />
    </div>
  )
}

const DesignerElementWrapper = ({
  element,
}: {
  element: FormElementInstance
}) => {
  const { removeElement, selectedElement, setSelectedElement } = useDesigner()

  const [mouseIsOver, setMouseIsOver] = useState(false)

  const topHalf = useDroppable({
    id: element.id + '-top',
    data: {
      type: element.type,
      elementId: element.id,
      isTopHalfDesignerElement: true,
    },
  })

  const bottomHalf = useDroppable({
    id: element.id + '-bottom',
    data: {
      type: element.type,
      elementId: element.id,
      isBottomHalfDesignerElement: true,
    },
  })

  const draggable = useDraggable({
    id: element.id + '-drag-handler',
    data: {
      type: element.type,
      elementId: element.id,
      isDesignerElement: true,
    },
  })

  if (draggable.isDragging) return null

  const DesignerElement = FormElements[element.type].designerComponent

  return (
    <div
      ref={draggable.setNodeRef}
      {...draggable.listeners}
      {...draggable.attributes}
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      onClick={e => {
        e.stopPropagation()
        setSelectedElement(element)
      }}
      className="relative min-h-[120px] flex flex-col text-foreground hover:cursor-pointer rounded-md ring-1 ring-accent ring-inset select-none"
    >
      <div
        ref={topHalf.setNodeRef}
        className="absolute w-full h-1/2 rounded-t-md"
      />

      {mouseIsOver && (
        <>
          <div className="absolute z-10 text-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 animate-pulse">
            <p className="text-sm text-muted-foreground">
              Click for properties or drag to move
            </p>
          </div>

          <div className="absolute right-0 z-10 h-full">
            <Button
              variant="outline"
              onClick={e => {
                e.stopPropagation()

                if (selectedElement?.id === element.id) {
                  setSelectedElement(null)
                }

                removeElement(element.id)
              }}
              className="flex h-full bg-red-500 border rounded-md rounded-l-none justify-items-center"
            >
              <BiSolidTrash className="w-6 h-6" />
            </Button>
          </div>
        </>
      )}

      {topHalf.isOver && (
        <div className="absolute top-0 w-full rounded-md h-[7px] bg-primary rounded-b-none"></div>
      )}

      <div
        className={cn(
          'flex w-full min-h-[120px] items-center rounded-md bg-accent/40 px-4 py-2 pointer-events-none opacity-100',
          mouseIsOver && 'opacity-30',
        )}
      >
        <DesignerElement elementInstance={element} />
      </div>

      {bottomHalf.isOver && (
        <div className="absolute bottom-0 w-full rounded-md h-[7px] bg-primary rounded-t-none"></div>
      )}

      <div
        ref={bottomHalf.setNodeRef}
        className="absolute bottom-0 w-full h-1/2 rounded-b-md"
      />
    </div>
  )
}
