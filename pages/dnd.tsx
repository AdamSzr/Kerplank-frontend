import React from 'react'
import { Typography } from '@mui/material'
import { MOCKED_TASKS } from '../src/features/models/mock/tasks'
import { Task } from '../src/features/models/Task'
import DragAndDropBoard, { DragAndDropProps } from '../src/features/DragAndDropBoard'

export default function dnd() {


  const props:DragAndDropProps<Task> = {
    elements: MOCKED_TASKS,
    elementIdProducer: (element:Task) => element.id,
    elementCardProducer: (element:Task) => <Typography fontSize="10px"> {element.title}</Typography>,
    groupBy: `status`,
    onElementColumnChange: (element, newColumnName) => {
      console.log( MOCKED_TASKS.find( it => it.id == element ) )
      console.log( `Task ${element} changed status to [${newColumnName}]`, element )
    },
  }

  return (
    <DragAndDropBoard {...props} />
  )
}
