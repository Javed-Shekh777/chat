import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics'

import { ChatState } from '../Context/ChatProvider'
import { Avatar, Tooltip, Box } from '@chakra-ui/react'

const ScrollableChat = ({ messages, selectDelete, handleDelete }) => {
   
    const { user } = ChatState();
    return (
        <>
            <ScrollableFeed >

                {messages && messages.map((m, i) => (
                    <div style={{ display: 'flex' }} key={m._id}>

                        {
                            (isSameSender(messages, m, i, user._id) ||
                                isLastMessage(messages, user._id, i)) &&
                            (<Tooltip label={m.sender.name}
                                placement='bottom start'
                                hasArrow>
                                <Avatar
                                    display={selectDelete ? 'none' : 'block'}
                                    mt={'12px'}
                                    ml={0}
                                    mr={1}
                                    size={'sm'}
                                    cursor={'pointer'}
                                    name={m.sender.name}
                                    src={m.sender.pic}
                                >
                                </Avatar>


                            </Tooltip>)}



                        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}  >
                            <input type='radio'
                                onChange={() => { handleDelete(m._id) }}
                                style={{ width: '25px', height: '25px', fontSize: '50px', display: selectDelete ? 'block' : 'none' }} />
                        </Box>

                        <span style={
                            {
                                color: `${m.sender._id !== user._id ? "black" : '#fff'}`,
                                maxWidth: '75%',
                                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                                marginTop: isSameUser(messages, m, i, user._id) ? 8 : 12,
                            }}>

                            {m.content !== "" ? <span style={{
                                background: `${m.sender._id !== user._id ? "yellow" : 'blue'}`, display: 'inline-block', borderRadius: '20px',
                                padding: '5px 15px',


                            }} >
                                <p> {m.content}</p>
                            </span>
                                : <>
                                     <Box 
                                     background={ `${m.sender._id !== user._id ? "#ccc" : 'lightpink'}`}
                                     borderRadius={20}
 

                                     maxHeight={'250px'} mb={30} maxW={'250px'} >
                                        <img style={{ 
                                             
// background : 'green',
 padding : '10px',borderRadius: '20px',
                                        objectFit: 'cover', height: '100%', width: '100%' }} src={
                                            m.image || m.emoji} />
                                    </Box>
                                </>}

                        </span>

                    </div>
                ))}

            </ScrollableFeed>
        </>
    )
}

export default ScrollableChat
