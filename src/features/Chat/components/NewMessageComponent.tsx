import React, { useContext, useEffect, useState } from 'react'
import { Box } from '@mui/system'
import { Button, FormControl, Input, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { userStorage } from '../../config'
import downloadAllUsers from '../../api/user-all-fetch'
import getProjectsList from '../../api/download-project-list'
import { ChatContext } from '..'

export default function NewMessageComponent() {
  const [ selectedPerson, setSelectedPerson ] = useState<string>( `` )
  const [ visibleRecipients, setVisibleRecipients ] = useState<string[]>([])
  const [ messageText, setMessageText ] = useState<string>( `` )
  const { sendNewMessage, setChatView, availableChats } = useContext( ChatContext )


  useEffect( () => {
    const acctualChats =  [ ...availableChats.map( it => it.name ), userStorage.getOrThrow().nickname ]

    const userNamesPromise =  downloadAllUsers().then( it => it.data.list.map( user => user.nickname ) )
    const projectNamesPromise =  getProjectsList().then( it => {
      return  it.data.list.map( project => project.title )
    } )
    Promise.all([ userNamesPromise, projectNamesPromise ])
      .then( ([ userNames, projectNames ]) => {
        console.log( userNames, projectNames )
        const availableNewChatsRespondents =    [ ...userNames, ...projectNames ].filter( name => !acctualChats.includes( name ) )
        setVisibleRecipients( availableNewChatsRespondents )
      } )
  }, [] )

  const sendChatMessage = async() => {
    if (messageText == `` || selectedPerson == ``) return
    const sendMessageResponse = await sendNewMessage( messageText, selectedPerson, `dm` )
      .then( it => it.data )

    if (sendMessageResponse.result != `ok`) {
      console.log( `Sending chat message fail` )
      return
    }

    setMessageText( `` )
    setChatView( `chat` )
  }


  return (
    <Box width="100%" display="flex" flexDirection="column" justifyContent="center" padding="30px" gap="10px">
      <Typography textAlign="center" variant='h4'>Tworzenie nowej wiadomości</Typography>
      <Box>
        <Button variant='contained' color='error' onClick={() => setChatView( `chat` )}> {`<--`} wróć</Button>
      </Box>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Wybierz odbiorcę</InputLabel>
        <Select value={selectedPerson} labelId='demo-simple-select-label' onChange={(e:any) => setSelectedPerson( e.target.value )}>
          {
            visibleRecipients.map( recipient => {
              return <MenuItem value={recipient ?? ``} key={recipient}>{recipient}</MenuItem>
            } )
          }
        </Select>

      </FormControl>
      <TextField placeholder='wiadomość' fullWidth style={{ height:`90px` }} onChange={e => setMessageText( e.target.value )} />
      <Button onClick={sendChatMessage} variant='contained'>wyslij</Button>
    </Box>
  )
}
