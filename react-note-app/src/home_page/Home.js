import {useEffect, useRef, useState} from "react";
import Typewriter from "typewriter-effect";
import './Home.css'
import Button from 'react-bootstrap/Button';
import LoginButton from "../editor_page/LoginButton";
import HelpButton from "../editor_page/HelpButton";

function Home() {

    // const [renderTrigger, setRenderTrigger] = useState()
    //
    // const canvasRef = useRef()
    //
    // useEffect(() => {
    //     const currCanvas = canvasRef.current;
    //     const currContext = currCanvas.getContext("2d");
    //     for (let i = 0; i < 2500; i++) {
    //         const xOne = Math.random() * currCanvas.offsetWidth;
    //         const yOne = Math.random() * currCanvas.offsetHeight;
    //         const circleRadius = Math.random() * 1.5;
    //         currContext.beginPath();
    //         currContext.arc(xOne, yOne, circleRadius, 0, 2 * Math.PI);
    //         currContext.fillStyle = "green"
    //         currContext.fill();
    //     }
    // }, [renderTrigger])

    return (
        <div className={"Home"}
            style={{height: window.screen.availHeight, width: window.screen.availWidth}}
        >
            {/*<canvas className={"homePage"} ref={canvasRef} height={window.screen.height} width={window.screen.width}/>*/}
            {/*<div className={"aboutContainer"} onClick={() => {window.location.href = "/about"}}>*/}
            {/*    About*/}
            {/*</div>*/}
            <div className={"termsAndConditionsContainer"} onClick={() => {window.location.href = "/termsandconditions"}}>
                Terms & Conditions
            </div>
            <div className={"privacyPolicyContainer"} onClick={() => {window.location.href = "/privacypolicy"}}>
                Privacy Policy
            </div>
            <div>
                <div className={"typeWriterContainer"}>
                    <Typewriter
                        onInit={(typeWriter) => {
                            typeWriter
                                .changeDelay(150)
                                .typeString("32 Notes")
                                .start();
                        }}
                    />
                </div>
                <div style={{padding: "50px"}}/>
                {/*<div className={"loginButtonContainer"}>*/}
                {/*    <Button variant={"outline-info"} size={"lg"}>Log In With Auth0</Button>*/}
                {/*</div>*/}
                <LoginButton/>
            </div>
            <HelpButton/>
        </div>
    );
}

export default Home;
