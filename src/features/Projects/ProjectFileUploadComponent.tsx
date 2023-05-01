

import React, { useContext, useEffect, useRef, useState } from 'react'
import { Stack } from '@mui/system'
import { Box, Button, Container, Typography } from '@mui/material'
import { Project } from '../models/Project'
import { uploadMultipleFile } from '../api/upload-file-fetch'
import { ProjectViewContext } from './ProjectsComponent'

const ProjectFileUploadComponent:React.FC<{ project?: Project }> = ({ project }) => {
  const [ selectedFile, setSelectedFile ] = useState<File | null>(null)
  const [ dataForm, setDataForm ] = useState<FormData | null>(null)
  const ctx = useContext( ProjectViewContext )

  const inputRef = useRef<HTMLFormElement>()

  useEffect( () => {
    if (!dataForm) return
    dataForm!.getAll( `files` ).forEach( it => {
      console.log( (it as File).name )
    } )

  }, [ dataForm != null ] )


  function onUploadSuccess() {
    clearFormData()
  }

  const uploadClick:React.FormEventHandler<HTMLFormElement> = async function( event ) {
    event.preventDefault()

    if (!dataForm || !project) return

    console.log( `FormData items size --`, dataForm.getAll( `files` ).length )

    const uploadResponse = await uploadMultipleFile( dataForm, `/${project.id}` ) // .then( it => ({ ...it, proj:it.project }) )
    const { result } = uploadResponse
    const idx = ctx.projectList?.findIndex( it => it.id == project.id )!
    console.log({ uploadResponse })
    if (result != `ok` || idx < 0) {
      console.error( `Błąd przesyłania pliku` )
      return
    }
    const np:Project = { ...project, files:[ ...project.files, ...uploadResponse.items.map( it => it.path ) ] }
    console.log({ project, np })
    // console.log( project )

    const newProjList = [ ctx.projectList!.slice( 0, idx ), np, ctx.projectList!.slice( idx + 1 ) ]
    ctx.setProjectList( newProjList as Project[] )

    onUploadSuccess()
  }


  const handleFileChange = (e:unknown) => {
    console.log( `file added`, e )
    const dataForm = new FormData( inputRef.current )
    setDataForm( dataForm )
  }


  const ShowFiles = () => {
    dataForm!.getAll( `files` ).forEach( it => {
      console.log( (it as File).name )
    } )
    return <>{dataForm!.getAll( `files` ).filter( it => it instanceof File ).map( file => <Box>{(file as File).name}</Box> )}</>
  }

  const clearFormData = () => {
    inputRef.current?.reset()
    setDataForm( null )
  }


  console.log({ disabled:Boolean( !dataForm ) })

  return (
    <Container sx={
      {
        marginTop: 2,
        marginBottom: 2,
        display: `flex`,
        flexDirection: `column`,
        alignItems: `left`,
        minWidth: 700,
        border: 3,
        borderRadius: 5,
        borderColor: `primary.main`,
        padding: 2,
      }
    }
    >
      <Typography textAlign="center" sx={{ marginBottom:`30px` }}> {dataForm == null ? `Wybierz plik aby przesłać` : `Twoje pliki:`}</Typography>


      {
        dataForm != null &&
        <Stack textAlign="center">
          <ShowFiles />
        </Stack>
      }


      <Box display="flex" justifyContent="center">
        <form
          ref={inputRef as React.LegacyRef<HTMLFormElement>}
          onSubmit={uploadClick}
          method='post' encType="multipart/form-data"
        >
          <Box sx={{ display:dataForm != null ? `none` : `unset` }}>
            <input type="file" name="files" multiple onChange={e => { handleFileChange( e ) }} />
          </Box>



          <Box sx={{ marginTop:`40px`, display:`flex`, gap:`5px` }}>
            <Button
              fullWidth variant="contained" onClick={() => clearFormData}
            >Wyczyść</Button>
            <Button fullWidth disabled={Boolean( !dataForm )} color="secondary" variant="contained" type='submit'>Zapisz</Button>
          </Box>
        </form>
      </Box>
    </Container>
  )
}

export default ProjectFileUploadComponent

