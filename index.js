function showLevels() {
    console.log("Show levels clicked!!");
    const menuButtons = document.getElementsByClassName("menu-option");
    for (let button of menuButtons) {
        button.style.display = "none";
    }

    const levelButtons = document.getElementsByClassName("level-option");
    for (let button of levelButtons) {
        button.style.display = "block";
    }
}

function goBackMainMenu() {
    console.log("Going back to main menu");
    const menuButtons = document.getElementsByClassName("level-option");
    for (let button of menuButtons) {
        button.style.display = "none";
    }

    const levelButtons = document.getElementsByClassName("menu-option");
    for (let button of levelButtons) {
        button.style.display = "block";
    }
}