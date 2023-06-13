import { DragEventHandler, useState } from 'react'
// import FormData from 'form-data'

const getItems = (count:number, prefix = `item`) =>
  Array.from( { length:count }, (v, k) => k ).map( k => `${prefix} ${k}` )


export type DragRowProps = {name: string; defaultElements?: string[]}

const DragRow = (props:DragRowProps) => {
  const { defaultElements, name } = props
  const [ widgets, setWidgets ] = useState<string[]>(defaultElements ?? [])

  const handleOnDrag:DragEventHandler = (event, type) => {
    if (!event.dataTransfer) return

    console.log( `handleOnDrag` )
    event.dataTransfer.setData( `widgetType`, type )
  }

  const handleOnDrop:DragEventHandler<HTMLDivElement> = e => {
    console.log( `drag-drop` )
    const widgetType = e.dataTransfer.getData( `widgetType` ) as string
    console.log( `widgetType`, widgetType )
    setWidgets([ ...widgets, widgetType ])
  }

  const handleDragOver:DragEventHandler<HTMLDivElement> = e => {
    console.log( `drag-over` )
    e.preventDefault()
  }

  const handleDragLeave = e => {
    const type =  e.dataTransfer.getData( `widgetType` ) as string
    console.log({ e, type })
  }

  const DragElement = ({ content }:{content: string}) => {
    return <div className='widget' draggable onDragStart={e => handleOnDrag( e, `widget-${name}` )}>{content}</div>
  }

  return (
    <div className='widgets'>
      {/* <div className='widget' draggable onDragStart={e => handleOnDrag( e, `widget-a` )}>
        widget a
      </div>
      <div className='widget' draggable onDragStart={e => handleOnDrag( e, `widget-b` )}>
        widget b
      </div>
      <div className='widget' draggable onDragStart={e => handleOnDrag( e, `widget-c` )}>
        widget c
      </div> */}
      <div className='page' onDrop={handleOnDrop} onDragOver={handleDragOver} onDragExit={() => console.log( `exit` )} onDragLeave={handleDragLeave} style={{ width:100, height:100, background:`red` }}>
        {widgets.map( (w, idx) => <DragElement key={idx} content={w} /> )}
      </div>
    </div>
  )
}


type DragEventHandler = (event:unknown, type:string) => void

const UploadingComponent = () => {


  // const [ widgets, setWidgets ] = useState<string[]>([])
  // const [ widgets1, setWidgets1 ] = useState<string[]>([])
  // const handleOnDrag:DragEventHandler = (event, type) => {
  //   if (!event.dataTransfer) return
  //   event.dataTransfer.setData( `widgetType`, type )
  // }

  // const handleOnDrop:DragEventHandler<HTMLDivElement> = e => {
  //   console.log( `drag-drop` )
  //   const widgetType = e.dataTransfer.getData( `widgetType` ) as string
  //   console.log( `widgetType`, widgetType )
  //   setWidgets([ ...widgets, widgetType ])
  // }

  // const handleDragOver:DragEventHandler<HTMLDivElement> = e => {
  //   console.log( `drag-over` )
  //   e.preventDefault()
  // }


  return (
    <>

      <DragRow name="row1-" defaultElements={getItems( 3, `row1 -> ` )} />
      <DragRow name="row2-" defaultElements={getItems( 3, `row2 -> ` )} />
      {/* <div className='widgets'>
        <div className='widget' draggable onDragStart={e => handleOnDrag( e, `widget-a` )}>
          widget a
        </div>
        <div className='widget' draggable onDragStart={e => handleOnDrag( e, `widget-b` )}>
          widget b
        </div>
        <div className='widget' draggable onDragStart={e => handleOnDrag( e, `widget-c` )}>
          widget c
        </div>
        <div className='page' onDrop={handleOnDrop} onDragOver={handleDragOver} onDragLeave={e => console.log( `dragExit`, e )} style={{ width:100, height:100, background:`red` }}>
          {widgets.map( (w, idx) => <div className='dropped-widget' draggable key={idx}>{w}</div> )}
        </div>
      </div>

      <div className='widgets'>
        <div className='widget' draggable onDragStart={e => handleOnDrag( e, `widget-a` )}>
          widget a
        </div>
        <div className='widget' draggable onDragStart={e => handleOnDrag( e, `widget-b` )}>
          widget b
        </div>
        <div className='widget' draggable onDragStart={e => handleOnDrag( e, `widget-c` )}>
          widget c
        </div>
        <div className='page' onDrop={handleOnDrop} onDragOver={handleDragOver} style={{ width:100, height:100, background:`red` }}>
          {widgets1.map( (w, idx) => <div className='dropped-widget' draggable key={idx}>{w}</div> )}
        </div>
      </div> */}
    </>
  )
}

export default UploadingComponent
