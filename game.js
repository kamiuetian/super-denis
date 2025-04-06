// Main game file - core initialization and configuration

// Constants
const GRAVITY = 250;
const PLAYER_SCALE = 3;

// Global variables
let game;
let gameStarted = false;
let playerState = "small";
let selectedLevel = 1;

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

// Game initialization
function startGame(level) {
  document.getElementsByClassName("bg")[0].style.display = "none";

  // Set game container to full screen dimensions
  const gameContainer = document.getElementById("game-container");
  gameContainer.style.width = "100vw";
  gameContainer.style.height = "100vh";
  gameContainer.style.margin = "0";
  gameContainer.style.padding = "0";
  gameContainer.style.overflow = "hidden";

  selectedLevel = level;
  if (!game) {
    game = new Phaser.Game(config);
  } else {
    game.scale.resize(window.innerWidth, window.innerHeight);
  }
  gameStarted = true;

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

  // If you have a specific goompa image, load it here
  // this.load.image("goompa", "assets/goompa.png");

  // Otherwise, just make sure your enemy sprite is properly loaded
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
}

// Set up the background
function setupBackground() {
  const bgRepeat = 3; // Explicitly set to 3 for consistency
  const screenHeight = this.scale.height;
  const screenWidth = this.scale.width;
  const worldWidth = screenWidth * bgRepeat;

  // Create plain white background rectangle that covers the entire world
  const whiteBackground = this.add.rectangle(
    0,
    0,
    worldWidth,
    screenHeight,
    0xffffff // White color
  );
  whiteBackground.setOrigin(0, 0);
  whiteBackground.setDepth(-2); // Make sure it's behind everything

  // Store reference to background
  this.background = whiteBackground;

  // Set physics world bounds to match the background size
  this.physics.world.setBounds(0, 0, worldWidth, screenHeight);

  // Ensure the camera won't show beyond the world bounds
  this.cameras.main.setBounds(0, 0, worldWidth, screenHeight);

  return bgRepeat;
}

