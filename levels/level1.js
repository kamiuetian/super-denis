const skills = [
  {
    name: "Curious Mind",
    icon: "📚",
    message:
      "I have many different interests and they made me realize that I genuinely love learning. There's something about discovering new things that makes me really excited!",
  },
  {
    name: "Positive Drive",
    icon: "🔥",
    message: `I always bring a lot of energy and a positive mindset into everything I do.`,
  },
  {
    name: "Open Thinker",
    icon: "🗣",
    message:
      "At university, I competed in national and international debating tournaments. I learned that changing perspective and staying open to new ideas is key.",
  },
  {
    name: "International Mindset",
    icon: "🌍",
    message: `${"🇩🇪 🇬🇧 🇹🇷 🇮🇹 🇪🇸 🇨🇳"} \n For me, learning languages is not only about communication but appreciating different ways of thinking and new cultures. It lets me thrive in international environments.`,
  },
  {
    name: "Focused Mentality",
    icon: "♟️",
    message:
      "My passion for chess taught me how to think ahead, stay focused under pressure and learn from my mistakes.",
  },
  {
    name: "Effective Communication",
    icon: "🎾",
    message:
      "Being a tennis instructor taught me to communicate with empathy, take responsibility and work together with different kinds of personalities.",
  },
];

// Game state for Level 1
let skillsCollected = 0;
let hasReachedCheckpoint = false;
let hasTennisRacket = false;
let lastShotTime = 0;

// Create Level 1
function createLevel1(bgRepeat) {
  // Force definite initialization of updateList at the very start
  this.updateList = [];
  console.log("Initialized updateList as empty array");

  // Rest of your code...
  setupGroups.call(this);
  setupGround.call(this, bgRepeat);
  setupDarkeningOverlay.call(this, bgRepeat);

  // Initialize game state
  this.skillsCollected = 0;
  this.hasReachedCheckpoint = false;
  this.hasTennisRacket = false;

  // Create UI elements
  createSkillsBar.call(this);
  createInstructionText.call(this);

  // Create level elements
  createPlatformsAndSkillItems.call(this);
  createEnemies.call(this);
  createBossArea.call(this, bgRepeat);

  // Setup collision handlers
  setupColliders.call(this);

  // Setup camera
  setupCamera.call(this, bgRepeat);

  // Setup keyboardinput for shooting
  setupShootingControls.call(this);

  // Show intro message
  showSpeechBubble.call(this, this.player, "Let's go!", 2000);
}

// Setup physics groups
function setupGroups() {
  this.platforms = this.physics.add.staticGroup();
  this.skillItems = this.physics.add.staticGroup();
  this.enemies = this.physics.add.group({
    collideWorldBounds: true,
    bounceX: 1,
    bounceY: 0,
  });
  this.tennisBalls = this.physics.add.group();
  this.bossBalls = this.physics.add.group();
  this.checkpoints = this.physics.add.staticGroup();
  this.bossGroup = this.physics.add.group();
}

// Setup ground platform
function setupGround(bgRepeat) {
  const groundHeight = 40;
  this.ground = this.platforms.create(
    (bgRepeat * this.scale.width) / 2,
    this.scale.height - groundHeight,
    null
  );
  this.ground.setDisplaySize(bgRepeat * this.scale.width, groundHeight);
  this.ground.setVisible(false);
  this.ground.refreshBody();
}

// Add darkening overlay for better visibility
function setupDarkeningOverlay(bgRepeat) {
  const darkOverlay = this.add.rectangle(
    0,
    0,
    this.scale.width * bgRepeat,
    this.scale.height,
    0x000000,
    0.2
  );
  darkOverlay.setOrigin(0, 0);
  darkOverlay.setDepth(-1);
}

