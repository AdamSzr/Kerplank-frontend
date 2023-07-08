
import { DragEvent, useContext } from 'react'
import { DragAndDropContext } from '..'
import ElementCard from './ElementCard'


export type DropableColumProps = {
  name: string
}

export default function DropableColum({ name }:DropableColumProps) {

  const { groupedElements, onElementColumnChange, elementIdProducer } = useContext( DragAndDropContext )
  const innerElements = groupedElements[ name ]

  function allowDrop( ev:DragEvent<HTMLDivElement> ) {
    ev.preventDefault()
  }


  function drop( ev:DragEvent<HTMLDivElement> ) {
    ev.preventDefault()
    const dropIntoElement = ev.target as HTMLElement
    const dropedIntoAnotherDraggableElement = dropIntoElement.className.includes( `draggable` )
    const columnToAppend = dropedIntoAnotherDraggableElement ? dropIntoElement.parentElement : dropIntoElement
    console.log({  dropedIntoAnotherDraggableElement, columnToAppend, cn:dropIntoElement.className  })
    const elementId = ev.dataTransfer!.getData( `elementId` )

    if (!columnToAppend) {
      throw Error( `Element -> Column to append not found` )
    }

    onElementColumnChange( elementId, name )
    columnToAppend.appendChild( document.getElementById( elementId )! )

    // if (dropIntoAnotherDraggableElement)
    //   dropIntoElement.parentElement!.appendChild( document.getElementById( elementId )! )
    // else
    //   dropIntoElement.appendChild( document.getElementById( elementId )! )
  }

  return (
    <div className='container' id={name} style={{  backgroundColor:`#9e9e9e`, gap:`10px` }} onDrop={e => drop( e )} onDragOver={e => allowDrop( e )}>
      <div className='title' style={{ textAlign:`center` }}> {name}</div>
      {innerElements.map( (element, idx) => <ElementCard key={`element-${idx}`} element={element} /> )}
      {/* <p className="draggable" id="c1-item-1" draggable onDragStart={e => drag( e )}>1</p>
      <p className="draggable" id="c1-item-2" draggable onDragStart={e => drag( e )}>2</p> */}
    </div>
  )
}
