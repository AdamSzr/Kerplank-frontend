import { CharPostRequest, ChatPost } from "../models/ChatPost"
import { BaseResponse } from "../models/BaseResponse"
import { Endpoints } from "../config"
import { ax } from "./ax"


const createChatPost = (request:CharPostRequest) => {
  return ax<{ post: ChatPost } & BaseResponse>(Endpoints[ `chat.create` ], `POST`, request)
}

export default createChatPost
