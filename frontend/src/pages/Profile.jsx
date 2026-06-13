import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import "./Profile.css";




function Profile(){


    const { user } = useAuth();


    const navigate = useNavigate();





    return(

        <div className="profile-page">





            <div className="profile-card">






                <div className="profile-avatar">


                    {

                    user?.username?.[0]

                    .toUpperCase()

                    }


                </div>








                <h1>


                    {

                    user?.username

                    }


                </h1>








                <p>


                    {

                    user?.email

                    }


                </p>









                <button

                    onClick={()=>navigate("/chat")}

                >


                    Back to Chat


                </button>








            </div>





        </div>

    );


}




export default Profile;