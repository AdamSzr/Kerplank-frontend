import React, { createContext } from 'react'
import { Box } from '@mui/system'
import groupBy from '../utils/groupBy'
import DropableColum from './components/DropableColum'



export type DragAndDropProps<T> = {
  elements: T[]
  groupBy: keyof T
  elementIdProducer: (element:T) => string
  //   columnsNameProducer: (elements:T[]) => string[]
  onElementColumnChange: (element:string, newColumnName:string) => void
  elementCardProducer: (element:T) => JSX.Element
}

export type DragAndDropContexType<T> = {
  elements: T[]
  groupBy: keyof T
  groupedElements: Record<string, T[]>
  columnsName: string[]
  elementIdProducer: (element:T) => string
  onElementColumnChange: (elementId:string, newColumnName:string) => void
  elementCardProducer: (element:T) => JSX.Element
}

export const DragAndDropContext = createContext<DragAndDropContexType<any>>( {} as DragAndDropContexType<any> )

export default function index<T>( props:DragAndDropProps<T> ) {

  const groupedElements = groupBy( props.elements, it => it[ props.groupBy ] as string )
  const columnsName  = Object.keys( groupedElements )

  const contextValue = { ...props, groupedElements, columnsName }

  return (
    <Box>
      <DragAndDropContext.Provider value={contextValue}>
        <div className='board' style={{ display:`flex`, gap:`10px` }}>
          {columnsName.map( columnName => <DropableColum key={columnName} name={columnName} /> )}

          {/* <div className='container' id="drag-section-1" style={{  backgroundColor:`#9e9e9e` }} onDrop={e => drop( e )} onDragOver={e => allowDrop( e )}>
            <div className='title' style={{ textAlign:`center` }}> drag-section-1</div>
            <p className="draggable" id="c1-item-1" draggable onDragStart={e => drag( e )}>1</p>
            <p className="draggable" id="c1-item-2" draggable onDragStart={e => drag( e )}>2</p>
          </div>

          <div className='container' id="drag-section-2" style={{ backgroundColor:`#a67c7c` }} onDrop={e => drop( e )} onDragOver={e => allowDrop( e )}>
            <div className='title' style={{ textAlign:`center` }}> drag-section-2</div>
            <p className="draggable" id="c2-item-1" draggable onDragStart={e => drag( e )}>3</p>
            <p className="draggable" id="c2-item-2" draggable onDragStart={e => drag( e )}>4</p>
          </div>
          <div className='container' id="drag-section-3" style={{ backgroundColor:`#a67c7c` }} onDrop={e => drop( e )} onDragOver={e => allowDrop( e )}>
            <div className='title' style={{ textAlign:`center` }}> drag-section-3</div>
            <p className="draggable" id="c3-item-1" draggable onDragStart={e => drag( e )}>5</p>
            <p className="draggable" id="c3-item-2" draggable onDragStart={e => drag( e )}>6</p>
          </div> */}
        </div>
      </DragAndDropContext.Provider>

    </Box>
  )
}
