

import axios, { AxiosResponse } from "axios"
import { CreateUserRequest } from "../models/request/CreateUserRequest"
import { UserMe } from "../models/UserMe"
import { BaseResponse } from "../models/BaseResponse"
import { backendUrlStorage, Endpoints, jwtTokenStorage } from "../config"
import { customFetch } from "./custom-fetch"
import { ax } from "./ax"




const deleteAccount = (nickname:string) => {
  const url = Endpoints[ `delete.user` ].replace( `:userId:`, nickname )
  return ax<BaseResponse>( url, `DELETE` )

}

export default deleteAccount
