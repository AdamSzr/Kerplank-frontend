
import { DragEvent, useContext } from 'react'
import { DragAndDropContext } from '..'
import ElementCard from './ElementCard'


export type DropableColumProps = {
  name: string
}

export default function DropableColumn({ name }:DropableColumProps) {

  const { groupedElements, onElementColumnChange } = useContext( DragAndDropContext )
  const innerElements = groupedElements[ name ]

  function allowDrop( ev:DragEvent<HTMLDivElement> ) {
    ev.preventDefault()
  }


  function drop( ev:DragEvent<HTMLDivElement> ) {
    ev.preventDefault()
    const dropIntoElement = ev.target as HTMLElement
    const dropedIntoAnotherDraggableElement = dropIntoElement.className.includes( `draggable` ) && !dropIntoElement.className.includes( `board-column` )
    const columnToAppend = dropedIntoAnotherDraggableElement ? dropIntoElement.parentElement : dropIntoElement
    const elementId = ev.dataTransfer!.getData( `elementId` )
    
    if (!elementId) {
      return console.warn( `Cannot drag element with id=[${elementId}]. This element not exists in HTML-document.` )
    }
    if (!columnToAppend) throw Error( `Element -> Column to append not found` )

    onElementColumnChange( elementId, name )
    columnToAppend.appendChild( document.getElementById( elementId )! )
  }

  return (
    <div className='board-column' id={name} style={{  backgroundColor:`#9e9e9e`, gap:`10px` }} onDrop={e => drop( e )} onDragOver={e => allowDrop( e )}>
      <div className='title' style={{ textAlign:`center` }}> {name}</div>
      {innerElements.map( (element, idx) => <ElementCard key={`element-${idx}`} element={element} /> )}
    </div>
  )
}
