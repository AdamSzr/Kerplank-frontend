
import { ChatPost } from "../models/ChatPost"
import { BaseResponse } from "../models/BaseResponse"
import { Endpoints } from "../config"
import { ax } from "./ax"


const downloadChatPosts = () => {
  return ax<{posts: ChatPost[]} & BaseResponse>(Endpoints[ `chat.create` ], `GET`)
}

export default downloadChatPosts
