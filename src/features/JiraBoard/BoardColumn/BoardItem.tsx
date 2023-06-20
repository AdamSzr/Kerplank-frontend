import React from 'react'
import { Task } from '../../models/Task'



export default function BoardItem({ title, id }:Task) {
  return (
    <p
      id={`task-${id}`} className="draggable"
      onDragStart={
        (e:any) =>  {
          e.dataTransfer.setData( `taskId`, id )
          e.target.classList.add( `dragging` ) }
      }
      onDragEnd={(e:any) => e.target.classList.remove( `dragging` )}
      // onDrag={() => console.log( id )}
      draggable
    >{id}-{title}</p>
  )
}
