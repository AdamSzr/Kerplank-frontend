import { CreateTaskRequestBody } from "../models/request/CreateTaskRequest"
import { Project } from "../models/Project"
import { BaseResponse } from "../models/BaseResponse"
import { Endpoints } from "../config"
import { ax } from "./ax"


const createTaskFetch = (request:CreateTaskRequestBody) => {

  return ax<{ project: Project } & BaseResponse>(Endpoints[ `create.task` ], `POST`, request)
}

export default createTaskFetch
