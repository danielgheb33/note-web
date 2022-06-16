import './App.css';
import 'katex/dist/katex.min.css';
import Editor from './editor_page/Editor.js';
import NoteWebPage from "./note_web_page/NoteWebPage";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./home_page/Home";
import TermsAndConditions from "./home_page/TermsAndConditions";
import PrivacyPolicy from "./home_page/PrivacyPolicy";
import {useState} from "react";

function App() {

    const [userID, setUserID] = useState("default_user@email");


    return (
        <div className={"App"}>
            <Router>
                <Switch>
                    {/*<Redirect exact from="/" to="/home"/>*/}
                    <Route path="/termsandconditions" component={(props) => <TermsAndConditions/>} />
                    <Route path="/privacypolicy" component={(props) => <PrivacyPolicy/>} />
                    <Route path="/noteweb" component={(props) => <NoteWebPage {...props} />} />
                    <Route path="/" exact render={(props) => <Home userID={userID} setUserID={setUserID} {...props} />} />
                    <Route path="/editor" render={(props) => <Editor userID={userID} setUserID={setUserID} {...props} />} />
                    <Route path="/noteweb" render={(props) => <NoteWebPage userID={userID} setUserID={setUserID} {...props} />} />
                </Switch>
            </Router>
        </div>
    );
}

export default App;
