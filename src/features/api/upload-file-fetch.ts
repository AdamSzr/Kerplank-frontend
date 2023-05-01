

import { Project } from "../models/Project"
import { DirectoryItem } from "../models/DirectoryItem"
import { BaseResponse } from "../models/BaseResponse"
import { backendUrlStorage, jwtTokenStorage } from "../config"


export type UploadMulitFileResponse = { items: DirectoryItem[] } & BaseResponse


export const uploadMultipleFile = async(formData:FormData, directory?:string): Promise<UploadMulitFileResponse> => { // TODO Change to typeof MultiPartData
  console.log( formData )
  const backendUrl = backendUrlStorage.getOrThrow()
  const jwt = jwtTokenStorage.tryGet()

  let url = `${backendUrl}/api/drive/upload/multi`
  if (directory) {
    url += `?directory=${directory}`
  }

  console.log( `Upload files to ${url}` )

  const response = await fetch( url, {
    method: `POST`,
    body: formData,
    headers: {
      "Authorization": `${jwt}`,
    },
  } )

  const data = await response.json() as Promise<UploadMulitFileResponse>
  console.log( data )

  return data
}

export default uploadMultipleFile
