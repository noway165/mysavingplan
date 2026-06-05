"use client"

import React, { useState, useEffect } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripHorizontal } from "lucide-react"

// A sortable item wrapper
export function SortableItem({ id, children, className }: { id: string, children: React.ReactNode, className?: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.8 : 1,
    scale: isDragging ? 1.05 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className={`relative group ${className}`}>
      {/* Drag Handle */}
      <div 
        {...attributes} 
        {...listeners}
        className="absolute top-4 right-4 z-20 p-2 rounded-lg bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing hover:bg-primary/20 hover:text-primary backdrop-blur-sm border border-border/50"
      >
        <GripHorizontal size={16} />
      </div>
      {children}
    </div>
  )
}

export function DraggableDashboard({ children }: { children: React.ReactNode }) {
  // Extract children to array and assign IDs
  const childrenArray = React.Children.toArray(children)
  const defaultItems = childrenArray.map((_, i) => `widget-${i}`)
  
  const [items, setItems] = useState<string[]>([])

  useEffect(() => {
    // Load saved layout or use default
    const saved = localStorage.getItem("dashboard-layout")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.length === defaultItems.length) {
          setItems(parsed)
          return
        }
      } catch (e) {
        // Ignore error
      }
    }
    setItems(defaultItems)
  }, [defaultItems.length])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before dragging starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id as string)
        const newIndex = items.indexOf(over.id as string)
        const newItems = arrayMove(items, oldIndex, newIndex)
        localStorage.setItem("dashboard-layout", JSON.stringify(newItems))
        return newItems
      })
    }
  }

  if (items.length === 0) return null

  // Map elements according to sorted IDs
  const sortedElements = items.map((id) => {
    const index = parseInt(id.split("-")[1])
    return (
      <SortableItem key={id} id={id} className={childrenArray[index] ? (childrenArray[index] as any).props.className : ''}>
        {childrenArray[index]}
      </SortableItem>
    )
  })

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 auto-rows-[minmax(140px,auto)]">
          {sortedElements}
        </div>
      </SortableContext>
    </DndContext>
  )
}
