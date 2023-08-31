import { User } from "../User"
import { BaseResponse } from "../BaseResponse"

export type CreateUserRequest = {
  nickname: string
  password: string
  email: string
}

export type CreateUserResponse = {
  user: User

} & BaseResponse
