import React, { useContext, useEffect, useState } from 'react'
import { Box, Button, Container, Switch, Typography } from '@mui/material'
import { ProjectViewContext } from '../ProjectsComponent'
import { formatDate } from '../../utils/DataFormater'
import { replaceItemInArray } from '../../utils/ArrayUtils'
import { Task } from '../../models/Task'
import { Project } from '../../models/Project'
import projectDelete from '../../api/delete-project-fetch'
import TaskEditComponent from './TaskEditComponent'

const TaskInstanceView = ({ setActiveView }:{setActiveView: (view:string) => void}) => {
  const ctx = useContext( ProjectViewContext )

  const [ task, setTask ] = useState<Task | undefined>()
  const [ editMode, setEditMode ] = useState( false )

  useEffect( () => {

    if (ctx.selectedTaskId && ctx.projectList) {
      const task = tryFindTask( ctx.selectedTaskId )
      if (!task)
        return

      console.log( task )
      setTask( task )
    }

  }, [ ctx.setSelectedTaskId ] )


  const tryFindTask = (taskId:string): Task | undefined => {
    if (ctx.projectList)
    {
      const project = tryFindProject( ctx.projectList, taskId )
      return project?.tasks.find( task => task.id == taskId )
    }
  }

  const tryFindProject = (projectList:Project[], taskId:string): Project | undefined => {
    const doesProjContainTask = (project:Project): boolean => {
      return project.tasks.some( task => task.id == taskId )
    }

    const project = projectList.find( it => doesProjContainTask( it ) )
    return project
  }


  const backToList = () => {
    ctx.setViewStage( `project-instance` )
    ctx.setSelectedTaskId( undefined )
  }

  const deleteTask = async() => {
    console.log({ ctx })
    if (!ctx.selectedProjectId || !task) return
    const response = await projectDelete( ctx.selectedProjectId, { taskId:task.id } )
    console.log( response )
    if (response.status == 200 && ctx.projectList) {
      console.log( `delete task success`, task.id )
      ctx.setProjectList( replaceItemInArray( ctx.projectList, response.data.project, item => item.id == ctx.selectedProjectId ) )
      ctx.setViewStage( `project-instance` )
      ctx.setSelectedTaskId( undefined )
    } else {
      console.log( `FAILED` )
    }
  }




  if (!task) { return <>Task is not available</> }

  return (
    <Box sx={{ marginTop:2 }}>
      <Box sx={{ display:`flex`, justifyContent:`right`, alignItems:`center` }}>
        {editMode ? `anuluj` : `edytuj`} <Switch color={editMode ? `error` : `success`} onChange={e => setEditMode( e.target.checked )} />
      </Box>
      {
        !editMode && <>
          <Container
            sx={
              {
                display: `flex`,
                flexDirection: `column`,
                alignItems: `center`,
              }
            }
          >
            <Box
              sx={
                {
                  border: 3,
                  borderRadius: 5,
                  borderColor: `warning.main`,
                  marginTop: 2,
                  padding: 2,
                  minWidth: 500,
                  display: `flex`,
                  flexDirection: `column`,
                  alignItems: `center`,
                }
              }
            >
              <Typography>
                <b>Tytuł:</b> {task.title}
              </Typography>
              <Typography>
                <b> Opis:</b> {task.description}
              </Typography>
              <Typography>
                <b> Przypisany do:</b> {task.assignedTo}
              </Typography>
              <Typography>
                <b> Status:</b> {task.status}
              </Typography>
              <Typography>
                <b> Data utworzenia zgłoszenia:</b> {task.dateTimeCreation}
              </Typography>
              <Typography>
                <b>Przewidywana data zakończenia:</b> {formatDate( task.dateTimeDelivery, true )}
              </Typography>
              <Box sx={{ marginTop:1, marginBottom:1 }}>
                <Button sx={{ marginRight:1 }} variant="contained" color="primary" onClick={backToList}> Wróć</Button>
                <Button variant="contained" color="error" onClick={deleteTask}> Usuń zadanie</Button>
              </Box>
            </Box>
          </Container>
        </>
      }
      {editMode && <TaskEditComponent task={task} setActiveView={setActiveView} />}
    </Box>
  )
}

export default TaskInstanceView
