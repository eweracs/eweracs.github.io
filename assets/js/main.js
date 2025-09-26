function setSpacerHeight() {
    const spacer = document.getElementById("spacer");
    const content = document.getElementById("content");
    const navBar = document.getElementById("nav");
    const navBarHeight = navBar.offsetHeight;

    const middleOfScreen = window.innerHeight / 2;
    const contentHeight = content.offsetHeight;
    const contentMiddle = contentHeight / 2;
    const spacerHeight = middleOfScreen - contentMiddle - navBarHeight;
    spacer.style.height = `${spacerHeight}px`;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const debouncedSetSpacerHeight = debounce(setSpacerHeight, 250);

window.addEventListener('load', setSpacerHeight);
window.addEventListener('resize', debouncedSetSpacerHeight);