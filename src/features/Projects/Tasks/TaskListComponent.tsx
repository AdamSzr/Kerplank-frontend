import { useContext, useEffect, useState } from 'react'
import { createTheme } from "@mui/material/styles"
import { Box, Button, ThemeProvider, Container, Typography } from '@mui/material'
import { ProjectViewContext } from '../ProjectsComponent'
import { Task, TaskStatus } from '../../models/Task'
import { userStorage } from '../../config'
import DragAndDropBoard, { DragAndDropProps } from '../../DragAndDropBoard'

const TaskListComponent = () => {

  const ctx = useContext( ProjectViewContext )

  const [ taskList, setTaskList ] = useState<Task[] | undefined>()
  const [ myTasksOnly, setMyTasksOnly ] = useState<boolean>( false )


  useEffect( () => {
    if (ctx.projectList) {
      const tasks = ctx.projectList.map( it => it.tasks ).flatMap( tasks => tasks )
      setTaskList( tasks )
    }
  }, [ ctx.projectList ] )

  if (!ctx.projectList)
    return <>Poczekaj</>

  console.log( taskList )

  const goToListView = () => {
    ctx.setViewStage( `project-list` )
  }

  const goToTaskInstanceView = (selectedTaskId:string) => {
    ctx.setViewStage( `task-instance` )
    ctx.setSelectedTaskId( selectedTaskId )
  }

  const createTaskItemView = (task:Task) => {
    return (
      <Box key={task.id}>
        {task.title}{` `}
        <Button sx={{}} variant="outlined" color="warning" onClick={() => goToTaskInstanceView( task.id )}> Szczegóły </Button>
      </Box>
    )
  }

  const getTaskList = () => {
    const user = userStorage.tryGet()

    if (myTasksOnly && user)
      return taskList?.filter( it => it.assignedTo == user.email )
    else
      return taskList
  }

  const theme = createTheme()

  useEffect( () => {
    // getProjectsList()
  }, [] )
  

  const props:DragAndDropProps<Task> = {
    elements: taskList ?? [],
    elementIdProducer: (element:Task) => element.id,
    elementCardProducer: (element:Task) => <Typography fontSize="10px"> {element.title}</Typography>,
    groupBy: `status`,
    onElementColumnChange: (elementId, newColumnName) => {
      console.log( getTaskList()?.find( it => it.id == elementId ) )
      console.log( `Task ${elementId} changed status to [${newColumnName}]`, elementId )
      if (!taskList) return
      const targetTaskIdx = taskList.findIndex( it => it.id == elementId )
      let targetTask = taskList[ targetTaskIdx ]
      targetTask.status = newColumnName as TaskStatus
      setTaskList([ ...taskList.slice( 0, targetTaskIdx ), targetTask, ...taskList.slice( targetTaskIdx + 1 ) ])
      console.log( `updated`, targetTask )
    },
  }

  return (

    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">

        <Box
          sx={
            {
              border: 3,
              borderRadius: 5,
              borderColor: `warning.main`,
              marginTop: 2,
              padding: 2,

            }
          }
        >
          <Box sx={
            {
              display: `flex`,
              flexDirection: `column`,
              alignItems: `center`,
              marginBottom: 2,
            }
          }
          >
            <Button sx={{ marginBottom:1 }} variant="contained" color="warning" onClick={goToListView}>Wróć do listy projektów</Button>
            <Button sx={{ marginBottom:1 }} variant="contained" color="warning" onClick={() => setMyTasksOnly( state => !state )}> Pokaż moje zadania </Button>
          </Box>

          <Typography fontWeight="bold">Lista zadań</Typography>
          <DragAndDropBoard {...props} />
          {getTaskList()?.map( task => createTaskItemView( task ) )}
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default TaskListComponent