// Create skills bar UI
function createSkillsBar() {
  // Container for the skills bar
  this.skillsBarContainer = this.add.container(20, 20);
  this.skillsBarContainer.setScrollFactor(0); // Fixed on screen

  // Background for skills bar
  const barBg = this.add.graphics();
  barBg.fillStyle(0x000000, 0.7);
  barBg.fillRect(0, 0, 300, 40);
  barBg.lineStyle(2, 0xffffff);
  barBg.strokeRect(0, 0, 300, 40);

  // Text label
  const label = this.add.text(10, 10, "Skills collected:", {
    fontSize: "18px",
    fill: "#FFFFFF",
  });

  // Skill boxes
  this.skillBoxes = [];
  for (let i = 0; i < skills.length; i++) {
    // Create empty box
    const box = this.add.graphics();
    box.lineStyle(2, 0xffffff);
    box.strokeRect(160 + i * 22, 10, 20, 20);

    // Create filled box (initially invisible)
    const filledBox = this.add.graphics();
    filledBox.fillStyle(0x00ff00);
    filledBox.fillRect(161, 11, 18, 18);
    filledBox.x = 160 + i * 22;
    filledBox.y = 10;
    filledBox.visible = false;

    this.skillBoxes.push(filledBox);
  }

  // Counter text
  this.skillsCounter = this.add.text(290, 10, "0/6", {
    fontSize: "18px",
    fill: "#FFFFFF",
    align: "right",
  });

  // Add all elements to the container
  this.skillsBarContainer.add(barBg);
  this.skillsBarContainer.add(label);
  for (const box of this.skillBoxes) {
    this.skillsBarContainer.add(box);
  }
  this.skillsBarContainer.add(this.skillsCounter);
}

// Add instruction text
function createInstructionText() {
  const instructionText = this.add
    .text(
      this.scale.width / 2,
      80,
      "Collect all skills and defeat Johann to complete the level!",
      {
        fontSize: "22px",
        fill: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
        fontStyle: "bold",
      }
    )
    .setOrigin(0.5, 0.5)
    .setScrollFactor(0);

  // Fade out instruction
  this.tweens.add({
    targets: instructionText,
    alpha: { from: 1, to: 0 },
    delay: 5000,
    duration: 1000,
    ease: "Power2",
  });

  // Also add keyboard controls hint
  const controlsText = this.add
    .text(
      this.scale.width / 2,
      120,
      "Controls: Arrow keys to move, UP to jump\nSpace to shoot (after collecting tennis racket)",
      {
        fontSize: "16px",
        fill: "#ffffff",
        stroke: "#000000",
        strokeThickness: 3,
        align: "center",
      }
    )
    .setOrigin(0.5, 0.5)
    .setScrollFactor(0);

  this.tweens.add({
    targets: controlsText,
    alpha: { from: 1, to: 0 },
    delay: 8000,
    duration: 1000,
    ease: "Power2",
  });
}

// Update the createPlatformsAndSkillItems function to have Mario-style platforms with mystery boxes
function createPlatformsAndSkillItems() {
  // Define a range for platform sections
  const minX = 250;
  const maxX = 2250;

  // Create platforms with Mario-style brick patterns and mystery boxes
  for (let i = 0; i < skills.length; i++) {
    // Calculate a position for this platform group
    // Ensure platforms are somewhat evenly spaced across the level
    const sectionWidth = (maxX - minX) / skills.length;
    const pieceStart =
      minX + i * sectionWidth + Phaser.Math.Between(50, sectionWidth - 150);

    // Generate a random platform structure with the skill item
    createMarioStyleStructure.call(this, pieceStart, i);
  }

  // Create checkpoint after the last skill (tennis racket)
  this.checkpoint = this.checkpoints
    .create(maxX + 250, this.scale.height - 50, "checkpoint")
    .setScale(0.5)
    .refreshBody();

  // Add checkpoint flag animation
  this.tweens.add({
    targets: this.checkpoint,
    angle: { from: -5, to: 5 },
    yoyo: true,
    repeat: -1,
    duration: 1000,
    ease: "Sine.easeInOut",
  });
}

