import { createUseStyles } from 'react-jss'
import { useContext } from 'react'
import { AddresseeType, ChatContext } from '..'

export default function ChatConversationList() {

  const { addresseeList, setSelectedChat } = useContext( ChatContext )

  const ConversationItem = (item:AddresseeType) => {
    return (
      <div onClick={() => setSelectedChat( item.addresseeName, item.user )}>
        {item.user == `group` ? `[G] - ` : `[U] - `} {item.addresseeName}
      </div>
    )
  }

  return (
    <div>
      <div>Twoje konwersacje</div>
      <div>
        {addresseeList.map( it => <ConversationItem {...it} /> )}
      </div>
    </div>
  )
}


const useStyles = createUseStyles({
 
})
  
  
