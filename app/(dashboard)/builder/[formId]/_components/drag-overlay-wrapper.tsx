import { useState } from 'react'
import { Active, DragOverlay, useDndMonitor } from '@dnd-kit/core'

import { useDesigner } from '@/hooks/use-designer'
import { ElementsType, FormElements } from '@/components/form-elements'
import { SidebarButtonElementDragOverlay } from './sidebar-button-element'

export const DragOverlayWrapper = () => {
  const { elements } = useDesigner()
  const [draggableItem, setDraggableItem] = useState<Active | null>(null)

  useDndMonitor({
    onDragStart: event => {
      setDraggableItem(event.active)
    },
    onDragCancel: () => {
      setDraggableItem(null)
    },
    onDragEnd: () => {
      setDraggableItem(null)
    },
  })

  if (!draggableItem) return null

  let node = <div>No drag overlay</div>
  const isSidebarButtonElement =
    draggableItem.data?.current?.isDesignerButtonElement

  if (isSidebarButtonElement) {
    const type = draggableItem.data?.current?.type as ElementsType

    node = <SidebarButtonElementDragOverlay formElement={FormElements[type]} />
  }

  const isDesignerElement = draggableItem.data?.current?.isDesignerElement

  if (isDesignerElement) {
    const elementId = draggableItem.data?.current?.elementId
    const element = elements.find(element => element.id === elementId)

    if (!element) {
      node = <div>Element not found!</div>
    } else {
      const DesignerElementComponent =
        FormElements[element.type].designerComponent

      node = (
        <div className="flex w-full h-[120px] items-center rounded-md bg-accent px-4 py-2 opacity-80 pointer-events-none">
          <DesignerElementComponent elementInstance={element} />
        </div>
      )
    }
  }

  return <DragOverlay>{node}</DragOverlay>
}
