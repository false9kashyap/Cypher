import { Routes, Route, Navigate } from "react-router-dom";


import Login from "./pages/Login";

import Register from "./pages/Register";

import Chat from "./pages/Chat";

import Profile from "./pages/Profile";


import { useAuth } from "./context/AuthContext";





function App() {



    const { token, user, authLoading } = useAuth();







    // WAIT UNTIL TOKEN CHECK FINISHES

    if(authLoading){


        return(

            <div>

                Loading...

            </div>

        );


    }









    return(


        <Routes>









            <Route


                path="/"


                element={


                    token && user


                    ?


                    <Navigate to="/chat" />


                    :


                    <Navigate to="/login" />


                }


            />










            <Route


                path="/login"


                element={


                    token && user


                    ?


                    <Navigate to="/chat" />


                    :


                    <Login />


                }


            />









            <Route


                path="/register"


                element={


                    token && user


                    ?


                    <Navigate to="/chat" />


                    :


                    <Register />


                }


            />










            <Route


                path="/chat"


                element={


                    token && user


                    ?


                    <Chat />


                    :


                    <Navigate to="/login" />


                }


            />









            <Route


                path="/profile"


                element={


                    token && user


                    ?


                    <Profile />


                    :


                    <Navigate to="/login" />


                }


            />









        </Routes>


    );


}





export default App;