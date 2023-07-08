import { it } from 'node:test'
import { createUseStyles } from 'react-jss'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { AxiosResponse } from 'axios'
import { Box, Button, Input, Typography, colors } from '@mui/material'
import createQueryFrom from '../utils/createQuery'
import { groupBy } from '../utils/ArrayUtils'
import getChatMessages from '../models/mocks/getChatMessages'
import { ChatPost, ChatPostResponse } from '../models/ChatPost'
import createChatPost from '../api/create-chat-post-fetch'
import ChatMessageList from './components/ChatMessageList'
import ChatInput from './components/ChatInput'
import ChatConversationList from './components/ChatConversationList'

const mockedChatMessages = getChatMessages()

export type ConnectToChatQuery = {
  chatId?: string
  addresseeName?: string
}
export type ChatType = "group" | "dm"
export type AddresseeType = {addresseeName: string; user: ChatType}

export type ChatConversations = {
  chatName: string
  type: ChatType
  messageList: ChatPost[]
}

export type AvailableChat = {name: string; type: ChatType}

export type ChatContextType = {
  messages: ChatPost[] | null
  sendMessage: ( message:string, toChat:string) => Promise<AxiosResponse<ChatPostResponse>>
  selectedChat: string | null
  setSelectedChat: (name:string) => void
  conversations: ChatConversations[]
  availableChats: AvailableChat[]
}


export const ChatContext = createContext<ChatContextType>( {} as ChatContextType )

export default function index() {
  const classes = useStyles()
  const [ messages, setMessages ] = useState<ChatPost[] | null>(null)
  const [ selectedChat, setSelectedChat ] = useState<string | null>(null)
  const [ conversations, setConversations ] = useState <ChatConversations[]>([])
  const [ availableChats, setAvailableChats ] = useState<{name: string; type: ChatType}[]>([ ])
  // const [ addresseeList, setAaddresseeList ] = useState<AddresseeType[]>([])

  const query:ConnectToChatQuery = {
    chatId: undefined,
    addresseeName: `test`,
  }

  useEffect( () => {
    if (messages) return
    const eventSource = new EventSource( `http://localhost:8080/api/chat` )
    console.log( `conecting to server` )
    eventSource.onmessage = event   => {
      const data = JSON.parse( event.data )
      // console.log( data )
      setMessages( it => [ ...it ?? [], data ] )
    }
    return () => {
      eventSource.close()
    }
  }, [] )

  useEffect( () => {
    if (!messages || messages.length <= 0) return

    let directMessages =  messages.filter( it => !it[ `chatName` ] )
      .map( it => ({ message:it, correspondent:it[ `authorName` ] == `adam` ? it[ `addresseeName` ] : it[ `authorName` ] }) )
      .sort( (a, b) => new Date( a.message.created ) < new Date( b.message.created ) ? 1 : -1 )
    directMessages = groupBy( directMessages, `correspondent` )
    const preparedDms:ChatConversations[] =  Object.entries( directMessages )
      .map( ([ chatName, messageList ])  => ({ chatName, type: `dm`, messageList: (messageList as any).map( (it:any) => {
        return { ...it.message }
      } ) }) )

    let groupMessages =  messages.filter( it => it[ `chatName` ] )
      .map( it => ({ message:it, chat:it[ `chatName` ] }) )
    groupMessages = groupBy( groupMessages, `chat` )
    const preparedGroupMess:ChatConversations[] = Object.entries( groupMessages )
      .map( ([ chatName, messageList ]) => ({ chatName, type:`group`, messageList:(messageList as any).map( (it:any) => it.message ) }) )

    const composedChats = [ ...preparedDms, ...preparedGroupMess ]

    setConversations( composedChats )
    setAvailableChats( composedChats.map( it => ({ name:it.chatName, type:it.type }) ) )

  }, [ messages ] )

  const sendMessage = (message:string, toChat:string) => {
    const targetChatIdx = availableChats.findIndex( it => it.name == toChat )
    if (targetChatIdx < 0) return console.error( `chat [${toChat}] not found` ) as any
    const targetChat = availableChats[ targetChatIdx ]!

    return createChatPost(
      targetChat.type == `group`
        ? { chatName:targetChat.name, content:message, addresseeName:undefined, authorName:`adam` }
        : { addresseeName:targetChat.name, content:message, chatName:undefined, authorName:`adam` },
    )
  }

  const contextValue:ChatContextType = {
    messages,
    sendMessage: sendMessage,
    selectedChat,
    setSelectedChat: (name:string) => setSelectedChat( name ),
    conversations,
    availableChats,
  }

  return (
    <div id="chat-component">
      <Typography display="block" textAlign="center" variant='h2'> Chat </Typography>
      {selectedChat && <Typography textAlign="center" variant='h4'>Rozmawiasz z: {selectedChat} </Typography>}
      <ChatContext.Provider value={contextValue}>
        <Box display="flex">
          <ChatConversationList />
          {
            selectedChat &&
            <Box width="100%">
              <ChatMessageList />
              <ChatInput />
            </Box>
          }
        </Box>
      </ChatContext.Provider>
    </div>
  )
}

const useStyles = createUseStyles({
  // chatComponent: {
  //   backgroundColor: `${colors.blueGrey[ 100 ]}`,
  //   color: `${colors.blue[ 900 ]}`,
  //   display: `flex`,
  // },
})

