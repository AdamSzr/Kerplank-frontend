import { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import { Box, Button, Container, Divider,  Grid,  Typography } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import DashboardIcon from '@mui/icons-material/Dashboard'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { replaceItemInArray } from '../utils/ArrayUtils'
import { Task, TaskStatus } from '../models/Task'
import { Project } from '../models/Project'
import { backendUrlStorage } from '../config'
import updateTask from '../api/update-task-fetch'
import projectDelete from '../api/delete-project-fetch'
import DragAndDropBoard, { DragAndDropProps } from '../DragAndDropBoard'
import TaskBoardElement from './Tasks/TaskBoardElement'
import { ProjectViewContext } from './ProjectsComponent'
import ProjectFileUploadComponent from './ProjectFileUploadComponent'
import ProjectAddUserComponent from './ProjectAddUserComponent'



const ProjectInstanceComponent = () => {

  const ctx = useContext( ProjectViewContext )
  const [ project, setProject ] = useState<Project | undefined>()
  const [ activeView, setActiveView ] = useState<"project-details" | 'add-user' | 'upload-file' | 'file-list' | 'tasks-list'>(`tasks-list`)

  useEffect( () => {
    if (ctx.selectedProjectId) {
      const projectEntity = ctx.projectList?.find( project => project.id == ctx.selectedProjectId )
      if (projectEntity) {
        setProject( projectEntity )
      }
    }
  }, [ ctx.selectedProjectId, ctx.projectList ] )


  if (!ctx.selectedProjectId)
    return <Box> Ładowanie </Box>


  const deleteTask = async(projectId:string, taskId:string) => {
    if (!project) return

    const response = await projectDelete( projectId, { taskId } )
    console.log( response )
    if (response.status == 200 && ctx.projectList) {
      console.log( `delete task success`, taskId )
      console.log( replaceItemInArray( ctx.projectList, response.data.project, item => item.id == projectId ) )
      ctx.setProjectList([ ...replaceItemInArray( ctx.projectList, response.data.project, item => item.id == projectId ) ])
    } else {
      console.log( `FAILED` )
    }
  }

  const deleteProject = async() => {
    if (!project) return

    const response = await projectDelete( project.id )
    if (response.status == 200) {
      console.log( `delete project success`, project.id )

      const newProjectList = ctx.projectList?.filter( it => it.id != project.id ) ?? []
      console.log({ newProjectList })
      ctx.setViewStage( `project-list` )
      ctx.setProjectList( newProjectList )
      ctx.setSelectedProjectId( undefined )
    } else {
      console.log( `FAILED` )
      console.log({ response })
    }
  }

  const onBackClick = () => {
    ctx.setSelectedProjectId( undefined )
    ctx.setViewStage( `project-list` )
  }


  const onDeleteTaskClick = (task:Task) => {
    if (project)
      deleteTask( project.id, task.id )
  }

  // const taskItemComponent = (task:Task) => {
  //   return (<Box
  //     sx={
  //       {
  //         marginTop: 2,
  //         marginBottom: 2,
  //         display: `flex`,
  //         alignItems: `center`,
  //         minWidth: 700,
  //       }
  //     }
  //     key={task.id}
  //   >
  //     <Typography fontWeight="bold" sx={{ marginRight:1, minWidth:`50%` }}>{task.title}</Typography>
  //     <Button sx={{ marginRight:2 }} variant="contained" onClick={() => { ctx.setSelectedTaskId( task.id ); ctx.setViewStage( `task-instance` ) }}>Szczegóły</Button>
  //     <Button variant="contained" color="error" onClick={() => onDeleteTaskClick( task )}>Usuń zadanie</Button>
  //   </Box>)
  // }

  const ShowProjectInfo = () => {
    return (
      <Box sx={{ mt:2, mb:2, display:`flex`, flexDirection:`column`, alignItems:`left`, minWidth:800 }}>
        <Typography fontSize="16px"> Autor: {project?.creator}</Typography>
        <Typography fontSize="16px"> Opis: {project?.description}</Typography>
        <Typography fontSize="16px"> Status: {project?.status}</Typography>
        <Typography fontSize="16px"> Data uwtorzenia: {project?.dateTimeCreation}</Typography>
        <Typography fontSize="16px"> Data dostarczenia: {project?.dateTimeDelivery}</Typography>
        <Typography fontSize="16px"> Użytkownicy: {project?.users.join( `, ` )}</Typography>

        <Divider />
        <Button sx={{ marginRight:0 }} variant="contained" color="error" onClick={deleteProject}>
          Usuń projekt
        </Button>
      </Box>
    )
  }

  const goToTaskInstanceView = (selectedTaskId:string) => {
    ctx.setViewStage( `task-instance` )
    ctx.setSelectedTaskId( selectedTaskId )
  }


  const updateTaskStatus = (taskId:string, newStatus:TaskStatus) => {
    return updateTask( taskId, { status:newStatus } )
  }

  const onElementClickHandle = (element:Task) => {
    console.log( `Clicked`, element )
    goToTaskInstanceView( element.id )
  }

  const setTaskList = (tasks:Task[]) => {
    if (!project) return console.log( `project is undefined` )

    const updatedProj = { ...project, tasks }
    setProject( updatedProj )
  }

  const onElementStateChange = (elementId:string, newColumnName:string) => {
    const taksk = project?.tasks.find( it => it.id == elementId )
    const newTaskStauts = newColumnName as TaskStatus
    if (!taksk) return console.log( `TaskId [${elementId}] not found` )
    if (taksk.status === newTaskStauts) return console.log( `Task has already status [${newTaskStauts}]` )

    updateTaskStatus( elementId, newColumnName as any ).then( response => {
      console.log( response )
      const taskIdxInResponse = response.data.project.tasks.findIndex( it => it.id == elementId )
      if (taskIdxInResponse < 0) return console.log( `update failed` )
      const updatedTask = response.data.project.tasks[ taskIdxInResponse ]

      console.log( `Task ${updatedTask.id} changed status to [${updatedTask.status}]`, updatedTask )
      const taskList = project?.tasks
      if (!taskList) return
      const targetTaskIdx = taskList.findIndex( it => it.id == elementId )
      let targetTask = taskList[ targetTaskIdx ]
      targetTask.status = updatedTask.status

      setTaskList([ ...taskList.slice( 0, targetTaskIdx ), targetTask, ...taskList.slice( targetTaskIdx + 1 ) ])
    } )
  }


  const props:DragAndDropProps<Task> = {
    elements: project?.tasks ?? [],
    elementIdProducer: (element:Task) => element.id,
    onElementClick: onElementClickHandle,
    elementCardProducer: (element:Task) => <TaskBoardElement task={element} />,
    groupBy: `status`,
    columns: [ `NEW`, `IN_PROGRESS`, `DONE` ],
    onElementColumnChange: onElementStateChange,
  }


  // const boardProps:DragAndDropProps<Task> = {
  //   elements: project?.tasks ?? [],

  // }

  const ShowTaskList = () => {
    return (
      <Box>
        <Box sx={{ marginBottom:2, marginLeft:2, alignItems:`center`, display:`flex` }}>

        </Box>
        <Box>
          <Typography fontWeight="bold">Lista zadań</Typography>
          <Divider />
          <DragAndDropBoard {...props} />

        </Box>
      </Box>
    )
  }

  const showBoard = () => {
    setActiveView( `tasks-list` )
  }

  const createTask = () => {
    ctx.setViewStage( `task-create` )
  }

  const onAddUsersClick = () => {
    setActiveView( `add-user` )
  }
  const onAddFileClick = () => {
    setActiveView( `upload-file` )
  }

  const showFiles = () => {
    setActiveView( `file-list` )
  }

  const cutPath = (path:string) => {
    const indexOfLastSlash = path.lastIndexOf( `/` )
    if (indexOfLastSlash < 0) return path
    console.log( path.slice( 0, indexOfLastSlash ) )
    return path.slice( indexOfLastSlash + 1 )
  }



  const FileListComponent = () => {
    return (<>
      <table>
        {
          project?.files.map( file => (<tr>
            <td>
              <div key={file}><Link href={`${backendUrlStorage.tryGet()}/api/drive/file?path=${file}`} download={true}>{cutPath( file )}</Link></div>
            </td>
          </tr>) )
        }
      </table>
    </>)
  }



  console.log({ activeView })

  return (
    <Container
      sx={
        {
          marginTop: 2,
          marginBottom: 2,
          display: `flex`,
          flexDirection: `column`,
          alignItems: `center`,
          padding: 2,
        }
      }
    >
      <Typography fontSize="30px"> Projekt: {project?.title} </Typography>

      {/* // Informacje.  */}

      <Grid container spacing={2}>
        <Grid item xs={4} display='grid' gap={2}>

          <Button startIcon={<ArrowBackIcon />} sx={{ marginRight:0, marginBottom:`30px` }} variant="contained" color="warning" onClick={onBackClick}>Wróć do listy projektów </Button>
          <Button sx={{ marginRight:0 }} variant="contained" color="success" onClick={showBoard} endIcon={<DashboardIcon />}>
            tablica
          </Button>
          <Button sx={{ marginRight:0 }} variant="contained" color="success" onClick={createTask} endIcon={<AddCircleIcon />}>
            utworz zadanie
          </Button>
          <Button sx={{ marginRight:0 }} variant="contained" color="primary" onClick={onAddUsersClick} endIcon={<AccountCircleIcon />}>
            dodaj/usun użytkowników
          </Button>
          <Button sx={{ marginRight:0 }} variant="contained" color="primary" onClick={onAddFileClick} endIcon={<CloudUploadIcon />}>
            dodaj plik
          </Button>
          <Button sx={{ marginRight:0 }} onClick={showFiles} variant="contained" color="primary" endIcon={<InsertDriveFileIcon />}>Pokaż pliki </Button>
          <Button sx={{ marginRight:0 }} variant="contained" color="primary" onClick={() => setActiveView( `project-details` )} endIcon={<SettingsIcon />}>
            Informacje i ustawienia
          </Button>
        </Grid>

        <Grid item xs={8}>
          {activeView == `tasks-list` && <ShowTaskList />}
          {activeView == `project-details` && <ShowProjectInfo />}
          {activeView == `upload-file` ? <ProjectFileUploadComponent project={project} /> : ``}
          {activeView == `add-user` ? <ProjectAddUserComponent project={project} /> : ``}
          {activeView == `file-list` ? <FileListComponent /> : ``}
        </Grid>
      </Grid>
    </Container>

  )
}

export default ProjectInstanceComponent
