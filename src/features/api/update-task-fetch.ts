
import { UpdateProjectRequest } from "../models/request/UpdateProjectRequest"
import { User } from "../models/User"
import { Task } from "../models/Task"
import { Project } from "../models/Project"
import { Endpoints } from "../config"
import { customFetch } from "./custom-fetch"
import { ax } from "./ax"

export type UpdateTaskRequest = {
  title?: string
  description?: string
  assignedTo?: string
  dateTimeCreation?: string
  dateTimeDelivery?: string
  status?: "NEW" | "IN_PROGRESS" | "DONE"
}



const updateTask = (taskId:string, updateTaskRequest:UpdateTaskRequest) => {
  return ax<{project: Project}>( Endpoints[ `edit.task` ].replace( `:taskId:`, taskId ), `PUT`, updateTaskRequest )
}

export default updateTask
