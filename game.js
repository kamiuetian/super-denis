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
  // Load Level 3 skill images
  this.load.image("customBlock", "assets/overworld/customBlock.png");
  this.load.image("blockGround", "block.png");
  this.load.image("block", "assets/overworld/block.png");
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
  const worldWidth = 5000;

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
  const bodyWidth = Math.floor(this.player.width * 0.6);
  const bodyOffset = Math.floor((this.player.width - bodyWidth) / 2);

  // Set the physics body size and offset
  this.player.body.setSize(bodyWidth, this.player.height);
  this.player.body.setOffset(bodyOffset, 0);

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
  if (this.dialogueActive) {
    // Force player to stay still during dialogue
    if (this.player && this.player.body) {
      this.player.setVelocityX(0);
      this.player.anims.play("stand");
    }
    return;
  }
  // Handle movement
  if (this.player && this.player.body && this.player.active) {
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
  }

  // Handle jumping
  if (this.player && this.player.body && this.player.active) {
    if (!this.player.body.touching.down) {
      this.player.anims.play("jump");
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-250);
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
function cloudFallDeath(player) {
  // Only run once
  if (this.playerDying) return;
  this.playerDying = true;

  // Stop player movement
  this.physics.pause();
  player.setVelocity(0, 0);
  player.setTint(0xff0000);

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
      "GAME OVER\n\nWhen aiming for the clouds, don't look down!",
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
    this.scene.restart();
  });
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
  // 1. Create groups
  this.platforms = this.physics.add.staticGroup();
  this.mysteryBoxes = this.physics.add.staticGroup();
  this.enemies = this.physics.add.group({
    collideWorldBounds: true,
    bounceX: 1,
    bounceY: 0,
  });

  // 2. Set up the ground
  const groundHeight = 40;
  const blockWidth = groundHeight; // Make blocks square based on ground height
  const worldWidth = 5000;
  const numBlocks = Math.ceil(worldWidth / blockWidth) + 1; // Add one extra block

  for (let i = 0; i < numBlocks; i++) {
    const block = this.platforms.create(
      i * (blockWidth - 7), // Subtract 1px to create overlap
      this.scale.height - groundHeight / 2,
      "block"
    );

    block.setDisplaySize(blockWidth, groundHeight); // Square blocks
    block.refreshBody();
    block.setData("isGround", true);
  }
  for (let i = 0; i < numBlocks; i++) {
    const block = this.platforms.create(
      i * (blockWidth - 7), // Same overlap as first layer
      this.scale.height - groundHeight / 2 - (groundHeight - 7), // Position below first layer
      "block"
    );

    block.setDisplaySize(blockWidth, groundHeight); // Square blocks
    block.refreshBody();
    block.setData("isGround", true);
  }
  /*const ground = this.platforms.create(
    2500,
    this.scale.height - groundHeight,
    null
  );
  ground.setDisplaySize(bgRepeat * this.scale.width, groundHeight);
  ground.setVisible(true);
  ground.refreshBody();*/

  // 3. Create the main platform blocks
  const brickBlocks = [
    // First set - two brick blocks with mystery boxes between them
    { x: 500, y: this.scale.height - 260, width: 48, height: 48 },
    { x: 596, y: this.scale.height - 260, width: 48, height: 48 },

    // Second set - two brick blocks with mystery boxes between them
    { x: 700, y: this.scale.height - 200, width: 48, height: 48 },
    { x: 796, y: this.scale.height - 200, width: 48, height: 48 },

    // Pipe block
    /*{
      x: 1600,
      y: this.scale.height - 100,
      width: 80,
      height: 100,
      type: "pipe",
    },
*/
    // Additional platforms for gameplay
    { x: 692, y: this.scale.height - 270, width: 48, height: 48 },
    /*{ x: 900, y: this.scale.height - 150, width: 150, height: 30 },
    { x: 1500, y: this.scale.height - 180, width: 250, height: 30 },
    { x: 1800, y: this.scale.height - 250, width: 150, height: 30 },*/
  ];

  // Create brick blocks
  for (const block of brickBlocks) {
    // Determine which texture to use
    let textureKey = "terrain";
    let useScale = false;

    // First two sets are from x=300 to x=396 and x=700 to x=796
    if (
      (block.x >= 500 && block.x <= 596) ||
      (block.x >= 700 && block.x <= 796)
    ) {
      textureKey = "emptyBlock"; // Use emptyBlock for first two sets
      useScale = true; // Use scale instead of setDisplaySize
    } else if (block.type === "pipe") {
      textureKey = "customBlock"; // Keep pipe texture
    }

    // Create the platform with appropriate texture
    const platform = this.platforms.create(block.x, block.y, "emptyBlock", 0);

    // Apply either scale or display size based on block type
    if (useScale) {
      platform.setScale(3); // Set scale to 3 for emptyBlock
    } else {
      platform.setDisplaySize(block.width, block.height);
    }

    platform.refreshBody();

    // Add green tint for pipe blocks
    if (block.type === "pipe") {
      platform.setTint(0x00ff00);
    }
  }

  // 4. Create mystery boxes according to specification
  const mysteryBoxPositions = [
    // Two mystery boxes between brick blocks (positioned between the two sets)
    { x: 548, y: this.scale.height - 260, index: 0 }, // Between first set of bricks
    { x: 748, y: this.scale.height - 300, index: 1 }, // Between second set of bricks

    // One alone
    { x: 644, y: this.scale.height - 260, index: 2 },

    // One on top of pipe block
    { x: 596, y: this.scale.height - 400, index: 3 },

    // Two others placed elsewhere
    { x: 1000, y: this.scale.height - 250, index: 4 },
    { x: 2200, y: this.scale.height - 280, index: 5 },
  ];

  // Create mystery boxes
  for (const box of mysteryBoxPositions) {
    const mysteryBox = this.mysteryBoxes
      .create(box.x, box.y, "mysteryBlock")
      .setOrigin(0.5, 0.5)
      .setScale(3)
      .setData("skillIndex", box.index)
      .setData("hit", false)
      .refreshBody();

    // Add glow effect
    const glow = this.add
      .sprite(mysteryBox.x, mysteryBox.y, "mysteryBlock")
      .setScale(1.7)
      .setAlpha(0.3)
      .setTint(0xffff44);

    // Store reference to glow
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
  /**create staircase */
  const stepWidth = 100;
  const stepHeight = 30;
  const baseY = this.scale.height - 100; // Position from bottom of screen

  for (let i = 0; i < 5; i++) {
    // Each step moves up and right by 100 units
    const stepX = 3500 + i * stepWidth;
    const stepY = baseY - i * stepWidth;

    const step = this.platforms.create(stepX, stepY, "terrain");
    step.setDisplaySize(stepWidth, stepHeight);
    step.setData("isStep", true);
    step.setData("stepNumber", i);
    step.refreshBody();
  }
  // Add this code immediately after creating the staircase in createLevel1 function
  // Create a trigger zone right after the last staircase step
  const lastStepX = 2400 + 4 * 100; // Position of the 5th step (index 4)
  const triggerX = lastStepX + 150; // Position trigger 150px after the last step
  const triggerY = baseY - 4 * 100; // Match height of the top step
  const triggerZone = this.add.zone(triggerX, triggerY, 500, 500);
  this.physics.world.enable(triggerZone);
  triggerZone.body.setAllowGravity(false);
  triggerZone.body.immovable = true;

  // Make the zone visible during development (can be removed in final version)
  const zoneVisual = this.add.rectangle(
    triggerX,
    triggerY,
    50,
    100,
    0x00ff00,
    0.3
  );
  zoneVisual.setDepth(100);

  // Add overlap detection
  this.physics.add.overlap(
    this.player,
    triggerZone,
    () => {
      // Only trigger once
      if (!this.bossTriggered) {
        this.bossTriggered = true;
        console.log("Player crossed staircase - activating boss area!");
        activateBossArea.call(this);
      }
    },
    null,
    this
  );
  // 5. Continue with existing code for UI, counters, etc.
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
    .text(this.scale.width - 190, 260, "Skills: 0/6", {
      fontSize: "16px",
      fill: "#FFD700",
      fontWeight: "bold",
    })
    .setScrollFactor(0);

  // Create skill text objects
  this.skillTexts = [];
  for (let i = 0; i < skills.length; i++) {
    const skillText = this.add
      .text(
        this.scale.width - 195,
        60 + i * 28,
        skills[i].icon + " " + skills[i].name,
        {
          fontSize: "14px",
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
    .text(20, 20, "Skills: 0/6", {
      fontSize: "20px",
      fill: "#ffffff",
    })
    .setScrollFactor(0);

  // 6. Add enemies
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

  // Set up camera to follow player
  this.cameras.main.setBounds(0, 0, 5000, this.scale.height);
  this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

  // Add instructions
  const instructionText = this.add
    .text(
      this.scale.width / 2,
      80,
      "Hit mystery boxes from below to discover skills!",
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

  // Fade out instructions
  this.tweens.add({
    targets: instructionText,
    alpha: { from: 1, to: 0 },
    delay: 3000,
    duration: 1000,
    ease: "Power2",
  });
}
// Add this function near the other game functions
function activateBossArea() {
  // First pause all physics to prevent anything from happening during the transition
  this.physics.pause();

  // Fade out
  //this.cameras.main.fadeOut(1000, 0, 0, 0);

  //this.cameras.main.once("camerafadeoutcomplete", () => {
  // Set global immunity flag immediately
  this.playerImmune = true;

  // SAFER CLEANUP: Handle enemy cleanup with better error checking
  if (this.enemies) {
    try {
      // First try to get children safely
      const enemyChildren = this.enemies.getChildren
        ? this.enemies.getChildren()
        : [];

      // Then process each enemy
      enemyChildren.forEach((enemy) => {
        if (this.updateList) {
          const index = this.updateList.indexOf(enemy);
          if (index !== -1) this.updateList.splice(index, 1);
        }
        if (enemy && enemy.destroy) enemy.destroy();
      });
    } catch (error) {
      console.error("Error cleaning up enemies:", error);
    }
  }

  // FIXED: Safe cleanup for tennis balls group
  if (this.tennisBalls) {
    try {
      // Check if the clear method exists before calling it
      if (this.tennisBalls.clear) {
        this.tennisBalls.clear(true, true);
      } else {
        // Alternative cleanup if clear isn't available
        const ballChildren = this.tennisBalls.getChildren
          ? this.tennisBalls.getChildren()
          : [];
        ballChildren.forEach((ball) => {
          if (ball && ball.destroy) ball.destroy();
        });
      }
    } catch (error) {
      console.error("Error cleaning up tennis balls:", error);
    }

    // Recreate the group to ensure it's properly initialized
    this.tennisBalls = this.physics.add.group();
  } else {
    // Create the group if it doesn't exist
    this.tennisBalls = this.physics.add.group();
  }

  // Remove all platforms except ground
  if (this.platforms) {
    try {
      // Store reference to the original ground
      let ground = null;

      // First try to get children safely
      const platformChildren = this.platforms.getChildren
        ? this.platforms.getChildren()
        : [];

      // Then process each platform
      platformChildren.forEach((platform) => {
        // Skip the ground (which is usually invisible and spans the entire level)
        if (
          platform.y >= this.scale.height - 50 &&
          platform.displayWidth > this.scale.width
        ) {
          ground = platform;
        } else {
          // Remove all other platforms
          platform.destroy();
        }
      });

      // If we didn't find the ground, we'll create a new one
      if (!ground) {
        // Create a new ground platform for the boss area
        const screenWidth = this.scale.width;
        const screenHeight = this.scale.height;
        const groundHeight = 40;

        ground = this.platforms.create(
          screenWidth / 2,
          screenHeight - groundHeight / 2,
          null
        );
        ground.setDisplaySize(screenWidth, groundHeight);
        ground.setVisible(false); // Keep it invisible
        ground.refreshBody();
      }
    } catch (error) {
      console.error("Error cleaning up platforms:", error);
    }
  }

  // Rest of boss area setup...
  const screenWidth = this.scale.width;
  const screenHeight = this.scale.height;

  // Keep just the darkening overlay for better visibility of sprites
  const darkOverlay = this.add
    .rectangle(0, 0, screenWidth, screenHeight, 0x000000, 0.3)
    .setOrigin(0, 0)
    .setScrollFactor(0);

  // CRITICAL FIX: Clear any velocity and ensure player is visible
  this.player.setVelocity(0, 0);
  this.player.setPosition(100, screenHeight - 100); // This line sets the player position
  this.player.setVisible(true);
  this.player.setAlpha(1);
  this.player.clearTint();
  this.player.setDepth(20);

  // ADD THIS: Make sure shooting controls are set up even in boss area
  this.shootKey = this.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.SPACE
  );
  this.lastShotTime = 0;

  // Force the hasTennisRacket flag to be true
  this.hasTennisRacket = true;

  // Add visual indicator that shooting is available
  const shootIndicator = this.add
    .text(150, 30, "🎾 PRESS SPACE TO SHOOT", {
      fontSize: "18px",
      fill: "#ffff00",
      stroke: "#000000",
      strokeThickness: 3,
    })
    .setScrollFactor(0);

  // Make it blink to draw attention
  this.tweens.add({
    targets: shootIndicator,
    alpha: { from: 1, to: 0.3 },
    duration: 500,
    yoyo: true,
    repeat: 5,
    onComplete: () => {
      this.tweens.add({
        targets: shootIndicator,
        alpha: 0,
        delay: 2000,
        duration: 1000,
      });
    },
  });

  // Make sure there's a collision with the new ground
  this.physics.add.collider(this.player, this.platforms);

  // Set camera to follow player
  // FIXED: Instead of simply following the player, use an offset to keep player at the left
  // this.cameras.main.startFollow(this.player); // Remove this line

  // Set fixed camera position instead of following player
  this.cameras.main.setScroll(0, 0);
  this.cameras.main.stopFollow();

  // Or if you still want to follow the player but with an offset:
  // this.cameras.main.startFollow(this.player, true, 0.1, 0.1, -screenWidth/3, 0);

  // Create boss at the right side - DO NOT ATTACK YET
  this.boss = this.physics.add
    .sprite(screenWidth * 0.8, -100, "enemy") // CHANGED: Using enemy sprite
    .setScale(0.3); // Adjusted scale for enemy sprite

  // Set boss properties
  this.boss.health = 3;
  // Initialize localStorage for boss health
  try {
    localStorage.setItem("bossHealth", "3");
    console.log("Boss health initialized in localStorage");
  } catch (e) {
    console.error("Failed to initialize localStorage for boss health:", e);
  }

  this.boss.direction = -1;
  this.boss.lastShotTime = this.time.now + 10000; // 10 second delay before first attack
  this.boss.setCollideWorldBounds(true);
  this.boss.setDepth(20);
  this.boss.setTint(0xffff00); // CHANGED: Yellow overlay instead of magenta
  this.boss.flipX = true;

  // Add boss health display
  this.bossHealth = [];
  for (let i = 0; i < 3; i++) {
    const heart = this.add
      .text(screenWidth / 2 - 45 + i * 30, 20, "❤️", { fontSize: "28px" })
      .setScrollFactor(0);
    this.bossHealth.push(heart);
  }

  // Create tennis balls group if needed
  if (!this.tennisBalls) this.tennisBalls = this.physics.add.group();

  // Setup boss-player interactions
  this.physics.add.collider(this.boss, this.platforms);
  this.physics.add.overlap(this.tennisBalls, this.boss, hitBoss, null, this);

  // Initialize update list if needed
  if (!this.updateList) this.updateList = [];

  // IMPORTANT: Modify the boss update function to ensure tennis balls are thrown
  this.boss.update = function (time) {
    // Don't do anything until landed
    if (this.y < screenHeight - 120) {
      return; // Early return with proper brackets
    }

    // SIMPLIFIED MOVEMENT - always move back and forth
    this.x += this.direction * 2;

    // Change direction at boundaries
    if (this.x < screenWidth * 0.6 || this.x > screenWidth * 0.9) {
      this.direction *= -1;
      this.flipX = this.direction > 0;
    }

    // SIMPLIFIED SHOOTING - fire every 3 seconds with clear debug
    const currentTime = this.scene.time.now;
    const elapsedSinceLastShot = currentTime - (this.lastShotTime || 0);

    if (elapsedSinceLastShot > 3000 && !this.scene.playerImmune) {
      console.log("BOSS SHOOTING NOW");

      // Create tennis ball with fixed scene reference
      const ball = this.scene.physics.add
        .sprite(this.x, this.y - 20, "tennisball") // Using same tennisball sprite
        .setScale(0.05) // Match player ball scale
        .setTint(0xff0000) // Red overlay for Johann's balls
        .setDepth(100);

      // ADDED: Rotation effect like player's tennis balls
      this.scene.tweens.add({
        targets: ball,
        rotation: -Math.PI * 4, // Rotate based on boss direction (opposite of player)
        duration: 1000,
        repeat: -1,
      });

      // ADDED: Flashing effect to make it more noticeable like player's tennis balls
      this.scene.tweens.add({
        targets: ball,
        alpha: { from: 0.4, to: 1 },
        duration: 200,
        yoyo: true,
        repeat: -1,
      });

      // ADDED: Track the ball's animation state
      updateTennisBallAnimation.call(this.scene, ball);

      // Aim at player with existing code...
      const dx = this.scene.player.x - this.x;
      const dy = this.scene.player.y - this.y;
      const baseAngle = Math.atan2(dy, dx);
      const angleVariation = ((Math.random() - 0.5) * Math.PI) / 2;
      const angle = baseAngle + angleVariation;

      const speed = 250;

      ball.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
      // ENHANCED: Add visual indicator showing direction
      const directionLine = this.scene.add.line(
        0,
        0,
        ball.x,
        ball.y,
        ball.x + Math.cos(angle) * 50,
        ball.y + Math.sin(angle) * 50,
        0xff0000,
        0.6
      );
      directionLine.setLineWidth(2);
      directionLine.setOrigin(0, 0);

      // Fade out direction indicator
      this.scene.tweens.add({
        targets: directionLine,
        alpha: 0,
        duration: 300,
        onComplete: () => directionLine.destroy(),
      });

      // ENHANCED: Add variation to the ball appearance based on angle
      // More extreme angles get different visual treatment
      if (Math.abs(angleVariation) > Math.PI / 6) {
        // If more than 30 degrees off
        ball.setTint(0xff8800); // Orange for wide shots
      } else if (Math.abs(angleVariation) > Math.PI / 12) {
        // If more than 15 degrees off
        ball.setTint(0xffcc00); // Yellow for medium-angle shots
      } else {
        ball.setTint(0xff0000); // Red for direct shots
      }
      // ADDED: Set physics properties like player's tennis balls
      ball.setBounce(0.6);
      ball.setCollideWorldBounds(true);

      // Clear collision function to avoid closure issues
      function ballHitPlayer(ball, player) {
        console.log("BALL HIT PLAYER");
        // FIX: Store a direct reference to the scene
        const sceneRef = this.scene;

        // Direct handler instead of using call with incorrect context
        if (ball && ball.active) {
          ball.destroy();
          if (!sceneRef.playerImmune) {
            // FIX: Access the physics directly from sceneRef
            sceneRef.physics.pause();
            player.setTint(0xff0000);

            // Create full screen black overlay
            const overlay = sceneRef.add
              .rectangle(
                0,
                0,
                sceneRef.scale.width,
                sceneRef.scale.height,
                0x000000,
                0.8
              )
              .setOrigin(0, 0)
              .setScrollFactor(0)
              .setDepth(999);

            // Show death message with proper text about HR rules
            const gameOverText = sceneRef.add
              .text(
                sceneRef.scale.width / 2,
                sceneRef.scale.height / 2 - 100,
                "Game Over\nKilling applicants is against HR rules!\nPlease be mindful",
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

            // Add restart button instead of automatic restart
            const restartButton = sceneRef.add
              .text(
                sceneRef.scale.width / 2,
                sceneRef.scale.height / 2 + 80,
                "[ Restart Level ]",
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

            // Add hover effect to button
            restartButton.on("pointerover", () => {
              restartButton.setStyle({ fill: "#ffff00" });
            });

            restartButton.on("pointerout", () => {
              restartButton.setStyle({ fill: "#ffffff" });
            });

            // Add click handler to restart
            restartButton.on("pointerdown", () => {
              sceneRef.scene.restart();
            });
          }
        }
      }

      // Add collisions with proper context
      this.scene.physics.add.overlap(
        ball,
        this.scene.player,
        ballHitPlayer,
        null,
        this // 'this' here is the boss object with scene reference
      );

      // Replace the platform collision with proper bouncing:
      this.scene.physics.add.collider(
        ball,
        this.scene.platforms,
        (ball, platform) => {
          tennisBallBounce.call(this.scene, ball, platform);
        },
        null,
        this
      );

      // Keep track of the ball's initial scale for animation
      ball.initialScale = 0.3;

      // Make sure the ball is destroyed after a certain time
      this.scene.time.delayedCall(5000, () => {
        if (ball.active) {
          ball.destroy();
          if (ball.glow) ball.glow.destroy();
        }
      });

      // Add collisions
      this.scene.physics.add.overlap(
        ball,
        this.scene.player,
        ballHitPlayer,
        null,
        this
      );

      // Update shot time directly using scene time
      this.lastShotTime = currentTime;
      console.log(
        "Shot fired, next shot after:",
        (currentTime + 1000) / 1000,
        "seconds"
      );
    }
  };

  // Add boss to update list
  this.updateList.push(this.boss);

  // Dramatic boss entrance
  this.tweens.add({
    targets: this.boss,
    y: screenHeight - 120,
    ease: "Bounce.easeOut",
    duration: 1500,
    onComplete: () => {
      this.cameras.main.shake(300, 0.01);

      // Delay dialogue to ensure everything is fully ready
      this.time.delayedCall(500, () => {
        // Show boss dialogue with exact text from requirements
        const johannBubble = createSpeechBubble.call(
          this,
          this.boss.x,
          this.boss.y - 80,
          "Let's see if your skills are really that impressive!",
          5000
        );

        // After 3 seconds, show Denis's response
        this.time.delayedCall(1000, () => {
          createSpeechBubble.call(
            this,
            this.player.x,
            this.player.y - 60,
            "Challenge accepted!",
            1000
          );
          this.physics.resume();

          // Turn off immunity 1 second after dialogue completes
          this.time.delayedCall(4000, () => {
            console.log("Player immunity turned off");
            this.playerImmune = false;
          });
        });
      });
    },
  });

  // Wait until everything is set up, then fade back in and resume physics
  //this.cameras.main.fadeIn(1000, 0, 0, 0);
  //this.cameras.main.once("camerafadeincomplete", () => {
  this.physics.resume();
  //});

  // Add instruction text after a delay
  this.time.delayedCall(6000, () => {
    const instructionText = this.add
      .text(
        screenWidth / 2,
        screenHeight - 80,
        "Hit Johann with tennis balls 3 times to win! Press SPACE to shoot.",
        {
          fontSize: "18px",
          fill: "#ffffff",
          stroke: "#000000",
          strokeThickness: 3,
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0);

    this.tweens.add({
      targets: instructionText,
      alpha: { from: 1, to: 0 },
      delay: 5000,
      duration: 1000,
    });
  });
  //});
}

// Fixed version of hitBoss function focusing on proper boss respawn

function hitBoss(ball, boss) {
  // Destroy the tennis ball
  ball.destroy();

  // Ensure we're working with consistent boss data
  if (!boss || !boss.active) {
    console.log("Boss hit detection failed - invalid boss object");
    return;
  }

  // Get current health from localStorage with better error handling
  let currentHealth;
  try {
    currentHealth = parseInt(localStorage.getItem("bossHealth"));
    if (isNaN(currentHealth) || currentHealth === null) {
      currentHealth = 3;
    }
  } catch (e) {
    currentHealth = 3;
  }

  // Calculate new health
  const newHealth = currentHealth - 1;
  console.log(`Boss hit! Health: ${currentHealth} → ${newHealth}`);

  // Update localStorage
  try {
    localStorage.setItem("bossHealth", newHealth.toString());
  } catch (e) {
    console.error("Failed to update localStorage:", e);
  }

  // Store position before destroying
  const bossX = boss.x;
  const bossY = boss.y;

  // Visual feedback
  this.cameras.main.flash(100, 255, 255, 255, 0.3);

  // Create hit effect
  const hitEffect = this.add.circle(bossX, bossY, 40, 0xff0000, 0.6);
  this.tweens.add({
    targets: hitEffect,
    scale: 2,
    alpha: 0,
    duration: 300,
    onComplete: () => hitEffect.destroy(),
  });

  // Update health display UI
  if (newHealth >= 0 && newHealth < this.bossHealth.length) {
    this.bossHealth[newHealth].setText("💔");
  }

  // Remove from update list
  if (this.updateList) {
    const index = this.updateList.indexOf(boss);
    if (index !== -1) {
      this.updateList.splice(index, 1);
    }
  }

  // Destroy old boss
  boss.destroy();
  this.boss = null;

  // Check if boss is defeated
  if (newHealth <= 0) {
    console.log("BOSS DEFEATED!");
    if (this.tennisBalls) {
      this.tennisBalls.getChildren().forEach((ball) => {
        // Check if this is a boss ball (red tint)
        if (ball.tintTopLeft === 0xff0000) {
          // Safely remove any glow effects first
          if (ball.glow && ball.glow.active) {
            ball.glow.destroy();
            ball.glow = null;
          }

          // Destroy the ball
          ball.destroy();
        }
      });
    }
    // Victory sequence
    this.physics.pause();
    const victoryText = this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 3,
        "YOU DEFEATED JOHANN!",
        {
          fontSize: "24px",
          fontFamily: "Arial",
          fontWeight: "bold",
          fill: "#ffffff",
          stroke: "#000000",
          strokeThickness: 4,
          backgroundColor: "#00800088",
          padding: { x: 16, y: 8 },
        }
      )
      .setScrollFactor(0)
      .setOrigin(0.5);

    // Complete level after delay
    this.time.delayedCall(4000, () => {
      gameWin.call(this);
    });
  } else {
    // FIXED: Respawn boss with correct settings for movement and shooting
    const screenWidth = this.scale.width;
    const screenHeight = this.scale.height;

    // IMPORTANT: Fixed position - always use the right side of screen
    const fixedX = screenWidth * 0.8;

    console.log(`Respawning boss at ${fixedX}, ${screenHeight - 120}`);

    // FIXED: Always spawn at safe height with CONSISTENT appearance
    this.boss = this.physics.add
      .sprite(fixedX, screenHeight - 120, "enemy") // FIXED: Use enemy sprite consistently
      .setScale(0.3) // FIXED: Use same scale as original (0.3)
      .setVisible(true)
      .setAlpha(1)
      .setDepth(100);

    // Add a flash effect to make the respawn obvious
    this.boss.setTintFill(0xffff00); // FIXED: Use yellow tint to match original
    this.time.delayedCall(100, () => {
      if (this.boss && this.boss.active) this.boss.clearTint();
      // Add back the normal tint
      this.boss.setTint(0xffff00); // FIXED: Maintain yellow tint after flash
    });

    // Set properties - IMPORTANT: Store scene reference
    this.boss.health = newHealth;
    this.boss.direction = -1;
    this.boss.lastShotTime = this.time.now;
    this.boss.setCollideWorldBounds(true);
    this.boss.flipX = true;
    this.boss.scene = this; // CRITICAL: Explicitly set scene reference

    console.log("Boss properties set:", this.boss);

    // Add collision detection
    this.physics.add.collider(this.boss, this.platforms);
    this.physics.add.overlap(this.tennisBalls, this.boss, hitBoss, null, this);

    // FIXED: Store screen dimensions directly on boss object
    this.boss.screenWidth = screenWidth;
    this.boss.screenHeight = screenHeight;

    // IMPROVED update function with better debugging
    this.boss.update = function (time) {
      console.log("Boss update function called");

      // REMOVED height check - always allow movement

      // Move back and forth
      this.x += this.direction * 2;

      // Check position and log periodically
      if (time % 300 === 0) {
        console.log(
          `Boss position: ${this.x}, ${this.y}, direction: ${this.direction}`
        );
      }

      // Change direction at boundaries
      if (this.x < this.screenWidth * 0.6 || this.x > this.screenWidth * 0.9) {
        this.direction *= -1;
        this.flipX = this.direction > 0;
        console.log(`Boss changed direction to: ${this.direction}`);
      }

      // Tennis ball shooting logic with direct scene access
      const currentTime = this.scene.time.now;
      const elapsedSinceLastShot = currentTime - (this.lastShotTime || 0);

      if (elapsedSinceLastShot > 3000) {
        console.log("BOSS SHOOTING NOW");

        // Create tennis ball with fixed scene reference
        const ball = this.scene.physics.add
          .sprite(this.x, this.y - 20, "tennisball") // FIXED: Use tennisball consistently
          .setScale(0.05) // FIXED: Use consistent scale of 0.1
          .setTint(0xff0000)
          .setDepth(100);

        // FIXED: Add same rotation animation
        this.scene.tweens.add({
          targets: ball,
          rotation: -Math.PI * 4,
          duration: 1000,
          repeat: -1,
        });

        // FIXED: Add same flashing effect
        this.scene.tweens.add({
          targets: ball,
          alpha: { from: 0.4, to: 1 },
          duration: 200,
          yoyo: true,
          repeat: -1,
        });

        // FIXED: Use same animation function
        updateTennisBallAnimation.call(this.scene, ball);

        // Aim at player
        const dx = this.scene.player.x - this.x;
        const dy = this.scene.player.y - this.y;
        const angle = Math.atan2(dy, dx);
        const speed = 150;

        ball.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

        // FIXED: Set same physics properties
        ball.setBounce(0.6);
        ball.setCollideWorldBounds(true);

        // Add collisions with player
        this.scene.physics.add.overlap(
          ball,
          this.scene.player,
          (ball, player) => {
            ball.destroy();
            if (!this.scene.playerImmune) {
              hitByBossBall.call(this.scene, player, ball);
            }
          },
          null,
          this
        );

        // FIXED: Use same bounce physics instead of destroying on contact
        this.scene.physics.add.collider(
          ball,
          this.scene.platforms,
          (ball, platform) => {
            tennisBallBounce.call(this.scene, ball, platform);
          },
          null,
          this
        );

        // FIXED: Only destroy after reasonable time (let it bounce around)
        const sceneRef = this.scene;

        if (sceneRef && sceneRef.time) {
          sceneRef.time.delayedCall(5000, () => {
            // Check if ball AND scene still exist before tweening
            if (ball && ball.active && sceneRef && sceneRef.tweens) {
              try {
                sceneRef.tweens.add({
                  targets: ball,
                  alpha: 0,
                  scale: 0.05,
                  duration: 200,
                  onComplete: () => {
                    if (ball && ball.active) {
                      ball.destroy();

                      // Also clean up any associated glow effect
                      if (ball.glow && ball.glow.active) {
                        ball.glow.destroy();
                        ball.glow = null;
                      }
                    }
                  },
                });
              } catch (e) {
                // Fallback destruction if tweening fails
                console.error("Error during ball fadeout:", e);
                if (ball && ball.active) {
                  ball.destroy();
                }
              }
            } else if (ball && ball.active) {
              // Direct destruction if scene no longer valid
              ball.destroy();
            }
          });
        }

        this.lastShotTime = currentTime;
      }
    };

    // Make sure updateList exists
    if (!this.updateList) {
      this.updateList = [];
    }

    // Add to update list
    this.updateList.push(this.boss);
    console.log(
      "Boss added to update list. List size:",
      this.updateList.length
    );

    // Also create a timer to call update directly as a fallback
    this.time.addEvent({
      delay: 100,
      callback: () => {
        if (this.boss && this.boss.active) {
          this.boss.update(this.time.now);
        }
      },
      callbackScope: this,
      loop: true,
    });

    // Message to player
    const messages = ["Good shot!", "One more hit!", "Final blow!"];
    const messageIndex = Math.max(0, Math.min(2, 3 - newHealth - 1));

    const hitText = this.add
      .text(this.player.x, this.player.y - 50, messages[messageIndex], {
        fontSize: "18px",
        fontFamily: "Arial",
        fill: "#ffffff",
        stroke: "#000000",
        strokeThickness: 3,
        padding: { x: 8, y: 4 },
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: hitText,
      y: hitText.y - 30,
      alpha: 0,
      duration: 1000,
      onComplete: () => hitText.destroy(),
    });
  }
}

// Handle player hit by boss ball with immunity check
function hitByBossBall(player, ball) {
  // FIX: Check if player is immune
  if (this.levelCompleting) {
    // Just destroy the ball without triggering death
    ball.destroy();
    return;
  }
  if (this.playerImmune) {
    ball.destroy();
    return;
  }

  // Remove the ball
  ball.destroy();

  // Kill the player
  this.physics.pause();
  player.setTint(0xff0000);

  // Create full screen black overlay
  const overlay = this.add
    .rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.8)
    .setOrigin(0, 0)
    .setScrollFactor(0)
    .setDepth(999);

  // Show death message with proper text about HR rules
  const gameOverText = this.add
    .text(
      this.scale.width / 2,
      this.scale.height / 2 - 100,
      "Game Over\nKilling applicants is against HR rules!\nPlease be mindful",
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

  // Add restart button instead of automatic restart
  const restartButton = this.add
    .text(
      this.scale.width / 2,
      this.scale.height / 2 + 80,
      "[ Restart Level ]",
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

  // Add hover effect to button
  restartButton.on("pointerover", () => {
    restartButton.setStyle({ fill: "#ffff00" });
  });

  restartButton.on("pointerout", () => {
    restartButton.setStyle({ fill: "#ffffff" });
  });

  // Add click handler to restart
  restartButton.on("pointerdown", () => {
    this.scene.restart();
  });

  // REMOVED: Automatic restart timer
}

// Update the showBossDialogue function to create a speech bubble over Johann
function showBossDialogue(text) {
  if (!this.boss || !this.boss.active) {
    console.log("Boss not available for dialogue");
    return;
  }

  console.log("Showing boss dialogue:", text);

  // Create speech bubble directly using our helper function
  createSpeechBubble.call(this, this.boss.x, this.boss.y - 80, text, 5000);
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
// Add this function right after the createLevel1 function, around line 450

// After the platformPositions and loop to create platforms in your createLevel1 function
// Add this code to create visible enemies:
function addEnemies() {
  // Create patrolling goompa enemies with proper positioning
  const enemyPositions = [
    { x: 600, y: this.scale.height - 80, range: 300, speed: 40 },
    { x: 1200, y: this.scale.height - 80, range: 200, speed: 70 },
    { x: 1900, y: this.scale.height - 80, range: 280, speed: 55 },
    { x: 2500, y: this.scale.height - 80, range: 220, speed: 80 },
    { x: 3100, y: this.scale.height - 80, range: 160, speed: 65 },
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
      .setVelocityX(-pos.speed);

    // Make sure they're visible and on top
    enemy.setDepth(20); // Higher depth to be above everything
    enemy.setAlpha(1); // Fully visible
    enemy.setTint(0xff0000); // Bright red tint for visibility

    // Position above ground (important!)
    enemy.y = this.scale.height - 85;
    // Add simple AI to make them patrol back and forth
    this.time.addEvent({
      delay: 2000 + Math.random() * 1000, // Random patrol timing
      callback: () => {
        if (enemy && enemy.active) {
          enemy.setVelocityX(-enemy.body.velocity.x); // Reverse direction

          // Calculate new maximum range positions
          const leftBound = pos.x - pos.range / 2;
          const rightBound = pos.x + pos.range / 2;

          // Keep enemy within its patrol range
          if (enemy.x < leftBound) {
            enemy.setVelocityX(Math.abs(pos.speed));
          } else if (enemy.x > rightBound) {
            enemy.setVelocityX(-Math.abs(pos.speed));
          }
        }
      },
      loop: true,
    });
    console.log(
      "Created enemy at",
      enemy.x,
      enemy.y,
      "with depth",
      enemy.depth
    );
  }
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
// Replace the existing createLevel2 function with this complete implementation
function createLevel2(bgRepeat) {
  // 1. First create the groups
  this.platforms = this.physics.add.staticGroup();
  this.skillItems = this.physics.add.staticGroup();
  this.tennisBalls = this.physics.add.group();

  // 2. Set up the ground (invisible, just for preventing falling)
  const groundHeight = 40; // Match Level 1's ground height
  const ground = this.platforms.create(
    //(bgRepeat * this.scale.width) / 2,
    2500,
    this.scale.height - groundHeight / 2, // Position at bottom of visible area
    null
  );
  ground.setDisplaySize(bgRepeat * this.scale.width, groundHeight);
  ground.setVisible(true); // Make it visible like in Level 1
  ground.refreshBody();
  ground.setData("isGround", true); // Tag to identify ground in collision handler
  ground.setData("isDeadlyGround", true); // Add new deadly tag
  // Create a visual indicator that the ground is deadly
  const dangerZone = this.add.graphics();
  dangerZone.fillStyle(0xff0000, 0.3); // Semi-transparent red
  dangerZone.fillRect(
    0,
    this.scale.height - groundHeight,
    bgRepeat * this.scale.width,
    groundHeight
  );
  dangerZone.lineStyle(2, 0xff0000, 0.8);
  dangerZone.lineBetween(
    0,
    this.scale.height - groundHeight,
    5000,
    this.scale.height - groundHeight
  );
  // 3. Set background - blue sky
  const skyBackground = this.add.rectangle(
    0,
    0,
    5000,
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
  this.skillsPanel.fillRect(this.scale.width - 220, 20, 200, 360);
  this.skillsPanel.lineStyle(2, 0xffd700, 1);
  this.skillsPanel.strokeRect(this.scale.width - 220, 20, 200, 360);
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
    .text(this.scale.width - 190, 350, "Skills: 0/12", {
      fontSize: "16px",
      fill: "#FFD700",
      fontWeight: "bold",
    })
    .setScrollFactor(0);

  // Create skill text objects - 12 skills for Level 2
  this.skillTexts = [];

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
    { x: 100, y: this.scale.height - 100 },
    { x: 300, y: this.scale.height - 210 },
    { x: 550, y: this.scale.height - 190 },
    { x: 800, y: this.scale.height - 300 },
    { x: 1100, y: this.scale.height - 250 },
    { x: 1300, y: this.scale.height - 350 },
    { x: 1500, y: this.scale.height - 200 },
    { x: 1750, y: this.scale.height - 300 },
    { x: 1900, y: this.scale.height - 200 },
    { x: 2050, y: this.scale.height - 320 },
    { x: 2200, y: this.scale.height - 250 },
    { x: 2400, y: this.scale.height - 300 },
  ];

  // Create clouds and add skills
  for (let i = 0; i < cloudPositions.length; i++) {
    const pos = cloudPositions[i];

    // Create cloud platform
    const cloud = this.platforms.create(pos.x, pos.y, "cloud");
    cloud.setScale(0.1); // Adjust scale as needed
    cloud.refreshBody();
    cloud.setData("touched", false);
    cloud.setData("skillIndex", i); // Store index for skill item
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
      //this.scale.width * bgRepeat * 0.85,
      2600,
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
    //this.scale.width * bgRepeat * 0.85,
    2600,
    this.scale.height * 0.05,
    "cloud"
  );
  bossCloud.setScale(0.25);
  bossCloud.refreshBody();

  // 9. Add collision detection
  this.physics.add.collider(
    this.player,
    this.platforms,
    playerHitCloud,
    null,
    this
  );

  // Set up camera to follow player
  this.cameras.main.setBounds(0, 0, 5000, this.scale.height);
  this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
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
  this.smallCounter.setText(`Items: ${this.itemCount}/12`);

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
    // Create a visual placeholder for the bridge (initially raised)
    this.bridgeGraphics = this.add.graphics();
    this.bridgeGraphics.fillStyle(0x8b4513); // Brown wood color
    this.bridgeGraphics.fillRect(-this.gapWidth / 2, -10, this.gapWidth, 20);
    this.bridgeGraphics.lineStyle(2, 0x663300, 1);
    this.bridgeGraphics.strokeRect(-this.gapWidth / 2, -10, this.gapWidth, 20);
    this.bridgeGraphics.setPosition(this.bridgeX, this.bridgeY - 200); // Start raised

    // Mark bridge as created
    this.bridgeCreated = true;
  }
  // Play bridge lowering animation
  if (this.riverCollider) {
    this.riverCollider.active = false;
  }
  // Play bridge lowering animation with corrected ending position
  this.tweens.add({
    targets: this.bridgeGraphics,
    y: this.scale.height - 30, // Position exactly at ground level
    duration: 1500,
    ease: "Bounce.easeOut",
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
  if (!bgRepeat || bgRepeat < 5) {
    bgRepeat = 3; // Ensure level is at least 5x screen width
    console.log("Corrected bgRepeat to:", bgRepeat);
  }
  // 1. First create the groups
  this.platforms = this.physics.add.staticGroup();
  this.skillItems = this.physics.add.staticGroup();
  this.tennisBalls = this.physics.add.group();
  this.physics.world.setBounds(0, 0, 5000, this.scale.height);

  // 2. Set up the ground (invisible, just for preventing falling)
  const groundHeight = 40; // Match Level 1's ground height
  const groundTop = this.scale.height - groundHeight;

  const ground = this.platforms.create(
    2500,
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
    5000,
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
  this.skillsPanel.fillRect(this.scale.width - 220, 20, 200, 360);
  this.skillsPanel.lineStyle(2, 0xffd700, 1);
  this.skillsPanel.strokeRect(this.scale.width - 220, 20, 200, 360);
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
    .text(this.scale.width - 190, 350, "Skills: 0/12", {
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
      "Collect the Icons to discover my professional skills!",
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
    { x: 250, y: this.scale.height - 100 },
    { x: 500, y: this.scale.height - 210 },
    { x: 750, y: this.scale.height - 190 },
    { x: 1000, y: this.scale.height - 300 },
    { x: 1250, y: this.scale.height - 250 },
    { x: 1500, y: this.scale.height - 350 },
    { x: 1750, y: this.scale.height - 200 },
    { x: 2000, y: this.scale.height - 300 },
    { x: 2300, y: this.scale.height - 200 },
    { x: 2600, y: this.scale.height - 320 },
    { x: 2850, y: this.scale.height - 250 },
    { x: 3100, y: this.scale.height - 300 },
  ];

  // Create visible skill items on platforms
  for (let i = 0; i < cloudPositions.length; i++) {
    const pos = cloudPositions[i];

    // Create platform using customBlock
    const platform = this.platforms.create(pos.x, pos.y, "customBlock");
    platform.setScale(3); // Adjust scale as needed
    platform.refreshBody();
    platform.setDepth(10);
    // Determine skill type (tech or finance)
    const isFinance = i >= 6; // First 6 are tech, next 6 are finance
    const itemIndex = isFinance ? i - 6 : i;
    const skillType = isFinance ? "finance" : "tech";

    // Create visible skill item using specific asset
    const assetKey = `${skillType}${itemIndex + 1}`; // tech1, tech2, finance1, etc.
    const skill = this.physics.add.staticSprite(pos.x, pos.y - 60, assetKey);
    skill.setDepth(15);
    // If asset doesn't exist, use fallback
    if (!this.textures.exists(assetKey)) {
      skill.setTexture("tech1");
      skill.setTint(isFinance ? 0x00ff00 : 0x00ffff);
    }

    skill.setScale(0.5);
    skill.setData("index", i);
    skill.setData("type", skillType);
    skill.setData("collected", false);

    // Add floating animation
    this.tweens.add({
      targets: skill,
      y: skill.y - 5,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Add collection overlap
    this.physics.add.overlap(this.player, skill, collectSkill, null, this);
  }

  // 8. Add Johann (boss) in the top right corner - REMOVED FOR LEVEL 3
  // this.boss = this.physics.add.sprite(...);

  // 9. Add collision detection
  this.physics.add.collider(this.player, this.platforms, hitCloud, null, this);

  // Set up camera to follow player
  this.cameras.main.setBounds(0, 0, 5000, this.scale.height);
  this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

  // 10. Add pre-level dialogue

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
  this.cameras.main.setBounds(0, 0, 5000, this.scale.height);
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
  this.player.x = 150; // Start position
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
  this.bridgeX = 3500; //bgRepeat * this.scale.width - 600; // Position bridge near end of level
  this.bridgeY = this.scale.height;
  this.gapWidth = 300; // Width of the gap to bridge

  // Create the gap/river
  const riverGraphics = this.add.graphics();
  riverGraphics.fillStyle(0x0077be); // Water blue
  riverGraphics.fillRect(
    this.bridgeX - this.gapWidth / 2,
    groundTop, // Position at the top of the ground
    this.gapWidth,
    groundHeight // Match the ground height
  );
  riverGraphics.setDepth(1);

  // Add Johann as doorman on the other side of the bridge
  this.johann = this.physics.add
    .sprite(
      this.bridgeX + this.gapWidth / 2 + 300, // On other side of bridge
      this.scale.height - 50,
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

  // Create deadly collision area for the river
  this.deathZone = this.add.zone(
    this.bridgeX,
    this.scale.height - 50,
    this.gapWidth,
    100
  );
  if (this.deathZone) {
    this.deathZone.y = groundTop + groundHeight / 2;
    this.physics.world.enable(this.deathZone);
  }
  this.physics.world.enable(this.deathZone);
  this.deathZone.body.setAllowGravity(false);
  this.deathZone.body.immovable = true;

  // Add collision with the death zone (only active until bridge is created)
  this.riverCollider = this.physics.add.overlap(
    this.player,
    this.deathZone,
    riverDeath,
    null,
    this
  );

  // Add flags to control dialogue flow
  this.dialogueShown = false;
  this.waitingForLanding = true;
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

    // Release player after dialogue completes
    this.time.delayedCall(5000, () => {
      this.dialogueActive = false;
    });
  });
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

function hitMysteryBox(player, box) {
  // Only trigger when hitting from below and not already hit
  if (!player.body.touching.up || box.getData("hit")) {
    return;
  }

  // Mark box as hit
  box.setData("hit", true);

  // ADDED: Set dialogue active flag to freeze player in the update function
  this.dialogueActive = true;

  // ADDED: Pause physics to prevent enemy/ball movement
  this.physics.pause();

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

  // Update counters
  this.coinCount = (this.coinCount || 0) + 1;
  this.skillsCounter.setText("Skills: " + this.coinCount + "/6");
  this.smallCounter.setText("Skills: " + this.coinCount + "/6");

  // Show speech bubble with skill message
  const speechBubble = showSpeechBubble.call(this, player, skill.message, 3000);

  // ADDED: Resume physics and player control after dialogue finishes
  this.time.delayedCall(3000, () => {
    // Only resume if not entering boss battle (which handles physics itself)
    if (!isGuitarSkill) {
      this.physics.resume();
      this.dialogueActive = false;
    }
  });

  // Activate boss area immediately if it's the tennis racket skill
  if (isGuitarSkill) {
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

  // Handle additional tennis racket information if it's the last skill
  if (this.coinCount == 6 && !isGuitarSkill) {
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
  }
}

function showLevel3EndDialogue() {
  // Get direct references to both characters' positions
  const playerX = this.player.x;
  const playerY = this.player.y;
  const johannX = this.johann
    ? this.johann.x
    : this.bridgeX + this.gapWidth / 2 + 300;
  const johannY = this.johann ? this.johann.y : this.scale.height - 50;

  // Player's first dialogue - positioned above player's head
  const denisText = createSpeechBubble.call(
    this,
    playerX,
    playerY - 60,
    "Level complete... but this isn't the end, is it?",
    4000
  );

  // Johann's response - positioned above Johann's head
  this.time.delayedCall(4000, () => {
    const johannText = createSpeechBubble.call(
      this,
      johannX,
      johannY - 60,
      "No, Denis. This is where the real journey begins.",
      4000
    );

    // Continue dialogue sequence with correct positioning
    this.time.delayedCall(4000, () => {
      const denisText2 = createSpeechBubble.call(
        this,
        playerX,
        playerY - 60,
        "I have learned a ton and explored different passions — and somewhere along the way, I found out that this program is definitely my path.",
        4000
      );

      this.time.delayedCall(4000, () => {
        const johannText2 = createSpeechBubble.call(
          this,
          johannX,
          johannY - 60,
          "Well...you've shown more than skill, you've shown real purpose. And that drive for innovation in banking? That's exactly what we're looking for.",
          4000
        );

        this.time.delayedCall(4000, () => {
          const denisText3 = createSpeechBubble.call(
            this,
            playerX,
            playerY - 60,
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

  // Hide the glow
  const glow = skill.getData("glow");
  if (glow) {
    this.tweens.add({
      targets: glow,
      alpha: 0,
      scale: 1.5,
      duration: 500,
      onComplete: () => glow.destroy(),
    });
  }

  // Update item count
  this.itemCount = (this.itemCount || 0) + 1;
  this.skillsCounter.setText(`Items: ${this.itemCount}/12`);
  this.smallCounter.setText(`Items: ${this.itemCount}/12`);

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
      duration: 300,
      ease: "Back.easeOut",
    });
  }

  // 3. Create the falling skill symbol effect
  const symbol = this.add.text(
    cloud.x,
    cloud.y,
    `${level2Skills[skillIndex].icon} ${level2Skills[skillIndex].name}`,
    { fontSize: "32px" }
  );

  // Animate the symbol falling from the cloud
  this.tweens.add({
    targets: symbol,
    y: cloud.y + 100,
    alpha: { from: 1, to: 0 },
    duration: 1500,
    ease: "Bounce.easeOut",
    onComplete: () => symbol.destroy(),
  });

  // 4. Update skill counter
  this.skillCount = (this.skillCount || 0) + 1;
  this.skillsCounter.setText(
    `Skills: ${this.skillCount}/${level2Skills.length}`
  );
  this.smallCounter.setText(
    `Skills: ${this.skillCount}/${level2Skills.length}`
  );

  // 6. Check if all skills collected
  if (this.skillCount >= level2Skills.length) {
    this.levelCompleting = true;

    this.time.delayedCall(1000, () => {
      this.physics.pause();

      const completionText = this.add
        .text(
          this.scale.width / 2,
          this.scale.height / 2 - 100,
          "All skills collected!",
          {
            fontSize: "24px",
            fill: "#ffffff",
            stroke: "#000000",
            strokeThickness: 4,
          }
        )
        .setOrigin(0.5)
        .setScrollFactor(0);

      this.time.delayedCall(2000, () => {
        // Progress to next section or level
        levelComplete.call(this);
      });
    });
  }
}
// Function to handle death from falling off clouds in Level 2
function cloudFallDeath(player, cloud) {
  // Only run once
  if (this.playerDying) return;
  this.playerDying = true;

  // Stop player movement
  this.physics.pause();
  player.setVelocity(0, 0);
  player.setTint(0xff0000);

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
    this.scene.restart();
  });
}
