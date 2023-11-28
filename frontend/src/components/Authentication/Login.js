import { Button,   FormControl, FormLabel, Input, InputGroup, InputLeftAddon, InputLeftElement, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import {EmailIcon, LockIcon} from '@chakra-ui/icons'
import React, { useState } from 'react'
import axios from 'axios';
import {BASE_URL} from '../../config/helper';
 
import { useNavigate } from 'react-router-dom';
 

const Login = (handle) => {
   
  const [email,setEmail] = useState();
  const [password,setPassword] = useState();
  const toast = useToast();
  const [loading,setLoading] = useState(false);
  const [show,setShow] = useState(false);
 
  const navigate = useNavigate();
 

 

 

    

  const submitHandler =async (e)=>{
     
    e.preventDefault();
   


  
 
    if(!email || !password){
      setLoading(true);
      toast({
        title: 'Please Fill all Fields!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: "top"
    });

    setLoading(false)
    return ;

    }

     


    const formData = new FormData();
 
    formData.append('email', email);
    formData.append('password', password)

    try {
      setLoading(true);
      let config = {
        headers  : {"Content-type":'application/json'}
      }

     

      const response = await axios.post(`${BASE_URL}/api/user/login`, formData, {
        headers: config,
      });

      
        if(response){

          toast({
            title: `Login Successfull!`,
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: "top",

        });
        }
      
     
      localStorage.setItem("userInfo",JSON.stringify(response));
   
      

      setLoading(false);
      navigate("/chats");
    
      
    } catch (error) {

      
      toast({
          title: "Error Occured!",
          status: 'error',
          duration: 5000,
          description: error.response.data.Message,
          isClosable: true,
          position: "top",
      });
      setLoading(false)
     
      
    }

   

    
  }

 

  return (
   
    <>
    <VStack>
       

      <FormControl id='email'>
        <FormLabel  >Email Address<span style={{color:'red'}}>*</span> : </FormLabel>
        <InputGroup>
        <InputLeftElement   >
        <EmailIcon fontSize={'22px'} />
        </InputLeftElement>
        <Input
        bg={'#fff'}
        _placeholder={{
          opacity : .8,
          color : 'grey'
        }}
       
         
        placeholder='Enter Your Email'
        onChange={(e)=>{setEmail(e.target.value)}}
        >
        </Input>
       
        </InputGroup>
        
      </FormControl>

      <FormControl id='password'>
        <FormLabel >Password<span style={{color:'red'}}>*</span> : </FormLabel>
         <InputGroup>
         <InputLeftElement>
         <LockIcon fontSize={'22px'} />
         </InputLeftElement>
         <Input
          _placeholder={{
            opacity : .8,
            color : 'grey'
          }}
         
         type= {show ? 'text' : 'password'}
         placeholder='Enter Password'
         onChange={(e)=>{setPassword(e.target.value)}}
         ></Input>
         <InputRightElement w={'4.5rem'}>
         <Button h={'1.75rem'} size={'sm'} type='submit' onClick={()=>setShow(!show)}
         >{show? 'Hide' : 'Show'}</Button>
         </InputRightElement>
         </InputGroup>
      </FormControl>

       

       

      <Button w={'100%'} marginTop={'10px'} colorScheme='blue'
      isLoading = {loading}
      onClick={submitHandler}
 
      >Login</Button>


<Button w={'100%'} marginTop={'10px'} colorScheme='red'
      >Get Guest User Credentials</Button>
      
    </VStack>
    </>
  )
}

export default Login

