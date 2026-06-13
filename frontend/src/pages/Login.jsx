import { useState } from "react";

import API from "../api/axios";

import { useAuth } from "../context/AuthContext";

import { useNavigate, Link } from "react-router-dom";

import "./Auth.css";



function Login(){


    const [email,setEmail] = useState("");

    const [password,setPassword] = useState("");


    const { login } = useAuth();

    const navigate = useNavigate();





    const handleLogin = async()=>{


        const res = await API.post(

            "/auth/login",

            {

                email,

                password

            }

        );



        login(res.data.access_token);


        navigate("/chat");


    };






    return(

        <div className="auth-page">


            <div className="auth-card">


                <h1>
                     CYPHER
                </h1>


                <h2>
                    Welcome Back
                </h2>


                <p>
                    Login to continue chatting
                </p>





                <input

                    placeholder="Email"

                    value={email}

                    onChange={(e)=>setEmail(e.target.value)}

                />




                <input

                    placeholder="Password"

                    type="password"

                    value={password}

                    onChange={(e)=>setPassword(e.target.value)}

                />





                <button onClick={handleLogin}>

                    Login

                </button>




                <span>

                    New here? 

                    <Link to="/register">

                        Create account

                    </Link>

                </span>



            </div>


        </div>

    );


}



export default Login;