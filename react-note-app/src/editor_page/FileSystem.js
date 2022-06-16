import React, {useEffect, useState} from 'react';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import FolderIcon from '@material-ui/icons/Folder';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import Modal from "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button';
import "bootstrap/dist/css/bootstrap.min.css";
import {Menu, Item, Submenu, useContextMenu} from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';
import './FileSystem.css';
import {getNoteDatum} from "../server_utilities";
import {type} from 'jquery';

function FileSystem(props) {

    const [newFileModalTrigger, setNewFileModalTrigger] = useState(false);
    const [newFileName, setNewFileName] = useState("");
    const [newFolderModalTrigger, setNewFolderModalTrigger] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const [selectedPath, setSelectedPath] = useState("");
    const [selectedFolder, setSelectedFolder] = useState("");
    const [isFolder, setIsFolder] = useState(false);
    const [renameModalTrigger, setRenameModalTrigger] = useState(false);
    const [renamedName, setRenamedName] = useState("");
    const [deleteModalTrigger, setDeleteModalTrigger] = useState(false);
    const [allFolders, setAllFolders] = useState([]);
    //   const [selectedName, setSelectedName] = useState("");

    const handleOnClick = (boolTrigger) => {
        boolTrigger ? setNewFileModalTrigger(true) : setNewFolderModalTrigger(true);
    };

    const handleOnClickCancel = (boolTrigger) => {
        boolTrigger ? setNewFileModalTrigger(false) : setNewFolderModalTrigger(false);
    };

    const addNewFile = (currNode, selectedNodePath, fileName) => {
        if (currNode["path"] === selectedNodePath) {
            currNode["children"].push({
                type: "File",
                name: fileName,
                path: currNode["path"] + "/" + fileName + ".md",
            });
            props.fileTextRef.current.value = "";
            props.setFilename(fileName);
            props.setCurrentNote({
                userID: props.userID,
                path: currNode["path"] + "/" + fileName + ".md",
                name: fileName,
                tags: [],
                description: "",
                links: [],
                content: ""
            });
            //setSelectedName(currNode["path"] + "/" + fileName + ".md");


            // ADDED BY ARJUN APRIL 18 11:28AM
            // setSelectedPath(currNode["path"] + "/" + fileName + ".md");


        } else {
            if (currNode.hasOwnProperty("children")) {
                currNode["children"].forEach((childNode) => {
                    addNewFile(childNode, selectedNodePath, fileName);
                });
            }
        }
    };

    const addNewFolder = (currNode, selectedNodePath, folderName) => {
        if (currNode["path"] === selectedNodePath) {
            currNode["children"].push({
                type: "Folder",
                name: folderName,
                path: currNode["path"] + "/" + folderName,
                children: []
            });
        } else {
            if (currNode.hasOwnProperty("children")) {
                currNode["children"].forEach((childNode) => {
                    addNewFolder(childNode, selectedNodePath, folderName);
                });
            }
        }
    };

    const handleOnClickCreate = (boolTrigger) => {
        if (boolTrigger) {
            setNewFileModalTrigger(false);
            addNewFile(props.fileSystem, selectedPath, newFileName);
        } else {
            setNewFolderModalTrigger(false);
            addNewFolder(props.fileSystem, selectedPath, newFolderName);
        }
    };

    useEffect(() => {
        moveToHelper(props.fileSystem, selectedPath, []);
    }, [selectedPath]);


    // useEffect(() => {
    //     getNoteDatum(props.userID, props.currentNote.path, (data) => {
    //         props.fileTextRef.current.value = data["content"];
    //     });
    // }, [props.currentNote.path]);

    const fileSystemView = (currNode) => (
        <TreeItem key={currNode["path"]} nodeId={currNode["path"]} label={currNode["name"]}
                  icon={currNode["type"] === "File" ? <InsertDriveFileIcon/> : <FolderIcon/>}
                  onContextMenuCapture={() => {
                      setSelectedPath(currNode["path"]);
                      currNode["type"] === "Folder" ? setIsFolder(true) : setIsFolder(false);
                  }}
                  onDoubleClickCapture={() => {
                      // First, set selectedName = currNode's name

                      if (currNode["type"] === "File" && currNode["path"] != props.currentNote.path) {
                          const setCurrentNoteAndInputBoxValue = (data) => {
                              props.setCurrentNote(data)
                              props.fileTextRef.current.value = data["content"];
                          }
                          getNoteDatum(props.userID, currNode["path"], setCurrentNoteAndInputBoxValue);
                          //setSelectedName(currNode["path"]);
                          // props.setSelectedPath(currNode["path"]);

                      }

                  }}
                  style={{paddingLeft: "5px"}}
        >
            {(currNode.hasOwnProperty("children") && currNode["children"] !== []) ?
                currNode["children"].map((childNode) => fileSystemView(childNode)) :
                null}
        </TreeItem>
    );

    const {show} = useContextMenu({
        id: "contextMenu"
    });

    const handleOnContextMenu = (event) => {
        event.preventDefault();
        show(event);
    };

    const handleOnClickRename = (currNode, selectedNodePath) => {
        if (currNode["path"] === selectedNodePath) {
            currNode["name"] = renamedName;
        } else {
            if (currNode.hasOwnProperty("children")) {
                currNode["children"].forEach((childNode) => {
                    handleOnClickRename(childNode, selectedNodePath);
                });
            }
        }
        setRenameModalTrigger(false);
    };

    const handleOnClickDelete = (currNode, selectedNodePath, isMoveTo) => {
        if (currNode.hasOwnProperty("children")) {
            let boolTrigger = false;
            let currCount = 0;
            let currIndex = 0;
            currNode["children"].forEach((childNode) => {
                if (childNode["path"] === selectedNodePath) {
                    boolTrigger = true;
                    currIndex = currCount;
                } else {
                    currCount++;
                }
            });
            if (boolTrigger) {
                if (isMoveTo) {
                    // console.log("Reaches")
                    changeChildrenPaths(selectedFolder, selectedPath, currNode["children"][currIndex]);
                    moveTo(props.fileSystem, selectedFolder, selectedPath, currNode["children"][currIndex]);
                }
                currNode["children"].splice(currIndex, 1);
            } else {
                currNode["children"].forEach((childNode) => {
                    handleOnClickDelete(childNode, selectedNodePath, isMoveTo);
                });
            }
        }
        setDeleteModalTrigger(false);
    };

    const moveToHelper = (currNode, selectedNodePath, folderArray) => {
        if (currNode.hasOwnProperty("children")) {
            currNode["children"].forEach((childNode) => {
                if (childNode["path"] !== selectedNodePath) {
                    if (childNode.hasOwnProperty("children")) {
                        folderArray.push(childNode["path"]);
                        moveToHelper(childNode, selectedNodePath, folderArray);
                    }
                }
            });
        }
        let localAllFolders = [];
        folderArray.forEach((currFolder, currIndex) => {
            localAllFolders.push(
                <Item key={currIndex} onClick={() => {
                    setSelectedFolder(currFolder);
                }}>{currFolder}</Item>
            );
        });
        setAllFolders(localAllFolders);
    };

    const changeChildrenPaths = (filePath, selectedNodePath, newElem) => {
        if (newElem["path"] === selectedNodePath) {
            newElem["path"] = filePath + newElem["path"];
        }
        if (newElem.hasOwnProperty("children")) {
            newElem["children"].forEach((currChild) => {
                currChild["path"] = filePath + currChild["path"];
                changeChildrenPaths(filePath, selectedNodePath, currChild);
            });
        }
    };

    const moveTo = (currNode, findNode, findPath, newElem) => {
        if (currNode["path"] === findNode) {
            currNode["children"].push(newElem);
        } else {
            if (currNode.hasOwnProperty("children")) {
                currNode["children"].forEach((childNode) => {
                    moveTo(childNode, findNode, findPath, newElem);
                });
            }
        }
    };

    useEffect(() => {
        if (selectedFolder !== "") {
            handleOnClickDelete(props.fileSystem, selectedPath, true);
            setSelectedFolder("");

            // console.log(props.fileSystem)
        }
    }, [selectedFolder]);

    return (
        <div>
            {newFileModalTrigger ?
                <Modal show={newFileModalTrigger} onHide={() => {
                    handleOnClickCancel(true);
                }}>
                    <Modal.Header>
                        <Modal.Title>Create New File</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <label>New File Name:</label><br/>
                            <input type="text"
                                   onChange={(event) => {
                                       setNewFileName(event.target.value);
                                   }}/>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => {
                            handleOnClickCancel(true);
                        }}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => {
                            handleOnClickCreate(true);
                        }}>
                            Create
                        </Button>
                    </Modal.Footer>
                </Modal> :
                null}
            {newFolderModalTrigger ?
                <Modal show={newFolderModalTrigger} onHide={() => {
                    handleOnClickCancel(false);
                }}>
                    <Modal.Header>
                        <Modal.Title>Create New Folder</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <label>New Folder Name:</label><br/>
                            <input type="text"
                                   onChange={(event) => {
                                       setNewFolderName(event.target.value);
                                   }}/>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => {
                            handleOnClickCancel(false);
                        }}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => {
                            handleOnClickCreate(false);
                        }}>
                            Create
                        </Button>
                    </Modal.Footer>
                </Modal> :
                null}
            {renameModalTrigger ?
                <Modal show={renameModalTrigger} onHide={() => {
                    setRenameModalTrigger(false);
                }}>
                    <Modal.Header>
                        <Modal.Title>Rename</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <label>New Name:</label><br/>
                            <input type="text"
                                   onChange={(event) => {
                                       setRenamedName(event.target.value);
                                   }}/>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => {
                            setRenameModalTrigger(false);
                        }}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => {
                            handleOnClickRename(props.fileSystem, selectedPath);
                        }}>
                            Rename
                        </Button>
                    </Modal.Footer>
                </Modal> :
                null}
            {deleteModalTrigger ?
                <Modal show={deleteModalTrigger} onHide={() => {
                    setDeleteModalTrigger(false);
                }}>
                    <Modal.Header>
                        <Modal.Title>Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are You Sure You Want To Delete?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => {
                            setRenameModalTrigger(false);
                        }}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => {
                            handleOnClickDelete(props.fileSystem, selectedPath, false);
                        }}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal> :
                null}
            <div>
                <Menu id={"contextMenu"}>
                    <Submenu label="New" disabled={!isFolder}>
                        <Item onClick={() => {
                            setNewFileModalTrigger(true);
                        }}>File</Item>
                        <Item onClick={() => {
                            setNewFolderModalTrigger(true);
                        }}>Folder</Item>
                    </Submenu>
                    <Item onClick={() => {
                        setRenameModalTrigger(true);
                    }}>Rename</Item>
                    <Item onClick={() => {
                        setDeleteModalTrigger(true);
                    }}>Delete</Item>
                    <Submenu label="Move To">
                        {allFolders}
                    </Submenu>
                </Menu>
            </div>
            <div>
                <div className={"newContainer"}>
                    <div className={"newFileContainer"}>
                        <Button variant="outline-info"
                                onClick={() => {
                                    handleOnClick(true);
                                }}>
                            New File
                        </Button>
                    </div>
                    <div className={"newFolderContainer"}>
                        <Button variant="outline-info"
                                onClick={() => {
                                    handleOnClick(false);
                                }}>
                            New Folder
                        </Button>
                    </div>
                </div>
                <TreeView
                    defaultExpanded={[""]}
                    onContextMenu={handleOnContextMenu}
                >
                    {fileSystemView(props.fileSystem)}
                </TreeView>
            </div>
        </div>
    );
}

export default FileSystem;