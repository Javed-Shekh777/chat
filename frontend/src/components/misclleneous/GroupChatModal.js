import { Button, FormControl, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast, ModalCloseButton, Spinner, Box } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import { BASE_URL } from '../../config/helper';

const GroupChatModal = ({ children }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();

    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const { user, chats, setChats } = ChatState();


    const handleSearch = async (query) => {
        setSearch(query)
        if (!query) {
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`http://localhost:8080/api/user?search=${search}`, config
            );

          
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
            setLoading(false);

        }
    }


    const handleSubmit =async () => {
        if(!groupChatName || !selectedUsers){
            toast({
                title: "Please fill all the fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
            return;
        }

        try {
   
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post(`${BASE_URL}/api/chat/group`, {
                name : groupChatName,
                users : JSON.stringify(selectedUsers.map((u)=>u._id)),
            },config
            );
 
            setChats([...chats,data])
            
          onClose();
          toast({
            title: "New Group Chat Created!",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });
        } catch (error) {
            toast({
                title: "Failed to create group chat!",
                description: "Failed to Load the search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
            setLoading(false);

        }
    }

    const handleDelete = (delUser)=>{
         setSelectedUsers(selectedUsers.filter(sel =>  sel._id !== delUser._id));
    }


    const handleGroup = (userToAdd)=>{
        if(selectedUsers.includes(userToAdd)){
            toast({
                title: "User already added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return ;
        }
        setSelectedUsers([...selectedUsers,userToAdd]);
    }
    return (
        <>

            <span onClick={onOpen}>{children}</span>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader display={'flex'} justifyContent={'center'} fontSize={'35px'} fontFamily={'Work sans'}>
                        Create Group Chat
                    </ModalHeader>
                    < ModalCloseButton />
                    <ModalBody display={'flex'} flexDir={'column'} alignItems={'center'}>

                        <FormControl>

                            <Input placeholder='Chat Name' mb={3} onChange={(e) => { setGroupChatName(e.target.value) }} />
                        </FormControl>

                        <FormControl>
                            <Input placeholder='Add Users eg: John,Prem,Jane' mb={1} onChange={(e) => handleSearch(e.target.value)} />
                        </FormControl>
                        
                        <Box w={'100%'} display={'flex'} flexWrap={'wrap'}  >
                        {selectedUsers.map(u=>(
    <UserBadgeItem key={u._id} user={u}  handleFunction={()=>handleDelete(u)} />
))}
                        </Box>

{
    loading ?   <Spinner ml={'auto'} display={'flex'} /> :
    (
        searchResult?.slice(0,4).map((user)=>(
            <UserListItem key={user._id} handleFunction={()=>{handleGroup(user)}}  user={user}/>
        ))
    )
}

                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={handleSubmit}
                            colorScheme='blue' >Create Chat</Button>
                    </ModalFooter>
                </ModalContent>

            </Modal>

        </>
    )
}

export default GroupChatModal
