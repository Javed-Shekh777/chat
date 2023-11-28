import { Box} from '@chakra-ui/react';
import React, {   useState } from 'react'
 
import { ChatState } from '../Context/ChatProvider';
import SideDrawer from '../components/misclleneous/SideDrawer';
import MyChats from '../components/misclleneous/MyChats';
import ChatBox from '../components/misclleneous/ChatBox'
 

const ChatPage = () => {
  
 
const [fetchAgain,setFetchAgain] = useState();

  const {user} = ChatState();

  // console.log("Chat Page User: ",user);
 
  
  return (
    <>
    

    <div style={{width : '100%'}}>
      {user && <SideDrawer />}
     

      
      <Box display={'flex'} justifyContent={'space-between'} w={'100%'} h={'91.5vh'} p={'10px'}>
        {user && <MyChats fetchAgain={fetchAgain}   />} 
         {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}  />}
       </Box> 
    </div> 


    {/* <h1 style={{color : 'red'}}>Cht pahef eoeoegjorlf;l</h1> */}
 
     
    </>
   
  )
}

export default ChatPage
