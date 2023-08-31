import { User } from "../models/User"
import { BaseResponse, ListResponse } from "../models/BaseResponse"
import { Endpoints } from "../config"
import { ax } from "./ax"


export type UserListResponse = ListResponse<User> & BaseResponse




const downloadUsers = () => {

  return ax<UserListResponse>( Endpoints[ `users.all` ] )
}


export default downloadUsers
