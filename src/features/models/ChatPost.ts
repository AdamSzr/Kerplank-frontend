import { BaseResponse } from "./BaseResponse"

export type ChatPost = {
  id: string
  authorName: string
  addresseeName: string | null | undefined
  created: string
  content: string
  chatName: string | null | undefined
};

export type CharPostRequest = Pick<ChatPost,  'content' | 'addresseeName' | 'chatName' | 'authorName'>

export type ChatPostResponse = BaseResponse & {post: ChatPost}
