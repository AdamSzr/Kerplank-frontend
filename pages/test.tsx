import { useEffect } from 'react'
import getTasks from '../src/features/models/mocks/getTasks'
import { Task } from '../src/features/models/Task'
import JiraBoard from '../src/features/JiraBoard'
// import FormData from 'form-data'



const UploadingComponent = () => {


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
    // if (!window) return

    // const draggableElemenets = document.querySelectorAll( `.draggable` )
    // const containers = document.querySelectorAll( `.container` )

    // draggableElemenets.forEach( draggable => {

    //   draggable.addEventListener( `dragstart`, () => {
    //     draggable.classList.add( `dragging` )
    //   } )

    //   draggable.addEventListener( `dragend`, () => {
    //     draggable.classList.remove( `dragging` )
    //   } )

    // } )

    // containers.forEach( container => {

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
      <JiraBoard onTaskStateChange={(task, state) => console.log({ task, state })} items={getTasks() as any} />

      {/* <div className='board' style={{ display:`flex`, gap:`10px` }}>
        <div className='container' style={{  backgroundColor:`#9e9e9e` }}>
          <div className='title' style={{ textAlign:`center` }}> drag-section-1</div>
          <p className="draggable" draggable>1</p>
          <p className="draggable" draggable>2</p>
        </div>

        <div className='container' style={{ backgroundColor:`#a67c7c` }}>
          <div className='title' style={{ textAlign:`center` }}> drag-section-2</div>
          <p className="draggable" draggable>3</p>
          <p className="draggable" draggable>4</p>
        </div>
      </div> */}

    </>
  )
}

export default UploadingComponent
