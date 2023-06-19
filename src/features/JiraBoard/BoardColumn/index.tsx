import React from 'react'
import { Title } from '@mui/icons-material'
import { Task } from '../../models/Task'
import BoardItem from './BoardItem'


export type BoardColumnProps = {
  title: string
  items: Task[]
}


export default function index({ items, title  }:BoardColumnProps) {
  return (
    <div className='container' id={`column-${title}`} style={{  backgroundColor:`#9e9e9e` }}>
      <div className='title' style={{ textAlign:`center` }}> {title}</div>
      {items.map( it => <BoardItem {...it} /> )}
    </div>
  )
}
