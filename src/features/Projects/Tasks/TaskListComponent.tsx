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

  console.log({ history:appCtx.history })

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
          {/* <Button onClick={() => console.log( appCtx.history[ 0 ]() )}>back</Button> */}
          {/* {getTaskList()?.map( task => createTaskItemView( task ) )} */}
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default TaskListComponent
