
import React from 'react'
import { Container,
         Box,
        Text,
        Tab,
        TabList,
        TabPanel,
        TabPanels,
        Tabs,
       } from '@chakra-ui/react'
import Login from '../components/Authentication/Login'
import Signup from '../components/Authentication/Signup'
import { useNavigate } from 'react-router-dom'
import {useEffect} from "react"

const Homepage = () => {
 const navigate = useNavigate();
   
  useEffect(() =>{
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if(user) navigate("/chats");
  }, [navigate]);
  return (
    <Container maxW = "xl" centerContent>
      <Box
        d = 'flex'
        justifyContent="center"
        p = {3}
        bg = {"white"}
        w= "100%"
        m = "40px 0 15px"
        borderRadius="lg"
        borderWidth="1px"
        >


        <Text fontSize={"4xl" }fontFamily={"work sans"} color = "black" textAlign={"center"}>Chat-App</Text>
      </Box>
      <Box 
      bg = "white" 
      w = "100%"
      p = {4}
      borderRadius={ "lg"}
      color = "black"
      borderWidth={"1px"} >
        <Tabs variant='soft-rounded'>
  <TabList mb = "1em">
    <Tab width = "50%">Login</Tab>
    <Tab width = "50%">Signup</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <Login />
    </TabPanel>
    <TabPanel>
      <Signup />
    </TabPanel>
  </TabPanels>
</Tabs>
      </Box>
    </Container>
  )
}

export default Homepage
