import { DragEvent, useContext } from 'react'
import styled from '@emotion/styled'
import { DragAndDropContext } from '..'

export type ElementCardProps<T> = {
  element: T
}

export default function ElementCard<T>({ element }:ElementCardProps<T>) {

  const { elementCardProducer, elementIdProducer, onElementClick } = useContext( DragAndDropContext )

  function drag( ev:DragEvent<HTMLDivElement> ) {
    ev.dataTransfer!.setData( `elementId`, elementIdProducer( element ) )
  }

  return (
    <CardElement className='draggable' id={elementIdProducer( element )} draggable onDragStart={e => drag( e )} onClick={() => onElementClick( element )}>
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
