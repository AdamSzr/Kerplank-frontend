import axios, { isCancel, AxiosError } from 'axios'
import { backendUrlStorage, jwtTokenStorage } from "../config"



export function customFetch<T>( relativeUrl:string, method?:'GET' | 'POST' | 'PUT' | 'DELETE', body?:any, token?:string ): Promise<T> {
  throw Error( `Depricated` )
}
