import React, { createContext } from 'react'
import { Box } from '@mui/system'
import groupBy from '../utils/groupBy'
import DropableColumn from './components/DropableColum'



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
  onElementColumnChange?: (elementId:string, newColumnName:string) => void
  elementCardProducer: (element:T) => JSX.Element
}

export const DragAndDropContext = createContext<DragAndDropContexType<any>>( {} as DragAndDropContexType<any> )

export default function index<T>( props:DragAndDropProps<T> ) {

  const groupedElements = groupBy( props.elements, it => it[ props.groupBy ] as string )
  const columnsName  = Object.keys( groupedElements )

  const contextValue = { ...props, groupedElements, columnsName }
  console.log( contextValue )
  return (
    <Box>
      <DragAndDropContext.Provider value={contextValue}>
        <div className='board' style={{ display:`flex`, gap:`10px` }}>
          {columnsName.map( columnName => <DropableColumn key={columnName} name={columnName} /> )}
        </div>
      </DragAndDropContext.Provider>

    </Box>
  )
}
