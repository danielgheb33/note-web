let byName = true; //true if searching by name, false otherwise

function displayForms () {
    if (document.title === "Stars: Radius Search (Naive)") {
        theAction = "/naiveRadius"
    } else {
        theAction = "/radius"
    }
    if (byName) {
        document.querySelector('#forms').innerHTML =
            '<form method = "POST" id="theForm" class="center">' +
            '<input name="starname" type="text" placeholder="Starname"> <br> <br>' +
            '<input name="radius" type="number" step=any min=0 placeholder="Radius"> <br> <br>' +
            '<input type="submit">' +
            '</form>'
    } else {
        document.querySelector('#forms').innerHTML =
            '<form method = "POST" id="theForm" class="center">' +
            '<input name="x" type="number" step=any placeholder="X-Coordinate"> <br> <br>' +
            '<input name="y" type="number" step=any placeholder="Y-Coordinate"> <br> <br>' +
            '<input name="z" type="number" step=any placeholder="Z-Coordinate"> <br> <br>' +
            '<input name="radius" type="number" step=any min=0 placeholder="Radius"> <br> <br>' +
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