<<<<<<< HEAD
<!DOCTYPE html>
<#assign content>
<br>
<br>
<div id="link-container">
    <a class="link" id="neighbors-link" href="/neighbors">Click here for a neighbors query!</a>
</div>
<br>
<br>
<div id="link-container">
    <a class="link" id="radius-link" href="/radius">Click here for a radius query!</a>
</div>
<br>
<br>
<div id="link-container">
    <a class="link" id="naive-neighbors-link" href="/naiveNeighbors">Click here for a naive neighbors query!</a>
</div>
<br>
<br>
<div id="link-container">
    <a class="link" id="naive-radius-link" href="/naiveRadius">Click here for a naive radius query!</a>
</div>

</#assign>
<#include "main.ftl">
=======
<#assign content>

    <div class="mainContainer"
         style="background-image: url('https://thumbs.gfycat.com/RingedSpicyKodiakbear-size_restricted.gif'); background-color: #116466; min-height: 100%; height: auto; width: 100%">
        <h1 style="background-color: cadetblue; text-align: center; font-size: xxx-large; color: white; padding: 20px">
            Stars </h1>

        <h2 style="text-align: center; font-style: italic; color: white">Neighbors Search</h2>

        <div style="display: flex; flex: 50%; text-align: center">
            <div style="flex: 100%">
                <form method="POST" action="/naive_neighbors_by_coordinates">
                    <label for="naiveNeighborsByCoordinates" style="color: white">
                        Naive Neighbors (By Coordinates)
                        <br><br>
                    </label>
                    <textarea
                            name="naiveNeighborsByCoordinates"
                            id="naiveNeighborsByCoordinates"
                            placeholder="Enter Search Number Followed By X, Y, Z Coordinates &#10;(Example: 10 0 5.0 0)"
                            style="height: 150px; width: 200px; border-radius: 10px; background-color: lightgray; text-align: center; resize: none;"></textarea><br>
                    <input type="submit">
                </form>
            </div>

            <div style="flex: 100%">
                <label for="naiveNeighborsByName" style="color: white">
                    Naive Neighbors (By Name)
                    <br><br>
                </label>
                <form method="POST" action="/naive_neighbors_by_name">
                    <textarea
                            name="naiveNeighborsByName"
                            id="naiveNeighborsByName"
                            placeholder="Enter Search Number Followed By Name &#10;(Example: 10 &quot;Sol&quot;)"
                            style="height: 150px; width: 200px; border-radius: 10px; background-color: lightgray; text-align: center; resize: none;"></textarea><br>
                    <input type="submit">
                </form>
            </div>

            <div style="flex: 100%">
                <label for="neighborsByCoordinates" style="color: white">
                    Neighbors (By Coordinates)
                    <br><br>
                </label>
                <form method="POST" action="/neighbors_by_coordinates">
                    <textarea
                            name="neighborsByCoordinates"
                            id="neighborsByCoordinates"
                            placeholder="Enter Search Number Followed By X, Y, Z Coordinates &#10;(Example: 10 0 5.0 0)"
                            style="height: 150px; width: 200px; border-radius: 10px; background-color: lightgray; text-align: center; resize: none;"></textarea><br>
                    <input type="submit">
                </form>
            </div>

            <div style="flex: 100%">
                <label for="neighborsByName" style="color: white">
                    Neighbors (By Name)
                    <br><br>
                </label>
                <form method="POST" action="/neighbors_by_name">
                    <textarea
                            name="neighborsByName"
                            id="neighborsByName"
                            placeholder="Enter Search Number Followed By Name &#10;(Example: 10 &quot;Sol&quot;)"
                            style="height: 150px; width: 200px; border-radius: 10px; background-color: lightgray; text-align: center; resize: none;"></textarea><br>
                    <input type="submit">
                </form>
            </div>
        </div>

        <br><br>

        <h2 style="text-align: center; font-style: italic; color: white">Radius Search</h2>

        <div style="display: flex; flex: 50%; text-align: center">
            <div style="flex: 100%">
                <label for="naiveRadiusByCoordinates" style="color: white">
                    Naive Radius (By Coordinates)
                    <br><br>
                </label>
                <form method="POST" action="/naive_radius_by_coordinates">
                    <textarea
                            name="naiveRadiusByCoordinates"
                            id="naiveRadiusByCoordinates"
                            placeholder="Enter Search Radius Followed By X, Y, Z Coordinates &#10;(Example: 10.0 0 5.0 0)"
                            style="height: 150px; width: 200px; border-radius: 10px; background-color: lightgray; text-align: center; resize: none;"></textarea><br>
                    <input type="submit">
                </form>
            </div>

            <div style="flex: 100%">
                <label for="naiveRadiusByName" style="color: white">
                    Naive Radius (By Name)
                    <br><br>
                </label>
                <form method="POST" action="/naive_radius_by_name">
                    <textarea
                            name="naiveRadiusByName"
                            id="naiveRadiusByName"
                            placeholder="Enter Search Radius Followed By Name &#10;(Example: 10 &quot;Sol&quot;)"
                            style="height: 150px; width: 200px; border-radius: 10px; background-color: lightgray; text-align: center; resize: none;"></textarea><br>
                    <input type="submit">
                </form>
            </div>

            <div style="flex: 100%">
                <label for="radiusByCoordinates" style="color: white">
                    Radius (By Coordinates)
                    <br><br>
                </label>
                <form method="POST" action="/radius_by_coordinates">
                    <textarea
                            name="radiusByCoordinates"
                            id="radiusByCoordinates"
                            placeholder="Enter Search Radius Followed By X, Y, Z Coordinates &#10;(Example: 10.0 0 5.0 0)"
                            style="height: 150px; width: 200px; border-radius: 10px; background-color: lightgray; text-align: center; resize: none;"></textarea><br>
                    <input type="submit">
                </form>
            </div>

            <div style="flex: 100%">
                <label for="radiusByName" style="color: white">
                    Radius (By Name)
                    <br><br>
                </label>
                <form method="POST" action="/radius_by_name">
                    <textarea
                            name="radiusByName"
                            id="radiusByName"
                            placeholder="Enter Search Radius Followed By Name &#10;(Example: 10 &quot;Sol&quot;)"
                            style="height: 150px; width: 200px; border-radius: 10px; background-color: lightgray; text-align: center; resize: none;"></textarea><br>
                    <input type="submit">
                </form>
            </div>
        </div>

        <br>

        <h2 style="text-align: center; color: white">Results:</h2>

        <div>
            <div style="background-color: firebrick; color: white; text-align: center;">
                ${errorMessage}
            </div>
            <#list resultsList as currResult>
                <div style="background-color: cadetblue; text-align: center; padding: 10px; margin-bottom: 10px">
                    ${currResult.getStarID()}
                    ${currResult.getProperName()}
                    (${currResult.getXCoordinate()}, ${currResult.getYCoordinate()}
                    , ${currResult.getZCoordinate()})
                </div>
            </#list>
        </div>
    </div>

</#assign>
<#include "main.ftl">
>>>>>>> file_system
