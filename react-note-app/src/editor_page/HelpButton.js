import React, {useState} from "react";
import HelpIcon from '@material-ui/icons/Help';
import './HelpButton.css';

function HelpButton() {

    const [isVisible, setIsVisible] = useState(false)

    const helpInformation = () => (
        <div className={"helpInfoContainer"}
             onMouseEnter={() => {
                 setIsVisible(true)
             }}
             onMouseLeave={() => {
                 setIsVisible(false)
             }}>
            <div className={"helpInfoStyle"}>
                <div>
                    <h2>CS32 Notes How To Guide:</h2>

                    <h3>Overview</h3>

                    In order to access CS32 Notes’ full functionality it is best if you have at
                    least a
                    basic understanding on how to use these certain features. Knowing Markdown,
                    LaTeX,
                    and/or KaTeX will already put you in a good position to get the most out of our
                    creation, but don’t worry this guide will help teach you or refresh your memory
                    if
                    you don’t feel comfortable hopping right in. Mind you CS32 Notes can still be
                    used
                    if these languages are not understood, it just overall improves the user
                    experience
                    and allows for more creative and/or useful types of ways to take notes. Besides
                    learning these languages it is also beneficial to learn certain features that
                    our
                    project contains, which is why we will be going over them within the Important
                    Tips
                    section. Again CS32 Notes can be used without knowing this information, it just
                    allows you to get the full use out of this website.
                    <h3>Important Tips</h3>
                    <h4>What is the Note Net??</h4>
                    The Note Net is a visual representation of all of your notes
                    The Note Net is created based off certain factors that each Note contains
                    These specifications are plugged into our physics algorithm
                    Then bam! The Note Net is created
                    Hovering over a Note, will provide information for that Note
                    Clicking on the Note will pull the Note up into an editor
                    <h4>What are the different Note Net Modes??</h4>
                    <h4>Tags</h4>
                    The notes Cluster together based off similar tags
                    Notes are represented as different colors based on the tags
                    <h4>Links</h4>
                    The notes are connected together based off of Links
                    If the connection is facing outward in a clockwise direction it is an outgoing
                    tag
                    The more outgoing tags, the closer to the center
                    In both modes, Note size depends on the amount of outgoing tags

                    <h4>What does each Note contain??</h4>
                    <ul>
                        <li>The user’s email</li>
                        <li>The Note’s name</li>
                        <li>The Note’s Tag</li>
                        <li>Links to other Notes/Websites within that Note</li>
                        <li>A Description of that specific Note</li>
                    </ul>
                    <h4>What is Linking??</h4>
                    Linking is used to connect specific ideas and notes
                    Whenever you decide it is useful to reference a particular note, you can plug in
                    the
                    link
                    This provides information for the Note Net, allowing for a better visual
                    <h4>How do I add Links??</h4>
                    Simply put on the line you think would suite best to reference a past Note
                    Enclose link text within brackets, then immediately follow up with the URL/path
                    to
                    notes within parentheses
                    i.e.( [CS32 Note reference](www.cs32notesHelp.com) )
                    Additional information within Markdown link
                    <h4>How do I add Tags??</h4>
                    On the first line inside of your editor you can implement your tags
                    You must denote each tag with ~
                    i.e.(~CS ~Guide ~Help)
                    The first tag will be used within the Note Net, make sure it is the most
                    important
                    <h4>How do I add Descriptions??</h4>
                    You can add a description on the line directly below the tags
                    You must denote the description with %
                    i.e.(%This guide is used to help the user understand CS32 Notes)
                    <h3>In Depth Links</h3>
                    <ul>
                        <li>How to use Markdown: {}
                            <a href={"https://www.markdownguide.org/basic-syntax/"}
                               target={"_blank"}>https://www.markdownguide.org/basic-syntax/</a>
                        </li>
                        <li>How to use LaTeX: {}
                            <a href={"https://www.overleaf.com/learn/latex/Learn_LaTeX_in_30_minutes"}
                               target={"_blank"}>https://www.overleaf.com/learn/latex/Learn_LaTeX_in_30_minutes</a>
                        </li>
                        <li>
                            How to use KaTeX: {}
                            <a href={"https://www.overleaf.com/learn/latex/Learn_LaTeX_in_30_minutes"}
                               target={"_blank"}>https://katex.org/docs/supported.html</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )

    return (
        <div className={"HelpButton"}>
            {
                isVisible ? (helpInformation()) : null
            }
            <div className={"helpButtonContainer"}
                 onMouseEnter={() => {
                     setIsVisible(true)
                 }}
                 onMouseLeave={() => {
                     setIsVisible(false)
                 }}
            >
                <HelpIcon className={"helpButtonStyle"}/>
            </div>
        </div>
    )
}

export default HelpButton;