// Function to create Mario-style brick platforms with skill boxes
function createMarioStyleStructure(pieceStart, skillIndex) {
  const random = Phaser.Math.Between(0, 5);
  const platformHeight = 40;

  switch (random) {
    case 0:
      // Pattern 1: Row of bricks with mystery box in middle
      for (let i = -2; i <= 2; i++) {
        if (i === 0) continue; // Skip middle for mystery box
        const brick = this.platforms.create(
          pieceStart + i * 40,
          this.scale.height - platformHeight * 1.9,
          "block"
        );
        brick.displayWidth = 40;
        brick.displayHeight = 40;
        brick.refreshBody();
      }

      // Add mystery box in the middle
      createMysteryBox.call(
        this,
        pieceStart,
        this.scale.height - platformHeight * 1.9,
        skillIndex
      );
      break;

    case 1:
      // Pattern 2: Step formation with mystery box at top
      for (let i = -1; i <= 1; i++) {
        const brick = this.platforms.create(
          pieceStart + i * 40,
          this.scale.height - platformHeight * 1.9,
          "block"
        );
        brick.displayWidth = 40;
        brick.displayHeight = 40;
        brick.refreshBody();
      }

      // Second level
      for (let i = -1; i <= 0; i++) {
        const brick = this.platforms.create(
          pieceStart + i * 40,
          this.scale.height - platformHeight * 2.9,
          "block"
        );
        brick.displayWidth = 40;
        brick.displayHeight = 40;
        brick.refreshBody();
      }

      createMysteryBox.call(
        this,
        pieceStart,
        this.scale.height - platformHeight * 3.9,
        skillIndex
      );
      break;

    case 2:
      // Pattern 3: Line with gap for mystery box
      createMysteryBox.call(
        this,
        pieceStart,
        this.scale.height - platformHeight * 1.9,
        skillIndex
      );

      // Bricks on both sides
      for (let i = 1; i <= 2; i++) {
        const brickLeft = this.platforms.create(
          pieceStart - i * 40,
          this.scale.height - platformHeight * 1.9,
          "block"
        );
        brickLeft.displayWidth = 40;
        brickLeft.displayHeight = 40;
        brickLeft.refreshBody();

        const brickRight = this.platforms.create(
          pieceStart + i * 40,
          this.scale.height - platformHeight * 1.9,
          "block"
        );
        brickRight.displayWidth = 40;
        brickRight.displayHeight = 40;
        brickRight.refreshBody();
      }
      break;

    case 3:
      // Pattern 4: Pyramid with mystery box on top
      for (let i = -2; i <= 2; i++) {
        const brick = this.platforms.create(
          pieceStart + i * 40,
          this.scale.height - platformHeight * 1.9,
          "block"
        );
        brick.displayWidth = 40;
        brick.displayHeight = 40;
        brick.refreshBody();
      }

      for (let i = -1; i <= 1; i++) {
        const brick = this.platforms.create(
          pieceStart + i * 40,
          this.scale.height - platformHeight * 2.9,
          "block"
        );
        brick.displayWidth = 40;
        brick.displayHeight = 40;
        brick.refreshBody();
      }

      createMysteryBox.call(
        this,
        pieceStart,
        this.scale.height - platformHeight * 3.9,
        skillIndex
      );
      break;

    case 4:
      // Pattern 5: Single mystery box with platform beneath
      createMysteryBox.call(
        this,
        pieceStart,
        this.scale.height - platformHeight * 2.9,
        skillIndex
      );

      const brick = this.platforms.create(
        pieceStart,
        this.scale.height - platformHeight * 1.9,
        "block"
      );
      brick.displayWidth = 40;
      brick.displayHeight = 40;
      brick.refreshBody();
      break;

    case 5:
      // Pattern 6: Floating mystery box (challenge jump)
      createMysteryBox.call(
        this,
        pieceStart,
        this.scale.height - platformHeight * 2.5,
        skillIndex
      );

      // Add some empty blocks nearby as platforms
      for (let i = -2; i <= 2; i += 2) {
        if (i === 0) continue; // Skip middle
        const emptyBlock = this.platforms.create(
          pieceStart + i * 40,
          this.scale.height - platformHeight * 1.9,
          "emptyBlock"
        );
        emptyBlock.displayWidth = 40;
        emptyBlock.displayHeight = 40;
        emptyBlock.refreshBody();
      }
      break;
  }
}

