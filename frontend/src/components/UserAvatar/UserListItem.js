import React from 'react'
import { Avatar, Box ,Text} from '@chakra-ui/react';

const UserListItem = ({user,handleFunction}) => {
   
  return (
    <>
    <Box 
    onClick={handleFunction}
    cursor={'pointer'}
    bg={'yellow'}
    _hover={{
        background : "#38B2AC",
        color : "#fff"
    }}
    w={'100%'}
    display={'flex'}
    alignItems={'center'}
    color={'black'}
    px={3}
    py={2}
    mb={2}
    borderRadius={'lg'}
    >
        <Avatar  
        mr={2}
        size={'sm'}
        cursor={'pointer'}
        name={user.name}
        src={user.pic}
        />
        <Box>
            <Text color={'red'}> {user.name} </Text>
            <Text fontSize='xs'>
                <b>Email : </b>
                {user.email}
            </Text>
        </Box>
    </Box>
    </>
  )
}

export default UserListItem;
