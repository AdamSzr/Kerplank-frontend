import { createUseStyles } from 'react-jss'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { AxiosResponse } from 'axios'
import { Button, Input, Typography, colors } from '@mui/material'
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
export type ChatType = "group" | "private"
export type SelectedChat = { name: string; type: ChatType}
export type AddresseeType = {addresseeName: string; user: ChatType}
export type ChatContextType = {
  messages: ChatPost[]
  sendMessage: ( message:string, chat:SelectedChat) => Promise<AxiosResponse<ChatPostResponse>>
  selectedChat: SelectedChat
  setSelectedChat: (name:string, type:ChatType) => void
  addresseeList: AddresseeType[]
  conversations: Record<string, ChatPost[]>
}

export const ChatContext = createContext<ChatContextType>( {} as ChatContextType )

export default function index() {
  const classes = useStyles()
  const [ messages, setMessages ] = useState<ChatPost[]>(mockedChatMessages)
  const [ selectedChat, setSelectedChat ] = useState<SelectedChat>( { } as SelectedChat )
  const [ conversations, setConversations ] = useState < Record<string, ChatPost[]>>({})
  const [ addresseeList, setAaddresseeList ] = useState<AddresseeType[]>([])

  const query:ConnectToChatQuery = {
    chatId: undefined,
    addresseeName: `test`,
  }



  useEffect( () => {
    let groupedMessages = groupBy( messages, `addresseeName` )
    const chatMessages = groupBy( groupedMessages.null, `chatName` )
    delete groupedMessages.null
    const conversations = { ...groupedMessages, ...chatMessages }
    console.log( conversations )
    const addresseeNames = [
      ...Object.keys( groupedMessages ).map( it => ({ addresseeName:it, user:`user` }) ),
      ...Object.keys( chatMessages ).map( it => ({ addresseeName:it, user:`group` }) ),
    ] as AddresseeType[]
    // Object.keys( conversations ).map( it => {
    //   const isPrivate = Boolean( conversations[ it ].addresseeName )
    //   return { addresseeName:it, user:isPrivate ? `group` : `private` }
    // } )
    setConversations( conversations )
    setAaddresseeList( addresseeNames )

  }, [ messages ] )

  const sendMessage = (message:string, chat:SelectedChat) => {
    return createChatPost(
      chat.type == `group`
        ? { chatName:chat.name, content:message, addresseeName:undefined, authorName:`adam` }
        : { addresseeName:chat.name, content:message, chatName:undefined, authorName:`adam` },
    )
  }

  //   useEffect( () => {
  //     const eventSource = new EventSource( `http://localhost:8080/api/chat` )
  //     console.log( `conecting to server` )
  //     eventSource.onmessage = event   => {
  //       const data = JSON.parse( event.data )
  //       console.log( data )
  //     }
  //     return () => {
  //       eventSource.close()
  //     }
  //   }, [] )

  const contextValue:ChatContextType = {
    messages,
    sendMessage: sendMessage,
    selectedChat,
    setSelectedChat: (name:string, type:ChatType) => setSelectedChat({ name, type }),
    conversations,
    addresseeList,
  }

  return (
    <div>
      <Typography display="block"> Chat </Typography>
      <Typography>Rozmawiasz z: {selectedChat.name} {selectedChat.type} </Typography>
      <ChatContext.Provider value={contextValue}>
        <ChatConversationList />
        <ChatMessageList />
        <ChatInput />
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