// Helper function to create a mystery box with animations
function createMysteryBox(x, y, skillIndex) {
  const mysteryBox = this.skillItems
    .create(x, y, "misteryBlock")
    .setScale(1.5)
    .setData("skillIndex", skillIndex)
    .refreshBody();

  // Add glow effect to mystery box
  const glow = this.add
    .sprite(mysteryBox.x, mysteryBox.y, "misteryBlock")
    .setScale(1.7)
    .setAlpha(0.3)
    .setTint(0xffff44);

  // Animate the glow
  this.tweens.add({
    targets: glow,
    scale: { from: 1.7, to: 1.9 },
    alpha: { from: 0.3, to: 0.1 },
    yoyo: true,
    repeat: -1,
    duration: 1000,
    ease: "Sine.easeInOut",
  });

  // Bounce animation for the mystery box
  this.tweens.add({
    targets: mysteryBox,
    y: mysteryBox.y - 5,
    yoyo: true,
    repeat: -1,
    duration: 1200,
    ease: "Sine.easeInOut",
  });
}

// Update collectSkill function to work with mystery boxes
function collectSkill(player, mysteryBox) {
  // Store the box's position before disabling it
  const boxX = mysteryBox.x;
  const boxY = mysteryBox.y;

  // Get skill index from the box
  const skillIndex = mysteryBox.getData("skillIndex");

  // Only collect if it hasn't been collected already
  if (mysteryBox.alpha === 1) {
    // Disable the box physics body
    mysteryBox.disableBody(true, false);

    // Create a visual "bump" effect
    this.tweens.add({
      targets: mysteryBox,
      y: mysteryBox.y - 10,
      duration: 100,
      yoyo: true,
      onComplete: () => {
        // Change appearance to show it's been hit
        mysteryBox.setTexture("emptyBlock");
        mysteryBox.setAlpha(0.6);

        // Re-enable body but make it inactive
        mysteryBox.enableBody(false, 0, 0, true, true);
      },
    });

    // Show the skill icon appearing from the box
    const skill = skills[skillIndex];
    const skillIcon = this.add.text(boxX, boxY - 20, skill.icon, {
      fontSize: "24px",
    });

    // Animate the icon floating up
    this.tweens.add({
      targets: skillIcon,
      y: skillIcon.y - 40,
      alpha: { start: 1, to: 0 },
      duration: 1000,
      onComplete: () => skillIcon.destroy(),
    });

    // Update skill counter
    this.skillsCollected++;
    this.skillsCounter.setText(this.skillsCollected + "/" + skills.length);

    // Update the skill UI
    if (skillIndex >= 0 && skillIndex < this.skillBoxes.length) {
      this.skillBoxes[skillIndex].visible = true;
    }

    // Remove all glow effects at the same position
    this.children.list.forEach((child) => {
      if (
        child.type === "Sprite" &&
        Math.abs(child.x - boxX) < 5 &&
        Math.abs(child.y - boxY) < 5 &&
        child.alpha < 1
      ) {
        this.tweens.add({
          targets: child,
          alpha: 0,
          duration: 300,
          onComplete: function () {
            child.destroy();
          },
        });
      }
    });

    // Display the skill message
    showSpeechBubble.call(this, player, skill.message, 3000);

    // Check for tennis racket (last skill)
    if (skillIndex === 5) {
      this.hasTennisRacket = true;

      // Show shooting instruction if it's the tennis racket
      const shootingText = this.add
        .text(this.scale.width / 2, 60, "Press SPACE to shoot tennis balls!", {
          fontSize: "18px",
          fill: "#ffffff",
          stroke: "#000000",
          strokeThickness: 3,
        })
        .setOrigin(0.5, 0.5)
        .setScrollFactor(0);

      // Fade out instruction after delay
      this.tweens.add({
        targets: shootingText,
        alpha: { from: 1, to: 0 },
        delay: 5000,
        duration: 1000,
      });
    }

    // Check if all skills are collected
    if (this.skillsCollected >= skills.length) {
      // Show message about finding checkpoint
      const checkpointText = this.add
        .text(
          this.scale.width / 2,
          100,
          "All skills collected! Find the checkpoint →",
          {
            fontSize: "18px",
            fill: "#ffffff",
            stroke: "#000000",
            strokeThickness: 3,
          }
        )
        .setOrigin(0.5, 0.5)
        .setScrollFactor(0);

      // Fade out after a few seconds
      this.tweens.add({
        targets: checkpointText,
        alpha: { from: 1, to: 0 },
        delay: 5000,
        duration: 1000,
      });
    }
  }
}

