import React, { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import Button from "react-bootstrap/Button";
import './LogoutButton.css';

const LogoutButton = (props) => {
    const { logout, isAuthenticated } = useAuth0();

    return (
        isAuthenticated && (
            <div className={props.className} >
                <Button variant={props.variant}
                    onClick={
                        () => {
                            logout();
                        }
                    }>Log Out</Button>
            </div>

        )
    );
};
export default LogoutButton;
