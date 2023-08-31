import { AxiosResponse } from "axios"
import { User } from "../models/User"
import { BaseResponse } from "../models/BaseResponse"
import { DEV_MODE, Endpoints } from "../config"
import { customFetch } from "./custom-fetch"
import { ax } from "./ax"


export type PasswordResetRequest = {
  uuid: string
  password: string
}




export function passwordReset( request:PasswordResetRequest ) {
  return ax( Endpoints[ `password.reset` ], `POST`, request )
}

