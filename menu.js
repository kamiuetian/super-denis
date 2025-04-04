// Existing menu functions
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

// New intro sequence functionality
let currentDialogIndex = 0;
const introDialogs = [
  "Hey, I am Denis and I am applying for the job at Bank.",
  "Your goal is to select me after going through my resume in three levels. See you at the finish line with Job Letter!",
];

// Add these variables at the top of your file (with your other variables)
let introBackgroundMusic = null;

// Add these functions to control the background music
function playIntroMusic() {
  if (!introBackgroundMusic) {
    introBackgroundMusic = new Audio("assets/introbackmusic.mp3");
    introBackgroundMusic.volume = 0.3; // Set to 30% volume
    introBackgroundMusic.loop = true; // Loop the music
  }

  introBackgroundMusic.play().catch((error) => {
    console.error("Error playing background music:", error);
  });
}

function fadeOutIntroMusic(duration = 1000) {
  if (introBackgroundMusic) {
    const originalVolume = introBackgroundMusic.volume;
    const fadeInterval = 50; // Update volume every 50ms
    const steps = duration / fadeInterval;
    const volumeStep = originalVolume / steps;

    let currentStep = 0;

    const fadeOutInterval = setInterval(() => {
      currentStep++;
      const newVolume = originalVolume - volumeStep * currentStep;

      if (newVolume <= 0) {
        introBackgroundMusic.volume = 0;
        clearInterval(fadeOutInterval);
        introBackgroundMusic.pause();
      } else {
        introBackgroundMusic.volume = newVolume;
      }
    }, fadeInterval);
  }
}

// Add this function above createIntroScreen
function createStartScreen() {
  // Create container
  const startContainer = document.createElement("div");
  startContainer.id = "start-container";
  startContainer.style.position = "fixed";
  startContainer.style.top = "0";
  startContainer.style.left = "0";
  startContainer.style.width = "100%";
  startContainer.style.height = "100%";
  startContainer.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
  startContainer.style.zIndex = "1000";
  startContainer.style.display = "flex";
  startContainer.style.flexDirection = "column";
  startContainer.style.justifyContent = "center";
  startContainer.style.alignItems = "center";
  startContainer.style.cursor = "pointer";
  startContainer.style.transition = "opacity 0.5s ease";

  // Create logo/title
  const title = document.createElement("h1");
  title.textContent = "Super Denis";
  title.style.color = "#4A89DC";
  title.style.fontSize = "48px";
  title.style.marginBottom = "30px";
  title.style.fontFamily = "Comic Sans MS, Arial, sans-serif";
  title.style.textShadow = "2px 2px 4px rgba(0,0,0,0.5)";

  // Create start button
  const startButton = document.createElement("button");
  startButton.textContent = "CLICK TO BEGIN";
  startButton.style.backgroundColor = "#4A89DC";
  startButton.style.color = "#FFFFFF";
  startButton.style.border = "none";
  startButton.style.borderRadius = "10px";
  startButton.style.padding = "15px 30px";
  startButton.style.fontSize = "22px";
  startButton.style.cursor = "pointer";
  startButton.style.fontWeight = "bold";
  startButton.style.transition = "transform 0.2s ease, background-color 0.3s";
  startButton.onmouseover = () => {
    startButton.style.backgroundColor = "#3D7AC8";
    startButton.style.transform = "scale(1.05)";
  };
  startButton.onmouseout = () => {
    startButton.style.backgroundColor = "#4A89DC";
    startButton.style.transform = "scale(1)";
  };

  // Small instruction text
  const instruction = document.createElement("p");
  instruction.textContent = "Experience my interactive resume";
  instruction.style.color = "#FFFFFF";
  instruction.style.marginTop = "20px";
  instruction.style.fontSize = "16px";

  // Handle click event
  startButton.onclick = () => {
    // Fade out start screen
    startContainer.style.opacity = "0";

    // Remove the start screen after fade and start intro
    setTimeout(() => {
      startContainer.remove();
      createIntroScreen();
    }, 500);
  };

  // Append elements
  startContainer.appendChild(title);
  startContainer.appendChild(startButton);
  startContainer.appendChild(instruction);
  document.body.appendChild(startContainer);
}

