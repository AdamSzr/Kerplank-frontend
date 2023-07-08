import { createHash } from 'crypto'
import React, { useContext } from 'react'
import { CSSProperties, DragEventHandler, useEffect, useState, DragEvent } from 'react'
import styled from '@emotion/styled'
import { DragAndDropContext } from '..'

export type ElementCardProps<T> = {
  element: T
}


export default function ElementCard<T>({ element }:ElementCardProps<T>) {

  const { elementCardProducer, elementIdProducer } = useContext( DragAndDropContext )

  function drag( ev:DragEvent<HTMLDivElement> ) {
    ev.dataTransfer!.setData( `elementId`, elementIdProducer( element ) )
  }

  // console.log( createHash( `sha256` ).update( JSON.stringify( element ) ).digest( `hex` ) )
  // <p className="draggable" id="c1-item-2" draggable onDragStart={e => drag( e )}>2</p>
  return (
    <CardElement className='draggable' id={elementIdProducer( element )} draggable onDragStart={e => drag( e )}>
      {elementCardProducer( element )}
    </CardElement>
  )
}


// eslint-disable-next-line spaces/space-in-calls
const CardElement = styled( `div` )({
  '& *': {
    pointerEvents: `none`,
  },
})
