

import { CreateUserRequest } from "../models/request/CreateUserRequest"
import { Endpoints } from "../config"
import { customFetch } from "./custom-fetch"
import { ax } from "./ax"


const downloadFile = (directoryPath:string) => { // TODO set query param

   
  return ax( Endpoints[ `drive.file` ] )
}

export default downloadFile
