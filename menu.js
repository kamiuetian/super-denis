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
  window.location.href = "resume.html";
}

// New intro sequence functionality
let currentDialogIndex = 0;
const introDialogs = [
  `Welcome! I am Denis and you’re about to dive into an interactive game through my world.
`,
  `Here is my offer: five minutes of your attention, in exchange for something memorable.
Through three levels, you’ll get to know me: my personality, what I bring to the table, and what motivates me.
`,
  `Your mission is to play through each level and see how I could grow with your team.`,
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
// Add this function to create consistent logo across all screens
function createLogo(container) {
  // Create logo element
  const logo = document.createElement("img");
  logo.src = "assets/logo.png"; // Make sure this file exists in your assets folder
  logo.alt = "Logo";
  logo.style.position = "absolute";
  logo.style.top = "15px";
  logo.style.right = "15px";
  logo.style.width = "120px"; // Adjust size as needed
  logo.style.height = "auto";
  logo.style.zIndex = "1001"; // Make sure it appears above other elements

  // Add the logo to the specified container
  container.appendChild(logo);

  return logo;
}
// Add this function in menu.js - can be placed near the createLogo function
function addBottomBorder(container) {
  // Remove any existing border style
  container.style.borderBottom = "";

  // Create bottom border div
  const bottomBorder = document.createElement("div");
  bottomBorder.style.position = "absolute";
  bottomBorder.style.bottom = "0";
  bottomBorder.style.left = "0";
  bottomBorder.style.width = "100%";
  bottomBorder.style.height = "10px";
  bottomBorder.style.backgroundColor = "#fed200"; // Yellow color
  bottomBorder.style.zIndex = "1001"; // Make sure it's visible

  // Append border to container
  container.appendChild(bottomBorder);

  return bottomBorder;
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
  startContainer.style.backgroundColor = "#002e3c"; // Semi-transparent overlay
  //startContainer.style.backgroundImage = "url('assets/titlepage.png')";
  startContainer.style.backgroundSize = "100% 100%"; // Cover the entire screen
  startContainer.style.backgroundPosition = "center";
  startContainer.style.backgroundRepeat = "no-repeat"; // Add this to prevent repeating
  startContainer.style.borderBottom = "10px solid #fed200";

  startContainer.style.zIndex = "1000";
  startContainer.style.display = "flex";
  startContainer.style.flexDirection = "column";
  startContainer.style.justifyContent = "center";
  startContainer.style.alignItems = "center";
  startContainer.style.cursor = "pointer";
  startContainer.style.transition = "opacity 0.5s ease";

  // Create logo/title
  const title = document.createElement("h1");
  title.textContent = "The IDDP Saga: ";
  title.id = "main-title";
  addBottomBorder(startContainer);
  const subtile = document.createElement("h2");
  subtile.textContent = "Denis Tezerdi";
  subtile.className = "author";
  // Create start button
  const startButton = document.createElement("button");
  startButton.textContent = "CLICK TO BEGIN";
  startButton.style.backgroundColor = "#fed200"; // Same as bottom border color
  startButton.style.color = "#002e3c"; // Same as background color
  startButton.style.border = "none";
  startButton.style.borderRadius = "10px";
  startButton.style.padding = "12px 24px"; // Reduced from 15px 30px
  startButton.style.fontSize = "20px"; // Reduced from 22px
  startButton.style.cursor = "pointer";
  startButton.style.fontWeight = "bold";
  startButton.style.transition = "transform 0.2s ease, background-color 0.3s";
  startButton.onmouseover = () => {
    startButton.style.backgroundColor = "#e6be00"; // Slightly darker yellow on hover
    startButton.style.transform = "scale(1.05)";
  };
  startButton.onmouseout = () => {
    startButton.style.backgroundColor = "#fed200"; // Back to original yellow
    startButton.style.transform = "scale(1)";
  };

  // Small instruction text
  const instruction = document.createElement("p");
  instruction.textContent = "Experience my interactive resume";
  instruction.style.color = "#FFFFFF";
  instruction.style.marginTop = "20px";
  instruction.style.fontSize = "16px";

  // Add logo to top right
  createLogo(startContainer);

  // Handle click event
  startButton.onclick = () => {
    // Fade out start screen
    startContainer.style.opacity = "1";

    // Remove the start screen after fade and start intro
    setTimeout(() => {
      startContainer.remove();
      createIntroScreen();
    }, 500);
  };

  // Append elements
  startContainer.appendChild(title);
  startContainer.appendChild(subtile);
  startContainer.appendChild(startButton);
  //startContainer.appendChild(instruction);
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
  introContainer.style.backgroundColor = "#002e3c";
  //introContainer.style.backgroundImage = "url('assets/titlepage.png')";
  introContainer.style.backgroundSize = "contain";
  introContainer.style.backgroundPosition = "center";
  introContainer.style.backgroundRepeat = "no-repeat"; // Prevent repeating
  introContainer.style.borderBottom = "10px solid #fed200";
  introContainer.style.zIndex = "1000";
  introContainer.style.display = "flex";
  introContainer.style.justifyContent = "center";
  introContainer.style.alignItems = "center";
  addBottomBorder(introContainer);
  // Replace the character div with an image
  // Replace the character div with a canvas for animation
  const character = document.createElement("canvas");
  character.id = "intro-character";
  character.width = 32 * 3; // Each frame is 32px wide, scale by 3
  character.height = 32 * 3; // Each frame is 32px high, scale by 3
  character.style.position = "absolute";
  character.style.bottom = "10px";
  character.style.left = "50px";
  character.style.transition = "left 4s ease-in-out";
  character.style.zIndex = "1000";

  // Add the character animation logic
  const ctx = character.getContext("2d");
  ctx.imageSmoothingEnabled = false; // Disable anti-aliasing to prevent glow

  const spriteSheet = new Image();
  spriteSheet.src = "assets/denis/NavySuitRunning.png";

  // Add static image for when character stops
  const staticImage = new Image();
  staticImage.src = "assets/denis/NavySuit.png";

  // Set up animation variables
  let frameIndex = 0;
  const frameCount = 8; // NavySuitRunning.png has 8 frames
  const frameWidth = 32;
  const frameHeight = 32;
  let lastFrameTime = 0;
  const frameDelay = 100; // 100ms between frames (10fps)
  let useStaticImage = false; // Add this flag

  // Animation function
  function animateCharacter(timestamp) {
    if (!lastFrameTime) lastFrameTime = timestamp;

    // Always update if enough time has passed (removed animationActive check)
    if (timestamp - lastFrameTime > frameDelay) {
      // Clear canvas
      ctx.clearRect(0, 0, character.width, character.height);

      // Draw the appropriate image based on state
      if (useStaticImage) {
        // Draw static image (no frame index needed)
        ctx.drawImage(
          staticImage,
          0,
          0,
          staticImage.width,
          staticImage.height,
          0,
          0,
          character.width,
          character.height
        );
      } else {
        // Draw running animation frame
        ctx.drawImage(
          spriteSheet,
          frameIndex * frameWidth,
          0,
          frameWidth,
          frameHeight,
          0,
          0,
          character.width,
          character.height
        );

        // Update frame index (only for running animation)
        frameIndex = (frameIndex + 1) % frameCount;
      }

      lastFrameTime = timestamp;
    }

    // Always continue animation loop
    requestAnimationFrame(animateCharacter);
  }

  // Start animation when image loads
  spriteSheet.onload = () => {
    requestAnimationFrame(animateCharacter);
  };

  // Start animation sequence

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
  characterName.style.color = "#002e3c"; // Blue color for name
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

  // Add the speech tail elements to the dialog box
  dialogBox.appendChild(speechTailBorder);
  dialogBox.appendChild(speechTail);

  // Add logo to top right
  createLogo(introContainer);

  // Add elements to container
  introContainer.appendChild(character);
  introContainer.appendChild(dialogBox);
  document.body.appendChild(introContainer);

  // Start animation sequence
  setTimeout(() => {
    character.style.left = "calc(50% - 40px)"; // Move to center

    setTimeout(() => {
      useStaticImage = true;
      dialogBox.style.display = "block";
      setTimeout(() => {
        dialogBox.style.opacity = "1";
        // First dialog is not the last one, so pass false
        typeText(
          introDialogs[currentDialogIndex],
          currentDialogIndex === introDialogs.length - 1
        );
      }, 100);
    }, 4100); // Increased to match the longer character movement (was 2100)
  }, 500); // Small delay before starting animation
}

function typeText(text, isLastDialog = false) {
  const dialogText = document.getElementById("dialog-text");
  dialogText.textContent = "";
  let i = 0;

  // Get the button container or create one if it doesn't exist
  let buttonContainer = document.querySelector(
    "#intro-dialog .button-container"
  );
  if (!buttonContainer) {
    buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";
    buttonContainer.style.display = "flex";
    buttonContainer.style.justifyContent = "center";
    buttonContainer.style.gap = "15px";
    buttonContainer.style.marginTop = "15px";
    document.querySelector("#intro-dialog").appendChild(buttonContainer);
  }

  // Clear any existing buttons
  buttonContainer.innerHTML = "";

  // Hide buttons initially - always hide until text is fully typed
  buttonContainer.style.display = "none";

  // Typewriter effect
  const typeInterval = setInterval(() => {
    if (i < text.length) {
      dialogText.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(typeInterval);

      // If not the last dialog, automatically advance to next dialog after delay
      if (!isLastDialog) {
        setTimeout(() => {
          showNextIntroDialog(true);
        }, 2000);
      } else {
        // MOVED HERE: Only create and show buttons after text is fully typed
        // and only if it's the last dialog
        buttonContainer.style.display = "flex"; // Now show the buttons

        // Add Start Game button
        const startGameButton = document.createElement("button");
        startGameButton.textContent = "Accept the mission";
        startGameButton.style.backgroundColor = "#002e3c";
        startGameButton.style.color = "#FFFFFF";
        startGameButton.style.border = "none";
        startGameButton.style.borderRadius = "10px";
        startGameButton.style.padding = "8px 15px";
        startGameButton.style.cursor = "pointer";
        startGameButton.style.fontWeight = "bold";
        startGameButton.style.transition = "background-color 0.3s";
        startGameButton.onmouseover = () => {
          startGameButton.style.backgroundColor = "#002e3c";
          startGameButton.style.opacity = "0.7"; // Slightly transparent on hover
        };
        startGameButton.onmouseout = () => {
          startGameButton.style.backgroundColor = "#002e3c";
          startGameButton.style.opacity = "1"; // Slightly transparent on hover
        };
        startGameButton.onclick = () => {
          // End dialog and show main menu
          fadeOutIntroMusic(1500);
          const introContainer = document.getElementById("intro-container");
          introContainer.style.opacity = "0";
          setTimeout(() => {
            introContainer.remove();
            // Show the game menu div
            const gameMenu = document.getElementById("game-menu");
            gameMenu.classList.remove("hidden");

            // Immediately call showLevels to display level buttons
            showLevels();
          }, 1000);
        };
        buttonContainer.appendChild(startGameButton);

        // Add Go to Videos button
        const videoButton = document.createElement("button");
        videoButton.textContent = "Decline the mission";
        videoButton.style.backgroundColor = "#FF5722"; // Different color to distinguish
        videoButton.style.color = "#FFFFFF";
        videoButton.style.border = "none";
        videoButton.style.borderRadius = "10px";
        videoButton.style.padding = "8px 15px";
        videoButton.style.cursor = "pointer";
        videoButton.style.fontWeight = "bold";
        videoButton.style.transition = "background-color 0.3s";
        videoButton.onmouseover = () => {
          videoButton.style.backgroundColor = "#E64A19";
        };
        videoButton.onmouseout = () => {
          videoButton.style.backgroundColor = "#FF5722";
        };
        videoButton.onclick = () => {
          // Show confirmation dialog
          showConfirmationModal(
            "Playing through the game will give you the full experience of my interactive resume. Are you sure you want to skip to the resume?",
            "Go to Resume",
            "Stay Here",
            () => {
              // This function runs if they confirm
              window.open("resume.html", "_blank");
            }
          );
        };
        buttonContainer.appendChild(videoButton);
      }
    }
  }, 60);
}

// Update showNextIntroDialog function to NOT add the button since we're handling it in typeText
function showNextIntroDialog(isAutoAdvance = false) {
  currentDialogIndex++;

  if (currentDialogIndex < introDialogs.length) {
    // Show next dialog - mark as last if it's the final dialog
    const isLastDialog = currentDialogIndex === introDialogs.length - 1;
    typeText(introDialogs[currentDialogIndex], isLastDialog);
  } else {
    // This else block should never be reached now since we handle the transition in the button click
    // But keep it as a fallback
    fadeOutIntroMusic(1500);
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

  // Get the game menu element
  const gameMenu = document.getElementById("game-menu");

  // Set up game menu styling
  gameMenu.style.backgroundColor = "#002e3c";
  gameMenu.style.borderBottom = "10px solid #fed200";

  // Add logo to game menu
  createLogo(gameMenu);
  addBottomBorder(gameMenu);

  // Check URL parameters FIRST before creating any screens
  const urlParams = new URLSearchParams(window.location.search);
  console.log("URL Parameters:", urlParams.toString());
  if (urlParams.get("skip_intro") === "true") {
    // Skip intro and start screen, directly show level menu
    console.log("Skip intro param detected - showing level menu directly");

    // Remove the 'hidden' class to make menu visible
    gameMenu.classList.remove("hidden");

    // Hide main menu options (if any)
    const menuButtons = document.getElementsByClassName("menu-option");
    for (let button of menuButtons) {
      button.style.display = "none";
    }

    // Show level options
    const levelButtons = document.getElementsByClassName("level-option");
    for (let button of levelButtons) {
      button.style.display = "block";
    }

    // Add any animations if needed
    document.querySelectorAll(".level-button").forEach((button, index) => {
      setTimeout(() => {
        button.classList.add("visible");
      }, index * 100);
    });

    // Clear any intro elements that might exist
    const introContainer = document.getElementById("intro-container");
    if (introContainer) introContainer.remove();

    const startContainer = document.getElementById("start-container");
    if (startContainer) startContainer.remove();
  } else {
    // Normal flow - hide level options initially
    const levelButtons = document.getElementsByClassName("level-option");
    for (let button of levelButtons) {
      button.style.display = "none";
    }

    // Start with the standard start screen
    createStartScreen();
  }
}

// Add this function at the appropriate place in your file
function showConfirmationModal(message, confirmText, cancelText, onConfirm) {
  // Create modal container with background overlay
  const modalContainer = document.createElement("div");
  modalContainer.style.position = "fixed";
  modalContainer.style.top = "0";
  modalContainer.style.left = "0";
  modalContainer.style.width = "100%";
  modalContainer.style.height = "100%";
  modalContainer.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  modalContainer.style.display = "flex";
  modalContainer.style.justifyContent = "center";
  modalContainer.style.alignItems = "center";
  modalContainer.style.zIndex = "2000";
  modalContainer.style.opacity = "0";
  modalContainer.style.transition = "opacity 0.3s ease";

  // Create modal content
  const modalContent = document.createElement("div");
  modalContent.style.backgroundColor = "#FFFFFF";
  modalContent.style.padding = "25px";
  modalContent.style.borderRadius = "15px";
  modalContent.style.width = "80%";
  modalContent.style.maxWidth = "500px";
  modalContent.style.textAlign = "center";
  modalContent.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.3)";
  modalContent.style.transform = "scale(0.8)";
  modalContent.style.transition = "transform 0.3s ease";

  // Message
  const messageElement = document.createElement("p");
  messageElement.textContent = message;
  messageElement.style.fontSize = "18px";
  messageElement.style.marginBottom = "20px";
  messageElement.style.color = "#333";
  messageElement.style.fontFamily = "Comic Sans MS, Arial, sans-serif";

  // Button container
  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.justifyContent = "center";
  buttonContainer.style.gap = "15px";

  // Continue button
  const confirmButton = document.createElement("button");
  confirmButton.textContent = confirmText;
  confirmButton.style.backgroundColor = "#FF5722";
  confirmButton.style.color = "#FFFFFF";
  confirmButton.style.border = "none";
  confirmButton.style.borderRadius = "10px";
  confirmButton.style.padding = "10px 20px";
  confirmButton.style.cursor = "pointer";
  confirmButton.style.fontWeight = "bold";
  confirmButton.style.transition = "background-color 0.3s";
  confirmButton.onmouseover = () => {
    confirmButton.style.backgroundColor = "#E64A19";
  };
  confirmButton.onmouseout = () => {
    confirmButton.style.backgroundColor = "#FF5722";
  };
  confirmButton.onclick = () => {
    // Fade out and remove
    modalContainer.style.opacity = "0";
    modalContent.style.transform = "scale(0.8)";
    setTimeout(() => {
      document.body.removeChild(modalContainer);
      onConfirm(); // Execute the confirm callback
    }, 300);
  };

  // Cancel button
  const cancelButton = document.createElement("button");
  cancelButton.textContent = cancelText;
  cancelButton.style.backgroundColor = "#4A89DC";
  cancelButton.style.color = "#FFFFFF";
  cancelButton.style.border = "none";
  cancelButton.style.borderRadius = "10px";
  cancelButton.style.padding = "10px 20px";
  cancelButton.style.cursor = "pointer";
  cancelButton.style.fontWeight = "bold";
  cancelButton.style.transition = "background-color 0.3s";
  cancelButton.onmouseover = () => {
    cancelButton.style.backgroundColor = "#3D7AC8";
  };
  cancelButton.onmouseout = () => {
    cancelButton.style.backgroundColor = "#4A89DC";
  };
  cancelButton.onclick = () => {
    // Fade out and remove
    modalContainer.style.opacity = "0";
    modalContent.style.transform = "scale(0.8)";
    setTimeout(() => {
      document.body.removeChild(modalContainer);
    }, 300);
  };

  // Append elements
  buttonContainer.appendChild(cancelButton); // Cancel first (left)
  buttonContainer.appendChild(confirmButton); // Confirm second (right)
  modalContent.appendChild(messageElement);
  modalContent.appendChild(buttonContainer);
  modalContainer.appendChild(modalContent);

  // Add to document
  document.body.appendChild(modalContainer);

  // Trigger animation
  setTimeout(() => {
    modalContainer.style.opacity = "1";
    modalContent.style.transform = "scale(1)";
  }, 10);
}

// Run initialization when the script loads
document.addEventListener("DOMContentLoaded", initMenu);
// Add this function to menu.js (or modify your existing level selection handler)
function selectLevel(level) {
  console.log("Selected level:", level);
  if (level === 1) {
    try {
      localStorage.removeItem("level1Checkpoint");
      console.log("Level 1 checkpoint data reset");
    } catch (e) {
      console.error("Error resetting Level 1 checkpoint data:", e);
    }
  }
  // For Level 3, redirect to video2.html to ensure the intro dialogue plays
  if (level === 3) {
    window.location.href = "video2.html?skip_button=true"; // Add skip_intro parameter to URL
    return; // Stop execution here for level 3
  }

  // Existing code for other levels
  const gameMenu = document.getElementById("game-menu");
  gameMenu.classList.add("hidden");

  selectedLevel = level;
  console.log("Setting level to:", selectedLevel);

  // Initialize the game with the selected level
  if (!game) {
    game = new Phaser.Game(config);
    gameStarted = true;
  } else {
    game.scene.scenes[0].scene.restart();
  }
}
