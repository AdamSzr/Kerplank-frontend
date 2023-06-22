// import FormData from 'form-data'

import { createUseStyles } from "react-jss"
import { useEffect } from "react"
import createQueryFrom from "../src/features/utils/createQuery"
import Chat, { ConnectToChatQuery } from "../src/features/Chat"



const UploadingComponent = () => {

  const query:ConnectToChatQuery = {
    chatId: `1`,
    // adresseId: undefined,
  }
  // console.log( createQueryFrom( query ) )
  

  // useEffect( () => {
  //   const eventSource = new EventSource( `http://localhost:8080/api/chat/` + createQueryFrom( query ) )
  //   console.log( `conecting to server` )
  //   eventSource.onmessage = event   => {
  //     const data = JSON.parse( event.data )
  //     console.log( data )
  //   }

  //   return () => {
  //     eventSource.close()
  //   }
  // }, [] )


  return (
    <>
      <Chat />

    </>
  )
}

export default UploadingComponent

