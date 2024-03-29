import { useContext, useEffect, useState } from "react"
import { styled } from "@mui/material/styles"
import TableRow from "@mui/material/TableRow"
import TableHead from "@mui/material/TableHead"
import TableContainer from "@mui/material/TableContainer"
import TableCell, { tableCellClasses } from "@mui/material/TableCell"
import TableBody from "@mui/material/TableBody"
import Table from "@mui/material/Table"
import Paper from "@mui/material/Paper"

import Link from '@mui/material/Link'
import { Button, Typography } from "@mui/material"
import { Project } from "../models/Project"
import { userStorage } from "../config"
import { ProjectViewContext } from "./ProjectsComponent"

const ProjectListComponent = () => {

  const ctx = useContext( ProjectViewContext )
  const canCreateProjects = userStorage.tryGet()?.role == `MODERATOR`

  const [ projectsList, setProjectList ] = useState<undefined | Project[]>()

  useEffect( () => {
    setProjectList( ctx.projectList )
  }, [ ctx.projectList ],
  )

  const onProjectIdClick = (projectId:string) => {
    ctx.setSelectedProjectId( projectId )
    ctx.setViewStage( `project-instance` )
  }

  const onTaskClick = (projectId:string, taskId:string) => {
    ctx.setSelectedProjectId( projectId )
    ctx.setSelectedTaskId( taskId )
    ctx.setViewStage( `task-instance` )
  }

  const createFileLink = (path:string) => {
    return (<div key={path}>
      <Link href={path}>
        {path}
      </Link>
    </div>)
  }



  const createRow = (project:Project) => {
    console.log({ project })
    if (!project)
      return <></>

    return (<StyledTableRow key={`project-table-row-${project.id}`}>
      <StyledTableCell><Button variant="contained" color="success" onClick={() => { onProjectIdClick( project.id ) }}>{project.id?.substring( 0, 6 )}</Button></StyledTableCell>
      <StyledTableCell><Typography fontWeight="bold">{project.title}</Typography></StyledTableCell>
      <StyledTableCell>{project.creator}</StyledTableCell>
      <StyledTableCell>{project.dateTimeCreation}</StyledTableCell>
      <StyledTableCell><Typography fontWeight="bold">{project.status}</Typography></StyledTableCell>
      <StyledTableCell>
        {
          project.users.map( nickname => {
            return <Typography key={nickname}>{nickname.split( `@` )[ 0 ] ?? nickname}</Typography>
          } )
        }
      </StyledTableCell>
    </StyledTableRow>)
  }

  if (!projectsList)
    return <div>Ładowanie</div>


  const showTaskList = () => {
    ctx.setViewStage( `task-list` )
  }

  return (
    <Paper>
      <Button sx={{ margin:1 }} variant="contained" color="primary" onClick={() => { ctx.setViewStage( `project-create` ) }} disabled={!canCreateProjects}> Utwórz projekt</Button>
      <TableContainer component={Paper}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Tytuł</StyledTableCell>
              {/* <StyledTableCell>Opis</StyledTableCell> */}
              <StyledTableCell>Właściciel</StyledTableCell>
              <StyledTableCell>Data utworzenia</StyledTableCell>
              {/* <StyledTableCell>Data dostarczenia</StyledTableCell> */}
              <StyledTableCell>Status</StyledTableCell>
              {/* <StyledTableCell>Zadania</StyledTableCell> */}
              <StyledTableCell>Użytkownicy</StyledTableCell>
              {/* <StyledTableCell>Pliki</StyledTableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {projectsList.map( project => createRow( project ) )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

const StyledTableCell = styled( TableCell )(({ theme }) => ({
  [ `&.${tableCellClasses.head}` ]: {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.common.white,
    fontSize: 14,
    fontWeight: `bold`,
  },
  [ `&.${tableCellClasses.body}` ]: {
    fontSize: 14,
  },
}) )

const StyledTableRow = styled( TableRow )(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },

  '&:last-child td, &:last-child th': {
    border: 0,
  },
}) )

export default ProjectListComponent
