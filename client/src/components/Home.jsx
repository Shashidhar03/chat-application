import React, { useEffect } from 'react'
import Axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

import Avatar from "../assets/profile.png"
import messageSound from '../assets/ting.mp3';
const sound = new Audio(messageSound);

const socket = io('http://localhost:5000');

function Home() {

    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    console.log(user);  //fetching user info from redux store

    const [conversations, setConversation] = React.useState([]); //conversations of the user to display on left side
    const [conversationInfo, setConversationInfo] = React.useState({ "user":"", "conversationID": ""});  //info about selected person to chat
    const [message, setMessage] = React.useState({ value: ''});  //msg to send
    const [messages, setMessages] = React.useState([]);  //msgs are retrived frm db
    const [allOtherUsers, setAllOtherUsers] = React.useState([{}]); //all other users except the current user to display on right

    // const messageRef = React.useRef(null);
    // useEffect(() => {
    //     messageRef.current.scrollIntoView({ behavior: "smooth" });
    // }, [messages]);

    socket.emit('addUser', user.userInfo._id);  //adds users into users array upon login

    useEffect(() => {
        Axios.get('http://localhost:5000/users/') //fetching all users
            .then((res) => {
                console.log(res.data);
                console.log(typeof(res.data));
                setAllOtherUsers(Array.isArray(res.data) ? res.data : [res.data]);
            })
            .catch((err) => {
                console.log(err);
            });
        Axios.get(`http://localhost:5000/conversations/${user.userInfo._id}`)  //fetching all conversations of the user
            .then((res) => {
                console.log(typeof (res.data));
                setConversation(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();

        socket.emit('sendMessage', { "message": message.value, "senderID": user.userInfo._id, "receiverID": conversationInfo.user._id });
        
        // console.log(message.value);
        // console.log(user.userInfo._id);
        // console.log(conversationInfo.user._id);
        await Axios.post('http://localhost:5000/messages/send', {"senderID":user.userInfo._id,"receiverID":conversationInfo.user._id,"conversationID":conversationInfo.conversationID,"message":message.value})
        .then((res) => {
            console.log(res.data);
        })
        .catch((err) => {
            console.log(err);
        });

        setMessage({ "value": "" });
    }

    useEffect(() => {
        socket.on('getMessage', (data) => {
            // console.log(data);
            setMessages([ data]);
            sound.play();
        });
    }, [messages, setMessages]);

    const handleChange = (e) => {
        setMessage({
            value: e.target.value
        });
    }

    const addConversation = async (id) => {  //adds new convo upon clicking on the people,if already convo exist already it dont add again
        console.log(id);
        await Axios.post('http://localhost:5000/conversations/add', {
            senderID: user.userInfo._id,
            receiverID: id
        })
        .then((res) => {
            console.log(typeof (res.data));
            if(res.data !== "Conversation already exists")
            {
                setConversation([...conversations, res.data]);
            }
            
        })
        .catch((err) => {
            console.log(err);
        });
    }

    const handleConversation = async (rUser,convoID) => { 
        console.log(rUser);
        setConversationInfo({ "user": rUser, "conversationID": convoID });
        const senderID = user.userInfo._id;
        console.log(senderID);
        console.log(convoID);
       
        await Axios.get(`http://localhost:5000/messages/getmsg?senderID=${senderID}&convoID=${convoID}&receiverID=${rUser._id}`)
        .then((res) => {
            console.log(res.data);
            setMessages(res.data);
        })
        .catch((err) => {
            console.log(err);
        });
    }
   
    return (
        <div className="w-screen flex overflow-x-hidden overflow-y-hidden ">

            <div className='w-[25%] h-screen  bg-slate-100'>
                <div className="mt-10 px-5 flex ">
                    <img src={Avatar} className="w-12 h-12 ml-5 border border-black rounded-full mt-1"></img>
                    <div className='ml-4 ' >
                        <h3 className='text-lg'>{user.userInfo.username}</h3>
                        <p className='text-sm'>{user.userInfo.email}</p>
                    </div>
                </div>

                <hr className='mt-4'></hr>

                <p className="ml-10 mt-3 text-blue-500 text-lg">Conversations</p>
                <div className='ml-4 mt-4 overflow-scroll overflow-x-hidden h-screen overflow-y-hidden'>
                    {
                        conversations.length > 0 ?
                        conversations.map((conversation, index) => (
                            allOtherUsers.map((rUser) => (
                                rUser._id === conversation.members[1] &&
                                user.userInfo._id === conversation.members[0] &&
                                (<div key={index} className="flex px-5 py-3 mb-3 cursor-pointer" onClick={()=>{handleConversation(rUser,conversation._id)}}>
                                    <img src={Avatar} className="w-12 h-12 border border-black rounded-full mt-1 " ></img>
                                    {console.log(user)}
                                    <div className='mt-2 ml-3' >
                                        <h3 className='text-lg '>{rUser.username}</h3>
                                        <p className='text-sm text-zinc-500'>Avalible</p>
                                    </div>
                                </div>)
                            ))) //mapping through all conversations and displaying the user with whom the conversation is going on
                        )
                        :
                        <div className='mt-2 ml-3' >
                            <h3 className='text-lg '>No Conversations</h3>
                        </div>
                    }
                </div>

            </div>

            <div className='w-[50%] h-screen'>
            
                <div className='w-[75%] h-14  bg-slate-100 mt-11 ml-16 rounded-full flex items-center '>
                    <div className=" cursor-pointer w-[40px] h-[40px] border border-black rounded-full ml-10 ">
                        <img src={Avatar} /></div>
                    <div className='ml-4 w-[60%] space-y-0'>
                        <p className='ml-4 text-lg'>{conversationInfo.user.username}</p>
                        <p className='ml-4 text-sm text-zinc-500'>Online</p>
                    </div>
                    <div className='cursor-pointer '>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-phone-outgoing"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" /><path d="M15 9l5 -5" /><path d="M16 4l4 0l0 4" /></svg>
                    </div>
                </div>

                <hr className='mt-2'></hr>

                <div className='h-[75%] overflow-y-scroll scroll-ms-1 mx-4 overflow-x-hidden '>
                    { messages.length>0 && messages.map((message, index) => (
                    console.log(message),
                    message.senderID !== user.userInfo._id ?
                        <div key={index} className='w-72 h-16 bg-slate-100 rounded-lg rounded-tl-none m-3 float-start clear-both p-2'>
                            {message.message}
                        </div>
                        :
                        <div key={index} className='w-72 h-16 bg-blue-600 rounded-lg rounded-br-none m-3 float-end clear-both p-2 text-white'>
                            {message.message}
                        </div>))
                    } 
                </div>
                    
                <hr />

                <div className='w-[80%] h-8 ml-14 mt-3 flex'>
                    <form onSubmit={handleSubmit} className='flex w-[100%]'>
                        <input type='text' className='w-[90%] h-10 rounded-full bg-slate-100 px-5 focus:border-none focus:outline-none' placeholder=' Type a message' name="message" onChange={handleChange} value={message.value}></input>
                        <button type="submit">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-send-2 mt-2"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4.698 4.034l16.302 7.966l-16.302 7.966a.503 .503 0 0 1 -.546 -.124a.555 .555 0 0 1 -.12 -.568l2.468 -7.274l-2.468 -7.274a.555 .555 0 0 1 .12 -.568a.503 .503 0 0 1 .546 -.124z" /><path d="M6.5 12h14.5" /></svg>
                        </button>
                    </form>
                </div>
               
            </div>
            
            <div className='w-[25%] h-screen bg-slate-100'>
                <div className='mt-14 '>
                    <p className="ml-10 mt-5 text-blue-500 text-2xl">Contacts</p>
                </div>

                <hr className='mt-4'></hr>

                <div className='ml-4 mt-4 overflow-scroll overflow-x-hidden overflow-y-hidden'>
                    {
                        allOtherUsers.map((contact, index) => (

                            contact.username !== user.userInfo.username && (<div key={index} className="flex px-5 py-3 mb-3 cursor-pointer" onClick={() => { addConversation(contact._id) }}>                                    <img src={Avatar} className="w-12 h-12 border border-black rounded-full mt-1 " ></img>
                                {console.log(contact)}
                                <div className='mt-2 ml-3' >
                                    <h3 className='text-lg '>{contact.username}</h3>
                                    <p className='text-sm text-zinc-500'>{contact.status}</p>
                                </div>
                            </div>)

                        ))
                    }
                </div>

                <div className='w-20 h-18 border-2 border-black p-3 bg-blue-500 text-white mt-96 hover:bg-slate-600 '>
                    <button className='' onClick={()=>{navigate("/")}}>Logout</button>
                </div>
            </div>
            
        </div>
    )
}

export default Home