// Create enemy characters
function createEnemies() {
  // Create patrolling goompa enemies with proper positioning
  const enemyPositions = [
    { x: 550, y: this.scale.height - 80, range: 150 },
    { x: 900, y: this.scale.height - 80, range: 200 },
    { x: 1500, y: this.scale.height - 80, range: 180 },
  ];

  for (const pos of enemyPositions) {
    // Use 'enemy' sprite instead of 'goompa' since that's what's properly loaded in preload
    const enemy = this.enemies
      .create(pos.x, pos.y, "enemy") // Change to 'enemy' instead of 'goompa'
      .setScale(0.1) // Adjust scale to match your sprite size
      .setCollideWorldBounds(true)
      .setBounce(1)
      .setData("startX", pos.x)
      .setData("range", pos.range)
      .setVelocityX(-60);

    // Set depth to ensure enemies are visible
    enemy.setDepth(10);

    // Move them up slightly to ensure they're on top of the ground
    enemy.y = this.scale.height - 85;

    // Make them more visible
    enemy.setTint(0xff8800); // Add orange tint to make them stand out

    // Add custom update function for patrolling behavior
    enemy.update = function () {
      const startX = this.getData("startX");
      const range = this.getData("range");

      // Change direction at range boundaries
      if (this.x < startX - range / 2 || this.x > startX + range / 2) {
        this.setVelocityX(-this.body.velocity.x);
        this.flipX = this.body.velocity.x < 0;
      }
    };

    // Add enemy to the update list
    this.updateList.push(enemy);

    // Log that enemies are being created (helps with debugging)
    console.log("Created enemy at", pos.x, pos.y);
  }
}

// Create the boss area with Johann
function createBossArea(bgRepeat) {
  // Boss area starts after the checkpoint
  const bossStartX = this.scale.width; // Position boss area at 2.5 screen widths from the left

  // Create a visually distinct ground for the boss area
  const bossGroundWidth = this.scale.width;
  const bossGround = this.platforms.create(
    bossStartX + bossGroundWidth / 2,
    this.scale.height - 40,
    null
  );
  bossGround.displayWidth = bossGroundWidth;
  bossGround.displayHeight = 40;
  bossGround.setTint(0x444444); // Dark gray color
  bossGround.refreshBody();

  // Create Johann boss (initially inactive)
  this.boss = this.bossGroup
    .create(
      bossStartX + bossGroundWidth - 100,
      this.scale.height - 40,
      "johann"
    )
    .setScale(0.6)
    .setActive(false)
    .setVisible(false);

  this.boss.health = 3;
  this.boss.direction = 1; // 1 = right, -1 = left
  this.boss.lastShotTime = 0;
  this.boss.active = false;

  // Boss behavior update function
  this.boss.update = function (time) {
    if (!this.active) return;

    // Move back and forth
    this.x += this.direction * 2;

    // Change direction at boundaries
    if (
      this.x < bossStartX + 100 ||
      this.x > bossStartX + bossGroundWidth - 100
    ) {
      this.direction *= -1;
      this.flipX = this.direction < 0;
    }

    // Shoot tennis balls occasionally
    if (time > this.lastShotTime + 2000) {
      // Every 2 seconds
      // Create boss tennis ball
      const ball = this.scene.bossBalls
        .create(this.x, this.y, "tennisBall")
        .setScale(0.4);

      // Aim toward player
      const dx = this.scene.player.x - this.x;
      const dy = this.scene.player.y - this.y;
      const angle = Math.atan2(dy, dx);
      const speed = 200;

      ball.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

      this.lastShotTime = time;
    }
  };
}

