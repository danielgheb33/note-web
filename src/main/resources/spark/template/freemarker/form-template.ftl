<!DOCTYPE html>
<#assign content>
<div id="link-container">
    <a class="link" id="home-button" href="/stars">Return Home</a>
</div>
<div class = "center">
    <button id="toggle-mode">Toggle Mode</button>
    <br> <br> <p> Use the above button to switch between name entry mode and coordinate entry mode. </p>
</div>

<p id="forms"> for neighbors <br>
</p>
<#--<button id="find-neighbors"> Find Nearest Neighbors </button>-->
<p>
    ${script}
</p>
<div class = "center">
    ${results}
</div>
</#assign>
<#include "main.ftl">