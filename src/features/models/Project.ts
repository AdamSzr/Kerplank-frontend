import { User } from "./User"
import { Task } from "./Task"


export type Project = {
  id: string
  title: string
  description: string
  dateTimeDelivery: string
  dateTimeCreation: string
  status: "ACTIVE" | "CLOSE"
  users: string[]
  files: string[]
  tasks: Task[]
  creator: string
}
