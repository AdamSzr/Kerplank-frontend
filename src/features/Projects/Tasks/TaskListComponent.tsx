import { useContext, useEffect, useState } from 'react'
import { createTheme } from "@mui/material/styles"
import { Box, Button, ThemeProvider, Container, Typography } from '@mui/material'
import { ProjectViewContext } from '../ProjectsComponent'
import { Task, TaskStatus } from '../../models/Task'
import { userStorage } from '../../config'
import updateTask from '../../api/update-task-fetch'
import DragAndDropBoard, { DragAndDropProps } from '../../DragAndDropBoard'
import { PageContext } from '../../AppRootComponent/AppRootViewComponent'

const TaskListComponent = () => {

  const ctx = useContext( ProjectViewContext )
  const appCtx = useContext( PageContext )

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

  const goToListView = () => {
    appCtx.setHistory( i => [ ...i, () => ctx.setViewStage( `project-list` ) ] )
    ctx.setViewStage( `project-list` )
  }
  console.log( appCtx.history )

  const goToTaskInstanceView = (selectedTaskId:string) => {
    ctx.setViewStage( `task-instance` )
    ctx.setSelectedTaskId( selectedTaskId )
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
  

  const updateTaskStatus = (taskId:string, newStatus:TaskStatus) => {
    return updateTask( taskId, { status:newStatus } )
  }

  const onElementClickHandle = (element:Task) => {
    console.log( `Clicked`, element )
    goToTaskInstanceView( element.id )
  }

  const onElementStateChange = (elementId:string, newColumnName:string) => {
    updateTaskStatus( elementId, newColumnName as any ).then( response => {
      console.log( response )
      const taskIdxInResponse = response.data.project.tasks.findIndex( it => it.id == elementId )
      if (taskIdxInResponse < 0) return console.log( `update failed` )
      const updatedTask = response.data.project.tasks[ taskIdxInResponse ]

      console.log( `Task ${updatedTask.id} changed status to [${updatedTask.status}]`, updatedTask )
      if (!taskList) return
      const targetTaskIdx = taskList.findIndex( it => it.id == elementId )
      let targetTask = taskList[ targetTaskIdx ]
      targetTask.status = updatedTask.status
      setTaskList([ ...taskList.slice( 0, targetTaskIdx ), targetTask, ...taskList.slice( targetTaskIdx + 1 ) ])
    } )
  }


  const props:DragAndDropProps<Task> = {
    elements: taskList ?? [],
    elementIdProducer: (element:Task) => element.id,
    onElementClick: onElementClickHandle,
    elementCardProducer: (element:Task) => <Typography fontSize="10px"> {element.title}</Typography>,
    groupBy: `status`,
    columns: [ `NEW`, `IN_PROGRESS`, `DONE` ],
    onElementColumnChange: onElementStateChange
    },
  }

  return (

    <ThemeProvider theme={theme}>
      <Container component="main">

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
          <Button onClick={() => console.log( appCtx.history[ 0 ]() )}>back</Button>
          {/* {getTaskList()?.map( task => createTaskItemView( task ) )} */}
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default TaskListComponent
