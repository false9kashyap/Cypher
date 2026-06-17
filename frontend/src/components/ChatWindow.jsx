import { useEffect, useRef, useState } from "react";

import API from "../api/axios";

import { useAuth } from "../context/AuthContext";

import EmojiPicker from "emoji-picker-react";

import "./ChatWindow.css";





function ChatWindow({ chat }) {


    const { user } = useAuth();


    const [messages,setMessages] = useState([]);

    const [text,setText] = useState("");

    const [isTyping,setIsTyping] = useState(false);

    const [showEmoji,setShowEmoji] = useState(false);



    const socket = useRef(null);

    const typingTimeout = useRef(null);

    const bottomRef = useRef(null);









    useEffect(()=>{


        const chatId = chat?.id || chat?._id;

        const userId = user?.id || user?._id;



        if(!chatId || !userId){

            return;

        }



        loadMessages(chatId);



        const WS_URL = import.meta.env.VITE_WS_URL;



        socket.current = new WebSocket(

            `${WS_URL}/ws/${chatId}/${userId}`

        );







        socket.current.onopen=()=>{


            socket.current.send(

                JSON.stringify({

                    type:"read_chat"

                })

            );


        };








        socket.current.onmessage=(event)=>{


            const data = JSON.parse(event.data);







            if(data.type==="message"){


                setMessages(

                    prev=>[...prev,data]

                );




                if(String(data.sender)!==String(userId)){


                    socket.current.send(

                        JSON.stringify({

                            type:"read",

                            message_id:data.id

                        })

                    );

                }

            }








            if(data.type==="read"){


                setMessages(

                    prev=>prev.map(

                        msg=>

                        String(msg.id)===String(data.message_id)

                        ?

                        {

                            ...msg,


                            readBy:[

                                ...new Set([

                                    ...(msg.readBy || []),

                                    data.reader

                                ])

                            ]

                        }

                        :

                        msg

                    )

                );

            }









            if(data.type==="read_chat"){


                setMessages(

                    prev=>prev.map(

                        msg=>({

                            ...msg,


                            readBy:[

                                ...new Set([

                                    ...(msg.readBy || []),

                                    data.reader

                                ])

                            ]

                        })

                    )

                );

            }









            if(data.type==="typing"){


                if(String(data.sender)!==String(userId)){


                    setIsTyping(

                        data.isTyping

                    );


                }


            }


        };









        return()=>{


            clearTimeout(

                typingTimeout.current

            );


            socket.current?.close();


        };



    },[chat,user]);









    const loadMessages=async(chatId)=>{


        const res = await API.get(

            `/message/${chatId}`

        );


        setMessages(

            res.data

        );


    };










    const handleTyping=(e)=>{


        setText(

            e.target.value

        );





        if(socket.current?.readyState===1){


            socket.current.send(

                JSON.stringify({

                    type:"typing",

                    isTyping:true

                })

            );

        }





        clearTimeout(

            typingTimeout.current

        );





        typingTimeout.current=setTimeout(()=>{


            if(socket.current?.readyState===1){


                socket.current.send(

                    JSON.stringify({

                        type:"typing",

                        isTyping:false

                    })

                );

            }


        },1000);


    };











    const addEmoji=(emoji)=>{


        setText(

            prev=>prev+emoji.emoji

        );


    };









    const sendMessage=()=>{


        if(!text.trim()){

            return;

        }



        if(socket.current?.readyState===1){


            socket.current.send(

                JSON.stringify({

                    type:"message",

                    text:text

                })

            );


        }



        setText("");

        setShowEmoji(false);


    };









    return(

        <div className="chat-box">



            <div className="chat-header">


                <div className="avatar">


                    {chat.otherUser?.username?.[0]?.toUpperCase()}


                </div>


                <div>


                    <h2>{chat.otherUser?.username}</h2>


                    <p>{isTyping ? "typing..." : ""}</p>


                </div>


            </div>








            <div className="messages">



            {


            messages.map((msg,index)=>{


                const userId = user?.id || user?._id;


                const mine =

                String(msg.sender)

                ===

                String(userId);



                const time = msg.createdAt

                ?

                new Date(msg.createdAt)

                :

                null;





                return(


                    <div

                    key={msg.id || msg._id || index}

                    className={mine ? "message mine" : "message other"}

                    >


                        {msg.text}




                        <div className="time">


                        {

                        time &&

                        time.toLocaleTimeString(

                            [],

                            {

                                hour:"2-digit",

                                minute:"2-digit"

                            }

                        )

                        }



                        {

                        mine &&

                        (

                        msg.readBy?.length>1

                        ?

                        " ✓✓"

                        :

                        " ✓"

                        )

                        }


                        </div>


                    </div>


                );


            })


            }



            <div ref={bottomRef}></div>


            </div>









            <div className="input-box">



                <button

                className="emoji-btn"

                onClick={()=>setShowEmoji(!showEmoji)}

                >

                😀

                </button>






                {

                showEmoji &&


                <div className="emoji-box">


                    <EmojiPicker

                    onEmojiClick={addEmoji}

                    theme="dark"

                    />


                </div>

                }







                <input

                value={text}

                onChange={handleTyping}

                placeholder="message..."

                onKeyDown={(e)=>{


                    if(e.key==="Enter"){

                        sendMessage();

                    }


                }}

                />






                <button onClick={sendMessage}>

                    Send

                </button>



            </div>


        </div>

    );


}




export default ChatWindow;