import { useState } from 'react'
// import FormData from 'form-data'

const getItems = count =>
  Array.from( { length:count }, (v, k) => k ).map( k => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }) )



const UploadingComponent = () => {
  const [ items, setItems ] = useState( getItems( 10 ) )
  const [ widgets, setWidgets ] = useState([ ])


  const handleOnDrag = (e, w) => {
    e.dataTransfer.setData( `widgetType`, w )
  }
  const handleOnDrop = e => {
    const widgetType = e.dataTransfer.getData( `widgetType` ) as string
    console.log( `widgetType`, widgetType )
    setWidgets([ ...widgets, widgetType ])
  }


  const handleDragOver = e => {
    e.preventDefault()
  }


  return (
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
        {widgets.map( (w, idx) => <div className='dropped-widget' key={idx}>{w}</div> )}
      </div>
    </div>
  )
}

export default UploadingComponent
