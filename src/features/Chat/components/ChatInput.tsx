import React, { useContext, useState } from 'react'
import { Button, Input } from '@mui/material'
import { ChatContext } from '..'

export default function ChatInput() {
  const [ messageText, setMessageText ] = useState<string>( `` )
  const { sendMessage, selectedChat } = useContext( ChatContext )

  const sendChatMessage = async() => {
    if (messageText == ``) return
    if (!selectedChat.name || !selectedChat.type) return


    
    const sendMessageResponse = await sendMessage( messageText, selectedChat )
      .then( it => it.data )

    if (sendMessageResponse.result != `ok`) {
      console.log( `Sending chat message fail` )
      return
    }
    setMessageText( `` )
  }

  return (
    <div>
      <Input value={messageText ?? ``} onChange={e => setMessageText( e.target.value )} />
      <Button onClick={() => sendChatMessage()}> Wyślij </Button>
    </div>
  )
}
