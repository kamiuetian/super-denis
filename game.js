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
  this.load.image("kebab", "assets/kebab.png");
  this.load.image("toad", "assets/toad.png");

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
  this.load.image("skillBox", "assets/skillBox.png");
  this.load.image("tennisBall", "assets/skillBox.png");
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
  let background = "background1";
  if (selectedLevel == 2) background = "background2";
  else if (selectedLevel == 3) background = "background3";

  const screenHeight = this.scale.height;
  const screenWidth = this.scale.width;
  const singleWidth = screenWidth;

  // Create background images
  this.background = this.add
    .image(singleWidth / 2, screenHeight / 2, background + "1")
    .setDisplaySize(singleWidth, screenHeight);

  this.add
    .image(singleWidth + singleWidth / 2, screenHeight / 2, background + "2")
    .setDisplaySize(singleWidth, screenHeight);

  this.add
    .image(
      2 * singleWidth + singleWidth / 2,
      screenHeight / 2,
      background + "3"
    )
    .setDisplaySize(singleWidth, screenHeight);

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
  if (!this.tennisBalls) {
    this.tennisBalls = this.physics.add.group();
  }

  // Create tennis ball at player position
  const ball = this.tennisBalls
    .create(
      this.player.x,
      this.player.y - 20,
      "coin" // Using coin sprite temporarily
    )
    .setScale(0.05);

  // Set velocity based on player direction
  const direction = this.player.flipX ? -1 : 1;
  ball.setVelocityX(direction * 400);

  // Add gravity to create arc
  ball.setGravityY(100);

  // Set tint to make it visible
  ball.setTint(0xffff00);

  // Destroy after 1.5 seconds
  this.time.delayedCall(1500, () => {
    if (ball.active) {
      ball.destroy();
    }
  });

  // Add collision with platforms
  this.physics.add.collider(
    ball,
    this.platforms,
    (ball) => ball.destroy(),
    null,
    this
  );

  // Show feedback
  showSpeechBubble.call(this, this.player, "Take that!", 500);
}

