import { error } from 'node:console'
import { useEffect, useState } from 'react'
import { groupBy } from '../utils/ArrayUtils'
import { Task } from '../models/Task'
import BoardColumn from './BoardColumn'


export type JiraBoardProps = {
  items: Task[]
  onTaskStateChange: (taskId:string, newState:string) => void
}

export default function index({ items, onTaskStateChange }:JiraBoardProps) {
  const [ oryginalElements, setOryginalElements ] = useState( items.slice( 10 ) )
  const [ groupedElements, setGroupedElements ] = useState<any>()

  useEffect( () => {
    const elementsGroupedByColumn = oryginalElements.reduce( function( r, a ) {
      r[ a.status ] = r[ a.status ] || []
      r[ a.status ].push( a )
      return r
    }, Object.create( null ) )
    
    const groupedElements = Object.entries( elementsGroupedByColumn )
    const sortedColumns = [
      groupedElements.find( it => it[ 0 ] == `NEW` ),
      groupedElements.find( it => it[ 0 ] == `IN_PROGRESS` ),
      groupedElements.find( it => it[ 0 ] == `DONE` ),
    ]
    console.log({ groupedElements })
    setGroupedElements( sortedColumns )
  }, [ oryginalElements ] )

  const taskStateChanged = (taskId:string, newState:string) => {
    const inArrayIdx = oryginalElements.findIndex( it => it.id == taskId )
    if (inArrayIdx < 0)
      throw Error( `task not found` )

    const task:Task = { ...oryginalElements[ inArrayIdx ], status:(newState as any) }
    const copiedArr = [ ...oryginalElements.slice( 0, inArrayIdx ), task, ...oryginalElements.slice( inArrayIdx + 1 ) ]
    console.log( inArrayIdx )
    console.log( copiedArr )

    // onTaskStateChange( taskId, newState )
    console.log()
  }

  if (!groupedElements) {
    return
  }

  return (
    <>
      <div className='board' style={{ display:`flex`, gap:`10px` }}>
        {
          groupedElements.map( ([ title, items ]:any, idx:number) => {
            return (<BoardColumn
              key={`board-${idx}`}
              onTaskStateChange={taskStateChanged}
              title={title} items={items}
            />)
          } )
        }
      </div>
    
    </>
  )
}
