import React, { useContext } from 'react'
import { Typography } from '@mui/material'
import { ChatPost } from '../../models/ChatPost'
import { ChatContext } from '..'

export default function ChatMessageList() {
  const { conversations, selectedChat } = useContext( ChatContext )

  
  const MessageItem = (item:ChatPost) => {
    return (<div>
      Autor:  {item.authorName}
      Tekst: {item.content}
      Odbiorca: {item.addresseeName}
    </div>)
  }

  return (
    <div>
      <Typography>
        Twoje Wiadomości
      </Typography>
      <div>
        {selectedChat.name && conversations[ selectedChat.name ].map( it => <MessageItem {...it} /> )}
      </div>


    </div>
  )
}
