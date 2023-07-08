import React, { useContext, useState } from 'react'
import { Box, Button, Input } from '@mui/material'
import { ChatContext } from '..'

export default function ChatInput() {
  const [ messageText, setMessageText ] = useState<string>( `` )
  const { sendMessage, selectedChat } = useContext( ChatContext )

  const sendChatMessage = async() => {
    if (messageText == `` || !selectedChat) return
    
    const sendMessageResponse = await sendMessage( messageText, selectedChat )
      .then( it => it.data )

    if (sendMessageResponse.result != `ok`) {
      console.log( `Sending chat message fail` )
      return
    }
    setMessageText( `` )
  }

  return (
    <Box display="flex" gap="40px" paddingX="25px">
      <Input fullWidth value={messageText ?? ``} placeholder='wiadomość' onChange={e => setMessageText( e.target.value )} />
      <Button color='primary' variant='contained' onClick={() => sendChatMessage()}> Wyślij </Button>
    </Box>
  )
}
