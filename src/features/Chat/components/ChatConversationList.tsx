import { createUseStyles } from 'react-jss'
import { useContext } from 'react'
import { Box } from '@mui/system'
import { AddresseeType, AvailableChat, ChatContext } from '..'

export default function ChatConversationList() {

  const { availableChats, setSelectedChat } = useContext( ChatContext )

  const ConversationItem = ({ name, type }:AvailableChat) => {
    return (
      <Box onClick={() => setSelectedChat( name )}>
        {type == `group` ? `[G] - ` : `[U] - `} {name}
      </Box>
    )
  } 

  return (
    <Box width="25%" fontSize="20px" padding="5px" lineHeight="30px">
      <Box borderBottom="1px solid black">Twoje konwersacje</Box>
      <Box>
        {availableChats.map( it => <ConversationItem key={it.name + it.type} {...it} /> )}
      </Box>
    </Box>
  )
}


const useStyles = createUseStyles({
 
})
  
  
