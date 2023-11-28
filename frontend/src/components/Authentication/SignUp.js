import { Box, Button, FormControl, FormLabel, Input, InputGroup, InputLeftElement, InputRightElement, Text,VStack, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from 'axios'
import { EmailIcon, LockIcon } from '@chakra-ui/icons';
import image from '../../img/img.png';
import avatar from '../../img/noAvatar.png';
import {BASE_URL} from '../../config/helper'

 
const SignUp = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmpassword, setConfirmPassword] = useState();
  const [cshow, setCShow] = useState(false);
  const [show, setShow] = useState(false);
  const [pic, setPic] = useState();
  const [gotp, setGotp] = useState();
  const [gen, setGen] = useState(false);
  const [inOtp, setInOtp] = useState();
  const [dis, setDis] = useState(false);
  const toast = useToast();
  const [loading, setLoading] = useState(false);

 




  const postImage = (pics) => {
    setLoading(true)
    if (pics.type === "image/jpeg" || pics.type === 'image/png') {

      setPic(pics);
      setLoading(false)

    } else {
      toast({
        title: 'Please Select an Image!',
        description: 'Image should be jpeg or png',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: "top"
      });
      setLoading(false)

      return;
    }



  }

  const submitHandler = async (e) => {
    

    e.preventDefault();



    if (pic === undefined) {
      setLoading(true);
      toast({
        title: 'Please Select an Image!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: "top"
      });
      setLoading(false)
      return;

    }

    if (!name || !email || !password || !confirmpassword) {
      setLoading(true);
      toast({
        title: 'Please Fill all Fields!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: "top"
      });

      setLoading(false)
      return;

    }

    if (password !== confirmpassword) {
      setLoading(true);
      toast({
        title: 'Password must be matched!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: "top"
      });
      setLoading(false)
      return;
    }


    if(!gen){
      toast({
        title: 'Please First Verify Email!',
        description : "By OTP",
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: "top"
      });
      return;
    
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password)
    formData.append('image', pic);


    try {
      setLoading(true);
      let config = {
        headers: { "Content-type": 'application/json' }
      }
      const response = await axios.post(`${BASE_URL}/api/user`, formData, {
        headers: config,
      });




      if (response) {

        toast({
          title: `Registration Successfull!`,
          status: 'success',
          duration: 3000,

          isClosable: true,
          position: "top",

        });

        

      }
      localStorage.setItem('userInfo', JSON.stringify(response));

    
      setLoading(false);

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



  const verifyOtp = () => {
     

    if (!inOtp) {
      toast({
        title: 'Please Enter Otp!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: "top"
      });
      return;
    }

    if (inOtp === gotp) {
      toast({
        title: 'Email Verified successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: "top"
      });
      setDis(false);
      setGen(true);


    }
  }


  const handleOtp = async () => {
    if (!name || !email) {
      toast({
        title: 'Please enter email or name!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: "top"
      });
      return;
    }
    setDis(true);
   
    try {

      const { data } = await axios.post('http://localhost:8080/api/user/otp', {
        name,
        email,
      });

      setGotp(data.genOtp.OTP);
      

      toast({
        title: data.Message,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: "top"
      });


    } catch (error) {
      toast({
        title: 'Otp generation error',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "top"
      });
    }
  }






  return (

    <>
      <VStack>
        <FormControl id='name'>
        <FormLabel >Name<span style={{color:'red'}}>*</span> : </FormLabel>
        <InputGroup>
        <InputLeftElement >
        <img  src={avatar}  style={{color: 'black' ,marginBottom : '5px', marginLeft : '5px',height : '25px'}} />
        </InputLeftElement>
        <Input
        
            placeholder='Enter Your Name'
            onChange={(e) => { setName(e.target.value) }}
          ></Input>
        </InputGroup>
       
        </FormControl>

        <FormControl id='email'>
        <FormLabel >Email Address<span style={{color:'red'}}>*</span> : </FormLabel>

      <InputGroup>
      <InputLeftElement>
      <EmailIcon  color={'grey'} fontSize={'22px'}/>
      </InputLeftElement>
      <Input
            placeholder='Enter Your Email'
            onChange={(e) => { setEmail(e.target.value) }}
          >
          </Input>
      </InputGroup>
         
        </FormControl>

        <FormControl id='password'>
        <FormLabel >Password<span style={{color:'red'}}>*</span> : </FormLabel>
          <InputGroup>
          <InputLeftElement>
          <LockIcon color={'grey'} fontSize={'20px'} />
          </InputLeftElement>
            <Input
              type={show ? 'text' : 'password'}
              placeholder='Enter Password'
              onChange={(e) => { setPassword(e.target.value) }}
            ></Input>
            <InputRightElement w={'4.5rem'}>
              <Button h={'1.75rem'} size={'sm'} onClick={() => setShow(!show)}
              >{show ? 'Hide' : 'Show'}</Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl id='confirmpassword' isRequired>
           <FormLabel display={'inline'}>Confirm Password</FormLabel><span style={{marginLeft : '-10px'}}>:</span>
          <InputGroup>
          <InputLeftElement>
          <LockIcon fontSize={'20px'} color={'grey'} />
          </InputLeftElement>
            <Input
              type={cshow ? 'text' : 'password'}
              placeholder='Enter Password'
              onChange={(e) => { setConfirmPassword(e.target.value) }}
            ></Input>
            <InputRightElement w={'4.5rem'} >
              <Button h={'1.75rem'} size={'sm'}
                onClick={() => setCShow(!cshow)} >
                {cshow ? 'Hide' : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl id='pic'>
          <FormLabel>Upload Your Picture</FormLabel>
          <label forhtml='file' style={{border : 2,width:'100%'}}>
          <Input type='file'
            accept='image/*'
            width={'100%'}
display={'none'}
            onChange={(e) => { postImage(e.target.files[0]) }}
          ></Input>
          <Box display={'flex'} gap={'4rem'} alignItems={'center'} border={'1px solid lightgrey'} p={'7px '} borderRadius={'5px'}>
           
          <img  src={image}  style={{color: 'red' ,height : '25px'}}  />
          <Text >Choose Image to Upload</Text>
          </Box>
         
          </label>
        </FormControl>
        <div style={{display: gen ? 'none':'block'}}>
        <Button colorScheme='green'  onClick={handleOtp}  >Generate OTP</Button>
        </div>
        <div style={{ display: dis ? 'block' : 'none' }}>
          <FormControl >

            Enter OTP :  <Input w={'40%'} mr={3} display={'inline'} onChange={(e) => { setInOtp(e.target.value) }} >

            </Input><Button display={'inline'} alignSelf={'center'} colorScheme='blue' onClick={verifyOtp}  >Verify</Button>

          </FormControl>
        </div>


        <Button w={'100%'} marginTop={'15px'} colorScheme='blue'
          isLoading={loading}
          onClick={submitHandler}
        >Sign Up</Button>

      </VStack>
    </>
  )
}

export default SignUp