// Setup collision handlers
function setupColliders() {
  // Basic platform collisions
  this.physics.add.collider(this.player, this.platforms);
  this.physics.add.collider(this.enemies, this.platforms);

  // Skill item collection
  this.physics.add.overlap(
    this.player,
    this.skillItems,
    collectSkill,
    null,
    this
  );

  // Enemy interactions
  this.physics.add.overlap(this.player, this.enemies, hitEnemy, null, this);

  // Tennis ball collisions
  this.physics.add.collider(
    this.tennisBalls,
    this.platforms,
    destroyTennisBall,
    null,
    this
  );
  this.physics.add.overlap(
    this.tennisBalls,
    this.enemies,
    hitEnemyWithBall,
    null,
    this
  );
  this.physics.add.overlap(
    this.tennisBalls,
    this.bossGroup,
    hitBoss,
    null,
    this
  );

  // Boss ball collisions
  this.physics.add.collider(
    this.bossBalls,
    this.platforms,
    destroyTennisBall,
    null,
    this
  );
  this.physics.add.overlap(
    this.bossBalls,
    this.player,
    hitByBossBall,
    null,
    this
  );

  // Checkpoint detection
  this.physics.add.overlap(
    this.player,
    this.checkpoints,
    reachCheckpoint,
    null,
    this
  );

  // Boss area detection
  this.bossAreaTrigger = this.add.zone(2000, this.scale.height - 100, 50, 200);
  this.physics.world.enable(this.bossAreaTrigger);
  this.physics.add.overlap(
    this.player,
    this.bossAreaTrigger,
    triggerBossFight,
    null,
    this
  );
}

// Setup camera to follow player
function setupCamera(bgRepeat) {
  this.cameras.main.setBounds(
    0,
    0,
    bgRepeat * this.scale.width,
    this.scale.height
  );
  this.cameras.main.startFollow(this.player);
}

// Setup controls for shooting tennis balls
function setupShootingControls() {
  this.shootKey = this.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.SPACE
  );
  this.lastShotTime = 0;
}

// Update function to be called from the main update loop
function updateLevel1(time, delta) {
  // Safety check with complete error handling
  if (!this.updateList) {
    console.warn("updateList was undefined - initializing empty array");
    this.updateList = [];
    return;
  }

  try {
    // Use a safer forEach approach instead of for...of
    this.updateList.forEach((entity) => {
      if (entity && entity.active) {
        entity.update(time, delta);
      }
    });
  } catch (error) {
    console.error("Error updating entities:", error);
    // Re-initialize the list if we hit an error
    this.updateList = [];
  }

  // Update boss with safety check
  if (this.boss && this.boss.active) {
    try {
      this.boss.update(time);
    } catch (error) {
      console.error("Error updating boss:", error);
    }
  }

  // Handle shooting with safety checks
  if (
    this.hasTennisRacket &&
    this.shootKey &&
    this.shootKey.isDown &&
    time > this.lastShotTime + 1000
  ) {
    try {
      shootTennisBall.call(this);
      this.lastShotTime = time;
    } catch (error) {
      console.error("Error while shooting:", error);
    }
  }
}
