import React, { DragEvent } from 'react'
import { Title } from '@mui/icons-material'
import { Task } from '../../models/Task'
import BoardItem from './BoardItem'


export type BoardColumnProps = {
  title: string
  items: Task[]
}


export default function index({ items, title  }:BoardColumnProps) {

  const getDragAfterElement = (container:Element, y:number) => {
    const draggableElemenets = Array.from( container.querySelectorAll( `.draggable:not(.dragging)` ) )
    return draggableElemenets.reduce( (closest:any, child) => {
      const box = child.getBoundingClientRect()
      const offset = y - box.top - box.height / 2
      if (offset < 0 && offset > closest.offset)
        return { offset:offset, element:child }

      return closest
    }, { offset:Number.NEGATIVE_INFINITY, element:undefined } ).element
  }

  return (
    <div
      className='container' id={`column-${title}`} style={{  backgroundColor:`#9e9e9e` }}
      onDragOver={
        (e:any) => {
          e.preventDefault()
          const afterElement = getDragAfterElement( e.target, (e as any).clientY )
          const draggable = document.querySelector( `.dragging` )!
          const includesDragable = (e.target as HTMLElement).classList.contains( `draggable` )
          try {
            if (includesDragable) return
            if (!afterElement) {
              e.target.appendChild( draggable! )
            } else {
              e.target.insertBefore( draggable, afterElement )
            }
          } catch ( e) { console.log( e ) }
        }
      }
      // onDragEnd={e => console.log( `drag-end-${title}` )}
      // onDragStart={e => console.log( `drag-start-${title}` )}
    >
      <div className='title' style={{ textAlign:`center` }}> {title}</div>
      {items.map( it => <BoardItem {...it} /> )}
    </div>
  )
}
