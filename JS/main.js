function setSpacerHeight() {
    window.onresize = function() {
        setSpacerHeight();
    }
    var spacer = document.getElementById("spacer");
    var content = document.getElementById("content");
    var navBar = document.getElementById("nav");
    var navBarHeight = navBar.offsetHeight;

    var middleOfScreen = window.innerHeight / 2;
    var contentHeight = content.offsetHeight;
    var contentMiddle = contentHeight / 2;
    var spacerHeight = middleOfScreen - contentMiddle - navBarHeight;
    spacer.style.height = spacerHeight + "px";
}