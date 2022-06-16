import '../App.css';
import 'katex/dist/katex.min.css';
import React, { useEffect, useState, useRef } from 'react';
import MarkdownKatex from 'markdown-it-katex';
import MarkdownIt from 'markdown-it';
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import Profile from "./Profile";
import './Editor.css';
import FileSystem from "./FileSystem";
import axios from 'axios';
import Button from "react-bootstrap/Button";
import { getFileSystem, postSavedNote } from "../server_utilities";
import HelpButton from "./HelpButton";

// test file system data


function Editor(props) {

    const [fileSystem, setFileSystem] = useState("");
    const [fileText, setFileText] = useState("");
    const [selectedPath, setSelectedPath] = useState("");
    const textRef = useRef(null);
    const renderedRef = useRef(null);

    const [currentNote, setCurrentNote] = useState({
        userID: props.userID,
        path: "",
        name: "",
        tags: [],
        description: "",
        links: [],
        content: ""
    });

    useEffect(() => {
        if (props.location.state != null) {
            console.log(props.location.state.note);
            setSelectedPath(props.location.state.note);
        }
    }, []);

    // useEffect(() => {
    //     const toSend = {
    //         userID: userID
    //     };
    //
    //     let config = {
    //         headers: {
    //             "Content-Type": "application/json",
    //             'Access-Control-Allow-Origin': '*',
    //         }
    //     };


    useEffect(() => {
        getFileSystem(props.userID, setFileSystem);
    }, [props.userID]);

    const md = new MarkdownIt();
    md.use(MarkdownKatex);

    //////////////////////////////////////  Styles /////////////////////////////////////////////////////////////////////

    const header_style = {
        height: 50,
        backgroundColor: "#1B4332",
        borderBottom: "1px solid black",
        color: "white"
    };

    const container_style = {
        display: "flex",
        backgroundColor: "#74c69d",
        height: "100vh"
    };

    const sidePanel_style = {
        width: 200,
        backgroundColor: "#2D6A4F",
        color: "#D8F3DC",
        borderRight: "1px solid black",

    };

    const column_style = {
        width: 425,
        height: 550,
        margin: 10,
        padding: 20,
        borderRadius: 5,
        backgroundColor: "#202020",
        color: "white",
        boxShadow: "5px 5px 10px #555",
        overflowY: "scroll"
    };

    const authentication_buttons_style = {
        width: 50,
        margin: "auto",
        marginTop: 10,
        marginBottom: 10

    };




    /**
     *
     * @param {Element} container
     * @param {string} rawHTML
     */
    function parseNote(container, rawHTML) {
        let tags = [];
        let description = "";
        let localLinks = [];

        container.innerHTML = rawHTML;

        // this extracts all the local links
        const links = container.querySelectorAll("a");
        const reg = new RegExp('^(?:[a-z]+:)?//', 'i');
        for (const linkElement of links) {
            const linkVal = linkElement.getAttribute("href");
            const isForeign = reg.test(linkVal);
            if (!isForeign) {
                localLinks.push(linkVal);
                const customLink = document.createElement("a");
                customLink.style.color = "blue";
                customLink.style.cursor = "pointer";
                customLink.onclick = () => {
                    setCurrentNote(linkVal);
                    console.log(linkVal);
                };
                customLink.innerHTML = linkElement.innerHTML;
                // customLink.innerText = customLink.innerText;
                linkElement.parentNode.replaceChild(customLink, linkElement);
            }
        }


        // this extracts all the tags
        if (container.children.length > 0) {
            const currNode = container.children.item(0);
            const innerText = currNode.textContent;
            if (innerText.charAt(0) == "~") {
                container.removeChild(currNode);
                tags = innerText.split('~').slice(1).map(e => e.trim());
            }
        }

        // this extracts the description
        if (container.children.length > 0) {
            const currNode = container.children.item(0);
            const innerText = currNode.textContent;
            if (innerText.charAt(0) == "%") {
                container.removeChild(currNode);
                description = innerText.slice(1);
            }
        }

        const metadata = {
            tags: tags,
            description: description,
            links: localLinks
        };

        console.log(metadata);

        return metadata;
    }

    /**
     *
     * @param {MouseEvent} e
     */
    function onChangeHandler(e) {
        const textContent = e.target.value;
        const renderedHTML = md.render(textContent);
        const metadata = parseNote(renderedRef.current, renderedHTML);
        setCurrentNote({
            userID: props.userID,
            path: currentNote.path,
            name: currentNote.name,
            tags: metadata.tags,
            description: metadata.description,
            links: metadata.links,
            content: textContent
        });
    }


    // Create state variables to keep track of the user's input
    const [filename, setFilename] = useState("untitled");

    /**
     * Requests checkins from backend
     */
    const saveText = () => {

        const toSend = {
            userID: props.userID, // replace with current user's id
            filename: filename,
            fileText: textRef.current.value,
            //fileTags:
            //fileDescritpion
        };
        console.log(props.userID);
        console.log(filename);
        console.log(fileText.value);
        let config = {
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*',
            }
        };

        axios.post(
            'http://localhost:4567/savenote',
            toSend,
            config
        )
            .then(response => {


            })
            .catch(function (error) {
                console.log(error);
            });
    };

    //TODO: each of these divs should be their own react components
    return (
        <div
            className={"Editor"}
            style={{ height: window.screen.availHeight, width: window.screen.availWidth }}
        >
            <div className={"navbar-fixed-top flex-right"}>
                {selectedPath !== "" ? selectedPath : "32 Notes"}
                <Button
                    className={"navbar-item"}
                    variant={"danger"}
                    onClick={() => { window.location.href = "/noteweb"; }
                    }>
                    Note Web
                </Button>
                <LogoutButton className={"navbar-item"} variant={"warning"} />
            </div>

            <div className={"mainContainer"}>
                <div className={"fileSystemContainer"}>
                    <Profile setUserID={props.setUserID} />
                    <FileSystem
                        filename={filename}
                        setFilename={setFilename}
                        userID={props.userID}
                        fileSystem={fileSystem}
                        fileTextRef={textRef}
                        currentNote={currentNote}
                        setCurrentNote={setCurrentNote}
                    />
                </div>
                <textarea
                    ref={textRef}
                    onChange={onChangeHandler}
                    type={"text"} placeholder={"Type Markdown Here"}
                    className={"editorStyle"}
                />


                <div className={"editorStyle"}
                     ref={renderedRef}></div>
                <div className={"saveContainer"}>
                    <Button
                        variant={"outline-info"}
                        onClick={() =>
                            postSavedNote(
                                props.userID,
                                currentNote,
                                (data) => { if (data != null) { console.log(data); } })}>
                        Save
                    </Button>
                </div>
                <HelpButton/>
            </div>

        </div >
    );

}

export default Editor;