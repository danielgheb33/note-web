import React, { useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import Button from "react-bootstrap/Button";
import './LoginButton.css';


const LoginButton = () => {
    const { loginWithRedirect, isAuthenticated } = useAuth0();

    useEffect(() => {
        setTimeout(() => {
            if (isAuthenticated) {
                window.location.href = "/editor";
            }
        }, 1500);
    }, [isAuthenticated]);

    return (
        !isAuthenticated && (
            <div className={"loginButtonContainer"}>
                {/*<form action="#"*/}
                {/*      onSubmit="if(document.getElementById('agree').checked) { return true; } else { alert('Please indicate that you have read and agree to the Terms and Conditions and Privacy Policy'); return false; }">*/}

                {/*    <input type="checkbox" name="checkbox" value="check" id="agree"/> By submitting you agree to the Terms*/}
                {/*    and Conditions and Privacy Policy*/}
                {/*</form>*/}
                <Button variant={"outline-info"} size={"lg"} onClick={() => {
                    loginWithRedirect();
                }}>Log In With Auth0</Button>
            </div>
        )

    );
};

export default LoginButton;