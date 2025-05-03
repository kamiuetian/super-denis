// Main game file - core initialization and configuration

// Constants
const GRAVITY = 250;
const PLAYER_SCALE = 3;

// Global variables
let game;
let gameStarted = false;
let playerState = "small";
let selectedLevel = 1;
const level3Skills = [
  {
    icon: "🏛",
    name: "Politics on Digital Education",
    year: "2016",
    desc: "Worked in politics focusing on digital education initiatives.",
  },
  {
    icon: "👨‍💻",
    name: "First Coding Experience",
    year: "2018",
    desc: "Gained first hands-on coding experience with Python, Stata, and R.",
  },
  {
    icon: "📈",
    name: "Digital Project Management",
    year: "2024",
    desc: "Acquired experience in managing digital projects.",
  },
  {
    icon: "☁",
    name: "Cloud & Security Seminar",
    year: "2024",
    desc: "Delivered a seminar on cloud technologies and security topics.",
  },
  {
    icon: "🤖",
    name: "AI Workshop",
    year: "2025",
    desc: "Conducted a workshop focused on Artificial Intelligence.",
  },
  {
    icon: "🎮",
    name: "Game Development Project",
    year: "2025",
    desc: "Worked on a project involving game development.",
  },
  {
    icon: "💳",
    name: "FinTech Tools and Investments",
    year: "2021",
    desc: "Gained experience with financial technology tools and investment strategies.",
  },
  {
    icon: "🛒",
    name: "Research on AR & VR in Commerce",
    year: "2022",
    desc: "Authored a research paper on the impact of Augmented and Virtual Reality on commerce.",
  },
  {
    icon: "🎓",
    name: "Bachelor of Science",
    year: "2024",
    desc: "Completed Bachelor of Science in Wirtschaftswissenschaften.",
  },
  {
    icon: "🤝",
    name: "Client Account Management",
    year: "2024",
    desc: "Handled client accounts and relationship management.",
  },
  {
    icon: "🖥",
    name: "First IT Solution Sale",
    year: "2025",
    desc: "Closed the first sale of an IT solution.",
  },
];
// Game configuration
const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  parent: "game-container",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: GRAVITY },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

// Modify startGame function to use this dialogue for Level 3
function startGame(level) {
  // Hide menu elements
  document.getElementsByClassName("bg")[0].style.display = "none";

  // Set game container to full screen
  const gameContainer = document.getElementById("game-container");
  gameContainer.style.width = "100vw";
  gameContainer.style.height = "100vh";
  gameContainer.style.margin = "0";
  gameContainer.style.padding = "0";
  gameContainer.style.overflow = "hidden";

  // Store selected level
  selectedLevel = level;

  // For Level 3, show the intro dialogue
  if (level === 3) {
    // Hide game container temporarily
    gameContainer.style.display = "none";

    // Show Level 3 intro dialogue
    showLevel3Intro(() => {
      // Show game container
      gameContainer.style.display = "block";

      // Initialize the game
      if (!game) {
        game = new Phaser.Game(config);
      } else {
        game.scale.resize(window.innerWidth, window.innerHeight);
      }

      // Set flag to skip in-game dialogue since we showed it already
      if (game && game.scene && game.scene.scenes[0]) {
        game.scene.scenes[0].dialogueShown = true;
      }
    });
  } else {
    // For other levels, start the game directly
    if (!game) {
      game = new Phaser.Game(config);
    } else {
      game.scale.resize(window.innerWidth, window.innerHeight);
    }
  }

  gameStarted = true;
}

// Add this helper function to handle the actual game initialization
function initializeGame() {
  if (!game) {
    game = new Phaser.Game(config);
  } else {
    game.scale.resize(window.innerWidth, window.innerHeight);
  }

  // Add window resize handler
  window.addEventListener("resize", () => {
    if (game) {
      game.scale.resize(window.innerWidth, window.innerHeight);
    }
  });
}

// Preload assets
function preload() {
  if (!gameStarted) return;
  this.load.image("levelBackground", "assets/denis/bg.jpg");
  this.load.image("level1Background", "assets/denis/level1bg.png");
  this.load.spritesheet("secondCharacter", "assets/denis/SecondCharacter.png", {
    frameWidth: 32,
    frameHeight: 32,
  });
  this.load.image("NavyBoy", "assets/denis/ElegentSecondCharacterStand.png");
  this.load.spritesheet("l3playerStand", "assets/denis/NavySuitIdle.png", {
    frameWidth: 32,
    frameHeight: 32,
  });
  this.load.spritesheet("l3playerJump", "assets/denis/NavySuitJump.png", {
    frameWidth: 32,
    frameHeight: 32,
  });
  this.load.spritesheet("l3playerRun", "assets/denis/NavySuitRunning.png", {
    frameWidth: 32,
    frameHeight: 32,
  });
  this.load.image("level2Background", "assets/denis/levle2bg.png");
  this.load.spritesheet("drawbridge", "assets/denis/WoodenGateAndTower.png", {
    frameWidth: 64, // Adjust based on actual sprite dimensions
    frameHeight: 128, // Adjust based on actual sprite dimensions
  });
  this.load.spritesheet("tennis-idle", "assets/denis/l2Player.png", {
    frameWidth: 32,
    frameHeight: 32,
  });

  this.load.spritesheet("tennis-run", "assets/denis/l2Playerrun.png", {
    frameWidth: 32,
    frameHeight: 32,
  });
  this.load.spritesheet("monster-run", "assets/denis/MonsterRunning.png", {
    frameWidth: 32,
    frameHeight: 32,
  });
  this.load.spritesheet(
    "player-idle",
    "assets/denis/School_withBackpackIdle.png",
    {
      frameWidth: 32,
      frameHeight: 32,
    }
  );

  this.load.spritesheet(
    "player-run",
    "assets/denis/School_withBackpackRunning.png",
    {
      frameWidth: 32,
      frameHeight: 32,
    }
  );

  this.load.spritesheet(
    "player-jump",
    "assets/denis/School_withBackpackJump.png",
    {
      frameWidth: 32,
      frameHeight: 32,
    }
  );

  this.load.spritesheet(
    "player-dead",
    "assets/denis/School_withBackpackDead.png",
    {
      frameWidth: 32,
      frameHeight: 32,
    }
  );
  // Load Level 3 skill images
  this.load.image("customBlock", "assets/overworld/customBlock.png");
  this.load.image("blockGround", "block.png");
  this.load.image("block", "assets/overworld/block.png");
  this.load.image("pipe", "assets/overworld/pipe1.png");
  this.load.image("pipe2", "assets/overworld/pipe2.png");
  this.load.image("flag", "assets/overworld/flag-mast.png");
  this.load.image("emptyBlock", "assets/overworld/emptyBlock.png");

  this.load.image("tech1", "assets/level3/ai-assistant.png");
  this.load.image("tech2", "assets/level3/analytics.png");
  this.load.image("tech3", "assets/level3/atm-card.png");
  this.load.image("tech4", "assets/level3/bank.png");
  this.load.image("tech5", "assets/level3/bitcoin.png");
  this.load.image("finance1", "assets/level3/encryption.png");
  this.load.image("finance2", "assets/level3/increase.png");
  this.load.image("finance3", "assets/level3/money-bag.png");
  this.load.image("finance4", "assets/level3/programming.png");
  this.load.image("finance5", "assets/level3/satellite.png");

  this.load.image("finance6", "assets/level3/smartphone.png");
  // Load background images
  this.load.image("background11", "assets/Level 1 - Image 1.png");
  this.load.image("background12", "assets/Level 1 - Image 2.png");
  this.load.image("background13", "assets/Level 1 - Image 3.png");
  this.load.image("background21", "assets/Level 2 - Image 1.png");
  this.load.image("background22", "assets/Level 2 - Image 2.png");
  this.load.image("background23", "assets/Level 2 - Image 3.png");
  this.load.image("background31", "assets/Level 3 - Image 1.png");
  this.load.image("background32", "assets/Level 3 - Image 2.png");
  this.load.image("background33", "assets/Level 3 - Image 3.png");

  // Load game objects
  this.load.image("commerz", "assets/commerz.png");
  this.load.image("cloud", "assets/overworld/cloud.png");
  this.load.image("coin", "assets/coin.png");
  this.load.image("enemy", "assets/enemy.png");
  this.load.image("toad", "assets/toad.png");

  // Load Mario-style mystery blocks
  this.load.spritesheet("mysteryBlock", "assets/overworld/misteryBlock.png", {
    frameWidth: 16,
    frameHeight: 16,
    spacing: 3,
  });

  // Load spritesheets
  this.load.spritesheet("mario", "assets/mario-sprite-sheet.png", {
    frameWidth: 16,
    frameHeight: 16,
    spacing: 3,
  });
  this.load.spritesheet("terrain", "assets/Terrain.png", {
    frameWidth: 48,
    frameHeight: 16,
  });
  this.load.spritesheet("clouds", "assets/misc-sprite-sheet.png", {
    frameWidth: 20,
    frameHeight: 18,
    spacing: 1,
  });

  // New assets for Level 1 requirements
  this.load.image("skillBox", "assets/overworld/misteryBlock.png"); // Now using mystery block
  this.load.image("tennisBall", "assets/tennisball.png");
  this.load.image("checkpoint", "assets/skillBox.png");
  this.load.image("sparkle", "assets/skillBox.png");
  this.load.image("goompa", "assets/skillBox.png");
  this.load.image("johann", "assets/toad.png");

  // Sprite sheets
  this.load.spritesheet("explosion", "assets/coin.png", {
    frameWidth: 64,
    frameHeight: 64,
  });

  // Sound effects
  this.load.audio("shootSound", "assets/shoot.mp3");
  this.load.audio("squashSound", "assets/squash.mp3");
  this.load.audio("hitSound", "assets/hit.mp3");
  this.load.image("enemy", "assets/enemy.png");

  // Load tennis-themed images
  this.load.image("tennisbackground", "assets/tennisbackground.jpg");
  this.load.image("tennis", "assets/tennis.jpeg");
  this.load.image("tennisball", "assets/tennisball.png"); // Add the tennis ball image

  // Load sound effects for tennis balls
  this.load.audio("bossBounceSound", "assets/hit.mp3");
}

// Create game scene
function create() {
  if (!gameStarted) return;

  this.endOfGame = false;

  // Create background
  setupBackground.call(this);

  // Setup player
  setupPlayer.call(this);
  // ADD BACK BUTTON - Insert this code here
  // Create back button in top left corner
  const backButton = this.add
    .text(20, 20, "← Back", {
      fontSize: "18px",
      fontFamily: "Arial",
      color: "#ffffff",
      backgroundColor: "#444444",
      padding: { x: 10, y: 8 },
      stroke: "#000000",
      strokeThickness: 2,
    })
    .setScrollFactor(0) // Keep fixed to camera
    .setOrigin(0, 0) // Align to top left
    .setDepth(1000) // Make sure it's on top of everything
    .setInteractive({ useHandCursor: true }); // Make it clickable with hand cursor

  // Add hover effects
  backButton.on("pointerover", () => {
    backButton.setStyle({
      backgroundColor: "#666666",
      color: "#ffff00",
    });
  });

  backButton.on("pointerout", () => {
    backButton.setStyle({
      backgroundColor: "#444444",
      color: "#ffffff",
    });
  });

  // Add click handler to return to menu
  backButton.on("pointerdown", () => {
    // Navigate back to index.html with a parameter to skip intro
    window.location.href = "index.html?skip_intro=true";
  });
  this.physics.world.defaults.debugBodyColor = 0xff00ff; // Bright pink
  this.physics.world.defaults.debugShowBody = true;
  this.physics.world.defaults.debugShowStaticBody = true;
  this.anims.create({
    key: "tennis-stand",
    frames: this.anims.generateFrameNumbers("tennis-idle", {
      start: 0,
      end: -1,
    }),
    frameRate: 13,
    repeat: -1,
  });

  this.anims.create({
    key: "tennis-right",
    frames: this.anims.generateFrameNumbers("tennis-run", {
      start: 0,
      end: -1,
    }),
    frameRate: 10,
    repeat: -1,
  });
  this.anims.create({
    key: "monster-run",
    frames: this.anims.generateFrameNumbers("monster-run", {
      start: 0,
      end: -1,
      duration: 1000,
    }),
    frameRate: 10,
    repeat: 1,
  });
  // Create level based on selection
  createLevel.call(this);

  // Setup input
  this.cursors = this.input.keyboard.createCursorKeys();

  // Create explosion animation
  this.anims.create({
    key: "explode",
    frames: this.anims.generateFrameNumbers("explosion", { start: 0, end: 5 }),
    frameRate: 20,
    repeat: 0,
  });
  this.anims.create({
    key: "l3player-stand",
    frames: this.anims.generateFrameNumbers("l3playerStand", {
      start: 0,
      end: 5,
    }),
    frameRate: 10,
    repeat: -1,
  });
  this.anims.create({
    key: "l3player-run",
    frames: this.anims.generateFrameNumbers("l3playerRun", {
      start: 0,
      end: 5,
    }),
    frameRate: 20,
    repeat: -1,
  });
  this.anims.create({
    key: "l3player-jump",
    frames: this.anims.generateFrameNumbers("l3playerJump", {
      start: 0,
      end: 5,
    }),
    frameRate: 20,
    repeat: 0,
  });
}

// Set up the background
function setupBackground() {
  const screenHeight = this.scale.height;
  const screenWidth = this.scale.width;
  const worldWidth = 5000; // Fixed world width for all levels
  const worldHeight = 5000; // Consistent with our vertical world size
  if (selectedLevel === 1) {
    const background = this.add
      .image(screenWidth / 2, screenHeight / 2, "level1Background")
      .setOrigin(0.5, 0.5) // Center the image
      .setScrollFactor(0) // Fixed to camera (no scrolling)
      .setDepth(-2);

    // Scale to cover the entire screen width
    const bgWidth = background.width;
    const bgHeight = background.height;

    // Use scaleX to ensure full width coverage, even if it crops some height
    const scaleX = screenWidth / bgWidth;
    const scaleY = screenHeight / bgHeight;
    const scale = Math.max(scaleX, scaleY); // Use MAXIMUM scale to ensure full coverage

    background.setScale(scale);
    this.background = background;
  } else if (selectedLevel === 3) {
    const background = this.add.tileSprite(
      0,
      0,
      worldWidth,
      screenHeight,
      "levelBackground"
    );
    background.setOrigin(0, 0);
    background.setScrollFactor(0.2, 0); // X scrolls slowly, Y doesn't scroll
    background.setDepth(-2);
    this.background = background;
  } else {
    // Set camera background color to white
    this.cameras.main.setBackgroundColor(0xffffff);

    // Create a single large background rectangle that covers the entire world
    const whiteBackground = this.add.rectangle(
      0,
      0,
      worldWidth,
      worldHeight,
      0xffffff // White color
    );
    whiteBackground.setOrigin(0, 0);
    whiteBackground.setDepth(-2); // Make sure it's behind everything

    // Store reference to background
    this.background = whiteBackground;
  }
  // Set the world bounds to fixed dimensions
  this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

  // Set camera bounds to match world
  this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);

  return 3;
}
function setupPlayer() {
  // Calculate responsive scaling
  const scaleFactor = getResponsiveScaleFactor();
  const playerBaseScale = 3; // Your original player scale
  const responsivePlayerScale = playerBaseScale * scaleFactor;

  // Create player using the idle animation's first frame
  this.player = this.physics.add.sprite(100, 300, "player-idle");
  // Scale gravity based on screen size
  const baseGravity = 800;
  const scaledGravity = baseGravity * scaleFactor;
  this.player.body.setGravityY(scaledGravity);

  // Apply responsive scaling
  this.player.setScale(responsivePlayerScale);

  this.player.setVisible(true);
  this.player.setBounce(0.2);
  this.player.setCollideWorldBounds(true);

  // Scale the collision body proportionally
  const bodyWidth = Math.floor(this.player.width * 0.45);
  const bodyOffset = Math.floor((this.player.width - bodyWidth) / 2);
  this.player.body.setSize(bodyWidth, this.player.height * 0.9);
  this.player.body.setOffset(bodyOffset, this.player.height * 0.1);

  // Create animations as before
  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("player-run", {
      start: 0,
      end: -1,
    }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: "stand",
    frames: this.anims.generateFrameNumbers("player-idle", {
      start: 0,
      end: -1,
    }),
    frameRate: 13,
    repeat: -1,
  });

  this.anims.create({
    key: "jump",
    frames: this.anims.generateFrameNumbers("player-jump", {
      start: 0,
      end: -1,
    }),
    frameRate: 5,
    repeat: 0,
  });

  this.anims.create({
    key: "dead",
    frames: this.anims.generateFrameNumbers("player-dead", {
      start: 0,
      end: 13,
    }),
    frameRate: 10,
    repeat: 0,
    duration: 1300,
  });

  this.player.anims.play("stand", true);
}

// Create the appropriate level
function createLevel() {
  const bgRepeat = 3; // We need this for level boundaries

  switch (selectedLevel) {
    case 1:
      createLevel1.call(this, bgRepeat);
      break;
    case 2:
      createLevel2.call(this, bgRepeat);
      break;
    case 3:
      createLevel3.call(this, bgRepeat);
      break;
  }
}

