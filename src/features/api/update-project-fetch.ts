import { UpdateProjectRequest } from "../models/request/UpdateProjectRequest"
import { Project } from "../models/Project"
import { BaseResponse } from "../models/BaseResponse"
import { Endpoints } from "../config"
import { ax } from "./ax"

const updateProject = (projectId:string, updateProjectRequest:UpdateProjectRequest) => {
  const url = Endpoints[ `edit|delete.project` ].replace( `:projectId:`, projectId )

  return ax<{ project: Project } & BaseResponse>(url, `PUT`, updateProjectRequest)
}

export default updateProject
