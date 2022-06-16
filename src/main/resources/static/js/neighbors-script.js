let byName = true; //true if searching by name, false otherwise


function displayForms () {
    let theAction = "";
    if (document.title === "Stars: Nearest Neighbors (Naive)") {
        theAction = "/naiveNeighbors"
    } else {
        theAction = "/neighbors"
    }
    if (byName) {
        document.querySelector('#forms').innerHTML =
            '<form method = "POST" id="theForm" class="center">' +
            '<input name="starname" required="required" type="text" step = "any" placeholder="Starname"> <br> <br>' +
            '<input name="neighbors" required="required" type="number" min = 0 placeholder="Num. of Neighbors"> <br> <br>' +
            '<input type="submit">' +
            '</form>'
    } else {
        document.querySelector('#forms').innerHTML =
            '<form method = "POST" id="theForm" class="center">' +
            '<input name="x" required="required" type="number" step = "any" placeholder="X-Coordinate"> <br> <br>' +
            '<input name="y" required="required" type="number" step = "any" placeholder="Y-Coordinate"> <br> <br>' +
            '<input name="z" required="required" type="number" step = "any" placeholder="Z-Coordinate"> <br> <br>' +
            '<input name="neighbors" required="required" type="number" min = 0 placeholder="Num. of Neighbors"> <br> <br>' +
            '<div class = "center"> <input type="submit"> </div>' +
            '</form>'
    }
    if (document.querySelector('.theForm') != null) {
        document.querySelector('.theForm').action = theAction;
    }
}
function toggleMode () {
    byName = !byName;
    displayForms();
}


//TODO: add an event listener (addTwoNumbers) to the "#compute-button" on "click
// document.querySelector('#find-neighbors').addEventListener("click", displayResults);
document.querySelector('#toggle-mode').addEventListener("click", toggleMode);

displayForms();