import React, { useContext, useEffect, useRef } from 'react'
import { Box, Typography, colors } from '@mui/material'
import { ChatPost } from '../../models/ChatPost'
import { userStorage } from '../../config'
import { ChatContext } from '..'

export default function ChatMessageList() {
  const { conversations, selectedChat } = useContext( ChatContext )
  const user = userStorage.tryGet()
  const listRef = useRef<HTMLDivElement>( null )
  
  const MessageItem = (item:ChatPost) => {
    console.log( item, user )

    return (
      <Box
        bgcolor={item.authorName == user?.nickname ? `#d8d7db` : `#f0f0f0`}
        lineHeight="20px"
        boxShadow="0px 0px 4px 0px black"
        padding="5px"
        borderRadius="10px"
        marginBottom="10px"
        textAlign={item.authorName == user?.nickname ? `left` : `right`}
      >
        {item.authorName == user?.nickname ? `> ` : ``} {item.content} {item.authorName != user?.nickname ? `< ` : ``}
      </Box>
    )
  }


  return (
    <div>
      <Typography>
      </Typography>
      <div style={{ padding:`25px`, maxHeight:`800px`, overflow:`auto` }} ref={listRef}>
        {selectedChat && conversations?.find( it => it.chatName == selectedChat )?.messageList.map( it => <MessageItem key={it.id} {...it} /> )}
      </div>


    </div>
  )
}
