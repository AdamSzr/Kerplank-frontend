import { CSSProperties, DragEventHandler, useEffect, useState, DragEvent } from 'react'
// import FormData from 'form-data'

const getItems = (count:number, prefix = `item`) =>
  Array.from( { length:count }, (v, k) => k ).map( k => `${prefix} ${k}` )




const UploadingComponent = () => {


  function allowDrop( ev:DragEvent<HTMLDivElement> ) {
    ev.preventDefault()
  }
  
  function drag( ev:DragEvent<HTMLDivElement> ) {
    ev.dataTransfer!.setData( `text`, (ev.target as HTMLElement).id )
  }
  
  function drop( ev:DragEvent<HTMLDivElement> ) {
    const dropInElement = ev.target as HTMLElement
    ev.preventDefault()
    const dropInDraggable = dropInElement.className == `draggable`
    const data = ev.dataTransfer!.getData( `text` )
    if (dropInDraggable == true) {
      console.log( dropInElement.parentElement )
      dropInElement.parentElement!.appendChild( document.getElementById( data )! )
      return
    }
    (ev.target as HTMLElement).appendChild( document.getElementById( data )! )
  }
  

  return (
    <>

      <div className='board' style={{ display:`flex`, gap:`10px` }}>
        <div className='container' id="drag-section-1" style={{  backgroundColor:`#9e9e9e` }} onDrop={e => drop( e )} onDragOver={e => allowDrop( e )}>
          <div className='title' style={{ textAlign:`center` }}> drag-section-1</div>
          <p className="draggable" id="c1-item-1" draggable onDragStart={e => drag( e )}>1</p>
          <p className="draggable" id="c1-item-2" draggable onDragStart={e => drag( e )}>2</p>
        </div>

        <div className='container' id="drag-section-2" style={{ backgroundColor:`#a67c7c` }} onDrop={e => drop( e )} onDragOver={e => allowDrop( e )}>
          <div className='title' style={{ textAlign:`center` }}> drag-section-2</div>
          <p className="draggable" id="c2-item-1" draggable onDragStart={e => drag( e )}>3</p>
          <p className="draggable" id="c2-item-2" draggable onDragStart={e => drag( e )}>4</p>
        </div>
      </div>

    </>
  )
}

export default UploadingComponent
