import { 
    createContext,
    useContext,
    useEffect,
    useState
} from "react";


import API from "../api/axios";





const AuthContext = createContext();









export function AuthProvider({ children }) {




    const [user,setUser] = useState(null);



    const [token,setToken] = useState(

        localStorage.getItem("token")

    );



    const [authLoading,setAuthLoading] = useState(true);









    // ===========================
    // VERIFY TOKEN ON REFRESH
    // ===========================


    useEffect(()=>{



        if(token){


            setAuthLoading(true);


            getUser();


        }


        else{


            setAuthLoading(false);


        }



    },[token]);












    const getUser = async()=>{



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



            localStorage.removeItem(

                "token"

            );




            setToken(null);



            setUser(null);



        }




        finally{


            setAuthLoading(false);


        }



    };















    // ===========================
    // LOGIN
    // ===========================


    const login=(jwtToken)=>{



        localStorage.setItem(

            "token",

            jwtToken

        );




        setToken(

            jwtToken

        );


    };















    // ===========================
    // LOGOUT
    // ===========================


    const logout=async()=>{



        try{



            if(user?.id){



                await API.post(

                    `/auth/logout?user_id=${user.id}`

                );



            }



        }catch(error){



            console.log(

                "Logout error",

                error

            );



        }









        localStorage.removeItem(

            "token"

        );




        setToken(null);



        setUser(null);



    };
















    return(


        <AuthContext.Provider


            value={{


                user,


                setUser,


                token,


                authLoading,


                login,


                logout


            }}


        >



            {children}



        </AuthContext.Provider>


    );



}












export function useAuth(){


    return useContext(

        AuthContext

    );


}