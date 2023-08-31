

import axios, { AxiosResponse } from "axios"
import { CreateUserRequest } from "../models/request/CreateUserRequest"
import { UserMe } from "../models/UserMe"
import { BaseResponse } from "../models/BaseResponse"
import { backendUrlStorage, Endpoints, jwtTokenStorage } from "../config"
import { customFetch } from "./custom-fetch"
import { ax } from "./ax"



export type WhoAmIResponse  = UserMe & BaseResponse

const whoAmI = () => {
  return ax<WhoAmIResponse>( Endpoints.userMe )
   
}

export default whoAmI
