import { CreateProjectRequestBody } from "../models/request/CreateProjectRequest"
import { Project } from "../models/Project"
import { BaseResponse, ListResponse } from "../models/BaseResponse"
import { Endpoints } from "../config"
import { ax } from "./ax"



export type ProjectListResponse = ListResponse<Project> & BaseResponse

const getProjectsList = () => {
  return ax<ProjectListResponse>( Endpoints[ `my.project` ], `GET` )
}

export default getProjectsList
