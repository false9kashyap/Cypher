import { useEffect, useState } from "react";

import API from "../api/axios";

import { useAuth } from "../context/AuthContext";

import Sidebar from "../components/Sidebar";

import ChatWindow from "../components/ChatWindow";

import "./Chat.css";





function Chat(){


    const { setUser, logout } = useAuth();


    const [selectedChat,setSelectedChat] = useState(null);







    useEffect(()=>{


        getProfile();


    },[]);









    const getProfile = async()=>{


        try{


            const res = await API.get(

                "/user/me"

            );



            setUser({

                ...res.data,

                id:

                res.data.id

                ||

                res.data._id

            });



        }catch(error){


            logout();


        }


    };











    return(


        <div className="chat-page">








            <Sidebar

                selectChat={setSelectedChat}

            />










            <div className="chat-area">









            {


                selectedChat


                ?


                <ChatWindow

                    chat={selectedChat}

                />


                :


                <div className="empty-chat">



                    <h1>

                        CYPHER

                    </h1>



                    <p>

                        Select a chat

                    </p>



                </div>


            }









            </div>







        </div>


    );


}





export default Chat;