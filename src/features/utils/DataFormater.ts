export function formatDate( date:string, userFrendly?:boolean ): string {
  let tmpDate = new Date( date )
  if (userFrendly) return tmpDate.toLocaleString()

  return tmpDate.getHours() + `:` +
        tmpDate.getMinutes() + ` ` +
        tmpDate.getDate() + `-` +
        tmpDate.getMonth()  + `-` +
        tmpDate.getFullYear()
}



export default 1
