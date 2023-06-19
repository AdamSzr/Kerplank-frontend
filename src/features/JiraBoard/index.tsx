import { useEffect, useState } from 'react'
import { groupBy } from '../utils/ArrayUtils'
import { Task } from '../models/Task'
import BoardColumn from './BoardColumn'


export type JiraBoardProps = {
  items: Task[]
  onTaskStateChange: (taskId:string, newState:string) => void
}

export default function index({ items, onTaskStateChange }:JiraBoardProps) {

  const elementsGroupedByColumn = items.reduce( function( r, a ) {
    r[ a.status ] = r[ a.status ] || []
    r[ a.status ].push( a )
    return r
  }, Object.create( null ) )

  const [ grouped, setGrouped ] = useState( Object.entries( elementsGroupedByColumn ) )


  const getDragAfterElement = (container:Element, y:number) => {
    const draggableElemenets = Array.from( container.querySelectorAll( `.draggable:not(.dragging)` ) )
    return draggableElemenets.reduce( (closest:any, child) => {
      const box = child.getBoundingClientRect()
      const offset = y - box.top - box.height / 2
      if (offset < 0 && offset > closest.offset)
        return { offset:offset, element:child }

      return closest
    }, { offset:Number.NEGATIVE_INFINITY, element:undefined } ).element
  }

  useEffect( () => {
    if (!window) return

    // const draggableElemenets = document.querySelectorAll( `.draggable` )
    // const containers = document.querySelectorAll( `.container` )

    // draggableElemenets.forEach( draggable => {

    //   draggable.addEventListener( `dragstart`, e => {
    //     draggable.classList.add( `dragging` )
    //   } )

    //   draggable.addEventListener( `dragend`, e => {
    //     draggable.classList.remove( `dragging` )
    //   } )

    // } )

    // containers.forEach( container => {
    //   container.addEventListener( `drop`, (e:any) => {
    //     // e.preventDefault()
    //     e.stopImmediatePropagation()
        
    //     const taskId = e.target?.id.split( `-` ).at( 1 )
    //     const newState = container.attributes.getNamedItem( `id` )?.value.split( `-` ).at( 1 )!
    //     console.log({ taskId, newState, eTarget:e.target, container })
    //     // onTaskStateChange( taskId, newState )
    //   } )

    //   container.addEventListener( `dragover`, e => {
    //     e.preventDefault()
    //     const afterElement = getDragAfterElement( container, (e  as MouseEvent).clientY )
    //     const draggable = document.querySelector( `.dragging` )!
    //     if (!afterElement) {
    //       container.appendChild( draggable! )
    //     } else {
    //       container.insertBefore( draggable, afterElement )
    //     }
    //   } )

    // } )
  }, [] )
    
  return (
    <>
      <div className='board' style={{ display:`flex`, gap:`10px` }}>
        {
          grouped.map( ([ title, items ]:any) => {
            return (<BoardColumn
              title={title} items={items}
            />)
          } )
        }

        {/* <div className='container' style={{  backgroundColor:`#9e9e9e` }}>
          <div className='title' style={{ textAlign:`center` }}> drag-section-1</div>
          <p className="draggable" draggable>1</p>
          <p className="draggable" draggable>2</p>
        </div>
    
        <div className='container' style={{ backgroundColor:`#a67c7c` }}>
          <div className='title' style={{ textAlign:`center` }}> drag-section-2</div>
          <p className="draggable" draggable>3</p>
          <p className="draggable" draggable>4</p>
        </div> */}
      </div>
    
    </>
  )
}