// Game update loop
function update(time, delta) {
  if (!gameStarted) return;

  // FIX: Allow movement during dialogue but not when game is truly over
  if (this.endOfGame) return;

  // LEVEL 3 FIX: Special handling for Level 3 movement
  if (selectedLevel === 3) {
    // Force enable player physics if somehow disabled
    if (this.player && !this.player.body.enable) {
      console.log("Re-enabling player physics!");
      this.physics.world.enable(this.player);
    }
  }

  // Allow movement even during dialogue in level 3
  if (selectedLevel === 2 && this.boss) {
    updateBoss.call(this, time);
  }

  // CRITICAL FIX: Reset lastShotTime if it's undefined or far in the future
  if (!this.lastShotTime || this.lastShotTime > time + 10000) {
    console.log("Resetting shot cooldown timer");
    this.lastShotTime = time - 2000; // Ready to shoot immediately
  }

  // ADD THIS DEBUG SECTION at the beginning
  if (time % 60 === 0) {
    // Log only every 60 frames to avoid spam
    console.log("Tennis racket:", this.hasTennisRacket);
    console.log(
      "Space key:",
      this.input.keyboard.checkDown(Phaser.Input.Keyboard.KeyCodes.SPACE, 1)
    );
    console.log("Last shot time:", this.lastShotTime);
    console.log("Current time:", time);
  }

  // FIXED: Tennis ball shooting - handles both key detection methods
  if (this.hasTennisRacket) {
    // Check SPACE key using multiple methods to ensure it works
    const spacePressed =
      this.input.keyboard.checkDown(
        Phaser.Input.Keyboard.KeyCodes.SPACE,
        100
      ) ||
      (this.shootKey && this.shootKey.isDown) ||
      this.input.keyboard.addKey("SPACE").isDown;

    if (spacePressed) {
      console.log("SPACE KEY PRESSED DETECTED!");

      // Check cooldown
      const cooldownOver = time > (this.lastShotTime || 0) + 1000;
      console.log("Cooldown over:", cooldownOver);

      if (cooldownOver) {
        console.log("ATTEMPTING TO SHOOT");
        try {
          shootTennisBall.call(this);
          this.lastShotTime = time;
        } catch (error) {
          console.error("Error shooting tennis ball:", error);
        }
      }
    }
  }
  if (this.dialogueActive) {
    // Force player to stay still during dialogue
    if (this.player && this.player.body) {
      this.player.setVelocityX(0);
      this.player.anims.play("stand");
    }
    return;
  }
  // Handle jumping with responsive scaling
  if (this.player && this.player.body && this.player.active) {
    if (selectedLevel === 2) {
      // Tennis player animations for Level 2
      if (this.cursors.left.isDown) {
        this.player.setVelocityX(-280);
        this.player.setFlipX(true);
        this.player.anims.play("tennis-right", true);
      } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(280);
        this.player.setFlipX(false);
        this.player.anims.play("tennis-right", true);
      } else {
        this.player.setVelocityX(0);
        this.player.anims.play("tennis-stand");
      }

      // For jumping in Level 2
      if (!this.player.body.touching.down) {
        // Use first frame of idle animation for jumping
        this.player.anims.play("tennis-stand");
      }

      // ADD THIS SECTION - Missing jump control for Level 2
      if (this.cursors.up.isDown && this.player.body.touching.down) {
        // Get the scaling factor
        const physicsScale = getPhysicsScaleFactors();

        // Base jump velocity (what would be used at 1920x1080)
        const baseJumpVelocity = -710;

        // Apply scaled jump velocity
        const scaledJumpVelocity =
          baseJumpVelocity * physicsScale.blended * 1.2;

        // Set jump velocity with scaling
        this.player.setVelocityY(scaledJumpVelocity);
      }
    } else if (selectedLevel === 3) {
      // Get physics scale for consistent jump behavior
      const physicsScale = getPhysicsScaleFactors();

      // Apply horizontal movement
      if (this.cursors.left.isDown) {
        // Use horizontal scale factor for left/right movement
        this.player.setVelocityX(-280 * physicsScale.horizontal);
        this.player.setFlipX(true);
        this.player.anims.play("l3player-run", true);
      } else if (this.cursors.right.isDown) {
        // Use horizontal scale factor for left/right movement
        this.player.setVelocityX(280 * physicsScale.horizontal);
        this.player.setFlipX(false);
        this.player.anims.play("l3player-run", true);
      } else {
        this.player.setVelocityX(0);
        this.player.anims.play("l3player-stand", true);
      }

      // Jump handling - add a debug message to see if touching.down is working
      if (this.cursors.up.isDown) {
        console.log(
          "Up pressed, touching down:",
          this.player.body.touching.down
        );

        if (this.player.body.touching.down) {
          // Base jump velocity
          const baseJumpVelocity = -710;

          // Apply scaled jump velocity - use VERTICAL factor for jumping
          const scaledJumpVelocity =
            baseJumpVelocity * physicsScale.vertical * 1.2;

          // Set jump velocity
          this.player.setVelocityY(scaledJumpVelocity);
          this.player.anims.play("l3player-jump", true);

          console.log("Jump executed with velocity:", scaledJumpVelocity);
        }
      }

      // Play jump animation only when in the air
      if (!this.player.body.touching.down && this.player.body.velocity.y < 0) {
        this.player.anims.play("l3player-jump", true);
      }
    } else {
      if (this.cursors.left.isDown) {
        this.player.setVelocityX(-280);
        this.player.setFlipX(true);
        this.player.anims.play("right", true);
      } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(280);
        this.player.setFlipX(false);
        this.player.anims.play("right", true);
      } else {
        this.player.setVelocityX(0);
        this.player.anims.play("stand");
      }
      if (!this.player.body.touching.down) {
        this.player.anims.play("jump");
      }

      if (this.cursors.up.isDown && this.player.body.touching.down) {
        // Get the scaling factor
        const physicsScale = getPhysicsScaleFactors();

        // Base jump velocity (what would be used at 1920x1080)
        const baseJumpVelocity = -710;

        // Apply scaled jump velocity
        const scaledJumpVelocity =
          baseJumpVelocity * (physicsScale.blended * 1.2);

        // Set jump velocity with scaling
        this.player.setVelocityY(scaledJumpVelocity);
      }
    }
  }
  // ADDED: Handle tennis ball shooting
  if (
    this.hasTennisRacket &&
    this.input.keyboard.checkDown(Phaser.Input.Keyboard.KeyCodes.SPACE, 1000)
  ) {
    if (time > (this.lastShotTime || 0) + 1000) {
      // 1 second cooldown
      shootTennisBall.call(this);
      this.lastShotTime = time;
    }
  }

  // Update boss and enemies
  if (this.updateList && this.updateList.length > 0) {
    this.updateList.forEach((entity) => {
      if (entity && entity.active && entity.update) {
        try {
          entity.update(time);
        } catch (e) {
          console.error("Error updating entity:", e);
        }
      }
    });
  }

  // Level 3 dialogue trigger - only once after landing
  if (selectedLevel === 3 && this.waitingForLanding && !this.dialogueShown) {
    if (this.player && this.player.body && this.player.body.touching.down) {
      this.waitingForLanding = false;

      // Small delay to ensure player is fully landed
      this.time.delayedCall(300, () => {
        // Freeze player
        this.dialogueActive = true;
        this.playerVelocityBeforeDialogue = {
          x: this.player.body.velocity.x,
          y: this.player.body.velocity.y,
        };
        this.player.setVelocity(0, 0);
        this.player.anims.play("stand");

        // Show dialogue
        showLevel3StartDialogue.call(this);
        this.dialogueShown = true;
      });
    }
  }

  // Skip movement processing if dialogue is active
  if (this.dialogueActive) {
    // Force player to stay still
    if (this.player && this.player.body) {
      this.player.setVelocityX(0);
      this.player.anims.play("stand");
    }
    return; // Skip rest of update for movement
  }
}

// Function to shoot tennis ball
function shootTennisBall() {
  console.log("--- ATTEMPTING TO SHOOT TENNIS BALL ---");

  if (!this.tennisBalls) {
    console.log("Creating new tennis balls group");
    this.tennisBalls = this.physics.add.group();
  }

  // Create tennis ball at player position
  console.log(
    `Creating ball at position ${this.player.x}, ${this.player.y - 20}`
  );

  // CHANGED: Use proper tennisball sprite instead of coin
  const ball = this.tennisBalls
    .create(
      this.player.x,
      this.player.y - 20,
      "tennisball" // Now using proper tennis ball sprite
    )
    .setScale(0.05); // Adjust scale for tennisball sprite

  console.log("Ball created:", ball);

  // Set velocity based on player direction with debugging
  const direction = this.player.flipX ? -1 : 1;
  ball.setVelocityX(direction * 400);
  console.log(`Set ball velocity: ${direction * 400}`);

  // Add gravity to create arc
  ball.setGravityY(100);

  // IMPROVED PHYSICS: Set proper bounce physics and ensure collision detection
  ball.setBounce(0.6); // Add bounce factor
  ball.setCollideWorldBounds(true); // Keep ball in world bounds
  ball.body.setSize(20, 20); // Ensure hit area is large enough
  ball.body.setOffset(-2, -2); // Center the collision body

  ball.isVelocityPositive = direction > 0;

  // Track if ball has been destroyed by collision
  ball.dead = false;
  ball.exploded = false;

  // IMPROVED PHYSICS: Add proper collision detection properties
  ball.setBounce(0.7); // Add bounce factor for better bouncing
  ball.setCollideWorldBounds(true); // Keep ball within the world bounds

  // Adjust body size for better collision detection with platforms
  ball.body.setSize(ball.width * 0.8, ball.height * 0.8);

  // Set strong color to make it visible - BRIGHT YELLOW
  ball.setTint(0xffff00);
  console.log("Set ball tint to bright yellow");

  // Set high depth to ensure it's visible
  ball.setDepth(100);
  console.log("Set ball depth to 100 (should be on top of everything)");

  // Add a rotation effect
  this.tweens.add({
    targets: ball,
    rotation: direction * Math.PI * 4, // Rotate based on direction
    duration: 1000,
    repeat: -1,
  });

  // Add a flashing effect to make it more noticeable
  this.tweens.add({
    targets: ball,
    alpha: { from: 0.4, to: 1 },
    duration: 200,
    yoyo: true,
    repeat: -1,
  });
  console.log("Added flashing effect to ball");

  // Start tracking the ball's animation state
  updateTennisBallAnimation.call(this, ball);

  // Add debug info directly on screen
  const debugText = this.add
    .text(
      10,
      140,
      `Ball shot at: ${Math.floor(this.player.x)},${Math.floor(this.player.y)}`,
      {
        fontSize: "16px",
        fill: "#ffffff",
        backgroundColor: "#000000",
        padding: 4,
      }
    )
    .setScrollFactor(0);

  // Remove debug text after 3 seconds
  this.time.delayedCall(3000, () => {
    debugText.destroy();
  });

  // Destroy after 3 seconds
  this.time.delayedCall(3000, () => {
    if (ball.active && !ball.dead) {
      console.log("Destroying ball after timeout");
      ball.dead = true;
      this.tweens.add({
        targets: ball,
        alpha: { from: 1, to: 0 },
        duration: 100,
        onComplete: () => ball.destroy(),
      });
    }
  });

  // Add collision with platforms with bouncing
  this.physics.add.collider(
    ball,
    this.platforms,
    (ball, platform) => {
      tennisBallBounce.call(this, ball, platform);
    },
    null,
    this
  );

  // Add collision with enemies
  if (this.enemies) {
    this.physics.add.overlap(
      ball,
      this.enemies,
      tennisBallHitEnemy,
      null,
      this
    );
  }

  // Show feedback
  showSpeechBubble.call(this, this.player, "Take that!", 500);

  console.log("--- TENNIS BALL CREATION COMPLETE ---");
}

// Function to update tennis ball animation based on velocity
function updateTennisBallAnimation(ball) {
  // Stop if ball has been destroyed
  if (ball.exploded || ball.dead || !ball.active) {
    return;
  }

  // Change visual properties based on vertical velocity
  if (ball.body.velocity.y > 0) {
    // Going down - make slightly larger
    ball.setScale(0.05);
  } else {
    // Going up - make slightly smaller
    ball.setScale(0.05);
  }

  // Call this function again after a short delay
  this.time.delayedCall(150, () => {
    if (ball.active && !ball.dead) {
      updateTennisBallAnimation.call(this, ball);
    }
  });
}

// Improved tennisBallBounce function with more natural physics
function tennisBallBounce(ball, platform) {
  // Skip if ball is already exploded or dead
  if (ball.exploded || ball.dead) {
    return;
  }

  // Check if ball exists and has a body
  if (!ball || !ball.body) {
    return;
  }

  // Get the current velocity for bounce calculations
  const currentVelocityY = ball.body.velocity.y;

  // Handle bounce direction based on collision side
  if (ball.body.blocked.left || ball.body.touching.left) {
    // Reverse horizontal velocity with energy loss
    ball.setVelocityX(-ball.body.velocity.x * 0.7);
  } else if (ball.body.blocked.right || ball.body.touching.right) {
    // Reverse horizontal velocity with energy loss
    ball.setVelocityX(-ball.body.velocity.x * 0.7);
  }

  // Handle vertical bouncing with more natural physics
  if (ball.body.blocked.down || ball.body.touching.down) {
    // Calculate bounce velocity based on impact (with damping)
    const impactVelocity = Math.abs(currentVelocityY);
    const bounceVelocity = Math.min(impactVelocity * 0.9, 300);

    // Apply smaller upward velocity with slight randomness
    ball.setVelocityY(-bounceVelocity + (Math.random() * 30 - 10));

    // Create bounce effect (only for harder impacts)
    if (impactVelocity > 200) {
      const bounceEffect = this.add.circle(
        ball.x,
        ball.y + 5,
        5,
        0xffff00,
        0.5
      );
      this.tweens.add({
        targets: bounceEffect,
        alpha: 0,
        scale: 2,
        duration: 200,
        onComplete: () => bounceEffect.destroy(),
      });
    }
  }
  // Handle ceiling collisions
  else if (ball.body.blocked.up || ball.body.touching.up) {
    // Bounce off ceiling with reduced velocity
    ball.setVelocityY(Math.abs(currentVelocityY) * 0.5);
  }

  // Add a small rotation to the ball for visual effect
  ball.setAngularVelocity((Math.random() > 0.5 ? 1 : -1) * 100);
}

// Function to handle tennis ball hitting enemies
function tennisBallHitEnemy(ball, enemy) {
  // Prevent multiple collisions
  if (ball.exploded || ball.dead) {
    return;
  }

  console.log("Tennis ball hit enemy!");

  // Mark ball as exploded
  ball.exploded = true;
  ball.dead = true;
  ball.body.moves = false;

  // Create an explosion effect
  explodeTennisBall.call(this, ball);

  // Enemy defeat logic
  enemy.setVelocityY(-150);
  enemy.setVelocityX(0);

  // If we have an enemy group, remove it
  if (this.enemies.remove) {
    this.enemies.remove(enemy, true, true);
  }

  // Play squash sound if available
  if (this.sound && this.sound.play && this.squashSound) {
    this.squashSound.play();
  }

  // Make enemy fall down
  this.tweens.add({
    targets: enemy,
    alpha: 0,
    y: `+=${this.scale.height}`,
    rotation: 5,
    duration: 1000,
    onComplete: () => enemy.destroy(),
  });
}

// Function to create a tennis ball explosion effect
function explodeTennisBall(ball) {
  // Create particles for the explosion
  const particles = this.add.particles(ball.x, ball.y, "coin", {
    speed: { min: 50, max: 150 },
    scale: { start: 0.1, end: 0.01 },
    lifespan: 500,
    quantity: 15,
    blendMode: "ADD",
    tint: 0xffff00,
  });

  // Emit a burst of particles
  particles.explode();

  // Create a flash effect
  const flash = this.add.circle(ball.x, ball.y, 30, 0xffffff, 0.8);
  this.tweens.add({
    targets: flash,
    alpha: 0,
    scale: 2,
    duration: 300,
    onComplete: () => flash.destroy(),
  });

  // Destroy the ball with a fade
  this.tweens.add({
    targets: ball,
    alpha: 0,
    scale: 0.5,
    duration: 200,
    onComplete: () => {
      ball.destroy();
      // Destroy particles after they finish
      this.time.delayedCall(500, () => particles.destroy());
    },
  });
}

