import { Menu,
  MenuButton,
  Tooltip,  
  MenuList, 
  Avatar, 
  MenuItem, 
  MenuDivider ,
  Drawer, 
  DrawerOverlay, 
  DrawerContent, 
  DrawerHeader,
  DrawerBody,
  Input,
  useToast,
  Spinner
} from '@chakra-ui/react';
import {BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import {Box,Text } from '@chakra-ui/layout';
import {Button } from '@chakra-ui/button';
import React, {useState} from 'react';
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import {useNavigate} from 'react-router-dom'
import { useDisclosure } from '@chakra-ui/hooks';
import Axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from '../UserAvatar/UserListItem';
import {getSender} from "../../config/ChatLogics";
import {Effect} from "react-notification-badge"
import NotificationBadge from 'react-notification-badge';
const SideDrawer = () => {
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat]= useState()

  const {user, setSelectedChat, chats, setChats,notification, setNotification} = ChatState();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const logoutHandler= () =>{
    localStorage.removeItem("userInfo");
    navigate("/")
  };
   
  const toast = useToast();
  const handleSearch = async() =>{
    if(!search){
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
     return;
    }
    try{
      setLoading(true)
      const config ={
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const {data} = await Axios.get(`/api/user?search=${search}`,config);
      setLoading(false);
      setSearchResult(data);
    }catch(error){
      toast({
        title: "Error Occure!",
        description: "Failed to load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left"
      })
    
    }
  };

  const accessChat = async(userId) =>{
    try{
      setLoadingChat(true);
      const config ={
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const {data} = await Axios.post("api/chat", {userId}, config);

      if(!chats.find((c) => c._id ===data._id))setChats ([data,...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    }catch(error){
       toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left"
      })
    }
  }
  return (
    <>
    <Box
    display="flex"
    justifyContent="space-between"
    alignItems = "center"
    background = "white"
    width ="100%"
    padding = "5px 10px 5px 10px"
    borderWidth = "5px">

      <Tooltip label = "Search Users to Chat"
      hasArrow
      placement="bottom-end">
      <Button variant = "ghost" onClick={onOpen}>
        <i class="fas fa-search"></i>
        <Text d={{base:"none", md: "flex"}} px="4">
          Search User
        </Text>
      </Button>
      </Tooltip>
      <Text fontSize ="2xl" fontFamily = "Work sans">Chat-App</Text>
            <div>
        <Menu>
          <MenuButton p ={1}>
            <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
             <BellIcon fontSize="2xl" m={1}/>          
             </MenuButton>
              <MenuList paddingLeft={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
        </Menu>
        <Menu>
          <MenuButton
           as={Button} 
           rightIcon={<ChevronDownIcon/>}>
           <Avatar 
           size="sm" 
           cursor="pointer" 
           name={user.name}
           src={user.pic}
           />
             </MenuButton>
             <MenuList>
              <ProfileModal user={user}>
              <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider/>
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
             </MenuList>
        </Menu>
      </div>
    </Box>

    <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay/>
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px">Search User</DrawerHeader>
         <DrawerBody>
        <Box display="flex" paddingBottom={2}>
          <Input
          placeholder = "Search by name or email"
          mr={2}
          value={search}
          onChange={(e) => setSearch(e.target.value)}/>
          <Button onClick={handleSearch}>Go</Button>
          </Box>
          {loading ? <ChatLoading/>: 
          ( 
           searchResult?.map(user => (
            <UserListItem
              key ={user._id}
              user={user}
              handleFunction={() =>accessChat(user._id)}
            />
           ))
          )}

        {loadingChat && <Spinner ml="auto" display="flex"/>}
      </DrawerBody>
      </DrawerContent>
     
    </Drawer>
    </>
  )
}

export default SideDrawer
