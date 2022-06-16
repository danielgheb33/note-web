import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import './Profile.css';

const Profile = (props) => {
    const {user, isAuthenticated} = useAuth0();

    return (
        isAuthenticated && (
            <div className={"profileContainer"}>
                <div className={"userInfo"}>
                    {"Welcome, " + user.given_name + "!"}
                </div>
                <img className={"userPicture"} src={user.picture} alt={"./graph.png"} />
                 {props.setUserID(user.email)}
            </div>
        )
    );

};
export default Profile;