// Fix the createLevel1 function to ensure coins are visible
// Updated createLevel1 function with new block layout
function createLevel1(bgRepeat) {
  this.skillCount = 0;

  // Define base dimensions that your level was designed for
  const baseWidth = 1920; // Base design width
  const baseHeight = 1080; // Base design height

  // Get current dimensions
  const currentWidth = this.scale.width;
  const currentHeight = this.scale.height;

  // Calculate scaling factors
  const scaleX = currentWidth / baseWidth;
  const scaleY = currentHeight / baseHeight;

  // Use the smaller scale for consistent proportions
  const objectScale = Math.min(scaleX, scaleY) * 3;

  // Helper function to calculate X position
  const getScaledX = (originalX) => {
    return (originalX / baseWidth) * currentWidth;
  };

  // Helper function to calculate Y position from bottom
  const getScaledYFromBottom = (distanceFromBottom) => {
    return currentHeight - distanceFromBottom * scaleY;
  };

  // 1. Create groups
  this.platforms = this.physics.add.staticGroup();
  this.mysteryBoxes = this.physics.add.staticGroup();
  this.enemies = this.physics.add.group({
    collideWorldBounds: true,
    bounceX: 1,
    bounceY: 0,
  });

  // 2. Set up the ground with exact positioning to avoid gaps
  const groundHeight = 40 * scaleY;
  const blockWidth = groundHeight; // Make blocks square based on ground height
  const worldWidth = 5000;
  const worldHeight = 5000;
  const numBlocks = Math.ceil(worldWidth / blockWidth) + 1; // Add one extra block

  // First ground layer with no gaps
  for (let i = 0; i < numBlocks; i++) {
    const block = this.platforms.create(
      i * (blockWidth - 2), // Use exact width with no subtraction for overlap
      currentHeight - groundHeight / 2 + 6,
      "block"
    );

    block.setDisplaySize(blockWidth + 4, groundHeight);
    block.refreshBody();
    block.setData("isGround", true);
    block.setDepth(5);
    block.setAlpha(1);
  }

  // Second ground layer with no gaps
  for (let i = 0; i < numBlocks; i++) {
    const block = this.platforms.create(
      i * (blockWidth - 4), // Use exact width with no subtraction
      currentHeight - groundHeight - groundHeight / 2 + 12, // FIXED: Position exactly at top of first layer
      // Exactly half a block above first layer
      "block"
    );

    block.setDisplaySize(blockWidth + 4, groundHeight);
    block.refreshBody();
    block.setData("isGround", true);
    block.setDepth(5);
    block.setAlpha(1);
  }

  // 3. Create the main platform blocks - now using responsive positioning
  const brickBlocks = [
    // First set - two brick blocks with mystery boxes between them
    { xOriginal: 500, yFromBottom: 270, width: 48, height: 48 },
    { xOriginal: 596, yFromBottom: 270, width: 48, height: 48 },

    // Additional platforms for gameplay
    { xOriginal: 692, yFromBottom: 270, width: 48, height: 48 },
    { xOriginal: 1300, yFromBottom: 300, width: 48, height: 48 },
    { xOriginal: 1348, yFromBottom: 300, width: 48, height: 48 },
    { xOriginal: 1396, yFromBottom: 300, width: 48, height: 48 },
    { xOriginal: 1444, yFromBottom: 300, width: 48, height: 48 },
    { xOriginal: 1650, yFromBottom: 500, width: 48, height: 48 },
    { xOriginal: 1698, yFromBottom: 500, width: 48, height: 48 },
    { xOriginal: 2150, yFromBottom: 400, width: 48, height: 48 },
    { xOriginal: 2198, yFromBottom: 400, width: 48, height: 48 },
    { xOriginal: 2246, yFromBottom: 400, width: 48, height: 48 },
    { xOriginal: 2548, yFromBottom: 700, width: 48, height: 48 },
    { xOriginal: 2596, yFromBottom: 700, width: 48, height: 48 },
    { xOriginal: 2692, yFromBottom: 700, width: 48, height: 48 },
    { xOriginal: 2500, yFromBottom: 400, width: 48, height: 48 },
    { xOriginal: 2548, yFromBottom: 400, width: 48, height: 48 },
    { xOriginal: 2596, yFromBottom: 400, width: 48, height: 48 },
    { xOriginal: 2644, yFromBottom: 400, width: 48, height: 48 },
    { xOriginal: 2692, yFromBottom: 400, width: 48, height: 48 },
  ];

  // Create the remaining individual blocks
  for (const block of brickBlocks) {
    // Skip already processed blocks
    if (block.processed) continue;

    // Calculate responsive positions
    const x = getScaledX(block.xOriginal);
    const y = getScaledYFromBottom(block.yFromBottom);

    // Create the platform
    const platform = this.platforms.create(x, y, "emptyBlock", 0);

    // Apply scale with slightly wider width to remove gaps
    platform.setScale(objectScale * 1.18, objectScale); // Make width 10% wider
    platform.refreshBody();
  }

  // Add pipes and flag with responsive positioning
  const pipeX = getScaledX(970);
  const pipe2X = getScaledX(1950);
  const flagX = getScaledX(3000);

  const groundTop = currentHeight - groundHeight * 2 + 4 * scaleY;

  // Add first pipe
  const pipe = this.physics.add
    .staticImage(pipeX, groundTop + 20, "pipe")
    .setOrigin(0.5, 1);
  pipe.setScale(objectScale);
  this.platforms.add(pipe);
  pipe.refreshBody();
  pipe.setData("isPipe", true);

  // Add second pipe
  const pipe2 = this.physics.add
    .staticImage(pipe2X, groundTop + 20, "pipe2")
    .setOrigin(0.5, 1);
  pipe2.setScale(objectScale);
  this.platforms.add(pipe2);
  pipe2.refreshBody();
  pipe2.setData("isPipe", true);

  // Add flag
  const flag = this.physics.add
    .staticImage(flagX, groundTop + 20, "flag")
    .setOrigin(0.5, 1);
  flag.setScale(objectScale);
  this.platforms.add(flag);
  flag.refreshBody();
  flag.setData("isPipe", true);
  const bossX = flagX + 150 * scaleX; // Position boss 100px to the right of flag
  /*this.boss = this.physics.add
    .sprite(bossX, groundTop, "NavyBoy") // Using the second character sprite
    .setOrigin(0.5, 1)
    .setScale(1 * objectScale)
    .setFlipX(true);

  // Make boss static and add animation if needed
  this.boss.setImmovable(true);
  this.boss.body.allowGravity = false;*/

  // Add invisible barrier at the end
  const invisibleBarrier = this.physics.add.staticImage(
    flagX + 5 * scaleX, // Position after flag
    currentHeight / 2, // Middle of the screen height
    null // No texture
  );

  // Make barrier tall and thin
  invisibleBarrier.setDisplaySize(10 * scaleX, currentHeight * 2);
  invisibleBarrier.visible = false; // Make it invisible
  invisibleBarrier.refreshBody();
  this.platforms.add(invisibleBarrier);

  // 4. Create mystery boxes with responsive positioning
  const mysteryBoxPositions = [
    // Two mystery boxes between brick blocks
    { xOriginal: 548, yFromBottom: 270, index: 0 },
    { xOriginal: 1370, yFromBottom: 470, index: 1 },

    // One alone
    { xOriginal: 644, yFromBottom: 270, index: 2 },

    // One on top of pipe block
    { xOriginal: 596, yFromBottom: 460, index: 3 },

    // Two others placed elsewhere
    { xOriginal: 2198, yFromBottom: 600, index: 4 },
    { xOriginal: 2644, yFromBottom: 700, index: 5 },
  ];

  // Create mystery boxes
  for (const box of mysteryBoxPositions) {
    // Calculate responsive positions
    const x = getScaledX(box.xOriginal);
    const y = getScaledYFromBottom(box.yFromBottom);

    const mysteryBox = this.mysteryBoxes
      .create(x, y, "mysteryBlock")
      .setOrigin(0.5, 0.5)
      .setScale(objectScale * 1.05)
      .setData("skillIndex", box.index)
      .setData("hit", false)
      .refreshBody();

    // Add glow effect
    const glow = this.add
      .sprite(mysteryBox.x, mysteryBox.y, "mysteryBlock")
      .setScale(objectScale * 0.57) // Adjust relative to main box scale
      .setAlpha(0.3)
      .setTint(0xffff44);

    // Store reference to glow
    mysteryBox.setData("glow", glow);

    // Scale the animation amounts relative to the screen size
    const bounceAmount = 5 * scaleY;

    // Bounce animation for mystery box
    this.tweens.add({
      targets: mysteryBox,
      y: mysteryBox.y - bounceAmount,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Glow animation
    this.tweens.add({
      targets: glow,
      scale: { from: objectScale * 0.57, to: objectScale * 0.63 },
      alpha: { from: 0.3, to: 0.1 },
      yoyo: true,
      repeat: -1,
      duration: 1000,
      ease: "Sine.easeInOut",
    });
  }

  // Create a responsive trigger zone
  const triggerX = getScaledX(3000);
  const groundY = currentHeight - groundHeight;
  const triggerHeight = currentHeight;

  const triggerZone = this.add.zone(
    triggerX,
    groundY - triggerHeight / 2,
    50 * scaleX,
    triggerHeight
  );

  this.physics.world.enable(triggerZone);
  triggerZone.body.setAllowGravity(false);
  triggerZone.body.immovable = true;

  // Add overlap detection
  this.physics.add.overlap(
    this.player,
    triggerZone,
    (player, triggerZone) => {
      // Check if all skills are collected (6 skills in level 1)
      if (this.skillCount < 6) {
        // Not all skills collected, show message

        if (!this.flagMessageShown) {
          createSpeechBubble.call(
            this,
            this.player.x,
            this.player.y - 60,
            "I need to collect all 6 character traits before moving to the next level",
            3000
          );
          this.flagMessageShown = true;

          // Reset flag message cooldown after 3 seconds
          this.time.delayedCall(3000, () => {
            this.flagMessageShown = false;
          });
        }
        return;
      }

      // All skills collected, proceed to level 2
      // Prevent multiple triggers
      if (this.levelCompleting) return;
      this.levelCompleting = true;

      // Stop player movement and show standing animation
      this.physics.pause();
      player.setVelocityX(0);
      player.anims.play("stand");

      // Fade out and transition to Level 2
      this.cameras.main.fadeOut(1000, 0, 0, 0);

      this.cameras.main.once("camerafadeoutcomplete", () => {
        // Go directly to video1.html (transition to Level 2) after 3 seconds
        this.time.delayedCall(2000, () => {
          resetCheckpointData();
          window.location.href = "video1.html";
        });
      });
    },
    null,
    this
  );

  // 5. UI elements - make these responsive to screen size
  // Skills panel
  const minPanelWidth = 220; // Absolute minimum width in pixels
  const minPanelHeight = 200; // Absolute minimum height in pixels

  const panelWidth = Math.max(200 * scaleX, minPanelWidth); // Use maximum of scaled or minimum
  const panelHeight = Math.max(260 * scaleY, minPanelHeight); // Use maximum of scaled or minimum

  const panelX = currentWidth - panelWidth - 20;
  const panelY = 20;

  this.skillsPanel = this.add.graphics();
  this.skillsPanel.fillStyle(0x000000, 0.8);
  this.skillsPanel.fillRect(panelX, panelY, panelWidth, panelHeight);
  this.skillsPanel.lineStyle(2 * scaleY, 0xffd700, 1);
  this.skillsPanel.strokeRect(panelX, panelY, panelWidth, panelHeight);
  this.skillsPanel.setScrollFactor(0);

  // Title - make font size responsive
  const titleSize = Math.max(18 * scaleY, 14); // Min font size of 14px
  this.add
    .text(panelX + 30, panelY + 10, "My Character", {
      fontSize: titleSize + "px",
      fill: "#FFD700",
      fontWeight: "bold",
    })
    .setScrollFactor(0);

  // Skills counter
  const counterSize = Math.max(16 * scaleY, 12); // Min font size of 12px
  this.skillsCounter = this.add
    .text(panelX + 30, panelY + panelHeight - 30, "Traits: 0/6", {
      fontSize: counterSize + "px",
      fill: "#FFD700",
      fontWeight: "bold",
    })
    .setScrollFactor(0);

  // Create skill text objects
  this.skillTexts = [];
  const skillSize = Math.max(14 * scaleY, 11); // Min font size of 11px
  const skillSpacing = Math.max(28 * scaleY, 20); // Min spacing of 20px

  for (let i = 0; i < skills.length; i++) {
    const skillText = this.add
      .text(
        panelX + 25,
        panelY + 40 + i * skillSpacing,
        skills[i].icon + " " + skills[i].name,
        {
          fontSize: skillSize + "px",
          fill: "#FFFFFF",
          fontFamily: "Arial",
        }
      )
      .setScrollFactor(0);

    // Initially hide skill text
    skillText.setAlpha(0);
    this.skillTexts.push(skillText);
  }
  const savedBoxes = loadCheckpointData();
  if (savedBoxes && savedBoxes.length > 0) {
    // For each saved box index, find the matching box and mark as already collected
    savedBoxes.forEach((savedIndex) => {
      // Find the mystery box with this index
      const boxToUpdate = this.mysteryBoxes
        .getChildren()
        .find((box) => box.getData("skillIndex") === savedIndex);

      if (boxToUpdate) {
        // Mark as already hit
        boxToUpdate.setData("hit", true);
        boxToUpdate.setTexture("emptyBlock");

        // Stop animation
        this.tweens.killTweensOf(boxToUpdate);

        // Get the glow and remove it
        const glow = boxToUpdate.getData("glow");
        if (glow) {
          this.tweens.killTweensOf(glow);
          glow.destroy();
        }

        // Update counters
        this.coinCount = (this.coinCount || 0) + 1;
        this.skillsCounter.setText("Traits: " + this.coinCount + "/6");
        this.skillCount = (this.skillCount || 0) + 1;

        // Update skills panel
        if (this.skillCount > 0 && this.skillCount <= skills.length) {
          const skill = skills[savedIndex];
          if (
            skill &&
            this.skillTexts &&
            this.skillTexts[this.skillCount - 1]
          ) {
            const skillText = this.skillTexts[this.skillCount - 1];

            // Update the text with the proper format - with null checks
            skillText.setText(
              "• " + (skill.icon || "") + " " + (skill.name || "")
            );
            skillText.setAlpha(1);
          }
        }
      }
    });

    console.log(
      `Restored ${savedBoxes.length} collected boxes from checkpoint`
    );
  }
  // Small skills counter in bottom left
  const smallCounterSize = Math.max(20 * scaleY, 16); // Min font size of 16px
  /*this.smallCounter = this.add
    .text(20, 20, "Skills: 0/6", {
      fontSize: smallCounterSize + "px",
      fill: "#ffffff",
    })
    .setScrollFactor(0);*/

  // 6. Add enemies (assuming addEnemies function is defined elsewhere)
  addEnemies.call(this);

  // 7. Add collisions
  this.physics.add.collider(this.player, this.platforms);
  this.physics.add.collider(this.enemies, this.platforms);
  this.physics.add.collider(this.enemies, this.enemies);
  this.physics.add.collider(this.player, this.enemies, hitEnemy, null, this);
  this.physics.add.collider(
    this.player,
    this.mysteryBoxes,
    hitMysteryBox,
    null,
    this
  );

  // Set world bounds
  this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

  // Set up camera to follow player
  this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
  this.cameras.main.startFollow(this.player, true, 0.1, 0.1, 0, 0);

  // Adjust deadzone based on screen size
  const deadZoneWidth = currentWidth / 3;
  const deadZoneHeight = currentHeight / 3;
  this.cameras.main.setDeadzone(deadZoneWidth, deadZoneHeight);

  // Add instructions with responsive text size
  const instructionSize = Math.max(24 * scaleY, 18); // Min font size of 18px
  const instructionText = this.add
    .text(
      currentWidth / 2,
      80 * scaleY,
      "Hit mystery boxes from below to discover skills!",
      {
        fontSize: instructionSize + "px",
        fill: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4 * scaleY,
        fontStyle: "bold",
      }
    )
    .setOrigin(0.5, 0.5)
    .setScrollFactor(0);

  // Fade out instructions
  this.tweens.add({
    targets: instructionText,
    alpha: { from: 1, to: 0 },
    delay: 3000,
    duration: 1000,
    ease: "Power2",
  });

  // Fix camera bounds with our custom function
  fixCameraBounds.call(this);

  return this.platforms;
}

// Function to update level when window is resized
function resizeLevel() {
  // Clear existing game objects
  this.platforms.clear(true, true);
  this.mysteryBoxes.clear(true, true);

  // Recreate the level with new dimensions
  createLevel1.call(this, 3);

  // Recalculate camera bounds
  fixCameraBounds.call(this);

  // Reposition player if needed
  if (this.player) {
    // Make sure player is above ground after resize
    const groundHeight = 40 * (this.scale.height / 1080);
    if (this.player.y > this.scale.height - groundHeight * 2) {
      this.player.y = this.scale.height - groundHeight * 2 - 50;
    }
  }
}

// Helper function to create speech bubbles at specific positions
function createSpeechBubble(x, y, text, duration = 3000) {
  // Create speech bubble container
  this.physics.pause(); // Pause physics during bubble creation
  const bubbleContainer = this.add.container(0, 0);
  bubbleContainer.setDepth(1000); // Ensure it's on top

  const bubblePadding = 10;
  const bubbleWidth = Math.min(text.length * 7 + bubblePadding * 2, 220);
  const bubbleHeight = 40 + bubblePadding * 2;

  // Create speech bubble background
  const bubble = this.add.graphics();
  bubble.fillStyle(0xffffff, 0.9);
  bubble.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 10);
  bubble.lineStyle(3, 0x000000, 1);
  bubble.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 10);

  // Create speech bubble tail
  const tail = this.add.graphics();
  tail.fillStyle(0xffffff, 0.9);
  tail.lineStyle(3, 0x000000, 1);
  tail.beginPath();
  tail.moveTo(bubbleWidth / 2 - 10, bubbleHeight);
  tail.lineTo(bubbleWidth / 2, bubbleHeight + 15);
  tail.lineTo(bubbleWidth / 2 + 10, bubbleHeight);
  tail.closePath();
  tail.fillPath();
  tail.strokePath();

  // Create text
  const bubbleText = this.add
    .text(bubbleWidth / 2, bubbleHeight / 2, text, {
      fontSize: "14px",
      fontFamily: "Arial",
      color: "#000000",
      align: "center",
      wordWrap: { width: bubbleWidth - bubblePadding * 2 },
    })
    .setOrigin(0.5, 0.5);

  // Add elements to container
  bubbleContainer.add(bubble);
  bubbleContainer.add(tail);
  bubbleContainer.add(bubbleText);

  // Position bubble at specified coordinates
  bubbleContainer.x = x - bubbleWidth / 2;
  bubbleContainer.y = y - bubbleHeight - 20;

  // Remove bubble after duration
  this.time.delayedCall(duration, () => {
    // Fade out animation
    this.tweens.add({
      targets: bubbleContainer,
      alpha: 0,
      y: bubbleContainer.y - 20,
      duration: 300,
      onComplete: () => {
        bubbleContainer.destroy();
        this;
      },
    });
  });

  return bubbleContainer;
}
// Add this function to reset all skill-related variables
function resetSkillPanel() {
  // Reset skill counters
  this.skillCount = 0;
  this.coinCount = 0;
  this.itemCount = 0;

  // Reset skill texts
  if (this.skillTexts && this.skillTexts.length > 0) {
    for (let i = 0; i < this.skillTexts.length; i++) {
      if (this.skillTexts[i]) {
        this.skillTexts[i].setText("");
        this.skillTexts[i].setAlpha(0);
      }
    }
  }

  // Reset counter displays
  if (this.skillsCounter) {
    this.skillsCounter.setText(
      "Traits: 0/" + (selectedLevel === 1 ? "6" : "12")
    );
  }
  /*if (this.smallCounter) {
    this.smallCounter.setText(
      "Skills: 0/" + (selectedLevel === 1 ? "6" : "12")
    );
  }*/
  // NEW: Reset movement-related flags
  this.dialogueActive = false;
  this.playerImmune = false;
  this.bossTriggered = false;
  this.playerDying = false;
  this.inDialogue = false;

  // NEW: Make sure physics is not paused when restarting
  if (this.physics && this.physics.world) {
    this.physics.resume();
  }
  // Reset tennis racket status
  this.hasTennisRacket = false;
}
// Add this function right after the createLevel1 function, around line 450

