import { ViewIcon } from '@chakra-ui/icons';
import { IconButton, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure,Button ,Modal,Image,Text} from '@chakra-ui/react'
import React from 'react'
import { ChatState } from '../../Context/ChatProvider';
 
const ProfileModel = ({children}) => {
    const {isOpen ,onOpen,onClose  } = useDisclosure();
    const {user } = ChatState();
   
   
    
    
    return (
 <>
 
  {
  children    ?
  ( <span onClick={onOpen}>{children}</span> )
  :
   ( 
<IconButton bg={'orange'} display={{base : "flex"}} icon={<ViewIcon color={'#fff'} />} onClick={onOpen} >
</IconButton>



  )}

  
   
 
  <Modal isOpen={isOpen} onClose={onClose} size={'md'} >
  <ModalOverlay bg={'black'}/>
  <ModalContent  background={'linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%)'} marginTop={'150px'} h={'410px'} >
      <ModalHeader
      fontSize={'40px'}
      fontFamily={'Work sans'}
      display={'flex'}
      color={'#fff'}
      justifyContent={'center'}
      >
{user.name}
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody display={'flex'} alignItems={'center'} justifyContent={'space-between'} flexDir={'column'} >
<Image
borderRadius={'full'} 
boxSize='150px' 
cursor={'pointer'}
src={user.pic}
alt={user.name}
/>
<Text color={'#fff'}
fontSize={{base : "28px" , md:"30px"}}
mt={'20px'}
>
   {user.email}
   </Text>
      </ModalBody>
      <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={onClose}>Close</Button>
      </ModalFooter>
  </ModalContent>
</Modal>
 

 
</>

  ) }


 
 

export default ProfileModel
