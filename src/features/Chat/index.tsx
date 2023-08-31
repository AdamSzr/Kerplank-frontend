import { createUseStyles } from 'react-jss'
import { createContext, useEffect, useState } from 'react'
import { AxiosResponse } from 'axios'
import { Box, Typography } from '@mui/material'
import createQueryFrom from '../utils/createQuery'
import { groupBy } from '../utils/ArrayUtils'
import { ChatPost, ChatPostResponse } from '../models/ChatPost'
import { backendUrlStorage, userStorage } from '../config'
import createChatPost from '../api/create-chat-post-fetch'
import NewMessageComponent from './components/NewMessageComponent'
import ChatMessageList from './components/ChatMessageList'
import ChatInput from './components/ChatInput'
import ChatConversationList from './components/ChatConversationList'

export type ConnectToChatQuery = {
  userName: string
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
  setChatView: (chatState:ChatViewStates) => void
  sendNewMessage: (message:string, to:string, type:ChatType) => Promise<AxiosResponse<ChatPostResponse>>
}

export type ChatViewStates = 'chat' | 'new-message'

export const ChatContext = createContext<ChatContextType>( {} as ChatContextType )

export default function index() {
  const classes = useStyles()
  const userName = userStorage.getOrThrow().nickname
  const [ messages, setMessages ] = useState<ChatPost[] | null>(null)
  const [ selectedChat, setSelectedChat ] = useState<string | null>(null)
  const [ conversations, setConversations ] = useState <ChatConversations[]>([])
  const [ availableChats, setAvailableChats ] = useState<{name: string; type: ChatType}[]>([ ])
  const [ view, setView ] = useState<ChatViewStates>( `chat` )
  
  // const [ addresseeList, setAaddresseeList ] = useState<AddresseeType[]>([])

  const query:ConnectToChatQuery = {
    userName,
    chatId: undefined,
    addresseeName: undefined,
  }

  useEffect( () => {
    if (messages) return
    const eventSource = new EventSource( `${backendUrlStorage.getOrThrow()}/api/chat` + createQueryFrom( query ) )
    console.log( `conecting to server` )
    eventSource.onmessage = event   => {
      const data = JSON.parse( event.data )
      setMessages( it => [ ...it ?? [], data ] )
    }
    return () => {
      eventSource.close()
    }
  }, [] )

  useEffect( () => {
    if (!messages || messages.length <= 0) return

    let directMessages =  messages.filter( it => !it[ `chatName` ] )
      .map( it => ({ message:it, correspondent:it[ `authorName` ] == userName ? it[ `addresseeName` ] : it[ `authorName` ] }) )
      .sort( (a, b) => new Date( a.message.created ) < new Date( b.message.created ) ? -1 : 1 )
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
    console.log( composedChats )
    setAvailableChats( composedChats.map( it => ({ name:it.chatName, type:it.type }) ) )

  }, [ messages ] )

  const sendMessage = (message:string, toChat:string) => {
    const targetChatIdx = availableChats.findIndex( it => it.name == toChat )
    if (targetChatIdx < 0) return console.error( `chat [${toChat}] not found` ) as any
    const targetChat = availableChats[ targetChatIdx ]!

    return createChatPost(
      targetChat.type == `group`
        ? { chatName:targetChat.name, content:message, addresseeName:undefined, authorName:userName }
        : { addresseeName:targetChat.name, content:message, chatName:undefined, authorName:userName },
    )
  }

  const sendNewMessage = (message:string, to:string, messType:ChatType) => {
    console.log( message, to, messType )
    return createChatPost(
      messType == `group`
        ? { chatName:to, content:message, addresseeName:undefined, authorName:userName }
        : { addresseeName:to, content:message, chatName:undefined, authorName:userName },
    )
  }

  const contextValue:ChatContextType = {
    messages,
    sendMessage: sendMessage,
    selectedChat,
    setSelectedChat: (name:string) => setSelectedChat( name ),
    conversations,
    availableChats,
    setChatView: state => setView( state ),
    sendNewMessage: (mess, to, type) => sendNewMessage( mess, to, type ),
  }

  return (
    <div id="chat-component">
      <Typography display="block" textAlign="center" variant='h2'> Chat </Typography>
      {selectedChat && <Typography textAlign="center" variant='h4'>Rozmawiasz z: {selectedChat} </Typography>}
      <ChatContext.Provider value={contextValue}>
        <Box display="flex">
          {view == `chat` && <ChatConversationList />}
         
          {
            selectedChat && view == `chat` &&
            <>
              <Box width="100%">
                <ChatMessageList />
                <ChatInput />
              </Box>
            </>
          }
          {view == `new-message` && <NewMessageComponent />}
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

