import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import API from "../api/axios";

import { useAuth } from "../context/AuthContext";

import "./Sidebar.css";





function Sidebar({ selectChat }) {



    const [chats,setChats] = useState([]);

    const [search,setSearch] = useState("");

    const [users,setUsers] = useState([]);




    const navigate = useNavigate();

    const { logout } = useAuth();








    useEffect(()=>{



        getChats();



        const interval=setInterval(()=>{


            getChats();


        },3000);




        return ()=>clearInterval(interval);



    },[]);









    useEffect(()=>{



        if(search.trim()===""){


            setUsers([]);

            return;


        }



        searchUsers();



    },[search]);












    const getChats=async()=>{



        try{


            const res = await API.get(

                "/chat/"

            );





            const sortedChats=res.data.sort(

                (a,b)=>

                new Date(b.lastMessageTime || 0)

                -

                new Date(a.lastMessageTime || 0)

            );





            setChats(

                sortedChats

            );



        }catch(error){


            console.log(error);


        }



    };













    const searchUsers=async()=>{



        try{


            const res = await API.get(

                `/user/search?q=${search}`

            );




            setUsers(

                res.data

            );



        }catch(error){


            console.log(error);


        }



    };














    const openChat=(chat)=>{



        selectChat(

            chat

        );







        setChats(

            prev=>prev.map(

                item=>

                item.id===chat.id

                ?

                {

                    ...item,

                    unreadCount:0

                }

                :

                item

            )

        );



    };













    const createChat=async(person)=>{



        await API.post(

            `/chat/create/${person.id}`

        );







        const chatRes = await API.get(

            "/chat/"

        );







        const newChat = chatRes.data.find(

            c=>c.otherUser.id===person.id

        );






        setChats(

            chatRes.data

        );






        if(newChat){


            selectChat(

                newChat

            );


        }






        setSearch("");

        setUsers([]);



    };













    const handleLogout=()=>{



        logout();



        navigate(

            "/login"

        );



    };












    const filteredChats = chats.filter(

        chat=>

        (chat.otherUser?.username || "")

        .toLowerCase()

        .includes(

            search.toLowerCase()

        )

    );












    return(

        <div className="sidebar">









            <h1 className="logo">

                CYPHER

            </h1>











            <input

                className="search"

                placeholder="Search chats..."

                value={search}

                onChange={(e)=>setSearch(e.target.value)}

            />













            <div className="chat-list">








            {


            filteredChats.map(chat=>(






                <div

                    key={chat.id}

                    className="chat-card"

                    onClick={()=>openChat(chat)}

                >







                    <div className="avatar">


                    {

                    chat.otherUser?.username

                    ?

                    chat.otherUser.username[0].toUpperCase()

                    :

                    "?"

                    }


                    </div>










                    <div className="chat-info">



                        <h3>

                            {chat.otherUser?.username}

                        </h3>







                        <p>


                        {

                        chat.lastMessage

                        ?

                        chat.lastMessage.length>25

                        ?

                        chat.lastMessage.slice(0,25)+"..."

                        :

                        chat.lastMessage

                        :

                        "No messages yet"

                        }


                        </p>




                    </div>










                    {

                    chat.unreadCount>0 &&



                    <div className="unread-badge">


                        {chat.unreadCount}


                    </div>


                    }







                </div>





            ))


            }













            {


            users.map(person=>(






                <div

                    key={person.id}

                    className="chat-card"

                    onClick={()=>createChat(person)}

                >







                    <div className="avatar">


                        {person.username[0].toUpperCase()}


                    </div>









                    <div className="chat-info">



                        <h3>

                            {person.username}

                        </h3>





                        <p>

                            Start new chat

                        </p>



                    </div>





                </div>





            ))


            }









            </div>













            <div className="logout-section">






                <button

                    className="logout-btn"

                    onClick={()=>navigate("/profile")}

                >


                    Profile


                </button>









                <button

                    className="logout-btn"

                    onClick={handleLogout}

                >


                    Logout


                </button>





            </div>









        </div>

    );



}





export default Sidebar;