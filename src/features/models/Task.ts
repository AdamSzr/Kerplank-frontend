
export type TaskStatus = "NEW" | "IN_PROGRESS" | "DONE"

export type Task = {
  "id": string
  "title": string
  "description": string
  "assignedTo"?: string
  "dateTimeCreation": string
  "dateTimeDelivery": string
  "status": TaskStatus
}
