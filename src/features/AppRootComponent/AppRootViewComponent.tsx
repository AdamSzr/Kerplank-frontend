
import { createContext, Dispatch, SetStateAction, useState } from 'react'
import { Box, Divider } from '@mui/material'
import { HomePage, MenuTab } from '../Menu/menu-config'
import MenuComponent from '../Menu/MenuComponent'

export type HistoryNavFnType = () => void

export type PageContextType = {
  acctualPage: MenuTab
  setAcctualPage: Dispatch<SetStateAction<MenuTab>>
  history: HistoryNavFnType[]
  setHistory: Dispatch<SetStateAction<HistoryNavFnType[]>>
}

export const PageContext = createContext<PageContextType>({ acctualPage:HomePage, setAcctualPage:x => { console.log( x ) }, history:[] as any, setHistory:x => { console.log( x ) } })

const AppRootViewComponent = () => {

  const [ acctualPage, setAcctualPage ] = useState<MenuTab>( HomePage )
  const [ history, setHistory ] = useState<HistoryNavFnType[]>([])

  const contextValue = { acctualPage, setAcctualPage, history, setHistory } as PageContextType

  return (
    <PageContext.Provider value={contextValue}>
      <Box>
        <MenuComponent />
        <Divider />
        {acctualPage.view}
      </Box>
    </PageContext.Provider>

  )
}

export default AppRootViewComponent
