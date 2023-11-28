import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Avatar, Box, FormControl, IconButton, Spinner, Text, useToast,Menu,MenuButton,MenuList,MenuItem,useDisclosure} from '@chakra-ui/react';
import { ArrowBackIcon, DeleteIcon } from '@chakra-ui/icons';
import { getSender,getSenderImage} from '../config/ChatLogics';
 
import UpdateGroupChatModal from './misclleneous/UpdateGroupChatModal';
import axios from 'axios';
import {HamburgerIcon} from '@chakra-ui/icons'
import Picker from 'emoji-picker-react'
import './style.css'
import ScrollableChat from './ScrollableChat'
import io from 'socket.io-client';
import { BASE_URL } from '../config/helper';

var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();
    const toast = useToast();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
const [image,setImage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
 
    const [typing, setTyping] = useState(false);
    const [dis,setdDis] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectDelete,setSelectdDelete] = useState(false);
    const [selectedMessages, setSelectedMessages] = useState([]);
    const [count,setCount]= useState(0);
    const {isOpen ,onOpen,onClose  } = useDisclosure();
 const [emoji,setEmoji] = useState('');


    const handleEmojiClick = (emoji)=>{
        
        setNewMessage(newMessage + emoji.emoji);
        setEmoji(emoji.imageUrl);
        onClose();
    }
    const handleEmojiPicker = ()=>{
        setShowEmojiPicker(!showEmojiPicker);
         
    }

    const handleDelete = (messageId)=>{
        setCount(count+1);
        setSelectedMessages((prev)=>{
            if(prev.includes(messageId)){
                return prev.filter((id)=> id !== messageId);
            }
            return [...prev,messageId];
        });

        
    }

const handleDeleteSelected =async (messageIds)=>{
    
    try {
         ;

        await fetch(`${BASE_URL}/api/message/deletechats`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messageIds }),
          }) 
        .then((res)=>{
           
            toast({
                title: `Deleted ${count} messages!.`,
                status: "success",
                duration: 5000,
                isClosable: true,
                position: 'top'
            });
            
        });

        setCount(0); 
    setMessages((prevMessages)=>{
        return prevMessages.filter((message)=> !selectedMessages.includes(message._id))
    });

