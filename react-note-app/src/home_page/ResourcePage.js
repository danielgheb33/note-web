import React from "react";
import './ResourcePage.css'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

function ResourcePage(props) {

    return (
        <div className={"ResourcePage"}
             style={{height: window.screen.height, width: window.screen.width}}
        >
            <div className={"navbar-fixed-top flex-center"}>
                <div className={"backButton"} onClick={() => {window.location.href = "/"}}>
                    <ArrowBackIcon/>
                </div>
                <h1 className={"resourcePageTitleStyle"}>{props.title}</h1>
            </div>
            <div className={"resourcePageEditorContainer"}>
                <textarea disabled={true}
                          className={"resourcePageEditorStyle"}>{props.body}</textarea>
            </div>
        </div>
    );
}

export default ResourcePage;