// Set up the player
function setupPlayer() {
  this.player = this.physics.add.sprite(100, 300, "mario");
  this.player.setScale(PLAYER_SCALE);
  this.player.setVisible(true);
  this.player.setBounce(0.2);
  this.player.setCollideWorldBounds(true);

  // Create animations
  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("mario", { start: 1, end: 3 }),
    frameRate: 13,
    repeat: -1,
  });

  this.anims.create({
    key: "stand",
    frames: [{ key: "mario", frame: 0 }],
    frameRate: 13,
  });

  this.anims.create({
    key: "jump",
    frames: [{ key: "mario", frame: 5 }],
    frameRate: 13,
  });
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
    // Debug player input state occasionally
    if (time % 300 === 0) {
      console.log("Player active:", this.player.active);
      console.log("Left key:", this.cursors.left.isDown);
      console.log("Right key:", this.cursors.right.isDown);
      console.log("Up key:", this.cursors.up.isDown);
      console.log(
        "Player velocity:",
        this.player.body ? this.player.body.velocity.x : "No body"
      );
    }

    // Force enable player physics if somehow disabled
    if (this.player && !this.player.body.enable) {
      console.log("Re-enabling player physics!");
      this.physics.world.enable(this.player);
    }
  }

  // Log input state for debugging
  if (time % 300 === 0 && selectedLevel === 3) {
    console.log("Player active:", this.player.active);
    console.log("Left key:", this.cursors.left.isDown);
    console.log("Right key:", this.cursors.right.isDown);
    console.log("Up key:", this.cursors.up.isDown);
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

  // Handle movement
  if (this.cursors.left.isDown) {
    this.player.setVelocityX(-250);
    this.player.setFlipX(true);
    this.player.anims.play("right", true);
  } else if (this.cursors.right.isDown) {
    this.player.setVelocityX(250);
    this.player.setFlipX(false);
    this.player.anims.play("right", true);
  } else {
    this.player.setVelocityX(0);
    this.player.anims.play("stand");
  }

  // Handle jumping
  if (!this.player.body.touching.down) {
    this.player.anims.play("jump");
  }

  if (this.cursors.up.isDown && this.player.body.touching.down) {
    this.player.setVelocityY(-250);
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

// Function to handle tennis ball bouncing physics
function tennisBallBounce(ball, collider) {
  // Don't process if ball is already dead
  if (ball.dead || ball.exploded) {
    return;
  }

  // Handle side collisions - reverse direction
  if (ball.body.blocked.left || ball.body.blocked.right) {
    // Reverse horizontal velocity with slight loss of momentum
    ball.setVelocityX(-ball.body.velocity.x * 0.8);
    ball.isVelocityPositive = ball.body.velocity.x > 0;

    // Play bounce sound if available
    if (this.sound && this.sound.play && this.hitSound) {
      this.hitSound.play({ volume: 0.3 });
    }
  }

  // Handle vertical bouncing
  if (ball.body.blocked.down) {
    // Bounce up with reduced velocity on each bounce
    const currentBounce = ball.bounce || 1;
    const bounceVelocity = -250 / (currentBounce * 0.5);
    ball.setVelocityY(bounceVelocity);
    ball.bounce = currentBounce + 0.5;

    // Play bounce sound if available
    if (this.sound && this.sound.play && this.hitSound) {
      this.hitSound.play({ volume: 0.2 });
    }

    // Create a small bounce effect
    const bounceEffect = this.add.circle(ball.x, ball.y + 5, 5, 0xffff00, 0.7);
    this.tweens.add({
      targets: bounceEffect,
      alpha: 0,
      scale: 2,
      duration: 200,
      onComplete: () => bounceEffect.destroy(),
    });
  }

  // Handle ceiling collisions
  if (ball.body.blocked.up) {
    ball.setVelocityY(100);
  }
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
function createLevel1(bgRepeat) {
  // 1. First create the groups
  this.platforms = this.physics.add.staticGroup();
  this.coins = this.physics.add.staticGroup();
  this.enemies = this.physics.add.group({
    collideWorldBounds: true,
    bounceX: 1,
    bounceY: 0,
  });

  // 2. Set up the ground
  const groundHeight = 40;
  ground = this.platforms.create(
    (bgRepeat * this.scale.width) / 2,
    this.scale.height - groundHeight,
    null
  );
  ground.setDisplaySize(bgRepeat * this.scale.width, groundHeight);
  ground.setVisible(true);
  ground.refreshBody();

  // REMOVED: Big green platform at 1500, 565
  // this.platforms
  //   .create(1500, 565, "terrain", 2)
  //   .setDisplaySize(600, 50)
  //   .refreshBody();

  // 3. Create a darkening overlay for better visibility
  const darkOverlay = this.add.rectangle(
    0,
    0,
    this.scale.width * bgRepeat,
    this.scale.height,
    0x000000,
    0.3 // 30% opacity black overlay
  );
  darkOverlay.setOrigin(0, 0);
  darkOverlay.setDepth(-1); // Make sure it's behind everything

  // 4. Initialize coin counter
  this.coinCount = 0;

  // 5. Create skills panel inside game canvas
  this.skillsPanel = this.add.graphics();
  this.skillsPanel.fillStyle(0x000000, 0.8); // More opaque for better readability
  this.skillsPanel.fillRect(this.scale.width - 220, 20, 200, 260);
  this.skillsPanel.lineStyle(2, 0xffd700, 1);
  this.skillsPanel.strokeRect(this.scale.width - 220, 20, 200, 260);
  this.skillsPanel.setScrollFactor(0);

  // Title
  this.add
    .text(this.scale.width - 190, 30, "MY SKILLS", {
      fontSize: "18px",
      fill: "#FFD700",
      fontWeight: "bold",
    })
    .setScrollFactor(0);

  // Skills counter
  this.skillsCounter = this.add
    .text(this.scale.width - 190, 260, "Skills: 0/6", {
      fontSize: "16px",
      fill: "#FFD700",
      fontWeight: "bold",
    })
    .setScrollFactor(0);

  // Create skill text objects
  this.skillTexts = [];
  for (let i = 0; i < skills.length; i++) {
    // Properly format using the icon and name from the skill object
    const skillText = this.add
      .text(
        this.scale.width - 195,
        60 + i * 28,
        skills[i].icon + " " + skills[i].name, // Removed bullet point for cleaner look
        {
          fontSize: "14px",
          fill: "#FFFFFF",
          fontFamily: "Arial",
        }
      )
      .setScrollFactor(0);

    // Initially hide skill text by setting alpha to 0
    skillText.setAlpha(0);
    this.skillTexts.push(skillText);
  }

  // Small skills counter in bottom left (traditional location)
  this.smallCounter = this.add
    .text(20, 20, "Skills: 0/6", {
      fontSize: "20px",
      fill: "#ffffff",
    })
    .setScrollFactor(0);

  // 6. Add an instruction text for better guidance
  const instructionText = this.add
    .text(
      this.scale.width / 2,
      80,
      "Collect all skills to complete the level!",
      {
        fontSize: "24px",
        fill: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
        fontStyle: "bold",
      }
    )
    .setOrigin(0.5, 0.5)
    .setScrollFactor(0);

  // Make the instruction text fade out after a few seconds
  this.tweens.add({
    targets: instructionText,
    alpha: { from: 1, to: 0 },
    delay: 3000,
    duration: 1000,
    ease: "Power2",
  });

  // 7. MODIFIED: Create ONLY green platforms with mystery boxes below
  const worldWidth = bgRepeat * this.scale.width;
  // Add this after your existing platform creation loop in createLevel1 function,
  // around line 826 (after the existing platform creation code)

  // Create additional set of block-based platforms
  // First make sure the block images are loaded in preload function
  // Make sure to add this to the preload function:
  this.load.image("block", "assets/overworld/block.png");
  this.load.image("emptyBlock", "assets/overworld/emptyBlock.png");

  // Define positions for 15 new block-based platforms
  const blockPlatforms = [
    { x: 350, y: this.scale.height - 350, width: 3, type: "block" },
    { x: 550, y: this.scale.height - 400, width: 2, type: "emptyBlock" },
    { x: 750, y: this.scale.height - 450, width: 4, type: "block" },
    { x: 950, y: this.scale.height - 370, width: 2, type: "emptyBlock" },
    { x: 1150, y: this.scale.height - 320, width: 3, type: "block" },
    { x: 1350, y: this.scale.height - 280, width: 5, type: "block" },
    { x: 1550, y: this.scale.height - 420, width: 2, type: "emptyBlock" },
    { x: 1750, y: this.scale.height - 380, width: 4, type: "block" },
    { x: 1950, y: this.scale.height - 440, width: 3, type: "block" },
    { x: 2150, y: this.scale.height - 360, width: 2, type: "emptyBlock" },
    { x: 2350, y: this.scale.height - 410, width: 6, type: "block" },
    { x: 2550, y: this.scale.height - 330, width: 3, type: "emptyBlock" },
    { x: 2750, y: this.scale.height - 390, width: 4, type: "block" },
    { x: 3100, y: this.scale.height - 350, width: 3, type: "emptyBlock" },
    { x: 3300, y: this.scale.height - 420, width: 5, type: "block" },
  ];

  // Create the block-based platforms
  for (let i = 0; i < blockPlatforms.length; i++) {
    const pos = blockPlatforms[i];
    const blockSize = 32; // Standard size for a block - adjust based on your actual image size

    // Calculate total width based on number of blocks
    const totalWidth = pos.width * blockSize;

    // Create platform using the specified block type
    const platform = this.platforms.create(pos.x, pos.y, pos.type);
    platform.displayWidth = totalWidth;
    platform.displayHeight = blockSize;
    platform.refreshBody();

    // Add a subtle bounce effect to make the platform noticeable
    this.tweens.add({
      targets: platform,
      y: platform.y - 2,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }
  const platformPositions = [
    { x: 200, y: this.scale.height - 150, width: 200, height: 30 }, // Longer
    { x: 600, y: this.scale.height - 220, width: 100, height: 30 }, // Shorter
    { x: 1500, y: this.scale.height - 300, width: 180, height: 30 }, // Longer
    { x: 2300, y: this.scale.height - 220, width: 90, height: 30 }, // Shorter
    { x: 3000, y: this.scale.height - 180, width: 220, height: 30 }, // Longer
    { x: 4000, y: this.scale.height - 270, width: 110, height: 30 }, // Shorter
  ];

  // Rename coins group to mysteryBoxes
  this.mysteryBoxes = this.physics.add.staticGroup();

  // Create brick platforms with mystery boxes below
  for (let i = 0; i < platformPositions.length; i++) {
    const pos = platformPositions[i];

    // Create brick platform with custom size
    // Use terrain spritesheet frame 0 which typically has brick texture
    const platform = this.platforms.create(pos.x, pos.y, "terrain", 0);
    platform.displayWidth = pos.width;
    platform.displayHeight = pos.height;
    platform.refreshBody();
    // Add mystery box below the platform
    // Position mystery box below the platform where it can be hit
    const mysteryBox = this.mysteryBoxes
      .create(
        pos.x, // Centered horizontally
        pos.y + pos.height - 120, // Below platform
        "mysteryBlock"
      )
      .setOrigin(0.5, 0.5)
      .setScale(1.5) // Proper size for mystery box
      .setData("skillIndex", i) // Store which skill is in this box
      .setData("hit", false) // Track if box has been hit already
      .refreshBody();

    // Add a pulsating glow effect around mysteryBoxes
    const glow = this.add
      .sprite(mysteryBox.x, mysteryBox.y, "mysteryBlock")
      .setScale(1.7)
      .setAlpha(0.3)
      .setTint(0xffff44);

    // Store reference to glow for later removal
    mysteryBox.setData("glow", glow);

    // Bounce animation for mystery box
    this.tweens.add({
      targets: mysteryBox,
      y: mysteryBox.y - 5,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Glow animation
    this.tweens.add({
      targets: glow,
      scale: { from: 1.7, to: 1.9 },
      alpha: { from: 0.3, to: 0.1 },
      yoyo: true,
      repeat: -1,
      duration: 1000,
      ease: "Sine.easeInOut",
    });
  }

  // Add a hint about jumping
  const jumpTip = this.add.text(
    150,
    this.scale.height - 70,
    "Use UP ARROW to jump between platforms!",
    {
      fontSize: "16px",
      fill: "#ffffff",
      stroke: "#000000",
      strokeThickness: 3,
    }
  );
  jumpTip.setScrollFactor(1); // Move with camera

  // Make it fade out after 8 seconds
  this.tweens.add({
    targets: jumpTip,
    alpha: { from: 1, to: 0 },
    delay: 8000,
    duration: 1000,
  });

  // Add enemies to the level - ADD THIS LINE
  addEnemies.call(this);

  // 9. Add physics colliders and overlaps
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

  // Set up camera to follow the player
  this.cameras.main.setBounds(
    0,
    0,
    bgRepeat * this.scale.width,
    this.scale.height
  );
  this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
}

// Add this function right after the createLevel1 function, around line 450

// After the platformPositions and loop to create platforms in your createLevel1 function
// Add this code to create visible enemies:
function addEnemies() {
  // Create patrolling goompa enemies with proper positioning
  const enemyPositions = [
    { x: 350, y: this.scale.height - 80, range: 150 },
    { x: 1000, y: this.scale.height - 80, range: 200 },
    { x: 1800, y: this.scale.height - 80, range: 180 },
  ];

  for (const pos of enemyPositions) {
    // Create enemy with visible properties
    const enemy = this.enemies
      .create(pos.x, pos.y, "enemy")
      .setScale(0.2) // Make it bigger so it's visible
      .setCollideWorldBounds(true)
      .setBounce(1)
      .setData("startX", pos.x)
      .setData("range", pos.range)
      .setVelocityX(-60);

    // Make sure they're visible and on top
    enemy.setDepth(20); // Higher depth to be above everything
    enemy.setAlpha(1); // Fully visible
    enemy.setTint(0xff0000); // Bright red tint for visibility

    // Position above ground (important!)
    enemy.y = this.scale.height - 85;

    console.log(
      "Created enemy at",
      enemy.x,
      enemy.y,
      "with depth",
      enemy.depth
    );
  }
}

// Replace the existing createLevel2 function with this complete implementation
function createLevel2(bgRepeat) {
  // 1. First create the groups
  this.platforms = this.physics.add.staticGroup();
  this.skillItems = this.physics.add.staticGroup();
  this.tennisBalls = this.physics.add.group();

  // 2. Set up the ground (invisible, just for preventing falling)
  const groundHeight = 40; // Match Level 1's ground height
  const ground = this.platforms.create(
    (bgRepeat * this.scale.width) / 2,
    this.scale.height - groundHeight / 2, // Position at bottom of visible area
    null
  );
  ground.setDisplaySize(bgRepeat * this.scale.width, groundHeight);
  ground.setVisible(true); // Make it visible like in Level 1
  ground.refreshBody();
  ground.setData("isGround", true); // Tag to identify ground in collision handler

  // 3. Set background - blue sky
  const skyBackground = this.add.rectangle(
    0,
    0,
    bgRepeat * this.scale.width,
    this.scale.height,
    0x87ceeb // Sky blue color
  );
  skyBackground.setOrigin(0, 0);
  skyBackground.setDepth(-2);

  // 4. Initialize skill counter
  this.coinCount = 0;

  // 5. Create skills panel inside game canvas (same as level 1)
  this.skillsPanel = this.add.graphics();
  this.skillsPanel.fillStyle(0x000000, 0.8);
  this.skillsPanel.fillRect(this.scale.width - 220, 20, 200, 260);
  this.skillsPanel.lineStyle(2, 0xffd700, 1);
  this.skillsPanel.strokeRect(this.scale.width - 220, 20, 200, 260);
  this.skillsPanel.setScrollFactor(0);

  // Title
  this.add
    .text(this.scale.width - 190, 30, "MY SKILLS", {
      fontSize: "18px",
      fill: "#FFD700",
      fontWeight: "bold",
    })
    .setScrollFactor(0);

  // Skills counter
  this.skillsCounter = this.add
    .text(this.scale.width - 190, 260, "Skills: 0/12", {
      fontSize: "16px",
      fill: "#FFD700",
      fontWeight: "bold",
    })
    .setScrollFactor(0);

  // Create skill text objects - 12 skills for Level 2
  this.skillTexts = [];
  const level2Skills = [
    {
      icon: "🎤",
      name: "Public Speaking",
      message: "I'm great at presentations!",
    },
    {
      icon: "🔄",
      name: "Digital Consultancy",
      message: "Let me optimize your workflows!",
    },
    {
      icon: "🤖",
      name: "AI Business Implementation",
      message: "AI solutions for business problems",
    },
    {
      icon: "👥",
      name: "Team Collaboration",
      message: "I work well with others",
    },
    {
      icon: "♟️",
      name: "Strategic Thinking",
      message: "Always thinking three steps ahead",
    },
    {
      icon: "☁️",
      name: "Cloud & Security",
      message: "Your data is safe with me",
    },
    { icon: "💸", name: "Finance", message: "I understand the bottom line" },
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
      icon: "🗃️",
      name: "IT Project Coordinator",
      message: "Keeping projects on track",
    },
    {
      icon: "🖧",
      name: "ICT Infrastructure",
      message: "Building solid foundations",
    },
    { icon: "🌍", name: "Languages", message: "I speak six languages!" },
  ];

  for (let i = 0; i < level2Skills.length; i++) {
    const skillText = this.add
      .text(
        this.scale.width - 195,
        60 + i * 20,
        level2Skills[i].icon + " " + level2Skills[i].name,
        {
          fontSize: "12px",
          fill: "#FFFFFF",
          fontFamily: "Arial",
        }
      )
      .setScrollFactor(0);

    // Initially hide skill text
    skillText.setAlpha(0);
    this.skillTexts.push(skillText);
  }

  // Small skills counter in bottom left
  this.smallCounter = this.add
    .text(20, 20, "Skills: 0/12", {
      fontSize: "20px",
      fill: "#ffffff",
    })
    .setScrollFactor(0);

  // 6. Add instructions
  const instructionText = this.add
    .text(
      this.scale.width / 2,
      80,
      "Jump on clouds to discover my professional skills!",
      {
        fontSize: "24px",
        fill: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
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

  // 7. Create cloud platforms with skills
  const cloudPositions = [
    { x: 200, y: this.scale.height - 100 },
    { x: 500, y: this.scale.height - 210 },
    { x: 800, y: this.scale.height - 190 },
    { x: 1100, y: this.scale.height - 300 },
    { x: 1400, y: this.scale.height - 250 },
    { x: 1700, y: this.scale.height - 350 },
    { x: 2000, y: this.scale.height - 200 },
    { x: 2300, y: this.scale.height - 300 },
    { x: 2600, y: this.scale.height - 200 },
    { x: 2900, y: this.scale.height - 320 },
    { x: 3200, y: this.scale.height - 250 },
    { x: 3500, y: this.scale.height - 300 },
  ];

  // Create clouds and add skills
  for (let i = 0; i < cloudPositions.length; i++) {
    const pos = cloudPositions[i];

    // Create cloud platform
    const cloud = this.platforms.create(pos.x, pos.y, "cloud");
    cloud.setScale(0.1); // Adjust scale as needed
    cloud.refreshBody();
    cloud.setData("touched", false);

    // Add a subtle floating animation to clouds
    this.tweens.add({
      targets: cloud,
      y: pos.y - 15,
      duration: 2000 + Math.random() * 1000, // Randomize duration
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Create skill item (invisible at first)
    const skill = this.skillItems.create(pos.x, pos.y - 30, "mysteryBlock");
    skill.setScale(0);
    skill.setVisible(false);
    skill.setData("skillIndex", i);
    skill.setData("revealed", false);

    // Store reference to cloud and skill
    cloud.setData("skillItem", skill);
    skill.setData("cloud", cloud);
  }

  // 8. Add Johann (boss) in the top right corner
  this.boss = this.physics.add
    .sprite(
      this.scale.width * bgRepeat * 0.85,
      this.scale.height * 0.05,
      "enemy" // Using existing enemy sprite for now
    )
    .setScale(0.2)
    .setDepth(20);

  this.boss.setCollideWorldBounds(true);
  this.boss.setBounce(1);
  this.boss.setImmovable(true);
  this.boss.lastShotTime = 0;

  // Put boss on a special cloud
  const bossCloud = this.platforms.create(
    this.scale.width * bgRepeat * 0.85,
    this.scale.height * 0.05,
    "cloud"
  );
  bossCloud.setScale(0.25);
  bossCloud.refreshBody();

  // 9. Add collision detection
  this.physics.add.collider(this.player, this.platforms, hitCloud, null, this);

  // Set up camera to follow player
  this.cameras.main.setBounds(
    0,
    0,
    bgRepeat * this.scale.width,
    this.scale.height
  );
  this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

  // 10. Add pre-level dialogue
  showLevelStartDialogue.call(this);
}

// Function to handle cloud collision
function hitCloud(player, cloud) {
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
    this.smallCounter.setText("Skills: " + this.coinCount + "/12");

    // Get the current skill
    const skillIndex = skill.getData("skillIndex");
    const level2Skills = [
      {
        icon: "🎤",
        name: "Public Speaking",
        message: "I'm great at presentations!",
      },
      {
        icon: "🔄",
        name: "Digital Consultancy",
        message: "Let me optimize your workflows!",
      },
      {
        icon: "🤖",
        name: "AI Business Implementation",
        message: "AI solutions for business problems",
      },
      {
        icon: "👥",
        name: "Team Collaboration",
        message: "I work well with others",
      },
      {
        icon: "♟️",
        name: "Strategic Thinking",
        message: "Always thinking three steps ahead",
      },
      {
        icon: "☁️",
        name: "Cloud & Security",
        message: "Your data is safe with me",
      },
      { icon: "💸", name: "Finance", message: "I understand the bottom line" },
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
        icon: "🗃️",
        name: "IT Project Coordinator",
        message: "Keeping projects on track",
      },
      {
        icon: "🖧",
        name: "ICT Infrastructure",
        message: "Building solid foundations",
      },
      { icon: "🌍", name: "Languages", message: "I speak six languages!" },
    ];
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
      y: skillIcon.y - 60,
      duration: 800,
      ease: "Bounce",
      onComplete: () => {
        // Fade out after 1 second
        this.tweens.add({
          targets: skillIcon,
          alpha: { from: 1, to: 0 },
          duration: 200,
          delay: 800,
          onComplete: () => skillIcon.destroy(),
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
  dialog.setScrollFactor(0);

  // Add completion text
  this.add
    .text(
      this.scale.width / 2,
      this.scale.height / 2 - 120,
      "LEVEL 2 COMPLETED!",
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
      "You have showcased all your professional skills!",
      {
        fontSize: "16px",
        fill: "#ffffff",
      }
    )
    .setScrollFactor(0)
    .setAlign("center")
    .setOrigin(0.5, 0);

  // Add progression text
  this.add
    .text(
      this.scale.width / 2,
      this.scale.height / 2,
      "Moving to Level 3 where you will\nface the final challenge!",
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

  // Move to next level after delay
  this.time.delayedCall(
    5000,
    () => {
      window.location.href = "video2.html"; // Adjust as needed
    },
    [],
    this
  );
}

// Update function for boss tennis ball shooting
function updateBoss(time) {
  // Check if it's time to shoot
  if (time - this.boss.lastShotTime > 3000) {
    // Create tennis ball
    const ball = this.tennisBalls
      .create(this.boss.x, this.boss.y, "tennisball")
      .setScale(0.05)
      .setTint(0xff0000)
      .setDepth(100);

    // Aim at player
    const dx = this.player.x - this.boss.x;
    const dy = this.player.y - this.boss.y;
    const angle = Math.atan2(dy, dx);
    const speed = 150;

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

    // Destroy after 5 seconds
    this.time.delayedCall(5000, () => {
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
  particles.explode(10);

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
  this.skillsCounter.setText(`Items: ${this.itemCount}/10`);
  this.smallCounter.setText(`Items: ${this.itemCount}/10`);

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
  // Play bridge lowering animation
  this.tweens.add({
    targets: this.bridgeGraphics,
    y: this.scale.height - 100,
    duration: 1500,
    ease: "Bounce.easeOut",
    onComplete: () => {
      // Create actual collision bridge after animation
      const bridgeX = this.bridgeGraphics.x;
      const bridgeY = this.scale.height - 100;
      const bridge = this.bridge.create(bridgeX, bridgeY, null);
      bridge.setDisplaySize(300, 20);
      bridge.setVisible(false); // Invisible but collidable
      bridge.refreshBody();

      // Add collision with bridge
      this.physics.add.collider(this.player, this.bridge);

      // Show "Bridge complete" message
      const bridgeText = this.add
        .text(
          this.scale.width / 2,
          120,
          "Bridge complete! Make your way to Commerzbank!",
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
    6000
  );

  // Show second part after delay
  this.time.delayedCall(6000, () => {
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
  this.skillsCounter.setText("Skills: " + this.coinCount + "/6");
  this.smallCounter.setText("Skills: " + this.coinCount + "/6");

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
  if (this.coinCount == 6) {
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
  }
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

    // Add ball to update list
    if (this.scene.updateList && !this.scene.updateList.includes(ball)) {
      this.scene.updateList.push(ball);
    }

    // ... rest of existing code for ball collision and movement ...
  }
};

// Add this function to replace collectCoin
function hitMysteryBox(player, box) {
  // Only trigger when hitting from below and not already hit
  if (!player.body.touching.up || box.getData("hit")) {
    return;
  }

  // Mark box as hit
  box.setData("hit", true);

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

  // Check if this is the guitar skill (skill index 5 is typically the last one with tennis racket)
  const isGuitarSkill =
    skill.name.toLowerCase().includes("racket") || skillIndex === 5;

  // Show skill icon popping out of the box
  const skillIcon = this.add
    .text(boxX, boxY - 40, skill.icon + " " + skill.name, { fontSize: "32px" })
    .setOrigin(0.5);

  // Animate skill icon bouncing up
  this.tweens.add({
    targets: skillIcon,
    y: skillIcon.y - 60,
    duration: 800,
    ease: "Bounce",
    onComplete: () => {
      // Fade out and destroy after bounce animation
      this.tweens.add({
        targets: skillIcon,
        alpha: { from: 1, to: 0 },
        duration: 200,
        onComplete: () => skillIcon.destroy(),
      });
    },
  });

  // Show skill name
  const skillName = this.add
    .text(boxX, boxY - 20, skill.name, {
      fontSize: "16px",
      fontStyle: "bold",
      fill: "#fff",
      stroke: "#000",
      strokeThickness: 3,
    })
    .setOrigin(0.5);

  // Fade out skill name faster (1 second total)
  this.tweens.add({
    targets: skillName,
    alpha: { from: 1, to: 0 },
    y: skillName.y - 20,
    duration: 1000, // Changed from 1500
    delay: 0, // Changed from 1000
    onComplete: () => skillName.destroy(),
  });

  // Update counters
  this.coinCount = (this.coinCount || 0) + 1;
  this.skillsCounter.setText("Skills: " + this.coinCount + "/6");
  this.smallCounter.setText("Skills: " + this.coinCount + "/6");

  // Show speech bubble with skill message
  showSpeechBubble.call(this, player, skill.message, 3000);

  // Activate boss area immediately if it's the guitar skill
  if (isGuitarSkill) {
    console.log("Guitar skill activated! Entering boss area...");

    // Enable tennis ball shooting ability
    this.hasTennisRacket = true;

    // Show message about guitar challenge
    const challengeMessage = this.add
      .text(
        this.scale.width / 2,
        100,
        "You found a guitar! Johann challenges you to a duel!",
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

    // Activate boss area with short delay
    this.time.delayedCall(2000, () => {
      activateBossArea.call(this);
    });
  }

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

  // Handle tennis racket (last skill)
  if (this.coinCount == 6) {
    // Enable tennis ball shooting ability
    this.hasTennisRacket = true;

    // Show a message about shooting tennis balls
    const shootText = this.add
      .text(this.scale.width / 2, 80, "Press SPACE to shoot tennis balls!", {
        fontSize: "18px",
        fill: "#ffffff",
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0);

    // Fade out after delay
    this.tweens.add({
      targets: shootText,
      alpha: { from: 1, to: 0 },
      delay: 5000,
      duration: 1000,
    });

    // Also show boss battle instruction
    const bossText = this.add
      .text(
        this.scale.width / 2,
        120,
        "Find Johann to the right and defeat him!",
        {
          fontSize: "18px",
          fill: "#ffffff",
          stroke: "#000000",
          strokeThickness: 3,
        }
      )
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0);

    // Fade out after delay
    this.tweens.add({
      targets: bossText,
      alpha: { from: 1, to: 0 },
      delay: 5000,
      duration: 1000,
    });
  }
}

/**Level 3 */

// Create Level 3 function by duplicating Level 2 function
function createLevel3(bgRepeat) {
  if (!bgRepeat || bgRepeat < 5) {
    bgRepeat = 3; // Ensure level is at least 5x screen width
    console.log("Corrected bgRepeat to:", bgRepeat);
  }
  // 1. First create the groups
  this.platforms = this.physics.add.staticGroup();
  this.skillItems = this.physics.add.staticGroup();
  this.tennisBalls = this.physics.add.group();
  this.physics.world.setBounds(
    0,
    0,
    bgRepeat * this.scale.width,
    this.scale.height
  );

  // 2. Set up the ground (invisible, just for preventing falling)
  const groundHeight = 40; // Match Level 1's ground height
  const ground = this.platforms.create(
    (bgRepeat * this.scale.width) / 2,
    this.scale.height - groundHeight / 2, // Position at bottom of visible area
    null
  );
  ground.setDisplaySize(bgRepeat * this.scale.width, groundHeight);
  ground.setVisible(true); // Make it visible like in Level 1
  ground.refreshBody();
  ground.setData("isGround", true); // Tag to identify ground in collision handler

  // 3. Set background - blue sky
  const skyBackground = this.add.rectangle(
    0,
    0,
    bgRepeat * this.scale.width,
    this.scale.height,
    0x87ceeb // Sky blue color
  );
  skyBackground.setOrigin(0, 0);
  skyBackground.setDepth(-2);

  // 4. Initialize skill counter
  this.coinCount = 0;

  // 5. Create skills panel inside game canvas (same as level 1)
  this.skillsPanel = this.add.graphics();
  this.skillsPanel.fillStyle(0x000000, 0.8);
  this.skillsPanel.fillRect(this.scale.width - 220, 20, 200, 260);
  this.skillsPanel.lineStyle(2, 0xffd700, 1);
  this.skillsPanel.strokeRect(this.scale.width - 220, 20, 200, 260);
  this.skillsPanel.setScrollFactor(0);

  // Title
  this.add
    .text(this.scale.width - 190, 30, "MY SKILLS", {
      fontSize: "18px",
      fill: "#FFD700",
      fontWeight: "bold",
    })
    .setScrollFactor(0);

  // Skills counter
  this.skillsCounter = this.add
    .text(this.scale.width - 190, 260, "Skills: 0/12", {
      fontSize: "16px",
      fill: "#FFD700",
      fontWeight: "bold",
    })
    .setScrollFactor(0);

  // Create skill text objects - 12 skills for Level 2
  this.skillTexts = [];
  const level3Skills = [
    {
      icon: "🎤",
      name: "Public Speaking",
      message: "I'm great at presentations!",
    },
    {
      icon: "🔄",
      name: "Digital Consultancy",
      message: "Let me optimize your workflows!",
    },
    {
      icon: "🤖",
      name: "AI Business Implementation",
      message: "AI solutions for business problems",
    },
    {
      icon: "👥",
      name: "Team Collaboration",
      message: "I work well with others",
    },
    {
      icon: "♟️",
      name: "Strategic Thinking",
      message: "Always thinking three steps ahead",
    },
    {
      icon: "☁️",
      name: "Cloud & Security",
      message: "Your data is safe with me",
    },
    { icon: "💸", name: "Finance", message: "I understand the bottom line" },
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
      icon: "🗃️",
      name: "IT Project Coordinator",
      message: "Keeping projects on track",
    },
    {
      icon: "🖧",
      name: "ICT Infrastructure",
      message: "Building solid foundations",
    },
    { icon: "🌍", name: "Languages", message: "I speak six languages!" },
  ];

  for (let i = 0; i < level3Skills.length; i++) {
    const skillText = this.add
      .text(
        this.scale.width - 195,
        60 + i * 20,
        level3Skills[i].icon + " " + level3Skills[i].name,
        {
          fontSize: "12px",
          fill: "#FFFFFF",
          fontFamily: "Arial",
        }
      )
      .setScrollFactor(0);

    // Initially hide skill text
    skillText.setAlpha(0);
    this.skillTexts.push(skillText);
  }

  // Small skills counter in bottom left
  this.smallCounter = this.add
    .text(20, 20, "Skills: 0/12", {
      fontSize: "20px",
      fill: "#ffffff",
    })
    .setScrollFactor(0);

  // 6. Add instructions
  const instructionText = this.add
    .text(
      this.scale.width / 2,
      80,
      "Jump on clouds to discover my professional skills!",
      {
        fontSize: "24px",
        fill: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
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

  // 7. Create cloud platforms with skills
  const cloudPositions = [
    { x: 200, y: this.scale.height - 100 },
    { x: 500, y: this.scale.height - 210 },
    { x: 800, y: this.scale.height - 190 },
    { x: 1100, y: this.scale.height - 300 },
    { x: 1400, y: this.scale.height - 250 },
    { x: 1700, y: this.scale.height - 350 },
    { x: 2000, y: this.scale.height - 200 },
    { x: 2300, y: this.scale.height - 300 },
    { x: 2600, y: this.scale.height - 200 },
    { x: 2900, y: this.scale.height - 320 },
    { x: 3200, y: this.scale.height - 250 },
    { x: 3500, y: this.scale.height - 300 },
  ];

  // Create clouds and add skills
  for (let i = 0; i < cloudPositions.length; i++) {
    const pos = cloudPositions[i];

    // Create cloud platform
    const cloud = this.platforms.create(pos.x, pos.y, "cloud");
    cloud.setScale(0.1); // Adjust scale as needed
    cloud.refreshBody();
    cloud.setData("touched", false);

    // Add a subtle floating animation to clouds
    this.tweens.add({
      targets: cloud,
      y: pos.y - 15,
      duration: 2000 + Math.random() * 1000, // Randomize duration
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Create skill item (invisible at first)
    const skill = this.skillItems.create(pos.x, pos.y - 30, "mysteryBlock");
    skill.setScale(0);
    skill.setVisible(false);
    skill.setData("skillIndex", i);
    skill.setData("revealed", false);

    // Store reference to cloud and skill
    cloud.setData("skillItem", skill);
    skill.setData("cloud", cloud);
  }

  // 8. Add Johann (boss) in the top right corner - REMOVED FOR LEVEL 3
  // this.boss = this.physics.add.sprite(...);

  // 9. Add collision detection
  this.physics.add.collider(this.player, this.platforms, hitCloud, null, this);

  // Set up camera to follow player
  this.cameras.main.setBounds(
    0,
    0,
    bgRepeat * this.scale.width,
    this.scale.height
  );
  this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

  // 10. Add pre-level dialogue
  showLevel3StartDialogue.call(this);

  // CRITICAL FIX: Make sure cursors are properly initialized for this level
  if (!this.cursors) {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  // CRITICAL FIX: Make sure physics are working properly
  this.physics.world.enable(this.player);
  this.player.body.setCollideWorldBounds(true);

  // Make sure the player is visible and movable
  this.player.setVelocity(0, 0);
  this.player.clearTint();
  this.player.setAlpha(1);
  this.cameras.main.setBounds(
    0,
    0,
    bgRepeat * this.scale.width,
    this.scale.height
  );
  this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
  this.add
    .line(
      0,
      0,
      0,
      this.scale.height / 2,
      bgRepeat * this.scale.width,
      this.scale.height / 2,
      0xff0000,
      0.5
    )
    .setLineWidth(2)
    .setOrigin(0, 0);

  // CRITICAL FIX: Make sure player is positioned correctly at start of level
  this.player.x = 100; // Start position
  this.player.y = this.scale.height - 150; // Above ground

  // CRITICAL FIX: Make sure physics are working properly
  this.physics.world.enable(this.player);
  this.player.body.setCollideWorldBounds(true);

  // CRITICAL FIX: Make sure cursors are properly initialized
  if (!this.cursors) {
    this.cursors = this.input.keyboard.createCursorKeys();
  }
  // Set up bridge and manager properties
  this.bridgeCreated = false;
  this.bridgeX = bgRepeat * this.scale.width - 600; // Position bridge near end of level
  this.bridgeY = this.scale.height - 100;
  this.gapWidth = 300; // Width of the gap to bridge

  // Create the gap/river
  const riverGraphics = this.add.graphics();
  riverGraphics.fillStyle(0x0077be); // Water blue
  riverGraphics.fillRect(
    this.bridgeX - this.gapWidth / 2,
    this.scale.height - 100,
    this.gapWidth,
    100
  );
  riverGraphics.setDepth(1);

  // Add Johann as doorman on the other side of the bridge
  this.johann = this.physics.add
    .sprite(
      this.bridgeX + this.gapWidth / 2 + 100, // On other side of bridge
      this.scale.height - 150,
      "enemy" // Use the existing Johann sprite
    )
    .setScale(0.2)
    .setDepth(20);

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

  // Rest of existing code...
}

// Function to create bridge when all skills are collected
function createBridge() {
  // Prevent creating bridge multiple times
  if (this.bridgeCreated) return;
  this.bridgeCreated = true;

  // Create a visual placeholder for the bridge (initially raised)
  this.bridgeGraphics = this.add.graphics();
  this.bridgeGraphics.fillStyle(0x8b4513); // Brown wood color
  this.bridgeGraphics.fillRect(-this.gapWidth / 2, -10, this.gapWidth, 20);
  this.bridgeGraphics.lineStyle(2, 0x663300, 1);
  this.bridgeGraphics.strokeRect(-this.gapWidth / 2, -10, this.gapWidth, 20);
  this.bridgeGraphics.setPosition(this.bridgeX, this.bridgeY - 200); // Start raised

  // Show notification about bridge
  const bridgeText = this.add
    .text(
      this.scale.width / 2,
      120,
      "Bridge lowering! Make your way to Commerzbank!",
      {
        fontSize: "20px",
        fill: "#ffffff",
        stroke: "#000000",
        strokeThickness: 3,
      }
    )
    .setOrigin(0.5, 0.5)
    .setScrollFactor(0);

  // Fade out notification
  this.tweens.add({
    targets: bridgeText,
    alpha: { from: 1, to: 0 },
    delay: 3000,
    duration: 1000,
  });

  // Animate bridge lowering
  this.tweens.add({
    targets: this.bridgeGraphics,
    y: this.bridgeY,
    duration: 2000,
    ease: "Bounce.Out",
    onComplete: () => {
      // Create physical bridge collision object after animation
      const bridge = this.platforms.create(this.bridgeX, this.bridgeY, null);
      bridge.setDisplaySize(this.gapWidth, 20);
      bridge.setVisible(false); // Invisible but collidable
      bridge.refreshBody();
      bridge.setData("isBridge", true);

      // Play a bridge completion sound if available
      // if (this.sound.get('bridgeSound')) this.sound.play('bridgeSound');
    },
  });
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
    this.smallCounter.setText("Skills: " + this.coinCount + "/12");

    // Regular skill reveal code...

    // Check if all skills are collected - CREATE BRIDGE instead of dialogue
    if (this.coinCount >= 12 && selectedLevel === 3) {
      // Create bridge after delay
      this.time.delayedCall(1000, () => {
        createBridge.call(this);
      });
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
function triggerFinalDialogue(player, johann) {
  // Don't trigger if already triggered or bridge not created
  if (this.endOfGame || !this.bridgeCreated) return;

  // Stop player movement temporarily during dialogue
  player.setVelocityX(0);
  player.anims.play("stand");

  // Start the level 3 end dialogue
  showLevel3EndDialogue.call(this);

  // Prevent triggering dialogue multiple times
  this.endOfGame = true;
}

// Function to show Level 3 start dialogue
function showLevel3StartDialogue() {
  // Add dialogue box with Denis's intro
  const startText = createSpeechBubble.call(
    this,
    this.player.x,
    this.player.y - 60,
    "Alright, Level 3. Time to get a bit personal. I've always been curious about how tech shapes the world—and how finance can steer that change.",
    6000
  );

  // Show second part after delay
  this.time.delayedCall(6000, () => {
    const startText2 = createSpeechBubble.call(
      this,
      this.player.x,
      this.player.y - 60,
      "IDDP feels like the place where I can actually explore both and grow through each of them. Let's go!",
      5000
    );
  });
}

// Add this function to your game.js file if it's not already present:

// Function to create speech bubbles for dialogue
function createSpeechBubble(x, y, text, duration = 3000) {
  // Calculate text width for proper bubble sizing
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

  // Create bubble graphics - slightly larger than text
  const bubble = this.add.graphics({ x: x - 110, y: y - 55 });

  // Bubble background
  bubble.fillStyle(0xffffff, 0.8);
  bubble.fillRoundedRect(0, 0, textWidth + 20, textHeight + 20, 10);

  // Bubble border
  bubble.lineStyle(2, 0x000000, 1);
  bubble.strokeRoundedRect(0, 0, textWidth + 20, textHeight + 20, 10);

  // Add text inside bubble
  const bubbleText = this.add.text(x - 100, y - 45, text, {
    fontSize: "16px",
    fill: "#000000",
    wordWrap: { width: 200, useAdvancedWrap: true },
  });

  // Group bubble and text for easy manipulation
  const container = this.add.container(0, 0, [bubble, bubbleText]);

  // Add tail/pointer to the bubble
  const tail = this.add.graphics({ x: x, y: y });
  tail.fillStyle(0xffffff, 0.8);
  tail.lineStyle(2, 0x000000, 1);
  tail.beginPath();
  tail.moveTo(-20, -30);
  tail.lineTo(-10, -15);
  tail.lineTo(-30, -15);
  tail.closePath();
  tail.fillPath();
  tail.strokePath();

  // Include tail in container
  container.add(tail);

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

// Also add the simpler showSpeechBubble function that's used in Level 3:

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

// Add this function to replace collectCoin
function hitMysteryBox(player, box) {
  // Only trigger when hitting from below and not already hit
  if (!player.body.touching.up || box.getData("hit")) {
    return;
  }

  // Mark box as hit
  box.setData("hit", true);

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

  // Check if this is the guitar skill (skill index 5 is typically the last one with tennis racket)
  const isGuitarSkill =
    skill.name.toLowerCase().includes("racket") || skillIndex === 5;

  // Show skill icon popping out of the box
  const skillIcon = this.add
    .text(boxX, boxY - 40, skill.icon + " " + skill.name, { fontSize: "32px" })
    .setOrigin(0.5);

  // Animate skill icon bouncing up
  this.tweens.add({
    targets: skillIcon,
    y: skillIcon.y - 60,
    duration: 800,
    ease: "Bounce",
    onComplete: () => {
      // Fade out and destroy after bounce animation
      this.tweens.add({
        targets: skillIcon,
        alpha: { from: 1, to: 0 },
        duration: 200,
        onComplete: () => skillIcon.destroy(),
      });
    },
  });

  // Show skill name
  const skillName = this.add
    .text(boxX, boxY - 20, skill.name, {
      fontSize: "16px",
      fontStyle: "bold",
      fill: "#fff",
      stroke: "#000",
      strokeThickness: 3,
    })
    .setOrigin(0.5);

  // Fade out skill name faster (1 second total)
  this.tweens.add({
    targets: skillName,
    alpha: { from: 1, to: 0 },
    y: skillName.y - 20,
    duration: 1000, // Changed from 1500
    delay: 0, // Changed from 1000
    onComplete: () => skillName.destroy(),
  });

  // Update counters
  this.coinCount = (this.coinCount || 0) + 1;
  this.skillsCounter.setText("Skills: " + this.coinCount + "/6");
  this.smallCounter.setText("Skills: " + this.coinCount + "/6");

  // Show speech bubble with skill message
  showSpeechBubble.call(this, player, skill.message, 3000);

  // Activate boss area immediately if it's the guitar skill
  if (isGuitarSkill) {
    console.log("Guitar skill activated! Entering boss area...");

    // Enable tennis ball shooting ability
    this.hasTennisRacket = true;

    // Show message about guitar challenge
    const challengeMessage = this.add
      .text(
        this.scale.width / 2,
        100,
        "You found a guitar! Johann challenges you to a duel!",
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

    // Activate boss area with short delay
    this.time.delayedCall(2000, () => {
      activateBossArea.call(this);
    });
  }

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

  // Handle tennis racket (last skill)
  if (this.coinCount == 6) {
    // Enable tennis ball shooting ability
    this.hasTennisRacket = true;

    // Show a message about shooting tennis balls
    const shootText = this.add
      .text(this.scale.width / 2, 80, "Press SPACE to shoot tennis balls!", {
        fontSize: "18px",
        fill: "#ffffff",
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0);

    // Fade out after delay
    this.tweens.add({
      targets: shootText,
      alpha: { from: 1, to: 0 },
      delay: 5000,
      duration: 1000,
    });

    // Also show boss battle instruction
    const bossText = this.add
      .text(
        this.scale.width / 2,
        120,
        "Find Johann to the right and defeat him!",
        {
          fontSize: "18px",
          fill: "#ffffff",
          stroke: "#000000",
          strokeThickness: 3,
        }
      )
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0);

    // Fade out after delay
    this.tweens.add({
      targets: bossText,
      alpha: { from: 1, to: 0 },
      delay: 5000,
      duration: 1000,
    });
  }
}

// Add this function for Level 3-specific end dialogue
function showLevel3EndDialogue() {
  // Create dialogue boxes using player position since boss isn't available yet
  const denisText = createSpeechBubble.call(
    this,
    this.player.x,
    this.player.y - 60,
    "Level complete... but this isn't the end, is it?",
    4000
  );

  // Show Johann's response after a delay
  // Position it ahead of the player to represent the doorman
  this.time.delayedCall(4000, () => {
    const johannText = createSpeechBubble.call(
      this,
      this.player.x + 100, // Position slightly ahead of player
      this.player.y - 60,
      "No, Denis. This is where the real journey begins.",
      4000
    );

    // Continue dialogue sequence
    this.time.delayedCall(4000, () => {
      const denisText2 = createSpeechBubble.call(
        this,
        this.player.x,
        this.player.y - 60,
        "I have learned a ton and explored different passions — and somewhere along the way, I found out that this program is definitely my path.",
        4000
      );

      this.time.delayedCall(4000, () => {
        const johannText2 = createSpeechBubble.call(
          this,
          this.player.x + 100,
          this.player.y - 60,
          "Well...you've shown more than skill, you've shown real purpose. And that drive for innovation in banking? That's exactly what we're looking for.",
          4000
        );

        this.time.delayedCall(4000, () => {
          const denisText3 = createSpeechBubble.call(
            this,
            this.player.x,
            this.player.y - 60,
            "Then... am I in?",
            4000
          );

          // Complete level after dialogue
          this.time.delayedCall(5000, () => {
            levelComplete.call(this);
          });
        });
      });
    });
  });
}