setSelectdDelete(false);

    setSelectedMessages([]);
    onClose();
        
    } catch (error) {
        toast({
            title: 'Error Occured!',
            description: "failed to Delete the Message",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: 'bottom'
        });
        
    }





}
 

    useEffect(() => {
        socket = io(BASE_URL);
        socket.emit("setup", user);
        socket.on('connection', () => {
            setSocketConnected(true);
        });

        socket.on("typing", () => setIsTyping(true))
        socket.on("stop typing", () => setIsTyping(false))

    }, []);
 

    const fetchMessage = async () => {
        if (!selectedChat) {
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            };

            setLoading(true);
            const { data } = await axios.get(`${BASE_URL}/api/message/${selectedChat._id}`, config);

           
            setMessages(data);
            setLoading(false)
            socket.emit('join chat', selectedChat._id);

        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: "failed to load the Message",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });

        }

    }



    useEffect(() => {
        fetchMessage();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                // give notifucation 
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification]);
                    setFetchAgain(!fetchAgain);
                }

            } else {
                setMessages([...messages, newMessageRecieved]);
            }
        });
    });



    const sendMessage = async (e) => {

        if ( (newMessage || emoji) && e.key ==='Enter' ) {
            
   

            socket.emit("stop typing", selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    },
                };
                setNewMessage("");
                const { data } = await axios.post(`${BASE_URL}/api/message/`, {
                    content: newMessage,
                    image  : "",
                    emoji : "",
                    chatId: selectedChat._id
                }, config);


               
                socket.emit("new Message", data)
                setMessages([...messages, data]);
              

            } catch (error) {
                toast({
                    title: 'Error Occured!',
                    description: "failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom'
                });

            }
        }
    


    }

 


    const sendImage =async (e)=>{
        if(!image){
            return ;
        }
        
        socket.emit("stop typing", selectedChat._id);
        try {
          
         
            const formData = new FormData();
            formData.append("file",image);
            formData.append("upload_preset","chat-app");

            await axios.post('https://api.cloudinary.com/v1_1/javed-shekh/image/upload', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              })
              .then(async (response) => {
            
const config = {
    headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`
    },
};
setImage('');

    const { data } = await axios.post(`${BASE_URL}/api/message/`, {
        image: response.data.url,
        content : "",
        emoji : "",
        chatId: selectedChat._id
    }, config);


    
    socket.emit("new Message", data)

    
    setMessages([...messages, data]);
                  
 
               
                
                setdDis(false)
              })
        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: "Failed to send the Image",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });



            
        }
        
    }
 

const ImageHandler = (e)=>{
    
    setImage(e.target.files[0]);
    setdDis(true);


    if (!socketConnected) return;

    if (!typing) {
        setTyping(true)
        socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime()
    var timerLength = 3000;
    setTimeout(() => {
        var timeNow = new Date().getTime();
        var timeDiff = timeNow - lastTypingTime;

        if (timeDiff >= timerLength && typing) {
            socket.emit("stop typing", selectedChat._id);
            setTyping(false);
        }
    }, timerLength)

}


    const typingHandler = (e) => {
        
        setNewMessage(e.target.value);
       
       

        //typing Indicator Logic
        if (!socketConnected) return;

        if (!typing) {
            setTyping(true)
            socket.emit("typing", selectedChat._id);
        }

        let lastTypingTime = new Date().getTime()
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;

            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength)

    };




    return (
        <>
            {selectedChat ? (
                <>
                 
                    <Text fontSize={{ base: "28px", md: '30px' }} pb={3} px={2} w={'100%'} fontFamily={'Work sans'} display={'flex'} 
                    // gap={{base : '60px'}}
                    justifyContent={{ base: 'space-between' }}
                     alignItems={'center'}
                      color={'#fff'}>
 

                        <IconButton bg={'blue'}  display={{ base: 'flex', md: 'none' }} icon={<ArrowBackIcon color={'#fff'}  fontWeight={'bold'} />} onClick={() => { setSelectedChat('') }} />
                        {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                <Box display={'flex'} gap={'10px'}>
                <Avatar src={getSenderImage(user,selectedChat.users)} size={'md'}  />
                  {getSender(user, selectedChat.users)}
                </Box>

                
            
                {/* 8888888888888 */}

                <Menu isOpen={isOpen} onClose={onClose} p={0} m={0} w={'40px'}>
                   {selectDelete &&
                    <MenuButton
    as={IconButton}
    aria-label='Options'
    icon={
         <DeleteIcon color={'#fff'} fontSize={'22px'} />
    }
    variant='outline'

    onClick={()=>{handleDeleteSelected(selectedMessages)}}
  />
}

                  
                    <MenuButton
    as={IconButton}
    onClick={onOpen}
    aria-label='Options'
    icon={
         <HamburgerIcon color={'#fff'} fontSize={'22px'} />
    }
    variant='outline'
  />
                  
 

  <MenuList   minW={'10px'} >
  <MenuItem borderTop={'1px solid'} borderBottom={'1px solid'} fontSize={'16px'} color={'black'}  >
      Profile
    </MenuItem>
    <MenuItem borderBottom={'1px solid'}  color={'black'} fontSize={'16px'} onClick={()=>{setSelectdDelete(!selectDelete)}}  >
Delete message <DeleteIcon ml={2} />
    </MenuItem>
   
    <MenuItem borderBottom={'1px solid'} fontSize={'16px'} color={'black'}    >
     Delete chat
    </MenuItem>
     
    
  </MenuList>
</Menu>



                



               
               
                  {/* <ProfileModel
                  
                    user={getSenderFull(user, selectedChat.users)}
                  /> */}
                </>
              ) : (
                < > 
                
                {selectedChat.chatName.toUppercase()}
              
                 
                  <UpdateGroupChatModal
                    fetchMessage={fetchMessage}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
                    </Text>
                        <Box display={'flex'}
                        flexDir={'column'}
                        justifyContent={'flex-end'}
                        p={3}
                        bg={'#FFDDC5'}
                        w={'100%'}
                        h={'100%'}
                        borderRadius={'lg'}
                        overflowY={'hidden'}
                    >

                        {loading ? (<Spinner size={'xl'} w={20} h={20} alignSelf={'center'} margin={'auto'} />) : (
                            <div className='messages'>

                                <ScrollableChat messages={messages} selectDelete={selectDelete}  handleDelete={handleDelete} />

                            </div>
                        )}

                        <FormControl
                            onKeyDown={ sendMessage}
                            isRequired mt={3} >

                            {isTyping ?
                                <div class="ticontainer">
                                    <div class="tiblock">
                                        <div class="tidot"></div>
                                        <div class="tidot"></div>
                                        <div class="tidot"></div>
                                    </div>
                                </div>
                                : <></>}

 
 

<div className="input">
    <div className='emoji-picker-container'>
{showEmojiPicker && (
    <Picker isOpen={isOpen} onClose={onClose} emojiStyle='apple'  autoFocusSearch={true}       onEmojiClick={handleEmojiClick}   />
)}
</div>
<button style={{fontSize : '24px'}} onClick={handleEmojiPicker} >😀</button>
 
      <input
        type="text"
        placeholder="Type something..."
        onChange={typingHandler}
                                value={newMessage}
        
      />
      {/* ******* PIcker Emoji*/}
       

      {/* *********** */}

      <div className="send">
        {/* <img src={Attach} alt="" /> */}
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={ImageHandler}
                                // value={newMessage}

          
        />
        <label htmlFor="file">
        <i class="fa-solid fa-image" style={{fontSize : '25px',marginRight : '10px',cursor  : 'pointer'}}></i>
          {/* <img src={Img} alt="" /> */}
        </label>
        <button 
        onClick={sendImage} 
        // onClick={sendMessage}
        style={{display : dis ? 'block' : 'none'}}
        >Send</button>
      </div>
    </div>
                  
                        </FormControl>

                    </Box>

                </>
            ) : (
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} h={'100%'} >
                    <Text color={'#fff'} fontSize={'3xl'} pb={3} fontFamily={'Work sans'}>
                        Click on a user to start chatting
                    </Text>
                </Box>)
            }

        </>
    )
}


export default SingleChat
