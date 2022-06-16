import NoteWeb from "./NoteWeb";
import "./NoteWebPage.css";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import LogoutButton from "../editor_page/LogoutButton";
import React, { useState } from "react";
import {useAuth0} from "@auth0/auth0-react";

function NoteWebPage(props) {
    const {isAuthenticated, user} = useAuth0();
    const [viewMode, setViewMode] = useState("unloaded");

    return (
        isAuthenticated && (
        <div>
            <div className={"navbar-fixed-top flex-right"}>
                <DropdownButton
                    variant={"info"}
                    title={"View Modes"}
                    className={"navbar-item"}>
                    <Dropdown.Item onClick={() => { setViewMode("tags"); }}>
                        Tags
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => { setViewMode("links"); }}>
                        Links
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => { setViewMode("filesystem"); }}>
                        FileSystem
                    </Dropdown.Item>
                </DropdownButton>
                <Button
                    className={"navbar-item"}
                    variant={"success"}
                    onClick={
                        () => {
                            window.location.href = "/editor";
                        }
                    }>Editor</Button>
                <LogoutButton className={"navbar-item"} variant={"warning"} />
            </div>
            <NoteWeb viewMode={viewMode} setViewMode={setViewMode} userID={user.email} {...props} />
        </div >));
}

export default NoteWebPage;
