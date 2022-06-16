# cs0320 Term Project 2021

<!-----
NEW: Check the "Suppress top comment" option to remove this info from the output.

Conversion time: 0.606 seconds.


Using this Markdown file:

1. Paste this output into your source file.
2. See the notes and action items below regarding this conversion run.
3. Check the rendered output (headings, lists, code blocks, tables) for proper
   formatting and use a linkchecker before you publish this page.

Conversion notes:

* Docs to Markdown version 1.0β29
* Sun Feb 28 2021 17:07:28 GMT-0800 (PST)
* Source doc: Term Project Outline
----->


**Team Members**

Daniel Ghebreyesus



*   Strengths
    *   Identifying bugs
    *   Identifying edge cases
*   Weaknesses
    *   Timing/Estimating how long a task will take to complete
    *   Making code fully generic

Ian Gordon



*   Strengths
    *   Pretty good at optimizing time complexity
    *   Doesn't require sleep
    *   Obsessively makes code more concise
*   Weaknesses
    *   Hard time reading other's code (might not work well with APIs)
    *   Arjun ;)
    *   Finding bugs

TaShawn Arabian



*   Strengths
    *   Working under pressure
    *   Not very picky, whether it comes to the idea or what part of the project i do
    *   Planning
*   Weaknesses
    *   Procrastination
    *   Debugging 
    *   Takes extra time to fully understand something

Arjun Shanmugam



*   Strengths
    *   Building test suites
    *   Planning out the class structure of a project
    *   Readable, concise code
*   Weaknesses
    *   Gets distracted easily
    *   Has a tough time working for more than 1-2 hours continuously
    *   Generics

**Ideas**



1. Note taking platform
    1. Problem 1: Difficult to take notes in math/physics/science classes bc of symbols and equations (but handwriting is slow and hard to store efficiently)
        1. Solution: using latex (Katex API?) under the hood, allow easy typesetting of symbols, equations, etc. 
        2.  Word processors (like Word) use symbol tables that are difficult to search through quickly 
    2. Problem 2: Although symbols can be typed quickly through Latex, it is difficult to learn
        3. Solution: Advanced mode and easier mode: “autocorrect” style text replacement which uses text recognition to automatically find Latex
        4. Challenges: Integrating Katex API and properly formatting “autocorrected” symbols
    3. Problem 3: Adding offline capabilities
        5. Solution: Taking ideas and inspiration from other apps, that use other ways to solve similar problems(notable, obsidian)
        6. Challenge: integrating all their ideas together while also being original and implementing our own style 
    4. Problem 4: Drawing pad for users with touchpads, sketchpads, etc.
        7. Solution: Adding the ability to take user-drawn input and insert as a PNG
        8. Most challenging feature: Getting user input – how do we standardize this? Input could come from many places, including a trackpad, iPad, or stylus.

**HTA Approval (crusch):** Approved!

**RESUBMISSION EDIT** There are a few algorithms we would like to implement within the note app. The simplest of which is a "Search" functionality that can search notes based on keywords. Additionaly, each "note" has links between them (for instance a note on ecosystems might link to particular notes on trees/animals/soil), so we would like to implement a modified version of Google's PageRank algorithm in order to provide the user with a "Homepage" of their most-referenced notes. To add to the linking functionality, we would like to create a graphical interface were each note is a "bubble" and links between the notes create lines between bubbles. Bubbles will "cluster" if the related notes have many links between them: the idea is to create a visual "web" of bubbles representing interconnected ideas between notes. This will require some method of translating the abstract "link-distance" of PageRank into a 2D vector space.

2.  Unit Converter App
    5. Problem 1: Originality 
        9. Solution: looking at all the top converter apps, then finding and adding certain applications and features to it that would make the app overall more enjoyable
        10. Challenges: obviously it would be difficult to make an app that outperforms a similar top app
    6. Problem 2: Being comprehensive about the different units without using too broad a range of measurements
        11. Solution: Sophisticated planning and thought about which conversions people need most on a daily basis
        12. Challenges: This is by no means an easy task. It would take hours of research and discussion with a number of people from a number of different backgrounds. 

**HTA Approval (crusch):** Rejected — no algorithmic complexity and this already exists.

**Mentor TA:** _Put your mentor TA's name and email here once you're assigned one!_

## Meetings
_On your first meeting with your mentor TA, you should plan dates for at least the following meetings:_

**Specs, Mockup, and Design Meeting:** _(Schedule for on or before March 15)_

**4-Way Checkpoint:** _(Schedule for on or before April 5)_

**Adversary Checkpoint:** _(Schedule for on or before April 12 once you are assigned an adversary TA)_

## How to Build and Run
_A necessary part of any README!_