// Fix the createLevel1 function to ensure coins are visible
function createLevel1(bgRepeat) {
  // 1. First create the groups
  this.platforms = this.physics.add.staticGroup();
  this.coins = this.physics.add.staticGroup();
  this.kebabs = this.physics.add.staticGroup();
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

  this.platforms
    .create(1500, 565, "terrain", 2)
    .setDisplaySize(600, 50)
    .refreshBody();

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
      // Change from 0/7 to 0/6
      fontSize: "16px",
      fill: "#FFD700",
      fontWeight: "bold",
    })
    .setScrollFactor(0);

  // Create skill text objects
  this.skillTexts = [];
  for (let i = 0; i < skills.length; i++) {
    const skillText = this.add
      .text(this.scale.width - 195, 60 + i * 28, "• " + skills[i], {
        fontSize: "14px",
        fill: "#FFFFFF",
        fontFamily: "Arial",
      })
      .setScrollFactor(0);

    // Initially hide skill text by setting alpha to 0
    skillText.setAlpha(0);
    this.skillTexts.push(skillText);
  }

  // Small skills counter in bottom left (traditional location)
  this.smallCounter = this.add
    .text(20, 20, "Skills: 0/6", {
      // Change from 0/7 to 0/6
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

  // 7. Create improved platform and coin arrangement
  const platformPositions = [
    { x: 200, y: this.scale.height - 150, width: 150, height: 30 }, // Ground level platform
    { x: 400, y: this.scale.height - 220, width: 120, height: 30 }, // Medium height
    { x: 600, y: this.scale.height - 300, width: 150, height: 30 }, // Higher platform
    { x: 800, y: this.scale.height - 220, width: 130, height: 30 }, // Medium height again
    { x: 1000, y: this.scale.height - 180, width: 140, height: 30 }, // Lower platform
    { x: 1200, y: this.scale.height - 270, width: 120, height: 30 }, // Higher platform
    { x: 1400, y: this.scale.height - 350, width: 180, height: 30 }, // Highest platform

    // Add stepping stone platforms to help player climb
    { x: 300, y: this.scale.height - 180, width: 80, height: 20 }, // Stepping stone
    { x: 500, y: this.scale.height - 260, width: 80, height: 20 }, // Stepping stone
    { x: 700, y: this.scale.height - 260, width: 80, height: 20 }, // Stepping stone
    { x: 900, y: this.scale.height - 200, width: 80, height: 20 }, // Stepping stone
    { x: 1100, y: this.scale.height - 230, width: 80, height: 20 }, // Stepping stone
    { x: 1300, y: this.scale.height - 310, width: 80, height: 20 }, // Stepping stone
  ];

  // Create visually distinct platforms
  for (let i = 0; i < platformPositions.length; i++) {
    const pos = platformPositions[i];
    // Create platform with custom size
    const platform = this.platforms.create(pos.x, pos.y, "terrain", 4);
    platform.displayWidth = pos.width;
    platform.displayHeight = pos.height;
    platform.refreshBody();

    // Make platform stand out with tint if it's a main platform
    if (i < 6) {
      // Change from i < 7 to i < 6
      platform.setTint(0x88cc88); // Green tint for main platforms
    }

    // Add coin above main platforms only
    if (i < 6) {
      // Change from i < 7 to i < 6
      // Position coin above the platform
      const coin = this.coins
        .create(
          pos.x + pos.width / 2, // Center on platform
          pos.y - 40, // Above platform
          "coin"
        )
        .setOrigin(0.5, 0.5) // Center origin
        .setScale(0.05) // Slightly bigger for better visibility
        .refreshBody();

      // Increase coin visibility with brighter appearance
      coin.setTint(0xffff00); // Bright yellow tint

      // Add a pulsating glow effect around coins
      const glow = this.add
        .sprite(coin.x, coin.y, "coin")
        .setScale(0.08)
        .setAlpha(0.6)
        .setTint(0xffffaa);

      // Same animation code as before...
      this.tweens.add({
        targets: coin,
        y: coin.y - 5,
        duration: 1000,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });

      this.tweens.add({
        targets: glow,
        scale: { from: 0.08, to: 0.1 },
        alpha: { from: 0.6, to: 0.3 },
        yoyo: true,
        repeat: -1,
        duration: 800,
        ease: "Sine.easeInOut",
      });
    }
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

  // 8. Add kebabs
  this.kebabCount = 0;
  for (let i = 0; i < 5; i++) {
    const x = 100 + 200 * i + Phaser.Math.Between(0, 100);
    const y = this.scale.height - 150;
    this.kebabs
      .create(x + 10, y - 40, "kebab")
      .setOrigin(0, 0)
      .setScale(0.1)
      .refreshBody();
  }

  // Add enemies to the level - ADD THIS LINE
  addEnemies.call(this);

  // 9. Add physics colliders and overlaps
  this.physics.add.collider(this.player, this.platforms);
  this.physics.add.collider(this.enemies, this.platforms);
  this.physics.add.collider(this.enemies, this.enemies);
  this.physics.add.collider(this.player, this.enemies, hitEnemy, null, this);
  this.physics.add.overlap(this.player, this.coins, collectCoin, null, this);
  this.physics.add.overlap(this.player, this.kebabs, eatKebab, null, this);

  // 10. Set up camera to follow player
  this.cameras.main.setBounds(
    0,
    0,
    bgRepeat * this.scale.width,
    this.scale.height
  );
  this.cameras.main.startFollow(this.player);
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
  this.kebabs = this.physics.add.staticGroup();

  let ground = this.endOfSky.create(
    (bgRepeat * this.scale.width) / 2,
    this.scale.height,
    null
  );
  ground.setDisplaySize(bgRepeat * this.scale.width, 10);
  ground.setVisible(false);
  ground.refreshBody();

  let repeat = 2;
  let x = 100;
  let y = this.scale.height - Phaser.Math.Between(0, 150);
  for (let i = 0; i < 20 && x < 1600; i++) {
    x = 130 * i + 100;
    y = this.scale.height - Phaser.Math.Between(100, 250);
    for (let j = 0; j < repeat; j++) {
      console.log("Creating cloud at ", x, " ,", y);
      this.platforms
        .create(x + j * 55, y, "cloud")
        .setOrigin(0, 0)
        .setScale(0.15)
        .setVisible(true)
        .refreshBody();
    }
    repeat = Phaser.Math.Between(1, 2);
  }
  console.log("Creating kebab at ", x, " ,", y);
  this.kebabs
    .create(x + 10, y - 50, "kebab")
    .setOrigin(0, 0)
    .setScale(0.1)
    .refreshBody();
  this.platforms
    .create(80, 100, "cloud")
    .setOrigin(0, 0)
    .setScale(0.2)
    .setVisible(true)
    .refreshBody();
  this.physics.add.collider(this.player, this.platforms);
  this.physics.add.collider(this.player, this.endOfSky, fallDown, null, this);
  this.physics.add.overlap(this.player, this.kebabs, finishLevel2, null, this);

  this.cameras.main.setBounds(
    0,
    0,
    bgRepeat * this.scale.width,
    this.scale.height
  );
  this.cameras.main.startFollow(this.player);
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

  // Update skills UI
  if (this.coinCount > 0 && this.coinCount <= skills.length) {
    const skillText = this.skillTexts[this.coinCount - 1];

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

function eatKebab(player, kebab) {
  kebab.disableBody(true, true);
  this.kebabCount += 1;

  if (this.kebabCount == 3) {
    playerState = "big";
    player.setScale(5);
  }
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

function finishLevel2(player, kebab) {
  kebab.disableBody(true, true);

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

  this.time.delayedCall(
    5000,
    () => {
      window.location.href = "video2.html";
    },
    [],
    this
  );
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

    // Clean up existing enemies
    if (this.enemies && this.enemies.getChildren) {
      this.enemies.getChildren().forEach((enemy) => {
        if (this.updateList) {
          const index = this.updateList.indexOf(enemy);
          if (index !== -1) this.updateList.splice(index, 1);
        }
        enemy.destroy();
      });
    }

    // Clean up any existing projectiles
    if (this.tennisBalls) this.tennisBalls.clear(true, true);

    const screenWidth = this.scale.width;
    const screenHeight = this.scale.height;

    // Remove old background
    if (this.background) this.background.setVisible(false);

    // Add new boss background
    const bossBackground = this.add
      .image(screenWidth / 2, screenHeight / 2, "background31")
      .setDisplaySize(screenWidth, screenHeight)
      .setScrollFactor(0);

    // Create a new ground for boss arena
    const bossGround = this.platforms.create(
      screenWidth / 2,
      screenHeight - 40,
      null
    );
    bossGround.displayWidth = screenWidth;
    bossGround.displayHeight = 40;
    bossGround.refreshBody();

    // CRITICAL FIX: Clear any velocity and ensure player is visible
    this.player.setVelocity(0, 0);
    this.player.setPosition(100, screenHeight - 100);
    this.player.setVisible(true);
    this.player.setAlpha(1);
    this.player.clearTint();
    this.player.setDepth(20); // Set high depth to ensure player is on top

    // Make sure there's a collision with the new ground
    this.physics.add.collider(this.player, this.platforms);

    // Set camera to follow player
    this.cameras.main.startFollow(this.player);

    // Create boss at the right side - DO NOT ATTACK YET
    this.boss = this.physics.add
      .sprite(screenWidth * 0.8, -100, "toad")
      .setScale(0.3);

    // Set boss properties
    this.boss.health = 3;
    this.boss.direction = -1;
    this.boss.lastShotTime = this.time.now + 10000; // 10 second delay before first attack
    this.boss.setCollideWorldBounds(true);
    this.boss.setDepth(20);
    this.boss.setTint(0xff00ff);
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

    // IMPORTANT: Modify the boss update function to prevent attacking too soon
    this.boss.update = function (time) {
      // Only update after landing
      if (this.y < screenHeight - 120) return;

      // Move boss
      this.x += this.direction * 2;

      // Stay on right side of screen
      if (this.x < screenWidth * 0.6 || this.x > screenWidth * 0.9) {
        this.direction *= -1;
        this.flipX = this.direction > 0;
      }

      // Only shoot if enough time has passed AND player immunity is off
      if (time > this.lastShotTime && !this.scene.playerImmune) {
        if (this.scene.player && this.scene.player.active) {
          // Create boss tennis ball
          const ball = this.scene.physics.add
            .sprite(this.x, this.y - 20, "coin")
            .setScale(0.1)
            .setTint(0xff0000);

          // Aim at player with moderate speed
          const dx = this.scene.player.x - this.x;
          const dy = this.scene.player.y - this.y;
          const angle = Math.atan2(dy, dx);
          const speed = 150;

          ball.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

          // Safe collision handling
          this.scene.physics.add.overlap(
            ball,
            this.scene.player,
            function (ball, player) {
              if (!this.scene.playerImmune) {
                hitByBossBall.call(this.scene, player, ball);
              } else {
                ball.destroy();
              }
            },
            null,
            this
          );

          // Add collision with platforms
          this.scene.physics.add.collider(
            ball,
            this.scene.platforms,
            (ball) => ball.destroy(),
            null,
            this
          );

          // Set next shot time
          this.lastShotTime = time + 3000;
        }
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

// Add this function near the other game functions
function hitBoss(ball, boss) {
  // Destroy the tennis ball
  ball.destroy();

  // Show hit effect
  this.cameras.main.flash(100, 255, 255, 255, 0.5); // Flash white briefly

  // Flash the boss to indicate hit
  this.tweens.add({
    targets: boss,
    alpha: 0.5,
    duration: 100,
    yoyo: true,
    repeat: 2,
  });

  // Reduce boss health
  boss.health--;

  // Update health display
  if (boss.health >= 0 && boss.health < this.bossHealth.length) {
    this.bossHealth[boss.health].setText("💔"); // Broken heart

    // Make the heart shake
    this.tweens.add({
      targets: this.bossHealth[boss.health],
      x: "+=5",
      duration: 50,
      yoyo: true,
      repeat: 5,
    });
  }

  // Show hit message
  const messages = ["Good shot!", "One more hit!", "Final blow!"];

  showSpeechBubble.call(this, this.player, messages[3 - boss.health - 1], 1500);

  // Check if boss is defeated
  if (boss.health <= 0) {
    // Boss defeat sequence
    boss.disableBody(true, false);

    // Add dramatic explosion effect
    const explosion = this.add.sprite(boss.x, boss.y, "explosion");
    explosion.setScale(2);

    // Make camera shake when boss is defeated
    this.cameras.main.shake(1000, 0.02);

    // Play explosion animation or create a visual effect
    this.tweens.add({
      targets: boss,
      alpha: 0,
      y: boss.y - 100,
      rotation: 2,
      duration: 2000,
      onComplete: () => boss.destroy(),
    });

    // Show victory message from player
    const victoryOptions = [
      "That's how it's done! But this was just the warm-up!",
      "That was just the beginning—ready for what's next!",
    ];

    const randomMessage =
      victoryOptions[Math.floor(Math.random() * victoryOptions.length)];
    showSpeechBubble.call(this, this.player, randomMessage, 3000);

    // Complete the level after a delay
    this.time.delayedCall(4000, () => {
      // Fade out for transition
      this.cameras.main.fadeOut(1000);

      this.cameras.main.once("camerafadeoutcomplete", () => {
        this.physics.pause();
        gameWin.call(this);
      });
    });
  } else {
    // Boss reacts to being hit
    const bossReactions = [
      "Not bad, but you'll need more than that!",
      "Lucky shot! Let's see if you can do it again!",
    ];

    const randomReaction =
      bossReactions[Math.floor(Math.random() * bossReactions.length)];

    // Show boss reaction after a short delay
    this.time.delayedCall(1000, () => {
      showBossDialogue.call(this, randomReaction);
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

  // Show death message
  this.add
    .text(
      this.scale.width / 2,
      this.scale.height / 2 - 100,
      "Ouch! Watch out for Johann's tennis balls!",
      {
        fontSize: "18px",
        fill: "#ff0000",
        backgroundColor: "#000000",
        padding: 10,
      }
    )
    .setScrollFactor(0)
    .setAlign("center")
    .setOrigin(0.5, 0);

  // Restart level after delay
  this.time.delayedCall(3000, () => {
    this.scene.restart();
  });
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
