import React  from 'react'
import { Tab,Text, Tabs,TabList,TabPanels,TabPanel, Container, Box

} from '@chakra-ui/react'
import SignUp from '../components/Authentication/SignUp'
import Login from '../components/Authentication/Login'
// import { useNavigate } from 'react-router-dom'
 
const HomePage = () => {
 
    
    
   
  return (
    <>
      
    <Container maxW={'xl'} centerContent >
        <Box
        display={'flex'}
        justifyContent={'center'}
        bg={'blue'}
        fontSize={'40px'}
        w={'100%'}
        boxShadow={'2px 3px 5px ,-2px -3px 5px'}
        textAlign={'center'}
        m={'40px 0 15px 0'}
        borderRadius={10}
        background-color={'#FA8BFF'}
        background= {"linear-gradient(45deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%)"}
        
        >
            <Text fontSize={'4xl'}color={'#fff'} fontFamily={'work sans'}>Talk-A-Person</Text>
        </Box>
        <Box 
       bg={'#fff'}
      
        w={'100%'}

        borderRadius={'lg'}
        boxShadow={'5px 5px 10px 5px black'}
      
        >
        <Tabs variant={'soft-rounded'}  >
        <TabList>
            
            <Tab w={'50%'}  background-color={'#FA8BFF'}
background={'lightgreen'} color={'black'} fontWeight={'bolder'}
>Login</Tab>
            <Tab  background-color={'#FA8BFF'}
background={'lightgreen'} color={'black'} fontWeight={'bolder'} w={'50%'}>Sign Up</Tab>
        </TabList>
        <TabPanels>
            
            <TabPanel>
                <Login />
                </TabPanel>
                <TabPanel>
                <SignUp/>
            </TabPanel>
        </TabPanels>
     </Tabs>
    
        </Box>
    </Container>
     
    </>
  )
}

export default HomePage
