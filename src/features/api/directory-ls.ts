

import { CreateUserRequest } from "../models/request/CreateUserRequest"
import { DirectoryItem } from "../models/DirectoryItem"
import { BaseResponse } from "../models/BaseResponse"
import { Endpoints } from "../config"
import { ax } from "./ax"



export type DirectoryItemListResponse = { items: DirectoryItem[] } & BaseResponse

const directoryLs = (path?:string) => {
  return ax<DirectoryItemListResponse>( Endpoints[ `drive.directory` ] + `?path=${path ?? `/`}` ) 
}

export default directoryLs