function createIntroScreen() {
  // Start playing background music
  playIntroMusic();

  // Create the intro container
  const introContainer = document.createElement("div");
  introContainer.id = "intro-container";
  introContainer.style.position = "fixed";
  introContainer.style.top = "0";
  introContainer.style.left = "0";
  introContainer.style.width = "100%";
  introContainer.style.height = "100%";
  introContainer.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  introContainer.style.zIndex = "1000";
  introContainer.style.display = "flex";
  introContainer.style.justifyContent = "center";
  introContainer.style.alignItems = "center";

  // Replace the character div with an image
  const character = document.createElement("img");
  character.id = "intro-character";
  character.src = "assets/mario.png"; // Set the image source
  character.style.position = "absolute";
  character.style.width = "50px";
  character.style.height = "80px";
  character.style.bottom = "50px";
  character.style.left = "50px";
  character.style.transition = "left 2s ease-in-out";

  // Create dialog box as a speech bubble
  const dialogBox = document.createElement("div");
  dialogBox.id = "intro-dialog";
  dialogBox.style.position = "absolute";
  dialogBox.style.width = "70%";
  dialogBox.style.padding = "20px";
  dialogBox.style.backgroundColor = "#FFFFFF"; // White background for speech bubble
  dialogBox.style.border = "2px solid #333333"; // Darker border
  dialogBox.style.color = "#000000"; // Black text for better contrast
  dialogBox.style.fontFamily = "Comic Sans MS, Arial, sans-serif"; // More casual font
  dialogBox.style.fontSize = "18px";
  dialogBox.style.textAlign = "left";
  dialogBox.style.bottom = "150px"; // Position higher above character
  dialogBox.style.display = "none";
  dialogBox.style.opacity = "0";
  dialogBox.style.transition = "opacity 0.5s ease-in-out";
  dialogBox.style.borderRadius = "20px"; // Rounded corners
  dialogBox.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)"; // Add shadow

  // Create speech bubble tail
  const speechTail = document.createElement("div");
  speechTail.style.position = "absolute";
  speechTail.style.bottom = "-20px"; // Position at bottom of bubble
  speechTail.style.left = "50%"; // Center horizontally
  speechTail.style.transform = "translateX(-50%)"; // Center accurately
  speechTail.style.width = "0";
  speechTail.style.height = "0";
  speechTail.style.borderLeft = "15px solid transparent";
  speechTail.style.borderRight = "15px solid transparent";
  speechTail.style.borderTop = "20px solid #FFFFFF"; // Same as bubble background
  speechTail.style.zIndex = "1"; // Ensure it's above other elements

  // Create border for speech tail (to match the bubble border)
  const speechTailBorder = document.createElement("div");
  speechTailBorder.style.position = "absolute";
  speechTailBorder.style.bottom = "-23px"; // Slightly lower than the tail
  speechTailBorder.style.left = "50%";
  speechTailBorder.style.transform = "translateX(-50%)";
  speechTailBorder.style.width = "0";
  speechTailBorder.style.height = "0";
  speechTailBorder.style.borderLeft = "17px solid transparent";
  speechTailBorder.style.borderRight = "17px solid transparent";
  speechTailBorder.style.borderTop = "23px solid #333333"; // Same as bubble border
  speechTailBorder.style.zIndex = "0"; // Behind the white tail

  // Character name element with updated styling
  const characterName = document.createElement("div");
  characterName.textContent = "DENIS";
  characterName.style.color = "#4A89DC"; // Blue color for name
  characterName.style.fontWeight = "bold";
  characterName.style.fontSize = "22px";
  characterName.style.marginBottom = "10px";
  characterName.style.textTransform = "uppercase";
  dialogBox.appendChild(characterName);

  // Dialog text element
  const dialogText = document.createElement("div");
  dialogText.id = "dialog-text";
  dialogText.style.lineHeight = "1.5"; // Better line spacing
  dialogText.style.marginBottom = "15px"; // Space between text and button
  dialogBox.appendChild(dialogText);

  // Next button with updated styling
  const nextButton = document.createElement("button");
  nextButton.textContent = "CONTINUE";
  nextButton.style.backgroundColor = "#4A89DC"; // Blue to match name
  nextButton.style.color = "#FFFFFF";
  nextButton.style.border = "none";
  nextButton.style.borderRadius = "10px"; // Rounded button corners
  nextButton.style.padding = "8px 15px";
  nextButton.style.marginTop = "15px";
  nextButton.style.cursor = "pointer";
  nextButton.style.fontWeight = "bold";
  nextButton.style.transition = "background-color 0.3s";
  nextButton.onmouseover = () => {
    nextButton.style.backgroundColor = "#3D7AC8";
  }; // Darker on hover
  nextButton.onmouseout = () => {
    nextButton.style.backgroundColor = "#4A89DC";
  }; // Back to original
  nextButton.onclick = showNextIntroDialog;
  dialogBox.appendChild(nextButton);

  // Add the speech tail elements to the dialog box
  dialogBox.appendChild(speechTailBorder);
  dialogBox.appendChild(speechTail);

  // Add elements to container
  introContainer.appendChild(character);
  introContainer.appendChild(dialogBox);
  document.body.appendChild(introContainer);

  // Start animation sequence
  setTimeout(() => {
    character.style.left = "calc(50% - 25px)"; // Move to center

    setTimeout(() => {
      dialogBox.style.display = "block";
      setTimeout(() => {
        dialogBox.style.opacity = "1";
        // First dialog is not the last one, so pass false
        typeText(
          introDialogs[currentDialogIndex],
          currentDialogIndex === introDialogs.length - 1
        );
      }, 100);
    }, 2100); // Show dialog after character reaches position
  }, 500); // Small delay before starting animation
}

