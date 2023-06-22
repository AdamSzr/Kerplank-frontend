export default function createQueryFrom( query:object ): string {
  let out = [] as string[]
  for (let [ k, v ] of Object.entries( query )) {
    if (v != undefined)
      out.push( k + `=` + v )
  }
  return out.length > 0 ? `?` + out.join( `&` ) : ``
}
