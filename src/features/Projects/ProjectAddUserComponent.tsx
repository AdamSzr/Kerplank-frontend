import React, { useContext, useEffect, useState } from 'react'
import FormLabel from '@mui/material/FormLabel'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import Checkbox from '@mui/material/Checkbox'
import { Box, Button, ButtonGroup, Divider, Typography } from '@mui/material'
import { replaceItemInArray } from '../utils/ArrayUtils'
import { Project } from '../models/Project'
import downloadAllUsers from '../api/user-all-fetch'
import updateProject from '../api/update-project-fetch'
import { ProjectViewContext } from './ProjectsComponent'


const ProjectAddUserComponent:React.FC<{ project?: Project }> = ({ project }) => {

  const ctx = useContext( ProjectViewContext )
    
  if (!project) {
    <>Proszę czekać</>
  }

  const [ usersInProj, setUsersInProj ] = useState<string[]>()
  const [ allUsersList, setAllUsersList ] = useState<string[]>()

  const [ editState, setEditState ] = useState<boolean>( false )

  useEffect( () => {
    if (project) {
      setUsersInProj( project.users )
    }

  }, [ ctx.projectList, project ] )

  useEffect( () => {
    downloadAllUsers().then(
      response => {
        console.log( response )
        if (response.status == 200) {
          setAllUsersList( response.data.list.filter( it => it.email != project?.creator ).map( it => it.email ) )
        }
      },
    )
  }, [] )



  const onCheckedClicked = (e:React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.name
    if (usersInProj?.some( it => it == email )) {
      const newUserList = usersInProj.filter( it => it != email )
      setUsersInProj([ ...newUserList ])
    } else {
      setUsersInProj( list => [ ...list!, email ] )
    }

    console.log( e.target.name )
  }


  const onAddClick = async() => {
    if (!project || !ctx.projectList)
      return

    const response = await updateProject( project.id, { users:usersInProj } )
    console.log( response )
    if (response.status == 200) {
      console.log( `Users are added.` )
      ctx.setProjectList( replaceItemInArray( ctx.projectList, response.data.project, item => item.id == ctx.selectedProjectId ) )
    }
  }



  const generateCheckboxFor = (userEmail:string) => {
    return (<FormControlLabel
      key={userEmail}
      control={<Checkbox checked={usersInProj?.some( it => it == userEmail )} onChange={onCheckedClicked} name={userEmail} />}
      label={userEmail}
    />)

  }


  return (
    <Box
      sx={
        {
          border: 3,
          borderRadius: 5,
          borderColor: `primary.main`,
          padding: 2,
        }
      }
    >
      <Box>
        
        {
          editState ? <></> : <Box>
            <Typography sx={{ marginTop:1, marginBottom:1 }} fontWeight="bold">Aktualnie w projekcie są</Typography>

            {usersInProj?.join( ` | ` )}
            <br />
            <Button onClick={() => setEditState( it => !it )} variant='contained'> edytuj</Button>
          </Box>
        }

        {
          editState ?
            <>
              <Typography fontWeight="Bold">
                Lista użytkowników
              </Typography>

              <FormControl sx={{ m:1 }} component="fieldset" variant="standard">
                <FormLabel component="legend">Zaznacz aby dodać lub odznacz aby usunąć</FormLabel>
                <FormGroup>
                  {allUsersList?.map( email => generateCheckboxFor( email ) )}
                </FormGroup>

                <Button sx={{ marginTop:2 }} variant="contained" color="success" onClick={onAddClick}>
                  Zapisz
                </Button>
                <Button onClick={() => setEditState( it => !it )} variant='contained' color='error'> anuluj</Button>
              </FormControl>
   
            </> :
            <></>
        }
      </Box>
    </Box>
  )
}

export default ProjectAddUserComponent
