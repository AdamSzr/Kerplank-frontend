import React, { useEffect, useState } from 'react'
import { Typography } from '@mui/material'
import { MOCKED_TASKS } from '../src/features/models/mock/tasks'
import { Task, TaskStatus } from '../src/features/models/Task'
import getProjectsList from '../src/features/api/download-project-list'
import DragAndDropBoard, { DragAndDropProps } from '../src/features/DragAndDropBoard'

export default function dnd() {
  const [ tasks, setTasks ] = useState( MOCKED_TASKS )


  useEffect( () => {
    getProjectsList()
  }, [] )


  const props:DragAndDropProps<Task> = {
    elements: tasks,
    elementIdProducer: (element:Task) => element.id,
    elementCardProducer: (element:Task) => <Typography fontSize="10px"> {element.title}</Typography>,
    groupBy: `status`,
    onElementColumnChange: (elementId, newColumnName) => {
      console.log( MOCKED_TASKS.find( it => it.id == elementId ) )
      console.log( `Task ${elementId} changed status to [${newColumnName}]`, elementId )
      const targetTaskIdx = tasks.findIndex( it => it.id == elementId )
      let targetTask = tasks[ targetTaskIdx ]
      targetTask.status = newColumnName as TaskStatus
      setTasks([ ...tasks.slice( 0, targetTaskIdx ), targetTask, ...tasks.slice( targetTaskIdx + 1 ) ])
      console.log( `updated`, targetTask )
    },
  }

  return (
    <DragAndDropBoard {...props} />
  )
}
