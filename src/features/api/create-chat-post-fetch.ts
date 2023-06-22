import { CharPostRequest, ChatPostResponse } from "../models/ChatPost"
import { Endpoints } from "../config"
import { ax } from "./ax"


const createChatPost = (request:CharPostRequest) => {
  console.log({ request })
  return ax<ChatPostResponse>( Endpoints[ `chat.create` ], `POST`, request )
}

export default createChatPost
