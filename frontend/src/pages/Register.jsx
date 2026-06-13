import { useState } from "react";

import API from "../api/axios";

import { Link,useNavigate } from "react-router-dom";

import "./Auth.css";



function Register(){


    const [username,setUsername]=useState("");

    const [email,setEmail]=useState("");

    const [password,setPassword]=useState("");


    const navigate = useNavigate();




    const register = async()=>{


        await API.post(

            "/auth/register",

            {

                username,

                email,

                password

            }

        );


        navigate("/login");


    };





    return(

        <div className="auth-page">


            <div className="auth-card">


                <h1>
                     CYPHER
                </h1>


                <h2>
                    Create Account
                </h2>


                <p>
                    Join the private chat network
                </p>




                <input

                    placeholder="Username"

                    value={username}

                    onChange={(e)=>setUsername(e.target.value)}

                />




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





                <button onClick={register}>

                    Register

                </button>




                <span>

                    Already have account?

                    <Link to="/login">

                        Login

                    </Link>

                </span>



            </div>


        </div>

    );


}



export default Register;