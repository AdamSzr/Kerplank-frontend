import React from 'react'
import { Task } from '../../models/Task'



export default function BoardItem({ title, id }:Task) {
  return (
    <p id={`task-${id}`} className="draggable" draggable>{title}</p>
  )
}
