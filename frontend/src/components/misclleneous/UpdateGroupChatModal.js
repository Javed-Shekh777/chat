import { ViewIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { Button, IconButton, Modal, ModalBody, ModalContent, Box, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast, ModalCloseButton, FormControl, Input, Spinner } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import UserListItem from '../UserAvatar/UserListItem';
import { BASE_URL } from '../../config/helper';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain,fetchMessage }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { selectedChat, user, setSelectedChat } = ChatState();
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState();
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState();
    const [renameLoading, setRenameLoading] = useState(false);
    const toast = useToast();


    const handleAddUser = async (userRemove) => {
        if (selectedChat.users.find((u) => u._id === userRemove._id)) {
            toast({
                title: "User Already in group!",

                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: "Only admins can add someone!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }


        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.put(`${BASE_URL}/api/chat/groupadd`, {
                chatId: selectedChat._id,
                userId : userRemove._id,
            }, config
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false)

        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.Message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);

        }

    };

    const handleRemove = async (userRemove) => {
         

        if (selectedChat.groupAdmin._id !== user._id && userRemove._id !== user._id) {
            toast({
                title: "Only admins can remove someone!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }


        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.put(`${BASE_URL}/api/chat/groupremove`, {
                chatId: selectedChat._id,
                userId : userRemove._id,
            }, config
            );

            userRemove._id === user._id ? setSelectedChat() : setSelectedChat(data)

            fetchMessage();
            setFetchAgain(!fetchAgain);
            setLoading(false)

        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.Message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);

        }


    }
    const handleRename = async () => {
        if (!groupChatName) return;

        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.put(`${BASE_URL}/api/chat/rename`, {
                chatId: selectedChat._id,
                chatName: groupChatName,
            }, config
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);

        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.Message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setRenameLoading(false);

        }
        setGroupChatName('');
    }

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

            const { data } = await axios.get(`${BASE_URL}/api/user?search=${search}`, config
            );

        
            setSearchResult(data);
            setLoading(false);

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



    return (
        <>
            <IconButton onClick={onOpen} display={{ base: 'flex' }} icon={<ViewIcon />} />

            <Modal isOpen={isOpen} onClose={onClose} isCentered >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontSize={'35px'} fontFamily={'Work sans'} display={'flex'} justifyContent={'center'} >
                        {selectedChat.chatName}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box w={'100%'} display={'flex'} flexWrap={'wrap'} pb={3} >
                            {selectedChat.users.map(u => (
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => handleRemove(u)}
                                />
                            ))}
                        </Box>

                        <FormControl display={'flex'}>
                            <Input
                                placeholder='Chat Name'
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => { setGroupChatName(e.target.value) }}
                            />
                            <Button
                                variant={'solid'}
                                colorScheme='teal'
                                ml={1}
                                isLoading={renameLoading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>

                        </FormControl>

                        <FormControl display={'flex'}>
                            <Input
                                placeholder='Add User to group'
                                mb={3}
                                onChange={(e) => { handleSearch(e.target.value) }}
                            />
                        </FormControl>
                        {loading ? <Spinner size={'lg'} /> : (
                            searchResult?.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleAddUser(user)}

                                />
                            ))
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={() => handleRemove(user)} >Leave Group</Button>
                    </ModalFooter>

                </ModalContent>
            </Modal>

        </>
    )
}

export default UpdateGroupChatModal
