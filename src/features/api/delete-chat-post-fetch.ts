import { BaseResponse } from "../models/BaseResponse"
import { Endpoints } from "../config"
import { ax } from "./ax"


const deleteChatPost = (postId:string) => {
  const url = Endpoints[ `chat.delete` ].replace( `:postId:`, postId )
  return ax<BaseResponse>( url, `DELETE` )
}

export default deleteChatPost
