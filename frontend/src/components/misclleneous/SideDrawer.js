import { Box, Button, Tooltip, Text, Menu, MenuButton, MenuList, MenuItem, Avatar, MenuDivider, Drawer, useDisclosure, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Input, useToast, Spinner } from '@chakra-ui/react';
import React, { useState } from 'react'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { ChatState } from '../../Context/ChatProvider';
import ProfileModel from './ProfileModel';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from '../../config/ChatLogics';
import { BASE_URL } from '../../config/helper';

const SideDrawer = () => {

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const {user,setSelectedChat,chats,setChats,notification,setNotification} = ChatState();
 
 
 
  const navigate = useNavigate();
  const { onClose, onOpen, isOpen } = useDisclosure();
  const toast = useToast();
  

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization : `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`${BASE_URL}/api/user?search=${search}`, config
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


  };

  const accessChat =async (userId) => {
    try {
      setLoadingChat(true);

      const config = {
        headers : {
          "Content-type":"application/json",
          Authorization : `Bearer ${user.token}`, 
        }
      };

      const {data} = await axios.post(`${BASE_URL}/api/chat`,{userId},config);
 
      if(!chats.find((c)=>c._id === data._id))  

setChats([data,...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();


    } catch (error) {
      toast({
        title : "Error fecting the chat",
        description : error.Message,
        status : 'error',
        duration : 5000,
        isClosable : true,
        position : 'bottom-left'
      });
      setLoadingChat(false);
      
    }

  }

  return (
    <>
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
        w={'100%'}
        // bg={'#c3447a'}
        bg={'maroon'}
        p={"5px 10px 5px 10px"}
        borderWidth={'5px'}

      >
        <Tooltip label="Search Users to Chat" hasArrow placement='bottom-end'>
          <Button _hover={{
          background : 'brown',
          color : "black"
        }}  bg={'black'} opacity={'0.8'} variant={'ghost'} onClick={onOpen}>
            <i className="fas fa-search" style={{color:'#fff'}} ></i>
            <Text display={{ base: "none", md: "flex" }} px={'4'} color={'#fff'}>
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize={'2xl'} color={'#fff'} fontWeight={'600'} fontFamily={'Work sans'}>Talk-A-Person
          </Text>
        <div>
          <Menu>
            <MenuButton p={1} position={'relative'} >
              <div  className='notification'>
                {notification.length}
           
                </div>
              <BellIcon  fontSize={30} m={1} color={'#fff'}></BellIcon>
            </MenuButton>
            <MenuList pl={2}>
             {!notification.length && "No New Messages"}
             {notification.map(notify=>(
              <MenuItem
               key={notify._id} onClick={()=>{
              
                setSelectedChat(notify.chat);
                setNotification(notification.filter(n=>{
                  
                  if(n.chat.isGroupChat){
                    return n.chat.chatName !== notify.chat.chatName
                  }else{
                    return n.sender.name  !== notify.sender.name
                  }
                 
                 
                }))
              }}>
                {notify.chat.isGroupChat ? `New Message in ${notify.chat.chatName}` : `
                  
                New Message from ${getSender(user,notify.chat.users)}` }
              </MenuItem>
             ))}
          </MenuList>
          </Menu>
          <Menu >
            <MenuButton bg={'	#FF1493'} as={Button} rightIcon={<ChevronDownIcon  />}>
      

              <Avatar   size={'sm'} cursor={'pointer'} name={user.name} src={user.pic} ></Avatar>

            </MenuButton>
            <MenuList   >
              <ProfileModel >
                <MenuItem color={'green'} fontWeight={'600'} >My Profile</MenuItem>
              </ProfileModel>

              <MenuDivider  />
              <MenuItem color={'red'} fontWeight={'600'}  onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      {/* //  side drawer  */}

      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay  />
        <DrawerContent bg={'blueviolet'}>
          <DrawerHeader borderBottomWidth={'1px'} color={'black'}>Search Users</DrawerHeader>

          <DrawerBody>

            <Box display={'flex'} pb={2}>
              <Input placeholder='Search by name or email' mr={2} color={'#fff'} value={search} onChange={(e) => setSearch(e.target.value)} />
              <Button onClick={handleSearch} colorScheme='green'>Go</Button>
            </Box>

            {/* {loading ? (<ChatLoading />) : (<span>results</span>)} */}
          
            {loading ? (<ChatLoading />) : (
    searchResult?.map((user)=>(
      <UserListItem
      user = {user}
      key={user._id}
      handleFunction={()=>accessChat(user._id)}
      />
    ))
   )}
        
             
{loadingChat && <Spinner ml={'auto'} display={'flex'} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideDrawer
