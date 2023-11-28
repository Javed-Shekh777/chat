import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { Box, Button, Stack, useToast, Text, Avatar } from '@chakra-ui/react';
import '../style.css'

import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from '../ChatLoading';
import { getSender, getSenderImage } from '../../config/ChatLogics';
import GroupChatModal from './GroupChatModal';
import { BASE_URL } from '../../config/helper';

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, setSelectedChat, selectedChat, chats, setChats } = ChatState();
  const toast = useToast();


  
  const fetchChats = async () => {

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`${BASE_URL}/api/chat`, config);
     
      setChats(data);
    } catch (error) {
      toast({
        title: 'Error Occured!',
        description: 'Failed to load the chats',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });

    }
  };

  useEffect(() => {
    const us = JSON.parse(localStorage.getItem("userInfo"));

    setLoggedUser(us.data);
    fetchChats();
  }, [fetchAgain])


  return (
    <>
      <Box 
        display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDir={'column'}
        alignItems={'center'}
        p={3}
        bg={'#fe019a'}
        // bg={'#ff6242'}
        opacity={1}
        w={{ base: '100%', md: '31%' }}
        borderRadius={'lg'}
        borderWidth={'1px'}
      >
        <Box
          pb={3}
          px={3}
          fontSize={{ base: '28px', md: '30px' }}
          fontFamily={'Work sans'}
          display={'flex'}
          color={'#fff'}
          w={'100%'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          My Chats

          <GroupChatModal>
            <Button
            bg={'blue'}
            opacity={0.9}
              display={'flex'}
              fontSize={{ base: '17px', md: '10px', lg: '17px' }}
              color={'#fff'}
              rightIcon={<AddIcon />}
            >
              New Group Chat
            </Button>
          </GroupChatModal>


        </Box>

        <Box
          display={'flex'}
          flexDir={'column'}
          p={3}
          // background= {'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'}
          bg={'#00FF00'}
          w={'100%'}
          h={'100%'}
          borderRadius={'lg'}
          overflowY={'hidden'}
        >
          {chats ?
            (
              <Stack overflowY={'scroll'}>
                {chats.map((chat) => (
                  <Box onClick={() => setSelectedChat(chat)}
                  background= {"linear-gradient(45deg,yellow 0%, #FA8BFF 25%, pink 40%, #2BFF88 85%,red 15%)"}
                    cursor={'pointer'}
                    _hover={{
                      
                    }}
                    
                    color={selectedChat === chat ? "white" : "black"}
                    px={3}
                    py={2}
                    display={'flex'}
                    gap={'2rem'}
                    alignItems={'center'}
                    borderRadius={'lg'}
                    key={chat._id}
                  >
                    <Avatar src={!chat.isGroupChat
                        ? getSenderImage(loggedUser, chat.users)
                        : chat.chatName}
                        size={'sm'}

                    
                     />

                    <Text>
                      {!chat.isGroupChat
                        ? getSender(loggedUser, chat.users)
                        : chat.chatName}

                    </Text>
                  </Box>
                ))}
              </Stack>
            ) : (
              <ChatLoading />
            )
          }

        </Box>
      </Box>


    </>
  )
}

export default MyChats
