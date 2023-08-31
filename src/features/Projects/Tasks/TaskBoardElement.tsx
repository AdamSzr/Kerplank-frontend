import React from 'react'
import { Box, Typography } from '@mui/material'
import { Task } from '../../models/Task'

export default function TaskBoardElement({ task }:{task: Task}) {
  return (
    <>
      <Typography fontSize="12.5px"> {task.title}</Typography>
      <Box sx={{ display:`flex`, justifyContent:`right` }}>
        <Typography fontSize="10px">
          {task.assignedTo?.split( `@` ).at( 0 ) ?? `*`}
        </Typography>
      </Box>
    </>
  )
}