// After the platformPositions and loop to create platforms in your createLevel1 function
// Add this code to create visible enemies:
// Completely revised addEnemies function - simplified for reliable movement
function addEnemies() {
  // Calculate responsive scaling
  const scaleY = this.scale.height / 1080;

  // First, get the ACTUAL positions of the ground blocks
  const groundLayer2Y = this.scale.height - 40 * scaleY - (40 * scaleY) / 2 + 6;

  // The visual top of the ground is the top of the second layer
  const groundVisualTop = groundLayer2Y - (40 * scaleY) / 2;

  console.log("Ground visual top:", groundVisualTop);

  // Clear any existing enemies
  if (this.enemies) {
    this.enemies.clear(true, true);
  }

  // Create enemy group
  this.enemies = this.physics.add.group({
    bounceX: 0,
    collideWorldBounds: true,
    allowGravity: true,
  });

  // Define positions at a FIXED HEIGHT above the ground visual top
  // This ensures consistent positioning regardless of screen size
  const enemyYPosition = groundVisualTop - 45; // 45px above ground visual top

  const enemyPositions = [
    //{ x: 600, y: enemyYPosition, range: 300, speed: 60 },
    { x: 1200, y: enemyYPosition, range: 300, speed: 80 },
    { x: 1900, y: enemyYPosition, range: 300, speed: 70 },
  ];

  // Create enemies
  for (const pos of enemyPositions) {
    const enemy = this.enemies
      .create(pos.x, pos.y, "monster-run")
      .setScale(getResponsiveScaleFactor() * 5)
      .setDepth(20);

    // Create better physics body - positioned at the BOTTOM of the sprite
    const bodyWidth = enemy.width * 0.6;
    const bodyHeight = enemy.height * 0.7;

    // Important: position body at BOTTOM of sprite with minimal offset
    const offsetX = (enemy.width - bodyWidth) / 2;
    const offsetY = enemy.height - bodyHeight - 2; // Only 2px offset from bottom

    enemy.body.setSize(bodyWidth, bodyHeight);
    enemy.body.setOffset(offsetX, offsetY);

    // Create visual indicator of position for debugging (remove in production)
    /*const debugDot = this.add.circle(pos.x, pos.y, 5, 0xff0000);
    debugDot.setDepth(100);*/

    // Set patrol data
    enemy.startX = pos.x;
    enemy.leftBound = pos.x - pos.range / 2;
    enemy.rightBound = pos.x + pos.range / 2;
    enemy.speed = pos.speed;
    enemy.direction = -1;

    // Set initial velocity
    enemy.setVelocityX(-pos.speed);
    enemy.body.onWorldBounds = true;
    enemy.anims.play("monster-run", true);
  }

  // Rest of the function remains the same
  this.physics.world.on("worldbounds", (body) => {
    const enemy = body.gameObject;
    if (enemy && enemy.texture.key === "enemy") {
      enemy.direction *= -1;
      enemy.setVelocityX(enemy.speed * enemy.direction);
      enemy.flipX = enemy.direction > 0;
    }
  });

  // Platform collisions
  this.physics.add.collider(
    this.enemies,
    this.platforms,
    (enemy, platform) => {
      if (platform.getData("isGround") && enemy.body.touching.down) {
        return;
      }
      enemy.direction *= -1;
      enemy.setVelocityX(enemy.speed * enemy.direction);
      enemy.flipX = enemy.direction > 0;
    },
    null,
    this
  );

  // Movement controller
  this.enemyController = this.time.addEvent({
    delay: 100,
    callback: () => {
      this.enemies.getChildren().forEach((enemy) => {
        if (!enemy || !enemy.active) return;
        if (
          (enemy.direction === -1 && enemy.x <= enemy.leftBound) ||
          (enemy.direction === 1 && enemy.x >= enemy.rightBound)
        ) {
          enemy.direction *= -1;
          enemy.setVelocityX(enemy.speed * enemy.direction);
          enemy.flipX = enemy.direction > 0;
        }
      });
    },
    callbackScope: this,
    loop: true,
  });

  // Collisions
  this.physics.add.collider(this.enemies, this.platforms);

  console.log(
    "Created " + enemyPositions.length + " enemies with patrol behavior"
  );
}
/**Level 2 skills */
const level2Skills = [
  {
    icon: "🎤",
    name: "Public Speaking",
    message: "I'm great at presentations!",
  },
  {
    icon: "🔄",
    name: "Sales - Customer centric thinking",
    message: "Let me optimize your workflows!",
  },

  {
    icon: "🗃️",
    name: "IT Project Coordinator",
    message: "Keeping projects on track",
  },
  {
    icon: "👥",
    name: "Team Collaboration",
    message: "I work well with others",
  },
  {
    icon: "☁️",
    name: "Cloud & Security",
    message: "Your data is safe with me",
  },
  {
    icon: "💸",
    name: "Economics & Finance studies",
    message: "I understand the bottom line",
  },
  {
    icon: "⚡",
    name: "Fast Learner",
    message: "Quick to adapt to new challenges",
  },
  {
    icon: "🚀",
    name: "Initiative",
    message: "I don't wait for instructions",
  },
  {
    icon: "🖧",
    name: "ICT Infrastructure",
    message: "Building solid foundations",
  },
  {
    icon: "🤖",
    name: "AI use case identification",
    message: "AI solutions for business problems",
  },

  {
    icon: "♟️",
    name: "Solution Oriented",
    message: "Always thinking three steps ahead",
  },

  {
    icon: "🌍",
    name: "Digital Consulting",
    message: "",
  },
];
// Replace the existing createLevel2 function with this complete implementation
function createLevel2(bgRepeat) {
  // Calculate responsive scaling
  const baseWidth = 1920;
  const baseHeight = 1080;
  const currentWidth = this.scale.width;
  const currentHeight = this.scale.height;
  const scaleX = currentWidth / baseWidth;
  const scaleY = currentHeight / baseHeight;
  const objectScale = Math.min(scaleX, scaleY);

  // 1. Create the groups
  this.platforms = this.physics.add.staticGroup();
  this.skillItems = this.physics.add.staticGroup();
  this.tennisBalls = this.physics.add.group();

  // 2. Set up the ground with scaled dimensions
  const groundHeight = 40 * scaleY; // Scale ground height
  const groundTop = currentHeight - groundHeight;

  // Create ground segments with proper scaling
  // First segment - left edge
  const groundLeft = this.platforms.create(
    500 * scaleX, // Scale position
    currentHeight - groundHeight / 2,
    null
  );
  groundLeft.setDisplaySize(1000 * scaleX, groundHeight); // Scale size
  groundLeft.setVisible(false);
  groundLeft.refreshBody();
  groundLeft.setData("isGround", true);
  groundLeft.setData("isDeadlyGround", true);

  // Middle segment
  const groundMiddle = this.platforms.create(
    2500 * scaleX,
    currentHeight - groundHeight / 2,
    null
  );
  groundMiddle.setDisplaySize(3000 * scaleX, groundHeight);
  groundMiddle.setVisible(false);
  groundMiddle.refreshBody();
  groundMiddle.setData("isGround", true);
  groundMiddle.setData("isDeadlyGround", true);

  // Right segment
  const groundRight = this.platforms.create(
    4500 * scaleX,
    currentHeight - groundHeight / 2,
    null
  );
  groundRight.setDisplaySize(1000 * scaleX, groundHeight);
  groundRight.setVisible(false);
  groundRight.refreshBody();
  groundRight.setData("isGround", true);
  groundRight.setData("isDeadlyGround", true);

  // Create visible ground tileSprite with scaling
  /*const groundVisual = this.add.tileSprite(
    0,
    groundTop,
    5000 * scaleX,
    groundHeight * 2,
    "block"
  );
  groundVisual.setOrigin(0, 0);
  groundVisual.setDepth(5);
*/
  // Danger zone with responsive dimensions
  /*const dangerZone = this.add.graphics();
  dangerZone.fillStyle(0xff0000, 0.3);
  dangerZone.fillRect(
    0,
    currentHeight - groundHeight,
    5000 * scaleX,
    groundHeight
  );
  dangerZone.lineStyle(2 * scaleY, 0xff0000, 0.8);
  dangerZone.lineBetween(
    0,
    currentHeight - groundHeight,
    5000 * scaleX,
    currentHeight - groundHeight
  );*/

  // 3. Set background - blue sky
  const background = this.add
    .image(currentWidth / 2, currentHeight / 2, "level2Background")
    .setOrigin(0.5, 0.5) // Center the image
    .setScrollFactor(0) // Fixed to camera (no scrolling)
    .setDepth(-2);

  // Scale to cover the entire screen width
  const bgWidth = background.width;
  const bgHeight = background.height;

  // Use scaleX to ensure full width coverage, even if it crops some height
  const bgScaleX = currentWidth / bgWidth;
  const bgScaleY = currentHeight / bgHeight;
  const bgScale = Math.max(bgScaleX, bgScaleY); // Use MAXIMUM scale to ensure full coverage

  background.setScale(bgScale);
  this.background = background;

  // 4. Initialize skill counter
  this.coinCount = 0;

  // 5. Create skills panel with responsive positioning and sizing
  const minPanelWidth = 180; // Absolute minimum width in pixels
  const minPanelHeight = 200; // Absolute minimum height in pixels

  const panelWidth = Math.max(300 * scaleX, minPanelWidth); // Use maximum of scaled or minimum
  const panelHeight = Math.max(300 * scaleY, minPanelHeight); // Use maximum of scaled or minimum

  const panelX = currentWidth - panelWidth - 20 * scaleX;
  const panelY = 20 * scaleY;

  this.skillsPanel = this.add.graphics();
  this.skillsPanel.fillStyle(0x000000, 0.8);
  this.skillsPanel.fillRect(panelX, panelY, panelWidth, panelHeight);
  this.skillsPanel.lineStyle(2 * scaleY, 0xffd700, 1);
  this.skillsPanel.strokeRect(panelX, panelY, panelWidth, panelHeight);
  this.skillsPanel.setScrollFactor(0);

  // Title with responsive font
  const titleSize = Math.max(20 * scaleY, 18); // Minimum size of 14px
  this.add
    .text(panelX + 30 * scaleX, panelY + 15 * scaleY, "MY SKILLS", {
      fontSize: `${titleSize}px`,
      fill: "#FFD700",
      fontWeight: "bold",
    })
    .setScrollFactor(0);

  // Skills counter with responsive font
  const counterSize = Math.max(16 * scaleY, 14); // Minimum size of 12px
  this.skillsCounter = this.add
    .text(panelX + 30 * scaleX, panelY + 330 * scaleY, "Skills: 0/12", {
      fontSize: `${counterSize}px`,
      fill: "#FFD700",
      fontWeight: "bold",
    })
    .setScrollFactor(0);

  // Create skill text objects with responsive positioning and font size
  this.skillTexts = [];
  const skillSize = Math.max(12 * scaleY, 10); // Minimum size of 10px
  const skillSpacing = 20 * scaleY;

  for (let i = 0; i < level2Skills.length; i++) {
    const skillText = this.add
      .text(
        panelX + 25 * scaleX,
        panelY + 60 * scaleY + i * skillSpacing,
        level2Skills[i].icon + " " + level2Skills[i].name,
        {
          fontSize: `${skillSize}px`,
          fill: "#FFFFFF",
          fontFamily: "Arial",
        }
      )
      .setScrollFactor(0);

    // Initially hide skill text
    skillText.setAlpha(0);
    this.skillTexts.push(skillText);
  }

  // Small skills counter with responsive positioning and font
  const smallCounterSize = Math.max(20 * scaleY, 16); // Minimum size of 16px
  /*this.smallCounter = this.add
    .text(20 * scaleX, 20 * scaleY, "Skills: 0/12", {
      fontSize: `${smallCounterSize}px`,
      fill: "#ffffff",
    })
    .setScrollFactor(0);*/

  // 6. Add instructions with responsive text
  const instructionSize = Math.max(24 * scaleY, 18); // Minimum size of 18px
  const instructionText = this.add
    .text(
      currentWidth / 2,
      80 * scaleY,
      "Jump on clouds to discover my professional skills!",
      {
        fontSize: `${instructionSize}px`,
        fill: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4 * scaleY,
        fontStyle: "bold",
      }
    )
    .setOrigin(0.5, 0.5)
    .setScrollFactor(0);

  // Make instructions fade out
  this.tweens.add({
    targets: instructionText,
    alpha: { from: 1, to: 0 },
    delay: 5000,
    duration: 1000,
    ease: "Power2",
  });

  // 7. Create cloud platforms with responsive positioning
  const cloudPositions = [
    { xRatio: 250 / baseWidth, yFromBottom: 380 },
    { xRatio: 500 / baseWidth, yFromBottom: 510 },
    { xRatio: 750 / baseWidth, yFromBottom: 490 },
    { xRatio: 1000 / baseWidth, yFromBottom: 580 },
    { xRatio: 1250 / baseWidth, yFromBottom: 510 },
    { xRatio: 1500 / baseWidth, yFromBottom: 600 },
    { xRatio: 1750 / baseWidth, yFromBottom: 500 },
    { xRatio: 2000 / baseWidth, yFromBottom: 600 },
    { xRatio: 2300 / baseWidth, yFromBottom: 480 },
    { xRatio: 2600 / baseWidth, yFromBottom: 570 },
    { xRatio: 2850 / baseWidth, yFromBottom: 550 },
    { xRatio: 3100 / baseWidth, yFromBottom: 560 },
    { xRatio: 100 / baseWidth, yFromBottom: 500 },
  ];

  // Create clouds and add skills
  for (let i = 0; i < cloudPositions.length; i++) {
    const pos = cloudPositions[i];

    // Calculate responsive positions
    const x = pos.xRatio * currentWidth;
    const y = currentHeight - pos.yFromBottom * scaleY;

    // Create cloud platform with responsive scale
    const cloud = this.platforms.create(x, y, "cloud");
    cloud.setScale(0.15 * objectScale); // Scale based on screen size
    cloud.body.setSize(cloud.width * 0.9, cloud.height * 0.4);
    cloud.body.setOffset(cloud.width * 0.15, 0); // Position at the top of the cloud

    cloud.refreshBody();
    cloud.setData("touched", false);
    cloud.setData("skillIndex", i);

    // Add a subtle floating animation to clouds
    this.tweens.add({
      targets: cloud,
      y: y - 15 * scaleY, // Scale animation amount
      duration: 2000 + Math.random() * 1000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Create skill item (invisible at first)
    if (i <= 11) {
      const skill = this.skillItems.create(x, y - 30 * scaleY, "mysteryBlock");
      skill.setScale(0);
      skill.setVisible(false);
      skill.setData("skillIndex", i);
      skill.setData("revealed", false);

      // Store reference to cloud and skill
      cloud.setData("skillItem", skill);
      skill.setData("cloud", cloud);
    }
    if (i === cloudPositions.length - 1) {
      cloud.setData("isPlatform", true);
      cloud.setScale(0.12 * objectScale);
      cloud.setTint(0xffffff);
      // Ensure it has a solid collision body
      cloud.body.setSize(cloud.width * 0.9, cloud.height * 0.5);
      cloud.body.checkCollision.down = false; // Only collide from top
      cloud.body.checkCollision.left = false;
      cloud.body.checkCollision.right = false;
      cloud.refreshBody();
    }
  }

  // 8. Add Johann (boss) in the top right corner
  const bossCloudX = 3300 * scaleX;
  const bossCloudY = currentHeight * 0.13;
  const bossCloud = this.platforms.create(bossCloudX, bossCloudY, "cloud");
  bossCloud.setScale(0.25 * objectScale);
  bossCloud.setData("isPlatform", true);
  bossCloud.refreshBody();

  // Then add Johann (boss) as a static image on top of the cloud
  this.boss = this.add
    .image(
      bossCloudX, // Same X as cloud
      bossCloudY - bossCloud.displayHeight * 0.2, // Position on top of cloud
      "secondCharacter"
    )
    .setScale(4 * objectScale)
    .setDepth(20);

  // Keep lastShotTime at Infinity so he never shoots
  this.boss.lastShotTime = Infinity;

  bossCloud.setScale(0.25 * objectScale);
  bossCloud.setData("isPlatform", true);
  bossCloud.refreshBody();

  // 9. Add collision detection
  this.physics.add.collider(
    this.player,
    this.platforms,
    playerHitCloud,
    null,
    this
  );

  // Position the player with responsive coordinates
  if (this.player) {
    // Position above the first cloud
    this.player.x = cloudPositions[12]
      ? cloudPositions[12].xRatio * currentWidth
      : cloudPositions[0].xRatio * currentWidth;
    this.player.y =
      (cloudPositions[12]
        ? currentHeight - cloudPositions[12].yFromBottom * scaleY
        : currentHeight - cloudPositions[0].yFromBottom * scaleY) -
      300 * scaleY;

    // Reset player velocity
    this.player.setVelocity(0, 0);
    this.player.clearTint();
    this.player.setAlpha(1);
    this.player.setTexture("tennis-idle");
    this.player.anims.play("tennis-stand");
  }

  // Setup camera with proper bounds
  fixCameraBounds.call(this);

  return this.platforms;
}

// Function to handle cloud collision
function hitCloud(player, cloud) {
  alert();
  // Only trigger when landing on top of cloud and not already touched
  if (!player.body.touching.down || cloud.getData("touched")) {
    return;
  }

  // Mark cloud as touched
  cloud.setData("touched", true);

  // Make cloud semi-transparent
  this.tweens.add({
    targets: cloud,
    alpha: 0.3,
    duration: 500,
    ease: "Power2",
  });

  // Retrieve the skill item associated with this cloud
  const skill = cloud.getData("skillItem");
  if (skill && !skill.getData("revealed")) {
    skill.setData("revealed", true);

    // Update counters
    this.coinCount += 1;
    this.skillsCounter.setText("Skills: " + this.coinCount + "/12");
    //this.smallCounter.setText("Skills: " + this.coinCount + "/12");

    // Get the current skill
    const skillIndex = skill.getData("skillIndex");

    const currentSkill = level2Skills[skillIndex % level2Skills.length];

    // Show skill icon
    const skillIcon = this.add
      .text(
        cloud.x,
        cloud.y - 40,
        currentSkill.icon + " " + currentSkill.name,
        {
          fontSize: "24px",
        }
      )
      .setOrigin(0.5);

    // Animate skill icon bouncing up
    this.tweens.add({
      targets: skillIcon,
      y: skillIcon.y + 200,
      duration: 2000,
      ease: "Bounce",
      onComplete: () => {
        // Fade out after 1 second
        this.tweens.add({
          targets: skillIcon,
          alpha: { from: 1, to: 0 },
          duration: 500,
          delay: 500,
          onComplete: () => skillIcon.destroy(),
        });
        this.tweens.add({
          targets: skillIcon,
          y: skillIcon.y + 200,
          duration: 4000,
          ease: "Bounce",
          onComplete: () => {
            this.tweens.add({
              targets: skillIcon,
              alpha: { from: 1, to: 0 },
              duration: 1000,
              delay: 1000,
              onComplete: () => skillIcon.destroy(),
            });

            // SPECIAL CASE FOR LANGUAGES (index 11)
            /*if (skillIndex === 11) {
              console.log("Falling languages animation triggered");
              // Create language array if not already defined
              const languages = [
                "English",
                "Urdu",
                "French",
                "German",
                "Spanish",
                "Arabic",
              ];

              // Add falling animation for each language
              // Add falling animation for each language
              languages.forEach((language, i) => {
                // Create text for each language
                const langText = this.add
                  .text(
                    cloud.x + (Math.random() * 60 - 30), // Random horizontal offset
                    cloud.y - 40,
                    language,
                    {
                      fontSize: "20px",
                      fill: "#ffffff",
                      stroke: "#000000",
                      strokeThickness: 3,
                      fontStyle: "italic",
                    }
                  )
                  .setOrigin(0.5);

                // Delay each language slightly
                this.time.delayedCall(300 * (i + 1), () => {
                  // Use SAME animation style as skill icons - bounce effect
                  this.tweens.add({
                    targets: langText,
                    y: langText.y + 200, // Move down by 200 pixels
                    duration: 4000, // 4 seconds duration
                    ease: "Bounce", // Same bounce effect
                    onComplete: () => {
                      this.tweens.add({
                        targets: langText,
                        alpha: { from: 1, to: 0 },
                        duration: 3000, // 3 second fade
                        delay: 1000, // 1 second delay before fading
                        onComplete: () => langText.destroy(),
                      });
                    },
                  });
                });
              });

              // For languages skill only - delay the level completion
              if (this.skillCount >= level2Skills.length) {
                // Wait for languages to fall before showing completion
                this.time.delayedCall(6000, () => {
                  this.levelCompleting = true;
                  this.physics.pause();
                  levelComplete.call(this);
                });
                return; // Skip the normal completion check
              }
            }*/
          },
        });
      },
    });

    // Show speech bubble with skill message
    showSpeechBubble.call(this, player, currentSkill.message, 2000);

    // Particle effect
    const particles = this.add.particles(cloud.x, cloud.y - 10, "coin", {
      speed: { min: 50, max: 150 },
      scale: { start: 0.05, end: 0.01 },
      lifespan: 800,
      quantity: 10,
      blendMode: "ADD",
      emitting: false,
    });

    // Emit particles once
    particles.explode(10);

    // Destroy the particles after animation completes
    this.time.delayedCall(800, () => {
      particles.destroy();
    });

    // Update skills panel
    if (this.coinCount > 0 && this.coinCount <= level2Skills.length) {
      const skillText = this.skillTexts[this.coinCount - 1];

      // Update the text and animate appearance
      skillText.setText("• " + currentSkill.icon + " " + currentSkill.name);

      // Fade in animation
      this.tweens.add({
        targets: skillText,
        alpha: { from: 0, to: 1 },
        duration: 300,
        ease: "Power2",
      });

      // Scale animation
      this.tweens.add({
        targets: skillText,
        scaleX: { from: 0.5, to: 1 },
        scaleY: { from: 0.5, to: 1 },
        duration: 300,
        ease: "Back.easeOut",
      });
    }

    // Check if all skills are collected
    if (this.coinCount >= level2Skills.length) {
      // Show level completion dialogue
      this.time.delayedCall(1000, () => {
        showLevelEndDialogue.call(this);
      });
    }
  }
}

// Function to show pre-level dialogue
function showLevelStartDialogue() {
  // Create dialogue boxes
  const denisText = createSpeechBubble.call(
    this,
    this.player.x,
    this.player.y - 60,
    "Welcome to the cloud, Johann. This is where I store all my skills — and no, you can't download them.",
    5000
  );

  // Show Johann's response after a delay
  this.time.delayedCall(5000, () => {
    const johannText = createSpeechBubble.call(
      this,
      this.boss.x,
      this.boss.y - 50,
      "Ha! We'll see about that. Just don't get lost up here — not everyone's cut out for high-level performance.",
      5000
    );
  });
}

// Function to show level completion dialogue
function showLevelEndDialogue() {
  // Create dialogue boxes
  const johannText = createSpeechBubble.call(
    this,
    this.boss.x,
    this.boss.y - 50,
    "Okay… I'll admit it. That was impressive.",
    4000
  );

  // Show player's response after a delay
  this.time.delayedCall(4000, () => {
    const denisText = createSpeechBubble.call(
      this,
      this.player.x,
      this.player.y - 60,
      "Told you. I don't just bring skills — I bring altitude.",
      4000
    );

    // Complete level after dialogue
    this.time.delayedCall(5000, () => {
      levelComplete.call(this);
    });
  });
}

// Function to handle level completion
function levelComplete() {
  // Draw victory screen
  const dialog = this.add.graphics();
  dialog.fillStyle(0x000000, 0.8);
  dialog.fillRect(
    this.scale.width / 2 - 240,
    this.scale.height / 2 - 150,
    480,
    300
  );
  dialog.lineStyle(2, 0x00ff00, 1);
  dialog.strokeRect(
    this.scale.width / 2 - 240,
    this.scale.height / 2 - 150,
    480,
    300
  );
  dialog.setScrollFactor(0);

  // Define all message texts
  const messages = [
    {
      text: "LEVEL 2 COMPLETED!",
      style: {
        fontSize: "24px",
        fontStyle: "bold",
        fill: "#00ff00",
        align: "center",
        wordWrap: { width: 440 },
      },
      y: this.scale.height / 2 - 120,
    },
    {
      text: "You have collected my professional skills!",
      style: {
        fontSize: "16px",
        fill: "#ffffff",
        align: "center",
        wordWrap: { width: 440 },
      },
      y: this.scale.height / 2 - 60,
    },
    {
      text: "Moving to Level 3 where you will learn about\nmy motivation to join IDDP.",
      style: {
        fontSize: "16px",
        fill: "#ffffff",
        align: "center",
        wordWrap: { width: 440 },
      },
      y: this.scale.height / 2,
    },
    {
      text: "continuing in 5 seconds...",
      style: { fontSize: "14px", fill: "#aaaaaa", align: "center" },
      y: this.scale.height / 2 + 100,
    },
  ];

  // Create text objects with empty strings initially
  const textObjects = messages.map((msg) => {
    return this.add
      .text(this.scale.width / 2, msg.y, "", msg.style)
      .setScrollFactor(0)
      .setAlign("center")
      .setOrigin(0.5, 0);
  });

  // Function to create typing animation for a text object
  const typeText = (textObj, fullText, onComplete, charDelay = 30) => {
    let currentIndex = 0;
    const length = fullText.length;

    if (textObj.typingTimer) {
      this.time.removeEvent(textObj.typingTimer);
    }

    textObj.typingTimer = this.time.addEvent({
      delay: charDelay,
      callback: () => {
        currentIndex++;
        textObj.setText(fullText.substring(0, currentIndex));

        if (currentIndex >= length) {
          this.time.removeEvent(textObj.typingTimer);
          if (onComplete) onComplete();
        }
      },
      repeat: length - 1,
    });
  };

  // Start typing animations in sequence
  const startTypingSequence = (index = 0) => {
    if (index >= textObjects.length) {
      // All typing animations complete - NOW start the 5 second timer for redirect
      this.time.delayedCall(
        5000,
        () => {
          window.location.href = "video2.html";
        },
        [],
        this
      );
      return;
    }

    const charDelay = index === 0 ? 50 : 30;

    typeText(
      textObjects[index],
      messages[index].text,
      () => {
        this.time.delayedCall(300, () => {
          startTypingSequence(index + 1);
        });
      },
      charDelay
    );
  };

  // Start the typing sequence
  startTypingSequence();

  // REMOVED: The previous timer that was independent of typing completion
  // Now redirection happens exactly 5 seconds after all text has appeared
}

// Update function for boss tennis ball shooting
function updateBoss(time) {
  if (time - this.boss.lastShotTime > 5000) {
    // Create tennis ball
    const ball = this.tennisBalls
      .create(this.boss.x, this.boss.y, "tennisball")
      .setScale(0.03) // Small size
      .setTint(0xffff00) // Yellow color
      .setDepth(100);

    // Aim generally at player but with randomization
    const dx = this.player.x - this.boss.x;
    const dy = this.player.y - this.boss.y;

    // Base angle toward player
    let angle = Math.atan2(dy, dx);

    // Add random angle deviation (-0.3 to 0.3 radians, about ±17 degrees)
    angle += Math.random() * 0.6 - 0.3;

    // Randomize speed between 120-180
    const speed = 120 + Math.random() * 60;

    // Set velocity with randomized angle and speed
    ball.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

    // Set physics properties
    ball.setBounce(0.6);
    ball.setCollideWorldBounds(true);

    // Add collisions
    this.physics.add.overlap(ball, this.player, hitByBossBall, null, this);

    // Add collision with platforms
    this.physics.add.collider(
      ball,
      this.platforms,
      (ball, platform) => {
        tennisBallBounce.call(this, ball, platform);
      },
      null,
      this
    );

    // Randomize destruction time between 5-8 seconds
    const destroyTime = 5000 + Math.random() * 3000;

    // Destroy after random time
    this.time.delayedCall(destroyTime, () => {
      if (ball.active) {
        ball.destroy();
      }
    });

    // Update shot time
    this.boss.lastShotTime = time;
  }
}

// Function to handle item collection
function collectItem(player, item) {
  // Skip if already collected
  if (item.getData("collected")) {
    return;
  }

  // Mark as collected
  item.setData("collected", true);

  // Get item properties
  const itemIndex = item.getData("index");
  const itemType = item.getData("type");

  // Determine which icon to show in the panel
  const techIcons = ["📊", "📡", "🪙", "🤖", "💻"];
  const financeIcons = ["🔏", "💳", "📱", "💰", "📈"];
  const iconToShow =
    itemType === "tech"
      ? techIcons[itemIndex % techIcons.length]
      : financeIcons[(itemIndex - 5) % financeIcons.length];

  // Play collection animation without speech bubble
  const particles = this.add.particles(item.x, item.y, "coin", {
    speed: { min: 50, max: 150 },
    scale: { start: 0.05, end: 0.01 },
    lifespan: 800,
    quantity: 10,
    blendMode: "ADD",
    emitting: false,
  });

  // Emit particles once
  particles.explode(2);

  // Destroy the particles after animation completes
  this.time.delayedCall(800, () => {
    particles.destroy();
  });

  // Hide the item with animation
  this.tweens.add({
    targets: item,
    alpha: 0,
    scale: 2,
    duration: 300,
    onComplete: () => item.destroy(),
  });

  // Hide the glow
  const glow = item.getData("glow");
  if (glow) {
    this.tweens.add({
      targets: glow,
      alpha: 0,
      scale: 2,
      duration: 300,
      onComplete: () => glow.destroy(),
    });
  }

  // Update item count
  this.itemCount++;
  this.skillsCounter.setText(`Items: ${this.itemCount}/12`);
  //this.smallCounter.setText(`Items: ${this.itemCount}/12`);

  // Update skill panel
  const skillTextIndex = itemType === "tech" ? itemIndex : itemIndex;
  const skillText = this.skillTexts[itemIndex];

  // Update the text
  skillText.setText(`• ${iconToShow}`);
  skillText.setFill(itemType === "tech" ? "#00FFFF" : "#00FF00");

  // Animate skill text appearance
  this.tweens.add({
    targets: skillText,
    scaleX: { from: 0.5, to: 1 },
    scaleY: { from: 0.5, to: 1 },
    duration: 300,
    ease: "Back.easeOut",
  });

  // Check if all items collected to lower bridge
  if (this.itemCount >= 10) {
    // Delay bridge animation slightly
    this.time.delayedCall(1000, () => {
      lowerBridge.call(this);
    });
  }
}

// Function to handle bridge animation
function lowerBridge() {
  if (!this.bridgeGraphics) {
    // Create a container for the bridge (containers support rotation with pivot points)
    this.bridgeContainer = this.add.container(
      this.bridgeX - this.gapWidth / 2,
      this.bridgeY - 10
    );

    // Create a visual placeholder for the bridge
    this.bridgeGraphics = this.add.graphics();
    this.bridgeGraphics.fillStyle(0x8b4513); // Brown wood color
    this.bridgeGraphics.fillRect(0, -10, this.gapWidth, 20); // Bridge rectangle
    this.bridgeGraphics.lineStyle(2, 0x663300, 1);
    this.bridgeGraphics.strokeRect(0, -10, this.gapWidth, 20);
    this.bridgeGraphics.setDepth(15); // Set depth for visibility
    // Add the graphics to the container
    this.bridgeContainer.add(this.bridgeGraphics);

    // Start rotated 90 degrees (vertical)
    this.bridgeContainer.rotation = -Math.PI / 2; // -90 degrees in radians

    // Mark bridge as created
    this.bridgeCreated = true;
  }

  // Disable river collision if it exists
  if (this.riverCollider) {
    this.riverCollider.active = false;
  }

  // Play bridge rotation animation
  this.tweens.add({
    targets: this.bridgeContainer,
    rotation: 0, // Rotate to 0 degrees (horizontal)
    duration: 3500,
    ease: "easeIn",
    onComplete: () => {
      // Create actual collision bridge after animation
      const bridgeX = this.bridgeX;
      const bridgeY = this.scale.height - 30;

      // Check if bridge physics group exists
      if (!this.bridge) {
        this.bridge = this.physics.add.staticGroup();
      }

      const bridge = this.bridge.create(bridgeX, bridgeY, null);
      bridge.setDisplaySize(300, 20);
      bridge.setVisible(false); // Invisible but collidable
      bridge.refreshBody();

      // Create a trigger zone right after the bridge
      const bridgeEndX = this.bridgeX + this.gapWidth / 2 + 50; // 50px after bridge end
      const triggerZone = this.add.zone(
        bridgeEndX,
        this.scale.height - 50,
        30, // narrow width so it triggers just as player crosses
        100 // tall enough to catch the player
      );
      this.physics.world.enable(triggerZone);
      triggerZone.body.setAllowGravity(false);
      triggerZone.body.immovable = true;

      // Add overlap with trigger zone
      this.physics.add.overlap(
        this.player,
        triggerZone,
        triggerFinalDialogue, // Use the existing dialogue function
        null,
        this
      );

      // Show "Bridge complete" message
      const bridgeText = this.add
        .text(
          this.scale.width / 2,
          120,
          "Bridge complete! Cross to meet Johann!",
          {
            fontSize: "20px",
            fill: "#ffffff",
            stroke: "#000000",
            strokeThickness: 3,
          }
        )
        .setOrigin(0.5, 0.5)
        .setScrollFactor(0);

      // Fade out message
      this.tweens.add({
        targets: bridgeText,
        alpha: { from: 1, to: 0 },
        delay: 3000,
        duration: 1000,
      });
    },
  });
}

// Function to show level start dialogue
function showLevelStartDialogue() {
  // Add dialogue box with Denis's intro
  const startText = createSpeechBubble.call(
    this,
    this.player.x,
    this.player.y - 60,
    "Alright, Level 3. Time to get a bit personal. I've always been curious about how tech shapes the world—and how finance can steer that change.",
    3000
  );

  // Show second part after delay
  this.time.delayedCall(2000, () => {
    const startText2 = createSpeechBubble.call(
      this,
      this.player.x,
      this.player.y - 60,
      "IDDP feels like the place where I can actually explore both and grow through each of them. Let's go!",
      5000
    );
  });
}

// Function for final dialogue with Johann
function talkToTheManager(player, manager) {
  // Don't trigger multiple times
  if (this.endOfGame) return;

  // FIX: Don't disable player movement by setting endOfGame too early
  // Only mark as temporarily in dialogue
  this.inDialogue = true;

  // Stop player movement temporarily during dialogue
  this.player.setVelocityX(0);
  this.player.anims.play("stand");

  // Reduce collision body to prevent re-triggering
  manager.body.setSize(1, 1);

  // Final dialogue sequence
  const dialogues = [
    {
      speaker: "denis",
      text: "Level complete... but this isn't the end, is it?",
    },
    {
      speaker: "johann",
      text: "No, Denis. This is where the real journey begins.",
    },
    {
      speaker: "denis",
      text: "I have learned a ton and explored different passions — and somewhere along the way, I found out that this program is definitely my path.",
    },
    {
      speaker: "johann",
      text: "Well...you've shown more than skill, you've shown real purpose. And that drive for innovation in banking? That's exactly what we're looking for.",
    },
    {
      speaker: "denis",
      text: "Then... am I in?",
    },
  ];

  // Start dialogue sequence
  this.currentDialogIndex = 0;
  showNextManagerDialogue.call(this, dialogues);
}

// Function to show next dialogue in manager sequence
function showNextManagerDialogue(dialogues) {
  if (this.currentDialogIndex >= dialogues.length) {
    // End of dialogue - show success screen
    this.time.delayedCall(2000, () => {
      showSuccessScreen.call(this);
    });
    return;
  }

  const currentDialogue = dialogues[this.currentDialogIndex];
  const speaker = currentDialogue.speaker;
  const text = currentDialogue.text;

  // Position dialogue based on speaker
  const x = speaker === "denis" ? this.player.x : this.doorman.x;
  const y = speaker === "denis" ? this.player.y - 60 : this.doorman.y - 60;

  // Create speech bubble
  const speechBubble = createSpeechBubble.call(this, x, y, text, 4000);

  // Increment dialogue index
  this.currentDialogIndex++;

  // Show next dialogue after delay
  this.time.delayedCall(4000, () => {
    showNextManagerDialogue.call(this, dialogues);
  });
}

// Function to show success screen
function showSuccessScreen() {
  // Now it's safe to completely end the game
  this.endOfGame = true;

  // Draw victory dialog box
  const dialog = this.add.graphics();
  dialog.fillStyle(0x000000, 0.9);
  dialog.fillRect(
    this.scale.width / 2 - 250,
    this.scale.height / 2 - 150,
    500,
    300
  );
  dialog.lineStyle(2, 0xffd700, 1);
  dialog.strokeRect(
    this.scale.width / 2 - 250,
    this.scale.height / 2 - 150,
    500,
    300
  );
  dialog.setScrollFactor(0);

  // Add completion text
  this.add
    .text(
      this.scale.width / 2,
      this.scale.height / 2 - 120,
      "CONGRATULATIONS!",
      {
        fontSize: "32px",
        fontStyle: "bold",
        fill: "#ffd700",
      }
    )
    .setScrollFactor(0)
    .setAlign("center")
    .setOrigin(0.5, 0);

  // Add success message
  this.add
    .text(
      this.scale.width / 2,
      this.scale.height / 2 - 60,
      "You've completed Denis's journey and secured a position at IDDP!",
      {
        fontSize: "18px",
        fill: "#ffffff",
        align: "center",
        wordWrap: { width: 400 },
      }
    )
    .setScrollFactor(0)
    .setAlign("center")
    .setOrigin(0.5, 0);

  // Add final message
  this.add
    .text(
      this.scale.width / 2,
      this.scale.height / 2 + 20,
      "This is just the beginning of an exciting career journey merging technology and finance!",
      {
        fontSize: "16px",
        fill: "#ffffff",
        align: "center",
        wordWrap: { width: 400 },
      }
    )
    .setScrollFactor(0)
    .setAlign("center")
    .setOrigin(0.5, 0);

  // Add final call to action
  this.add
    .text(
      this.scale.width / 2,
      this.scale.height / 2 + 100,
      "Thank you for playing!",
      {
        fontSize: "20px",
        fill: "#00ff00",
      }
    )
    .setScrollFactor(0)
    .setAlign("center")
    .setOrigin(0.5, 0);

  // Redirect to final video
  this.time.delayedCall(5000, () => {
    window.location.href = "video3.html";
  });
}

// Update the collectCoin function to display speech bubbles
function collectCoin(player, coin) {
  // Store the coin's position before disabling it
  const coinX = coin.x;
  const coinY = coin.y;

  // Disable the coin physics body and hide it
  coin.disableBody(true, true);

  // Find and remove any glow effects at the same position
  this.children.list.forEach((child) => {
    // Check if this is a sprite that might be our glow
    if (
      child.type === "Sprite" &&
      Math.abs(child.x - coinX) < 5 &&
      Math.abs(child.y - coinY) < 5 &&
      child.alpha < 1
    ) {
      // Glows have alpha < 1
      // Add a fade out effect before destroying
      this.tweens.add({
        targets: child,
        alpha: 0,
        scale: 0,
        duration: 300,
        onComplete: function () {
          child.destroy();
        },
      });
    }
  });

  // Update counters
  this.coinCount += 1;
  this.skillsCounter.setText("Traits: " + this.coinCount + "/6");
  //this.smallCounter.setText("Skills: " + this.coinCount + "/6");

  // Show speech bubble with skill message
  const skillIndex = this.coinCount - 1; // 0-based index
  if (skillIndex >= 0 && skillIndex < skills.length) {
    showSpeechBubble.call(this, player, skills[skillIndex].message, 3000);
  }

  // Particle effect for coin collection
  const particles = this.add.particles(coinX, coinY, "coin", {
    speed: { min: 50, max: 100 },
    scale: { start: 0.05, end: 0.01 },
    lifespan: 500,
    quantity: 10,
    blendMode: "ADD",
    emitting: false,
  });

  // Emit particles once
  particles.emitParticleAt(coinX, coinY, 10);

  // Destroy the particles after animation completes
  this.time.delayedCall(500, () => {
    particles.destroy();
  });

  if (this.coinCount > 0 && this.coinCount <= skills.length) {
    // Get the skill that was just collected
    const skill = skills[this.coinCount - 1];
    const skillText = this.skillTexts[this.coinCount - 1];

    // Update the text with the proper format using icon and name
    skillText.setText("• " + skill.icon + " " + skill.name);

    // Fade in animation
    this.tweens.add({
      targets: skillText,
      alpha: { from: 0, to: 1 },
      duration: 300,
      ease: "Power2",
    });

    // Scale animation
    this.tweens.add({
      targets: skillText,
      scaleX: { from: 0.5, to: 1 },
      scaleY: { from: 0.5, to: 1 },
      duration: 300,
      ease: "Back.easeOut",
    });
  }

  // CHANGED: If tennis racket (last skill) is collected, activate boss battle
  /*if (this.coinCount == 6) {
    // Enable tennis ball shooting ability
    this.hasTennisRacket = true;

    // Show boss battle instruction
    const bossText = this.add
      .text(
        this.scale.width / 2,
        100,
        "You've got the tennis racket! Now find Johann to the right and defeat him!",
        {
          fontSize: "18px",
          fill: "#ffffff",
          stroke: "#000000",
          strokeThickness: 3,
          align: "center",
        }
      )
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0);

    // Make instruction fade after a few seconds
    this.tweens.add({
      targets: bossText,
      alpha: { from: 1, to: 0 },
      delay: 5000,
      duration: 1000,
      ease: "Power2",
    });

    // Activate the boss area
    activateBossArea.call(this);
  }*/
}

// Update the gameWin function to reflect the skills collection
function gameWin() {
  // Draw a victory dialog box
  const dialog = this.add.graphics();
  dialog.fillStyle(0x000000, 0.8);
  dialog.fillRect(
    this.scale.width / 2 - 200,
    this.scale.height / 2 - 150,
    400,
    300
  );
  dialog.lineStyle(2, 0x00ff00, 1);
  dialog.strokeRect(
    this.scale.width / 2 - 200,
    this.scale.height / 2 - 150,
    400,
    300
  );

  // Add completion text
  this.add
    .text(
      this.scale.width / 2,
      this.scale.height / 2 - 120,
      "LEVEL 1 COMPLETED!",
      {
        fontSize: "24px",
        fontStyle: "bold",
        fill: "#00ff00",
      }
    )
    .setScrollFactor(0)
    .setAlign("center")
    .setOrigin(0.5, 0);

  // Add congratulatory message
  this.add
    .text(
      this.scale.width / 2,
      this.scale.height / 2 - 60,
      "You have discovered all of my skills!",
      {
        fontSize: "16px",
        fill: "#ffffff",
      }
    )
    .setScrollFactor(0)
    .setAlign("center")
    .setOrigin(0.5, 0);

  // Add more details
  this.add
    .text(
      this.scale.width / 2,
      this.scale.height / 2,
      "Moving to Level 2 where you will learn\nabout my professional experience",
      {
        fontSize: "16px",
        fill: "#ffffff",
      }
    )
    .setScrollFactor(0)
    .setAlign("center")
    .setOrigin(0.5, 0);

  // Add progress indicator
  this.add
    .text(
      this.scale.width / 2,
      this.scale.height / 2 + 100,
      "Continuing in 5 seconds...",
      {
        fontSize: "14px",
        fill: "#aaaaaa",
      }
    )
    .setScrollFactor(0)
    .setAlign("center")
    .setOrigin(0.5, 0);

  // All elements should be fixed on screen
  dialog.setScrollFactor(0);
  resetCheckpointData();
  this.time.delayedCall(
    5000,
    () => {
      window.location.href = "video1.html";
    },
    [],
    this
  );
}

function hitEnemy(player, enemy) {
  if (player.body.touching.down && enemy.body.touching.up) {
    enemy.disableBody(true, true);
    return;
  }

  if (playerState == "big") {
    player.setScale(3);
    playerState = "small";
    return;
  }

  this.physics.pause();
  player.setTint(0xff0000);
  this.add
    .text(
      this.scale.width / 2,
      this.scale.height / 2 - 100,
      "Game Over\nKilling applicants is againsts HR rules!\nPlease be mindful",
      {
        fontSize: "16px",
        fill: "#ff0000",
        backgroundColor: "#000000",
      }
    )
    .setScrollFactor(0)
    .setAlign("center")
    .setOrigin(0.5, 0);

  this.time.delayedCall(
    5000,
    () => {
      resetSkillPanel.call(this); // Add this line
      this.scene.restart();
    },
    [],
    this
  );
}

function fallDown(player, sky) {
  console.log("fallDown");
  this.physics.pause();
  player.setTint(0xff0000);
  this.add
    .text(
      this.scale.width / 2,
      this.scale.height / 2 - 100,
      "Game Over\nKilling applicants is againsts HR rules!\nPlease be mindful",
      {
        fontSize: "16px",
        fill: "#ff0000",
      }
    )
    .setScrollFactor(0)
    .setAlign("center")
    .setOrigin(0.5, 0);

  this.time.delayedCall(
    5000,
    () => {
      resetSkillPanel.call(this); // Add this line
      this.scene.restart();
    },
    [],
    this
  );
}

// Change this function to not reference kebab
function finishLevel2(player) {
  // Remove kebab parameter and reference
  // Remove: kebab.disableBody(true, true);

  this.add
    .text(
      this.scale.width / 2,
      this.scale.height / 2 - 100,
      "Level 2 completed",
      {
        fontSize: "16px",
        fill: "#00ff00",
      }
    )
    .setScrollFactor(0)
    .setAlign("center")
    .setOrigin(0.5, 0);

  // Rest of function...
}

function enterTower(player, tower) {
  this.player.setVelocityX(0);
  this.player.anims.play("stand");
  player.disableBody(true, true);
}

// Update the boss.update function in the activateBossArea function
this.boss.update = function (time) {
  // ... existing code ...

  if (elapsedSinceLastShot > 3000 && !this.scene.playerImmune) {
    // Create a tennis ball with red overlay
    const ball = this.scene.physics.add
      .sprite(this.x, this.y - 20, "tennis") // Using tennis.jpeg image
      .setScale(0.3)
      .setTint(0xff0000) // Red overlay for Johann's balls
      .setDepth(100);

    // Add a red glow effect to make it more menacing
    const glow = this.scene.add
      .sprite(ball.x, ball.y, "tennis")
      .setScale(0.4)
      .setAlpha(0.3)
      .setTint(0xff3333)
      .setDepth(99);

    // Make the glow follow the ball
    this.scene.tweens.add({
      targets: glow,
      alpha: { from: 0.3, to: 0 },
      scale: { from: 0.4, to: 0.5 },
      duration: 200,
      repeat: -1,
    });

    // Update glow position with ball
    ball.glow = glow;
    ball.update = function () {
      if (this.glow) {
        this.glow.x = this.x;
        this.glow.y = this.y;
      }
    };
    // Add safe cleanup function for when ball is destroyed
    // Replace with this more robust version:
    ball.on(
      "destroy",
      function () {
        try {
          // Store scene reference explicitly
          const currentScene = this.scene;

          if (ball.glow && ball.glow.active) {
            // Check if the scene is still valid before using tweens
            if (
              currentScene &&
              currentScene.tweens &&
              currentScene.tweens.add
            ) {
              // Fade out glow instead of immediate destruction
              currentScene.tweens.add({
                targets: ball.glow,
                alpha: 0,
                duration: 100,
                onComplete: () => {
                  if (ball.glow && ball.glow.active) {
                    ball.glow.destroy();
                  }
                  ball.glow = null;
                },
              });
            } else {
              // Direct destruction if tweens not available
              if (ball.glow && ball.glow.active) {
                ball.glow.destroy();
              }
              ball.glow = null;
            }
          }
        } catch (e) {
          console.log("Error cleaning up ball:", e);
        }
      },
      ball
    );

    // Add ball to update list
    if (this.scene.updateList && !this.scene.updateList.includes(ball)) {
      this.scene.updateList.push(ball);
    }

    // ... rest of existing code for ball collision and movement ...
  }
};

/**Level 3 */

// Create Level 3 function by duplicating Level 2 function
function createLevel3(bgRepeat) {
  if (this.player) {
    const bodyWidth = Math.floor(this.player.width * 0.6);
    const bodyHeight = Math.floor(this.player.height * 0.9);
    const offsetX = Math.floor((this.player.width - bodyWidth) / 2);
    const offsetY = Math.floor(this.player.height * 0.1);

    this.player.body.setSize(bodyWidth, bodyHeight);
    this.player.body.setOffset(offsetX, offsetY);

    // Make sure gravity is properly applied
    const physicsScale = getPhysicsScaleFactors();
    const baseGravity = 800;
    const scaledGravity = baseGravity * physicsScale.vertical;
    this.player.body.setGravityY(scaledGravity);

    console.log("Level 3 player physics configured");
  }
  // 1. Calculate responsive scaling factors (same as Level 1 and 2)
  const baseWidth = 1920;
  const baseHeight = 1080;
  const currentWidth = this.scale.width;
  const currentHeight = this.scale.height;
  const scaleX = currentWidth / baseWidth;
  const scaleY = currentHeight / baseHeight;
  const objectScale = Math.min(scaleX, scaleY);

  // Helper function to calculate X position (same as Level 1)
  const getScaledX = (originalX) => {
    return (originalX / baseWidth) * currentWidth;
  };

  // Helper function to calculate Y position from bottom (same as Level 1)
  const getScaledYFromBottom = (distanceFromBottom) => {
    return currentHeight - distanceFromBottom * scaleY;
  };

  // 2. Create the groups
  this.platforms = this.physics.add.staticGroup();
  this.skillItems = this.physics.add.staticGroup();
  this.tennisBalls = this.physics.add.group();

  // 3. Set world bounds consistently
  this.physics.world.setBounds(0, 0, 5000, 5000);

  // In createLevel3 function, replace the existing ground code with this:
  // 4. Set up the ground with exact same approach as Level 1
  const groundHeight = 40 * scaleY; // Scale ground height
  const groundTop = currentHeight - groundHeight;
  const blockWidth = groundHeight; // Make blocks square based on ground height
  const numBlocks = Math.ceil(5000 / blockWidth) + 1; // Add one extra block for overlap

  // First ground layer with no gaps - exactly like Level 1
  for (let i = 0; i < numBlocks; i++) {
    const block = this.platforms.create(
      i * (blockWidth - 2), // Use exact width with overlap
      currentHeight - groundHeight / 2,
      "block"
    );

    block.setDisplaySize(blockWidth + 4, groundHeight);
    block.refreshBody();
    block.setData("isGround", true);
    block.setDepth(5);
    block.setAlpha(1);
  }

  // Second ground layer with no gaps - exactly like Level 1
  for (let i = 0; i < numBlocks; i++) {
    const block = this.platforms.create(
      i * (blockWidth - 4), // Use exact width with different overlap
      currentHeight - groundHeight - groundHeight / 2 + 6, // Position exactly at top of first layer
      "block"
    );

    block.setDisplaySize(blockWidth + 4, groundHeight);
    block.refreshBody();
    block.setData("isGround", true);
    block.setDepth(5);
    block.setAlpha(1);
  }

  // Create visible ground tileSprite matching the actual collision ground
  const groundVisual = this.add.tileSprite(
    0,
    groundTop - groundHeight + 6, // Position to match the top layer
    5000,
    groundHeight * 2,
    "block"
  );
  groundVisual.setOrigin(0, 0);
  groundVisual.setDepth(4); // Below the actual block depth
  // 5. Set white background (consistent with other levels)
  const background = this.add
    .image(currentWidth / 2, currentHeight / 2, "levelBackground")
    .setOrigin(0.5, 0.5) // Center the image
    .setScrollFactor(0) // Fixed to camera (no scrolling)
    .setDepth(-2);

  // Scale to cover the entire screen width
  const bgWidth = background.width;
  const bgHeight = background.height;

  // Use scaleX to ensure full width coverage, even if it crops some height
  const bgScaleX = currentWidth / bgWidth;
  const bgScaleY = currentHeight / bgHeight;
  const bgScale = Math.max(bgScaleX, bgScaleY); // Use MAXIMUM scale to ensure full coverage

  background.setScale(bgScale);
  this.background = background;
  // 6. Initialize skill counter
  this.coinCount = 0;

  // 7. Create skills panel with responsive positioning and sizing
  const minPanelWidth = 160; // Absolute minimum width in pixels
  const minPanelHeight = 230; // Absolute minimum height in pixels

  const panelWidth = Math.max(200 * scaleX, minPanelWidth); // Use maximum of scaled or minimum
  const panelHeight = Math.max(360 * scaleY, minPanelHeight); // Use maximum of scaled or minimum

  const panelX = currentWidth - panelWidth - 20 * scaleX;
  const panelY = 20 * scaleY;
  //
  this.skillsPanel = this.add.graphics();
  this.skillsPanel.fillStyle(0x000000, 0.8);
  this.skillsPanel.fillRect(panelX, panelY, panelWidth, panelHeight);
  this.skillsPanel.lineStyle(2 * scaleY, 0xffd700, 1);
  this.skillsPanel.strokeRect(panelX, panelY, panelWidth, panelHeight);
  this.skillsPanel.setScrollFactor(0);

  // 8. Title with responsive font
  const titleSize = Math.max(18 * scaleY, 14); // Minimum size of 14px
  this.add
    .text(panelX + 30 * scaleX, panelY + 30 * scaleY, "MY SKILLS", {
      fontSize: `${titleSize}px`,
      fill: "#FFD700",
      fontWeight: "bold",
    })
    .setScrollFactor(0);

  // 9. Skills counter with responsive font
  const counterSize = Math.max(16 * scaleY, 12); // Minimum size of 12px
  this.skillsCounter = this.add
    .text(
      panelX + 30 * scaleX,
      panelY + (panelHeight - 30 * scaleY),
      "Skills: 0/12",
      {
        fontSize: `${counterSize}px`,
        fill: "#FFD700",
        fontWeight: "bold",
      }
    )
    .setScrollFactor(0);

  // 10. Create skill text objects with responsive positioning and font size
  this.skillTexts = [];
  const skillSize = Math.max(12 * scaleY, 10); // Minimum size of 10px
  const skillSpacing = 20 * scaleY;

  for (let i = 0; i < level3Skills.length; i++) {
    const skillText = this.add
      .text(
        panelX + 25 * scaleX,
        panelY + 60 * scaleY + i * skillSpacing,
        level3Skills[i].icon + " " + level3Skills[i].name,
        {
          fontSize: `${skillSize}px`,
          fill: "#FFFFFF",
          fontFamily: "Arial",
        }
      )
      .setScrollFactor(0);

    // Initially hide skill text
    skillText.setAlpha(0);
    this.skillTexts.push(skillText);
  }

  // 11. Small skills counter with responsive positioning and font
  const smallCounterSize = Math.max(20 * scaleY, 16); // Minimum size of 16px

  // 12. Add instructions with responsive text
  const instructionSize = Math.max(24 * scaleY, 18); // Minimum size of 18px
  const instructionText = this.add
    .text(
      currentWidth / 2,
      80 * scaleY,
      "Collect the Icons to discover my tech & finance passions!",
      {
        fontSize: `${instructionSize}px`,
        fill: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4 * scaleY,
        fontStyle: "bold",
      }
    )
    .setOrigin(0.5, 0.5)
    .setScrollFactor(0);

  // Make instructions fade out
  this.tweens.add({
    targets: instructionText,
    alpha: { from: 1, to: 0 },
    delay: 3000,
    duration: 1000,
    ease: "Power2",
  });

  // 13. Create platforms with responsive positioning
  const platformPositions = [
    { xRatio: 250 / baseWidth, yFromBottom: 200 },
    { xRatio: 500 / baseWidth, yFromBottom: 310 },
    { xRatio: 750 / baseWidth, yFromBottom: 290 },
    { xRatio: 1000 / baseWidth, yFromBottom: 390 },
    { xRatio: 1250 / baseWidth, yFromBottom: 310 },
    { xRatio: 1500 / baseWidth, yFromBottom: 450 },
    { xRatio: 1750 / baseWidth, yFromBottom: 600 },
    { xRatio: 2000 / baseWidth, yFromBottom: 720 },
    { xRatio: 2300 / baseWidth, yFromBottom: 550 },
    { xRatio: 2600 / baseWidth, yFromBottom: 400 },
    { xRatio: 2850 / baseWidth, yFromBottom: 600 },
    { xRatio: 3100 / baseWidth, yFromBottom: 750 },
  ];

  // 14. Create platforms and skill items with responsive scaling
  for (let i = 0; i < platformPositions.length; i++) {
    const pos = platformPositions[i];

    // Calculate responsive positions
    const x = pos.xRatio * currentWidth;
    const y = currentHeight - pos.yFromBottom * scaleY;

    // Create platform using customBlock with proper scaling
    const platform = this.platforms.create(x, y, "customBlock");
    platform.setScale(3 * objectScale);
    platform.refreshBody();
    platform.setDepth(10);

    // Determine skill type (tech or finance)
    const isFinance = i >= 6; // First 6 are tech, next 6 are finance
    const itemIndex = isFinance ? i - 6 : i;
    const skillType = isFinance ? "finance" : "tech";

    // Create visible skill item using specific asset with responsive scaling
    const assetKey = `${skillType}${itemIndex + 1}`; // tech1, tech2, finance1, etc.
    const skill = this.physics.add.staticSprite(x, y - 60 * scaleY, assetKey);
    skill.setScale(0.5 * objectScale);
    skill.setDepth(15);

    // If asset doesn't exist, use fallback
    if (!this.textures.exists(assetKey)) {
      skill.setTexture("tech1");
      skill.setTint(isFinance ? 0x00ff00 : 0x00ffff);
    }

    skill.setData("index", i);
    skill.setData("type", skillType);
    skill.setData("collected", false);

    // Add floating animation scaled to screen size
    this.tweens.add({
      targets: skill,
      y: skill.y - 5 * scaleY,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Add collection overlap
    this.physics.add.overlap(this.player, skill, collectSkill, null, this);

    // Add floating animation to platforms
    this.tweens.add({
      targets: platform,
      y: y - 15 * scaleY,
      duration: 2000 + Math.random() * 1000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  // 15. Bridge and river with responsive positioning
  const bridgeX = getScaledX(3500);
  this.bridgeX = bridgeX;
  this.bridgeY = currentHeight - groundHeight / 2;
  this.gapWidth = 300 * scaleX; // Scale gap width

  // First, remove any ground tiles in the river area
  // Find and remove ground blocks that overlap with the river

  // Create a more visually appealing water/river
  const riverArea = this.add.group();

  // Create the main river body
  const riverGraphics = this.add.graphics();
  riverGraphics.fillStyle(0x0077be); // Water blue
  riverGraphics.fillRect(
    this.bridgeX - this.gapWidth / 2,
    groundTop - groundHeight + 6, // FIXED: Align exactly with ground visual surface
    this.gapWidth,
    groundHeight * 2 // INCREASED: Make river deeper for better visibility
  );
  riverGraphics.setDepth(10); // Higher depth to ensure visibility
  riverArea.add(riverGraphics);

  const towerX = this.bridgeX + this.gapWidth;
  const towerY = currentHeight - groundHeight;
  this.bridgeTower = this.add
    .sprite(towerX, towerY, "drawbridge", 0)
    .setOrigin(0.5, 1)
    .setScale(3 * objectScale)
    .setDepth(50)
    .setFlipX(true); // ADDED: Flip horizontally

  // Mark that bridge needs to be created
  this.bridgeCreated = false;

  // Left barrier - at the left edge of the river
  const leftBarrier = this.physics.add.staticImage(
    this.bridgeX - this.gapWidth / 4, // Position at left edge of river
    this.scale.height / 3, // Position in middle of visible screen
    null // No texture
  );
  // Make it thin but very tall
  leftBarrier.setDisplaySize(10, this.scale.height / 1.1);
  leftBarrier.setVisible(false); // Invisible barrier
  leftBarrier.refreshBody();
  leftBarrier.setData("isRiverBarrier", true);
  this.platforms.add(leftBarrier);

  // Store references to both barriers so we can disable them when the bridge is created
  this.riverBarriers = [leftBarrier];
  // Add Johann as doorman with responsive positioning

  this.johann = this.physics.add
    .sprite(
      this.bridgeX + this.gapWidth / 2 + 300 * scaleX,
      currentHeight - 100 * scaleY,
      "NavyBoy"
    )
    .setScale(3 * objectScale)
    .setDepth(20)
    .setFlipX(true); // ADDED: Flip horizontally

  // Make Johann static
  this.johann.body.setImmovable(true);
  this.johann.body.allowGravity = false;

  // Add collision detection with Johann to trigger dialogue
  this.physics.add.overlap(
    this.player,
    this.johann,
    triggerFinalDialogue,
    null,
    this
  );

  // Create deadly collision area for the river with responsive sizing
  this.deathZone = this.add.zone(
    this.bridgeX,
    groundTop - groundHeight, // Position at the top of the ground
    this.gapWidth,
    groundHeight * 4 // Make it much taller to catch players at any height
  );

  this.physics.world.enable(this.deathZone);
  this.deathZone.body.setAllowGravity(false);
  this.deathZone.body.immovable = true;

  // Add collision with the death zone - use a proper process callback
  this.riverCollider = this.physics.add.overlap(
    this.player,
    this.deathZone,
    riverDeath,
    (player, zone) => {
      // Additional check to ensure player is truly in the river area
      return (
        player.x > this.bridgeX - this.gapWidth / 2 &&
        player.x < this.bridgeX + this.gapWidth / 2
      );
    },
    this
  );

  // 16. Set up collisions
  this.physics.add.collider(this.player, this.platforms);

  // 17. Position the player with responsive coordinates
  if (this.player) {
    // Position at start of level
    this.player.x = 150 * scaleX;
    this.player.y = currentHeight - 150 * scaleY;

    // Reset player velocity
    this.player.setVelocity(0, 0);
    this.player.clearTint();
    this.player.setAlpha(1);
    this.player.anims.play("stand");
  }

  // 18. Apply camera bounds
  fixCameraBounds.call(this);

  // Add dialogue flags
  this.dialogueShown = false;
  this.waitingForLanding = true;
  this.bridgeCreated = false;

  return this.platforms;
}

// Modify hitCloud function to create bridge when all skills collected
function hitCloud(player, cloud) {
  // Skip ground collisions
  if (cloud.getData("isGround") || cloud.getData("isBridge")) {
    return;
  }

  // Only trigger when landing on top of cloud and not already touched
  if (!player.body.touching.down || cloud.getData("touched")) {
    return;
  }

  // Mark cloud as touched
  cloud.setData("touched", true);

  // Make cloud semi-transparent
  this.tweens.add({
    targets: cloud,
    alpha: 0.5,
    duration: 500,
  });

  // Retrieve the skill item associated with this cloud
  const skill = cloud.getData("skillItem");
  if (skill && !skill.getData("revealed")) {
    skill.setData("revealed", true);

    // Update counters
    this.coinCount += 1;
    this.skillsCounter.setText("Skills: " + this.coinCount + "/12");
    //this.smallCounter.setText("Skills: " + this.coinCount + "/12");

    // Regular skill reveal code...

    // Check if all skills are collected - CREATE BRIDGE instead of dialogue
    if (this.coinCount >= 12 && selectedLevel === 3) {
      // Create bridge after delay
      this.time.delayedCall(1000, () => {});
    }
    // For level 2, keep the original end dialogue
    else if (this.coinCount >= 12 && selectedLevel === 2) {
      // Show level completion dialogue
      this.time.delayedCall(1000, () => {
        showLevelEndDialogue.call(this);
      });
    }
  }
}

// Function to trigger the final dialogue when player meets Johann
// Modify the triggerFinalDialogue function to fade out and redirect instead of showing dialogue
function triggerFinalDialogue(player, johann) {
  // Don't trigger if already triggered or bridge not created
  if (this.endOfGame || !this.bridgeCreated) return;

  // Set flag to prevent multiple triggers
  this.endOfGame = true;

  // Stop player movement
  player.setVelocityX(0);
  player.anims.play("stand");

  // Pause physics to prevent any further movement
  this.physics.pause();

  // Create fade out effect
  this.cameras.main.fadeOut(1500, 0, 0, 0);

  // When fade out completes, redirect to video3.html
  this.cameras.main.once("camerafadeoutcomplete", () => {
    window.location.href = "video3.html";
  });
}

// Function to show Level 3 start dialogue
function showLevel3StartDialogue() {
  // Add dialogue box with Denis's intro
  const startText = createSpeechBubble.call(
    this,
    this.player.x,
    this.player.y - 60,
    "Lets Go !",
    1000
  );
  this.dialogueActive = false;
  // Show second part after delay
}

// Add this function to your game.js file if it's not already present:

// Function to create speech bubbles for dialogue
function createSpeechBubble(x, y, text, duration = 3000) {
  // Calculate text width and height for proper bubble sizing
  const textObj = this.make.text({
    x: 0,
    y: 0,
    text: text,
    style: {
      fontSize: "16px",
      wordWrap: { width: 200, useAdvancedWrap: true },
    },
  });
  const textWidth = textObj.width;
  const textHeight = textObj.height;
  textObj.destroy(); // We just needed this to measure

  // Calculate total bubble height and width
  const bubblePadding = 10;
  const bubbleWidth = Math.min(textWidth + bubblePadding * 2, 220);
  const bubbleHeight = textHeight + bubblePadding * 2;

  // Position the bubble above the character with proper spacing
  const bubbleX = x - bubbleWidth / 2;
  const bubbleY = y - bubbleHeight - 20; // Position above character

  // Create bubble graphics
  const bubble = this.add.graphics();
  bubble.x = bubbleX;
  bubble.y = bubbleY;

  // Bubble background
  bubble.fillStyle(0xffffff, 0.8);
  bubble.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 10);

  // Bubble border
  bubble.lineStyle(2, 0x000000, 1);
  bubble.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 10);

  // Add text inside bubble
  const bubbleText = this.add.text(
    bubbleX + bubblePadding,
    bubbleY + bubblePadding,
    text,
    {
      fontSize: "16px",
      fill: "#000000",
      wordWrap: { width: 200, useAdvancedWrap: true },
    }
  );

  // Create the tail/pointer correctly positioned at bottom of bubble
  const tail = this.add.graphics();
  tail.fillStyle(0xffffff, 0.8);
  tail.lineStyle(2, 0x000000, 1);

  // Draw pointing DOWN triangle at the bottom center of the bubble
  const tailX = bubbleX + bubbleWidth / 2;
  const tailY = bubbleY + bubbleHeight; // Position at bottom of bubble

  tail.beginPath();
  tail.moveTo(tailX - 10, tailY); // Left point of triangle
  tail.lineTo(tailX + 10, tailY); // Right point of triangle
  tail.lineTo(tailX, tailY + 15); // Bottom point (pointing down)
  tail.closePath();
  tail.fillPath();
  tail.strokePath();

  // Group everything for easy manipulation
  const container = this.add.container(0, 0, [bubble, bubbleText, tail]);
  container.setDepth(1000); // Make sure it's on top of everything

  // Auto-destroy after duration
  if (duration > 0) {
    this.time.delayedCall(duration, () => {
      this.tweens.add({
        targets: container,
        alpha: 0,
        duration: 300,
        onComplete: () => container.destroy(),
      });
    });
  }

  return container;
}

function showSpeechBubble(player, text, duration = 3000) {
  const bubble = createSpeechBubble.call(
    this,
    player.x,
    player.y - 60,
    text,
    duration
  );
  return bubble;
}

// Handle window resize
window.addEventListener("resize", resizeGame);

function resizeGame() {
  if (!game) return;

  const canvas = document.querySelector("canvas");
  if (!canvas) return;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  game.scale.resize(viewportWidth, viewportHeight);
  if (game.scene && game.scene.scenes[0]) {
    fixCameraBounds.call(game.scene.scenes[0]);
  }
}

// Update the boss.update function in the activateBossArea function
this.boss.update = function (time) {
  // ... existing code ...

  if (elapsedSinceLastShot > 3000 && !this.scene.playerImmune) {
    // Create a tennis ball with red overlay
    const ball = this.scene.physics.add
      .sprite(this.x, this.y - 20, "tennis") // Using tennis.jpeg image
      .setScale(0.3)
      .setTint(0xff0000) // Red overlay for Johann's balls
      .setDepth(100);

    // Add a red glow effect to make it more menacing
    const glow = this.scene.add
      .sprite(ball.x, ball.y, "tennis")
      .setScale(0.4)
      .setAlpha(0.3)
      .setTint(0xff3333)
      .setDepth(99);

    // Make the glow follow the ball
    this.scene.tweens.add({
      targets: glow,
      alpha: { from: 0.3, to: 0 },
      scale: { from: 0.4, to: 0.5 },
      duration: 200,
      repeat: -1,
    });

    // Update glow position with ball
    ball.glow = glow;
    ball.update = function () {
      if (this.glow) {
        this.glow.x = this.x;
        this.glow.y = this.y;
      }
    };

    // Add ball to update list
    if (this.scene.updateList && !this.scene.updateList.includes(ball)) {
      this.scene.updateList.push(ball);
    }

    // ... rest of existing code for ball collision and movement ...
  }
};

function hitMysteryBox(player, box) {
  // Only trigger when hitting from below and not already hit
  if (!player.body.touching.up || box.getData("hit")) {
    return;
  }

  // Mark box as hit
  box.setData("hit", true);

  // Store player velocity to restore it later if needed
  this.playerVelocityBeforeDialogue = {
    x: player.body.velocity.x,
    y: player.body.velocity.y,
  };

  // Force player to stop and display standing animation
  player.setVelocity(0, 0);
  player.anims.play("stand");

  // Store box position for effects
  const boxX = box.x;
  const boxY = box.y;

  // Create "bump" effect
  this.tweens.add({
    targets: box,
    y: box.y - 10,
    duration: 100,
    yoyo: true,
    onComplete: () => {
      // Remove box completely from gameplay
      box.destroy();
    },
  });

  // Get skill index from the box
  const skillIndex = box.getData("skillIndex");
  saveCheckpointData(skillIndex);

  // Find and remove any glow effects
  const glow = box.getData("glow");
  if (glow) {
    this.tweens.add({
      targets: glow,
      alpha: 0,
      scale: 0,
      duration: 300,
      onComplete: function () {
        glow.destroy();
      },
    });
  }

  // Get the current skill
  const skill = skills[skillIndex];

  // Check if this is the tennis racket skill (skill index 5 is typically the last one with tennis racket)
  const isGuitarSkill = skill.name.toLowerCase().includes("racket");

  // Show skill icon popping out of the box
  /*const skillIcon = this.add
    .text(boxX, boxY - 40, skill.icon + " " + skill.name, { fontSize: "28px" })
    .setOrigin(0.5)
    .setDepth(1002);
  const speechHeight = 120; // Approximate height of speech bubble
  const bounceHeight = speechHeight + 30; // Bounce higher than speech bubble

  // Animate skill icon bouncing up
  /*this.tweens.add({
    targets: skillIcon,
    y: skillIcon.y - bounceHeight,
    duration: 800,
    ease: "Bounce",
    onComplete: () => {
      // Fade out and destroy after bounce animation
      this.tweens.add({
        targets: skillIcon,
        y: skillIcon.y - 5,
        duration: 1000,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    },
  });*/

  // Update counters
  this.coinCount = (this.coinCount || 0) + 1;
  this.skillsCounter.setText("Traits: " + this.coinCount + "/6");
  //this.smallCounter.setText("Skills: " + this.coinCount + "/6");
  this.skillCount = (this.skillCount || 0) + 1;

  // Show speech bubble with skill message
  //const speechBubble = showSpeechBubble.call(this, player, skill.message, 3000);
  const landingCheck = this.time.addEvent({
    delay: 5, // Check every 100ms
    callback: () => {
      if (player.body.touching.down) {
        // Player has landed, show speech bubble
        landingCheck.remove();
        this.dialogueActive = true;
        this.physics.pause();
        player.setVelocity(0, 0);
        player.anims.play("stand");

        const speechDuration = calculateSpeechDuration(skill.message);

        console.log("Speech duration:", speechDuration); // Log the calculated duration
        animatedSpeechBubble.call(
          this,
          player.x,
          player.y - 60,
          skill.message,
          3000,
          //speechDuration,
          skill
        );

        // Check if all skills collected
        /*if (this.skillCount >= 6) {
          // Delay bridge animation slightly
          this.time.delayedCall(1000, () => {
            // Show completion message if all collected
            const completionText = this.add
              .text(
                this.scale.width / 2,
                this.scale.height / 2 - 100,
                "All skills collected! Head to the flagpole!",
                {
                  fontSize: "24px",
                  fill: "#ffffff",
                  stroke: "#000000",
                  strokeThickness: 4,
                }
              )
              .setOrigin(0.5)
              .setScrollFactor(0);

            // Remove after a few seconds
            this.time.delayedCall(3000, () => {
              completionText.destroy();
            });
          });
        }*/
      }
    },
    callbackScope: this,
    loop: true,
  });
  this.time.delayedCall(5000, () => {
    landingCheck.remove();
  });
  // ADDED: Resume physics and player control after dialogue finishes
  this.time.delayedCall(3000, () => {
    // Only resume if not entering boss battle (which handles physics itself)
    /*if (!isGuitarSkill) {
      this.physics.resume();
      this.dialogueActive = false;
    }*/
  });

  // Activate boss area immediately if it's the tennis racket skill
  /*if (isGuitarSkill) {
    console.log("Tennis racket skill activated! Entering boss area...");

    // Enable tennis ball shooting ability
    this.hasTennisRacket = true;

    // Show message about tennis challenge
    const challengeMessage = this.add
      .text(
        this.scale.width / 2,
        100,
        "You found a tennis racket! Johann challenges you to a duel!",
        {
          fontSize: "18px",
          fill: "#ffffff",
          stroke: "#000000",
          strokeThickness: 3,
          align: "center",
        }
      )
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0);

    // Make message fade out
    this.tweens.add({
      targets: challengeMessage,
      alpha: { from: 1, to: 0 },
      delay: 3000,
      duration: 1000,
    });

    // NOTE: We don't resume physics here since activateBossArea handles physics
    // Activate boss area with short delay to allow reading the dialogue
    this.time.delayedCall(3000, () => {
      activateBossArea.call(this);
    });
  }*/

  // Particle effect
  const particles = this.add.particles(boxX, boxY - 10, "coin", {
    speed: { min: 50, max: 150 },
    scale: { start: 0.05, end: 0.01 },
    lifespan: 800,
    quantity: 10,
    blendMode: "ADD",
    emitting: false,
  });

  // Emit particles once
  particles.explode(10);

  // Destroy the particles after animation completes
  this.time.delayedCall(800, () => {
    particles.destroy();
  });

  // Update skills panel
  if (this.coinCount > 0 && this.coinCount <= skills.length) {
    const skillText = this.skillTexts[this.coinCount - 1];

    // Update the text and animate appearance
    skillText.setText("• " + skill.icon + " " + skill.name);

    // Fade in animation
    this.tweens.add({
      targets: skillText,
      alpha: { from: 0, to: 1 },
      duration: 300,
      ease: "Power2",
    });

    // Scale animation
    this.tweens.add({
      targets: skillText,
      scaleX: { from: 0.5, to: 1 },
      scaleY: { from: 0.5, to: 1 },
      duration: 300,
      ease: "Back.easeOut",
    });
  }
}

// Function to handle player falling into river
function riverDeath(player, river) {
  // Don't trigger if bridge is already created
  if (this.bridgeCreated) {
    // Disable collision if bridge exists
    this.riverCollider.active = false;
    return;
  }

  // Stop player movement
  this.physics.pause();
  player.setVelocity(0, 0);
  player.setTint(0x0000ff); // Blue tint for drowning

  // Create ripple/splash effect
  const splash = this.add.particles(player.x, this.scale.height - 100, "coin", {
    speed: { min: 20, max: 70 },
    scale: { start: 0.05, end: 0 },
    lifespan: 800,
    tint: 0x0077be,
    quantity: 15,
    angle: { min: 240, max: 300 },
    emitting: false,
  });

  splash.explode(15);

  // Create full screen overlay
  const overlay = this.add
    .rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.8)
    .setOrigin(0, 0)
    .setScrollFactor(0)
    .setDepth(999);

  // Show custom message
  const gameOverText = this.add
    .text(
      this.scale.width / 2,
      this.scale.height / 2 - 100,
      "GAME OVER\n\nYou can't enter a company without an interview!\nWait for the bridge to lower.",
      {
        fontSize: "18px",
        fill: "#ff0000",
        align: "center",
        padding: 10,
      }
    )
    .setScrollFactor(0)
    .setAlign("center")
    .setOrigin(0.5, 0)
    .setDepth(1000);

  // Add restart button
  const restartButton = this.add
    .text(this.scale.width / 2, this.scale.height / 2 + 80, "[ Try Again ]", {
      fontSize: "20px",
      fill: "#ffffff",
      backgroundColor: "#880000",
      padding: { x: 15, y: 10 },
    })
    .setScrollFactor(0)
    .setAlign("center")
    .setOrigin(0.5, 0.5)
    .setDepth(1000)
    .setInteractive({ useHandCursor: true });

  // Button hover effects
  restartButton.on("pointerover", () => {
    restartButton.setStyle({ fill: "#ffff00" });
  });

  restartButton.on("pointerout", () => {
    restartButton.setStyle({ fill: "#ffffff" });
  });

  // Restart on click
  restartButton.on("pointerdown", () => {
    resetSkillPanel.call(this); // Add this line
    this.scene.restart();
  });
}

// Add this function to handle skill collection in Level 3

function collectSkill(player, skill) {
  // Skip if already collected
  if (skill.getData("collected")) {
    return;
  }

  // Mark as collected
  skill.setData("collected", true);

  // Get item properties
  const itemIndex = skill.getData("index");
  const itemType = skill.getData("type");

  // Create collection particle effect
  const particles = this.add.particles(skill.x, skill.y, "coin", {
    speed: { min: 50, max: 150 },
    scale: { start: 0.1, end: 0.01 },
    lifespan: 800,
    quantity: 15,
    blendMode: "ADD",
    tint: itemType === "tech" ? 0x00ffff : 0x00ff00,
    emitting: false,
  });

  // Explode particles
  particles.explode(15);

  // Destroy particles after animation completes
  this.time.delayedCall(800, () => particles.destroy());

  // Hide the item with animation
  this.tweens.add({
    targets: skill,
    alpha: 0,
    scale: 1.2,
    duration: 500,
    onComplete: () => skill.destroy(),
  });

  const skillIndex = itemIndex >= 6 ? itemIndex - 6 : itemIndex;
  const skillData = level3Skills[itemIndex] || {};

  // Get year and description if available
  const year = skillData.year || "";
  const description = skillData.desc || "";

  // If we have year or description, show them
  if (year || description) {
    // Create text objects with nice formatting
    const yearText = this.add
      .text(skill.x, skill.y - 60, year ? `${year}` : "", {
        fontSize: "18px",
        fontStyle: "bold",
        color: "#FFFFFF",
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    const descText = this.add
      .text(skill.x, skill.y - 10, description, {
        fontSize: "14px",
        color: "#FFFFFF",
        stroke: "#000000",
        strokeThickness: 2,
        align: "center",
        wordWrap: { width: 180 },
      })
      .setOrigin(0.5);

    // Add particle effects around the text
    /*const textParticles = this.add.particles(skill.x, skill.y - 30, "coin", {
      speed: { min: 30, max: 70 },
      scale: { start: 0.05, end: 0 },
      alpha: { start: 0.7, end: 0 },
      lifespan: 2000,
      quantity: 1,
      frequency: 200,
      tint: itemType === "tech" ? 0x00ffff : 0x00ff00,
    });*/

    // Text animation sequence
    this.tweens.add({
      targets: [yearText, descText],
      y: "-=30", // Float upward
      duration: 3000,
      ease: "Sine.easeOut",
      onComplete: () => {
        // Start fading out halfway through the upward animation
        this.tweens.add({
          targets: [yearText, descText],
          alpha: 0,
          duration: 1000,
          onComplete: () => {
            yearText.destroy();
            descText.destroy();
            //textParticles.destroy();
          },
        });
      },
    });
  }

  // Rest of your existing skill collection code
  // Update item count
  this.itemCount = (this.itemCount || 0) + 1;
  this.skillsCounter.setText(`Items: ${this.itemCount}/12`);

  // Update skill panel
  if (itemIndex < this.skillTexts.length) {
    const skillText = this.skillTexts[itemIndex];

    // Get emoji icon for this skill type and index
    const techIcons = ["📊", "📡", "🪙", "🤖", "💻"];
    const financeIcons = ["🔏", "💳", "📱", "💰", "📈"];
    const iconToShow =
      itemType === "tech"
        ? techIcons[itemIndex % techIcons.length]
        : financeIcons[(itemIndex - 6) % financeIcons.length];

    // Update the text
    skillText.setText(`• ${iconToShow}`);
    skillText.setFill(itemType === "tech" ? "#00FFFF" : "#00FF00");
    skillText.setAlpha(1);

    // Animate skill text appearance
    this.tweens.add({
      targets: skillText,
      scaleX: { from: 0.5, to: 1 },
      scaleY: { from: 0.5, to: 1 },
      duration: 300,
      ease: "Back.easeOut",
    });
  }

  // Check if all items collected to lower bridge
  if (this.itemCount >= 12) {
    // Delay bridge animation slightly
    this.time.delayedCall(1000, () => {
      lowerBridge.call(this);
    });
  }
}

// In the playerHitCloud function (or whatever handles cloud collision)
function playerHitCloud(player, cloud) {
  if (cloud.getData("isPlatform")) {
    return;
  }
  if (cloud.getData("isDeadlyGround")) {
    // Call the death function if player hits deadly ground
    cloudFallDeath.call(this, player);
    return; // Exit function immediately
  }
  // Skip if cloud already activated
  if (cloud.getData("activated")) {
    return;
  }
  if (cloud.getData("isGround") || cloud.getData("activated")) {
    return;
  }

  // Mark cloud as activated
  cloud.setData("activated", true);

  // Get the skill index from cloud's data or its array position
  const skillIndex = cloud.getData("skillIndex");
  console.log("Skill index:", skillIndex);
  // 1. Make the cloud transparent
  this.tweens.add({
    targets: cloud,
    alpha: 0.3,
    duration: 500,
    ease: "Power2",
  });

  // 2. Reveal the skill in the panel
  if (skillIndex < this.skillTexts.length) {
    const skillText = this.skillTexts[skillIndex];

    // Get skill data from level2Skills array
    const skill = level2Skills[skillIndex];

    // Set the text with icon
    skillText.setText(`${skill.icon} ${skill.name}`);
    skillText.setFill("#FFFFFF");

    // Make it visible with animation
    skillText.setAlpha(1);
    this.tweens.add({
      targets: skillText,
      scaleX: { from: 0.5, to: 1 },
      scaleY: { from: 0.5, to: 1 },
      duration: 500,
      ease: "Back.easeOut",
    });
  }

  // 3. Create the falling skill symbol effect
  const scaleFactor = getResponsiveScaleFactor();
  const skillIconSize = Math.max(24 * scaleFactor, 18); // Minimum size of 18px
  const skillIcon = this.add.text(
    cloud.x,
    cloud.y,
    `${level2Skills[skillIndex].icon} ${level2Skills[skillIndex].name}`,
    { fontSize: `${skillIconSize}px` }
  );

  // Animate the symbol falling from the cloud
  this.tweens.add({
    targets: skillIcon,
    y: skillIcon.y + 200,
    duration: 3000,
    ease: "Bounce",
    onComplete: () => {
      this.tweens.add({
        targets: skillIcon,
        alpha: { from: 1, to: 0 },
        duration: 100,
        delay: 100,
        onComplete: () => skillIcon.destroy(),
      });

      // SPECIAL CASE FOR LANGUAGES (index 11)
      /*if (skillIndex === 11) {
        console.log("Falling languages animation triggered");
        // Create language array if not already defined
        const languages = [
          "German",
          "english",
          "turkish",
          "chinese",
          "italien",
          "spanish",
        ];

        // Add falling animation for each language
        languages.forEach((language, i) => {
          // Create text for each language
          const langText = this.add
            .text(
              cloud.x + (Math.random() * 60 - 30), // Random horizontal offset
              cloud.y - 40,
              language,
              {
                fontSize: "20px",
                fill: "#ffffff",
                stroke: "#000000",
                strokeThickness: 3,
                fontStyle: "italic",
              }
            )
            .setOrigin(0.5);

          // Delay each language slightly
          this.time.delayedCall(300 * (i + 1), () => {
            // Add falling animation with slight horizontal movement
            this.tweens.add({
              targets: langText,
              y: langText.y + 300,
              x: langText.x + (Math.random() * 60 - 30), // Random drift
              alpha: { from: 1, to: 0 },
              duration: 3000,
              ease: "Cubic.easeIn",
              onComplete: () => langText.destroy(),
            });
          });
        });

        // For languages skill only - delay the level completion
        if (this.skillCount >= level2Skills.length) {
          // Wait for languages to fall before showing completion
          this.time.delayedCall(6000, () => {
            this.levelCompleting = true;
            this.physics.pause();
            levelComplete.call(this);
          });
          return; // Skip the normal completion check
        }
      }*/
    },
  });

  // 4. Update skill counter
  this.skillCount = (this.skillCount || 0) + 1;
  this.skillsCounter.setText(
    `Skills: ${this.skillCount}/${level2Skills.length}`
  );
  /*this.smallCounter.setText(
    `Skills: ${this.skillCount}/${level2Skills.length}`
  );*/

  // 6. Check if all skills collected
  if (this.skillCount >= level2Skills.length) {
    this.levelCompleting = true;

    this.time.delayedCall(4000, () => {
      this.physics.pause();
      levelComplete.call(this);
    });
  }
}
// Function to handle death from falling off clouds in Level 2
function cloudFallDeath(player) {
  // Only run once
  if (this.playerDying) return;
  this.playerDying = true;

  console.log("Player hit deadly ground - triggering death sequence");

  // Stop player movement
  this.physics.pause();
  player.setVelocity(0, 0);
  player.setTint(0xff0000); // Set red tint immediately

  // Create fall effect
  const fallTrail = this.add.particles(player.x, player.y, "cloud", {
    speed: { min: 50, max: 100 },
    scale: { start: 0.1, end: 0 },
    lifespan: 500,
    quantity: 15,
    blendMode: "ADD",
    alpha: { start: 0.6, end: 0 },
    emitting: false,
  });
  fallTrail.explode(15);

  // Store scene reference to avoid 'this' context issues
  const currentScene = this;

  // Try to play death animation if available
  try {
    player.anims.play("dead");

    // Use a direct timeout instead of relying on animation complete
    this.time.delayedCall(1300, function () {
      showGameOverScreen();
    });
  } catch (error) {
    console.error("Error playing death animation:", error);
    // Fallback if animation play fails - show game over immediately
    showGameOverScreen();
  }

  // Define game over screen function with proper scene context
  function showGameOverScreen() {
    // Create full screen overlay
    const overlay = currentScene.add
      .rectangle(
        0,
        0,
        currentScene.scale.width,
        currentScene.scale.height,
        0x000000,
        0.8
      )
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(999);

    // Show custom message
    const gameOverText = currentScene.add
      .text(
        currentScene.scale.width / 2,
        currentScene.scale.height / 2 - 100,
        "GAME OVER\n\nWhen reaching for the clouds,\nyou need to stay focused!",
        {
          fontSize: "18px",
          fill: "#ff0000",
          align: "center",
          padding: 10,
        }
      )
      .setScrollFactor(0)
      .setAlign("center")
      .setOrigin(0.5, 0)
      .setDepth(1000);

    // Add restart button
    const restartButton = currentScene.add
      .text(
        currentScene.scale.width / 2,
        currentScene.scale.height / 2 + 80,
        "[ Try Again ]",
        {
          fontSize: "20px",
          fill: "#ffffff",
          backgroundColor: "#880000",
          padding: { x: 15, y: 10 },
        }
      )
      .setScrollFactor(0)
      .setAlign("center")
      .setOrigin(0.5, 0.5)
      .setDepth(1000)
      .setInteractive({ useHandCursor: true });

    // Button hover effects
    restartButton.on("pointerover", () => {
      restartButton.setStyle({ fill: "#ffff00" });
    });

    restartButton.on("pointerout", () => {
      restartButton.setStyle({ fill: "#ffffff" });
    });

    // Restart on click
    restartButton.on("pointerdown", () => {
      resetSkillPanel.call(currentScene);
      currentScene.scene.restart();
    });
  }
}
// Modify the showLevel3Intro function to auto-start after dialogue
function showLevel3Intro(callback) {
  // Create the intro container
  const introContainer = document.createElement("div");
  introContainer.id = "level3-intro-container";
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

  // Add the character image
  const character = document.createElement("img");
  character.id = "intro-character";
  character.src = "assets/mario.png";
  character.style.position = "absolute";
  character.style.width = "80px";
  character.style.height = "120px";
  character.style.bottom = "50px";
  character.style.left = "50px";
  character.style.transition = "left 2s ease-in-out";

  // Create the dialogue box
  const dialogBox = document.createElement("div");
  dialogBox.id = "level3-dialog";
  dialogBox.style.position = "absolute";
  dialogBox.style.width = "70%";
  dialogBox.style.padding = "20px";
  dialogBox.style.backgroundColor = "#FFFFFF";
  dialogBox.style.border = "2px solid #333333";
  dialogBox.style.color = "#000000";
  dialogBox.style.fontFamily = "Comic Sans MS, Arial, sans-serif";
  dialogBox.style.fontSize = "18px";
  dialogBox.style.textAlign = "left";
  dialogBox.style.bottom = "150px";
  dialogBox.style.display = "none";
  dialogBox.style.opacity = "0";
  dialogBox.style.transition = "opacity 0.5s ease-in-out";
  dialogBox.style.borderRadius = "20px";
  dialogBox.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";

  // Create speech bubble tail
  const speechTail = document.createElement("div");
  speechTail.style.position = "absolute";
  speechTail.style.bottom = "-20px";
  speechTail.style.left = "50px";
  speechTail.style.width = "0";
  speechTail.style.height = "0";
  speechTail.style.borderLeft = "15px solid transparent";
  speechTail.style.borderRight = "15px solid transparent";
  speechTail.style.borderTop = "20px solid #FFFFFF";
  speechTail.style.zIndex = "1";

  // Create border for speech tail
  const speechTailBorder = document.createElement("div");
  speechTailBorder.style.position = "absolute";
  speechTailBorder.style.bottom = "-23px";
  speechTailBorder.style.left = "50px";
  speechTailBorder.style.width = "0";
  speechTailBorder.style.height = "0";
  speechTailBorder.style.borderLeft = "17px solid transparent";
  speechTailBorder.style.borderRight = "17px solid transparent";
  speechTailBorder.style.borderTop = "23px solid #333333";
  speechTailBorder.style.zIndex = "0";

  // Character name element
  const characterName = document.createElement("div");
  characterName.textContent = "DENIS";
  characterName.style.color = "#4A89DC";
  characterName.style.fontWeight = "bold";
  characterName.style.fontSize = "22px";
  characterName.style.marginBottom = "10px";
  characterName.style.textTransform = "uppercase";
  dialogBox.appendChild(characterName);

  // Dialog text element
  const dialogText = document.createElement("div");
  dialogText.id = "level3-dialog-text";
  dialogText.style.lineHeight = "1.5";
  dialogText.style.marginBottom = "15px";
  dialogBox.appendChild(dialogText);

  // Counter text for auto-start
  const counterText = document.createElement("div");
  counterText.id = "counter-text";
  counterText.style.textAlign = "center";
  counterText.style.marginTop = "20px";
  counterText.style.color = "#888";
  counterText.style.fontSize = "16px";
  counterText.style.visibility = "hidden";
  dialogBox.appendChild(counterText);

  // Add the speech tail elements to the dialog box
  dialogBox.appendChild(speechTailBorder);
  dialogBox.appendChild(speechTail);

  // Add elements to container
  introContainer.appendChild(character);
  introContainer.appendChild(dialogBox);
  document.body.appendChild(introContainer);

  // Animation sequence
  setTimeout(() => {
    character.style.left = "180px"; // Move character to position

    setTimeout(() => {
      dialogBox.style.display = "block";
      setTimeout(() => {
        dialogBox.style.opacity = "1";

        // Type the dialogue text
        const dialogContent =
          "Alright, Level 3. Time to get a bit personal. I've always been curious about how tech shapes the world—and how finance can steer that change. IDDP feels like the place where I can actually explore both and grow through each of them. Let's go!";

        // Typing animation
        let i = 0;
        const typeInterval = setInterval(() => {
          if (i < dialogContent.length) {
            dialogText.textContent += dialogContent.charAt(i);
            i++;
          } else {
            clearInterval(typeInterval);

            // Show countdown instead of button
            counterText.style.visibility = "visible";
            let secondsLeft = 3;

            // Update counter text
            const updateCounter = () => {
              counterText.textContent = `Starting in ${secondsLeft} second${
                secondsLeft !== 1 ? "s" : ""
              }...`;
            };

            // Initial counter display
            updateCounter();

            // Start countdown
            const countdownInterval = setInterval(() => {
              secondsLeft--;

              if (secondsLeft <= 0) {
                clearInterval(countdownInterval);
                // Fade out intro container
                introContainer.style.opacity = "0";
                setTimeout(() => {
                  introContainer.remove();
                  if (callback) callback(); // Start the actual level
                }, 500);
              } else {
                updateCounter();
              }
            }, 1000);
          }
        }, 30); // Speed of typing
      }, 100);
    }, 2100);
  }, 500);

  return introContainer;
}

/**New fixcamera */
function fixCameraBounds() {
  // Get the camera and its dimensions
  const camera = this.cameras.main;
  const gameWidth = this.scale.width;
  const gameHeight = this.scale.height;

  // World dimensions
  const worldWidth = 5000;
  const worldHeight = 5000;

  // 1. Create a large deadzone (most of the screen) so camera only moves when player nears edges
  const deadZoneWidth = gameWidth * 0.3; // 60% of screen width
  const deadZoneHeight = gameHeight * 0.6; // 60% of screen height

  // Calculate deadzone position (centered)
  const deadZoneX = (gameWidth - deadZoneWidth) / 2;
  const deadZoneY = (gameHeight - deadZoneHeight) / 2;

  // 2. Configure camera with static-feeling settings
  camera.setBounds(0, 0, worldWidth, worldHeight);
  camera.setDeadzone(deadZoneWidth, deadZoneHeight); // Large deadzone so camera moves less

  // 3. Use very slow lerp/smoothing for subtle movement
  camera.startFollow(
    this.player,
    true, // Round pixels
    0.05, // Very slow X lerp (was 0.1)
    0.05, // Very slow Y lerp (was 0.1)
    0, // X offset to center player in deadzone
    0 // No Y offset
  );

  // 4. Keep ground visible by adding a floor boundary
  const groundHeight = 40 * (this.scale.height / 1080);
  const groundY = this.scale.height - groundHeight * 2;

  // 5. Override camera update to ensure constraints
  const originalUpdate = camera.update;
  camera.update = function () {
    // Call original update method
    originalUpdate.apply(this, arguments);

    const playerX = this.scene.player.x - this.scrollX;

    // ADDED: Make sure player stays visible when moving left
    // If player is too close to left edge, adjust camera
    if (playerX < 100) {
      this.scrollX = this.scene.player.x - 100;
    }
    // Never show below ground
    if (this.scrollY + gameHeight > groundY + 20) {
      this.scrollY = groundY + 20 - gameHeight;
    }

    // Never show left of world boundary
    if (this.scrollX < 0) {
      this.scrollX = 0;
    }

    // Never show above world top
    if (this.scrollY < 0) {
      this.scrollY = 0;
    }
  };

  // 6. For even more static feeling, we could snap camera to grid positions
  // Uncomment the following line if you want camera to move in "chunks"
  camera.setRoundPixels(true);
}
function getPhysicsScaleFactors() {
  const baseWidth = 1920;
  const baseHeight = 1080;

  // Current dimensions
  const currentWidth = window.innerWidth;
  const currentHeight = window.innerHeight;

  // Calculate raw scaling factors
  const scaleX = currentWidth / baseWidth;
  const scaleY = currentHeight / baseHeight;

  // Calculate a blended scale factor for balanced physics
  const blendedScale = Math.sqrt(scaleX * scaleY);

  // Return all factors so we can choose the appropriate one for each physics property
  return {
    horizontal: scaleX,
    vertical: scaleY,
    blended: blendedScale,
    // Keep the min scale for objects that need consistent proportions
    uniform: Math.min(scaleX, scaleY),
  };
}
function getResponsiveScaleFactor() {
  const baseWidth = 1920;
  const baseHeight = 1080;

  // Current dimensions
  const currentWidth = window.innerWidth;
  const currentHeight = window.innerHeight;

  // Calculate scaling factors
  const scaleX = currentWidth / baseWidth;
  const scaleY = currentHeight / baseHeight;

  // Use the smaller scale for consistent proportions
  return Math.min(scaleX, scaleY);
}
function animatedSpeechBubble(x, y, text, duration = 3000, skill) {
  // Pause physics and activate dialogue state
  this.physics.pause();
  this.dialogueActive = true;

  // Calculate text dimensions with wider word wrap to prevent overflow
  const textObj = this.make.text({
    x: 0,
    y: 0,
    text: text,
    style: {
      fontSize: "16px",
      wordWrap: { width: 240, useAdvancedWrap: true },
    },
  });

  // Get actual text dimensions after wrapping
  const textWidth = textObj.width;
  const textHeight = textObj.height;
  textObj.destroy(); // Clean up measurement text

  // Calculate bubble dimensions with more padding
  const bubblePadding = 15;
  const bubbleWidth = Math.min(textWidth + bubblePadding * 3, 260);
  const bubbleHeight = textHeight + bubblePadding * 2.5;

  // Position bubble above character
  const bubbleX = x - bubbleWidth / 2;
  const bubbleY = y - bubbleHeight - 25;

  // Create skill icon ABOVE the speech bubble with dynamic font size
  const skillIconMaxWidth = bubbleWidth * 0.9; // 90% of bubble width

  // Calculate font size based on text length and available width
  const skillText = skill.icon + " " + skill.name;
  const baseFontSize = 28;
  const estimatedWidth = skillText.length * (baseFontSize / 2); // Rough estimate
  const scaleFactor =
    estimatedWidth > skillIconMaxWidth ? skillIconMaxWidth / estimatedWidth : 1;
  const fontSize = Math.max(16, Math.floor(baseFontSize * scaleFactor)); // Min 16px

  // Create skill icon just above where bubble will appear
  const skillIcon = this.add
    .text(x, bubbleY - 20, skillText, {
      fontSize: `${fontSize}px`,
      align: "center",
    })
    .setOrigin(0.5)
    .setDepth(1002);

  // Animate skill icon to hover above speech bubble
  this.tweens.add({
    targets: skillIcon,
    y: bubbleY - 30, // Slight lift above speech bubble
    duration: 800,
    ease: "Bounce",
    onComplete: () => {
      // Add subtle floating animation
      this.tweens.add({
        targets: skillIcon,
        y: skillIcon.y - 5,
        duration: 1000,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    },
  });

  // Create bubble graphics with WHITE background
  const bubble = this.add.graphics();
  bubble.x = bubbleX;
  bubble.y = bubbleY;

  // White background with slight transparency
  bubble.fillStyle(0xffffff, 0.9);
  bubble.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 10);

  // Black border
  bubble.lineStyle(2, 0x000000, 1);
  bubble.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 10);

  // Empty text object for typing animation with BLACK text
  const bubbleText = this.add.text(
    bubbleX + bubblePadding,
    bubbleY + bubblePadding,
    "", // Start empty for typing effect
    {
      fontSize: "16px",
      fill: "#000000", // Black text on white background
      wordWrap: {
        width: bubbleWidth - bubblePadding * 2.5,
        useAdvancedWrap: true,
      },
    }
  );

  // Create tail with white background and black border
  const tail = this.add.graphics();
  tail.fillStyle(0xffffff, 0.9);
  tail.lineStyle(2, 0x000000, 1);

  // Draw pointer triangle
  const tailX = bubbleX + bubbleWidth / 2;
  const tailY = bubbleY + bubbleHeight;
  tail.beginPath();
  tail.moveTo(tailX - 10, tailY);
  tail.lineTo(tailX + 10, tailY);
  tail.lineTo(tailX, tailY + 15);
  tail.closePath();
  tail.fillPath();
  tail.strokePath();

  // Group elements
  const container = this.add.container(0, 0, [bubble, bubbleText, tail]);
  container.setDepth(1000);

  // Typing animation
  const typingSpeed = Math.max(80, Math.min(150, 3000 / text.length));
  let currentCharIndex = 0;

  const typingTimer = this.time.addEvent({
    delay: typingSpeed,
    callback: () => {
      if (currentCharIndex < text.length) {
        // Add next character
        bubbleText.text += text[currentCharIndex];
        currentCharIndex++;
      } else {
        typingTimer.destroy();
      }
    },
    callbackScope: this,
    repeat: text.length - 1,
  });

  // Auto-destroy after duration
  if (duration > 0) {
    const totalDuration = duration + typingSpeed * text.length;

    this.time.delayedCall(totalDuration, () => {
      // Clean up both the speech bubble and skill icon
      this.tweens.add({
        targets: [skillIcon, container],
        alpha: 0,
        y: "-=20", // Both float up slightly while fading
        duration: 300,
        onComplete: () => {
          skillIcon.destroy();
          container.destroy();
          this.physics.resume();
          this.dialogueActive = false;
        },
      });
    });
  }

  return container;
}
// Helper function to calculate appropriate speech bubble duration
function calculateSpeechDuration(text) {
  // Constants for reading speed adjustment
  const WORDS_PER_MINUTE = 200; // Average reading speed
  const MILLISECONDS_PER_WORD = 60000 / WORDS_PER_MINUTE;

  // Calculate typing time
  const typingSpeed = Math.max(80, Math.min(150, 3000 / text.length));
  const typingTime = typingSpeed * text.length;

  // Estimate word count (roughly 5 characters per word)
  const estimatedWords = Math.max(1, Math.ceil(text.length / 5));

  // Calculate reading time
  const readingTime = estimatedWords * MILLISECONDS_PER_WORD;

  // Total duration: typing time + reading time + a small buffer
  const totalDuration = typingTime + readingTime + 500;

  // Enforce minimum and maximum durations
  const minDuration = 2000;
  const maxDuration = 12000;

  return Math.min(maxDuration, Math.max(minDuration, totalDuration));
}

// Add this function to check and load checkpoint data
function loadCheckpointData() {
  const level = selectedLevel || 1;
  const levelKey = `level${level}Checkpoint`;

  // Get saved collected boxes from localStorage
  let savedBoxes = [];
  try {
    const savedData = localStorage.getItem(levelKey);
    if (savedData) {
      savedBoxes = JSON.parse(savedData);
      console.log(
        `Loaded checkpoint data: ${savedBoxes.length} boxes collected`
      );
    }
  } catch (e) {
    console.error("Error loading checkpoint data:", e);
  }

  return savedBoxes;
}

// Add this function to save checkpoint data
function saveCheckpointData(boxIndex) {
  const level = selectedLevel || 1;
  const levelKey = `level${level}Checkpoint`;

  // Get existing data
  let savedBoxes = [];
  try {
    const savedData = localStorage.getItem(levelKey);
    if (savedData) {
      savedBoxes = JSON.parse(savedData);
    }
  } catch (e) {
    console.error("Error reading checkpoint data:", e);
  }

  // Add new box if not already saved
  if (!savedBoxes.includes(boxIndex)) {
    savedBoxes.push(boxIndex);

    // Save updated data
    try {
      localStorage.setItem(levelKey, JSON.stringify(savedBoxes));
      console.log(`Box ${boxIndex} saved to checkpoint`);
    } catch (e) {
      console.error("Error saving checkpoint data:", e);
    }
  }
}

// Add a function to reset checkpoint data (for level restart or completion)
function resetCheckpointData() {
  console.log("Resetting checkpoint data");
  const level = selectedLevel || 1;
  const levelKey = `level1Checkpoint`;

  try {
    localStorage.removeItem(levelKey);
    console.log("Checkpoint data reset");
  } catch (e) {
    console.error("Error resetting checkpoint data:", e);
  }
}
