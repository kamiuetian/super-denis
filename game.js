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
  this.load.image("cloud", "assets/cloud.png");
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
  const bgRepeat = 2;
  const screenHeight = this.scale.height;
  const screenWidth = this.scale.width;

  // Create plain white background rectangle
  const whiteBackground = this.add.rectangle(
    0,
    0,
    screenWidth * bgRepeat,
    screenHeight,
    0xffffff // White color
  );
  whiteBackground.setOrigin(0, 0);
  whiteBackground.setDepth(-2); // Make sure it's behind everything

  // Store reference to background
  this.background = whiteBackground;

  // Set physics world bounds
  this.physics.world.setBounds(0, 0, bgRepeat * screenWidth, screenHeight);

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
  if (!gameStarted || this.endOfGame) return;

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
    .setScale(0.1); // Adjust scale for tennisball sprite

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
    ball.setScale(0.17);
  } else {
    // Going up - make slightly smaller
    ball.setScale(0.13);
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
  ground.setVisible(false);
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
  const platformPositions = [
    { x: 200, y: this.scale.height - 150, width: 150, height: 30 },
    { x: 400, y: this.scale.height - 220, width: 120, height: 30 },
    { x: 600, y: this.scale.height - 300, width: 150, height: 30 },
    { x: 800, y: this.scale.height - 220, width: 130, height: 30 },
    { x: 1000, y: this.scale.height - 180, width: 140, height: 30 },
    { x: 1200, y: this.scale.height - 270, width: 120, height: 30 },
  ];

  // Rename coins group to mysteryBoxes
  this.mysteryBoxes = this.physics.add.staticGroup();

  // Create ONLY green platforms with mystery boxes below
  for (let i = 0; i < platformPositions.length; i++) {
    const pos = platformPositions[i];

    // Create platform with custom size
    const platform = this.platforms.create(pos.x, pos.y, "terrain", 4);
    platform.displayWidth = pos.width;
    platform.displayHeight = pos.height;
    platform.refreshBody();
    platform.setTint(0x88cc88); // Green tint for ALL platforms

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
}

// Add this function right after the createLevel1 function, around line 450

// After the platformPositions and loop to create platforms in your createLevel1 function
// Add this code to create visible enemies:
function addEnemies() {
  // Create patrolling goompa enemies with proper positioning
  const enemyPositions = [
    { x: 350, y: this.scale.height - 80, range: 150 },
    { x: 900, y: this.scale.height - 80, range: 200 },
    { x: 1500, y: this.scale.height - 80, range: 180 },
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

function createLevel2(bgRepeat) {
  this.platforms = this.physics.add.staticGroup();
  this.endOfSky = this.physics.add.staticGroup();

  // Other code...

  this.physics.add.collider(this.player, this.platforms);
  this.physics.add.collider(this.player, this.endOfSky, fallDown, null, this);
}

function createLevel3(bgRepeat) {
  this.player.setScale(4);
  this.platforms = this.physics.add.staticGroup();
  // this.bank = this.physics.add.staticGroup();
  this.manager = this.physics.add.staticGroup();

  const endOfWindow = this.scale.width * bgRepeat;
  const groundHeight = 1;
  ground = this.platforms.create(
    (bgRepeat * this.scale.width) / 2,
    this.scale.height,
    null
  );
  ground.setDisplaySize(bgRepeat * this.scale.width, groundHeight);
  ground.setVisible(false);
  ground.refreshBody();

  //const tower = this.bank.create(endOfWindow - 200, this.scale.height - 255 - groundHeight, 'commerz').setScale(0.4).refreshBody();
  // tower.body.setSize(5, 550);
  const npc = this.manager
    .create(endOfWindow - 350, this.scale.height - 95, "toad")
    .setOrigin(0, 0)
    .setScale(0.04)
    .refreshBody();
  npc.body.setSize(150, 150);

  this.physics.add.collider(this.player, this.platforms);
  this.physics.add.overlap(
    this.player,
    this.manager,
    talkToTheManager,
    null,
    this
  );
  // this.physics.add.overlap(this.player, this.bank, enterTower, null, this);

  this.cameras.main.setBounds(
    0,
    0,
    bgRepeat * this.scale.width,
    this.scale.height
  );
  this.cameras.main.startFollow(this.player);
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

function talkToTheManager(player, manager) {
  console.log("Managing collision");
  if (this.endOfGame) return;
  this.endOfGame = true;
  this.player.setVelocityX(0);
  this.player.anims.play("stand");
  manager.body.setSize(1, 1);
  texts = [
    "Congratulations!\n you've reached the Commerzbank tower",
    "You are hired!",
  ];

  this.currentDialogIndex = 0;

  // Display the first dialog text
  this.dialogText = this.add
    .text(
      this.scale.width / 2,
      this.scale.height / 2 - 100,
      texts[this.currentDialogIndex],
      {
        fontSize: "16px",
        fill: "#00ff00",
        backgroundColor: "#000000",
        padding: { x: 10, y: 5 },
      }
    )
    .setScrollFactor(0)
    .setAlign("center")
    .setOrigin(0.5, 0);

  // Set up the timed event to change dialog every 5 seconds
  this.dialogTimer = this.time.addEvent({
    delay: 5000, // 5 seconds
    callback: showNextDialog,
    callbackScope: this,
    loop: true,
    args: [texts, manager],
  });
}

function showNextDialog(texts, manager) {
  console.log("Showing next dialog ...", this.currentDialogIndex);
  // Move to the next dialog index
  this.currentDialogIndex++;

  // Check if it's the last dialog
  if (this.currentDialogIndex >= texts.length) {
    this.dialogText.setText("Please come on in!");
    manager.disableBody(true, false);

    // Stop the timer
    this.dialogTimer.remove();

    // Redirect after 5 seconds
    this.time.delayedCall(5000, () => {
      window.location.href = "video3.html";
    });
    return;
  }

  // Update the displayed text
  this.dialogText.setText(texts[this.currentDialogIndex]);
}

// Add this function near the other game functions
function activateBossArea() {
  // First pause all physics to prevent anything from happening during the transition
  this.physics.pause();

  // Fade out
  this.cameras.main.fadeOut(1000, 0, 0, 0);

  this.cameras.main.once("camerafadeoutcomplete", () => {
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
          .setScale(0.1) // Match player ball scale
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
        const angle = Math.atan2(dy, dx);
        const speed = 150;

        ball.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

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
        this.scene.time.delayedCall(3000, () => {
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
          (currentTime + 3000) / 1000,
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
          this.time.delayedCall(3000, () => {
            createSpeechBubble.call(
              this,
              this.player.x,
              this.player.y - 60,
              "Challenge accepted!",
              3000
            );

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
    this.cameras.main.fadeIn(1000, 0, 0, 0);
    this.cameras.main.once("camerafadeincomplete", () => {
      this.physics.resume();
    });

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
  });
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
        this.scene.time.delayedCall(5000, () => {
          if (ball && ball.active) {
            this.scene.tweens.add({
              targets: ball,
              alpha: 0,
              scale: 0.05,
              duration: 200,
              onComplete: () => ball.destroy(),
            });
          }
        });

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
      },
    });
  });

  return bubbleContainer;
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

  // Fade out skill name
  this.tweens.add({
    targets: skillName,
    alpha: { from: 1, to: 0 },
    y: skillName.y - 20,
    duration: 1500,
    delay: 1000,
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
