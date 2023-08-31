

import { CreateUserRequest } from "../models/request/CreateUserRequest"
import { Endpoints } from "../config"
import { customFetch } from "./custom-fetch"
import { ax } from "./ax"


const uploadFile = (directoryPath:string, files:File) => { // TODO set query param

  return ax( Endpoints[ `drive.path` ] + directoryPath, `POST`, { file:files } )
}

export default uploadFile