function typeText(text, isLastDialog = false) {
  const dialogText = document.getElementById("dialog-text");
  dialogText.textContent = "";
  let i = 0;

  // Modify the next button visibility based on dialog position
  const nextButton = document.querySelector("#intro-dialog button");
  if (!isLastDialog) {
    nextButton.style.display = "none"; // Hide button for auto-advance dialogs
  } else {
    nextButton.style.display = "block"; // Show button only for last dialog
    nextButton.textContent = "START GAME";
  }

  // Typewriter effect
  const typeInterval = setInterval(() => {
    if (i < text.length) {
      dialogText.textContent += text.charAt(i);
      i++;
      // Play typing sound (if you have one)
      // playTypingSound();
    } else {
      clearInterval(typeInterval);

      // If not the last dialog, automatically advance to next dialog after delay
      if (!isLastDialog) {
        setTimeout(() => {
          showNextIntroDialog(true); // Changed from showNextDialog to showNextIntroDialog
        }, 1000); // 1 second delay before showing next message
      }
    }
  }, 30); // Adjust speed as needed
}

// Change the function name from showNextDialog to showNextIntroDialog
function showNextIntroDialog(isAutoAdvance = false) {
  currentDialogIndex++;

  if (currentDialogIndex < introDialogs.length) {
    // Show next dialog - mark as last if it's the final dialog
    const isLastDialog = currentDialogIndex === introDialogs.length - 1;
    typeText(introDialogs[currentDialogIndex], isLastDialog);
  } else {
    // End of dialog, fade out music and show menu
    fadeOutIntroMusic(1500); // Fade out over 1.5 seconds

    const introContainer = document.getElementById("intro-container");
    introContainer.style.opacity = "0";

    setTimeout(() => {
      introContainer.remove();
      document.getElementById("game-menu").style.display = "flex";
    }, 1000);
  }
}

// Modified function to initialize menu setup
function initMenu() {
  console.log("Initializing menu...");

  // Hide game menu initially
  document.getElementById("game-menu").style.display = "none";

  // Hide level options initially
  const levelButtons = document.getElementsByClassName("level-option");
  for (let button of levelButtons) {
    button.style.display = "none";
  }

  // Start with the start screen instead of intro
  createStartScreen();
}

// Run initialization when the script loads
document.addEventListener("DOMContentLoaded", initMenu);
