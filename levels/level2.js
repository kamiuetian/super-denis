// Level 2: "404: Skill Gap Not Found" - Professional skills in the cloud

// Make these available to other files
export const professionalSkills = [
  {
    name: "Public Speaking",
    icon: "🎤",
    message: "Voice amplified! Commanding attention now!",
  },
  {
    name: "Digital Consultancy",
    icon: "🔄",
    message: "Digital transformation activated!",
  },
  {
    name: "AI Business Implementation",
    icon: "🤖",
    message: "AI systems integrated! Future-proofing complete!",
  },
  {
    name: "Team Collaboration",
    icon: "👥",
    message: "Teamwork enhanced! We're unstoppable together!",
  },
  {
    name: "Strategic Thinking",
    icon: "♟️",
    message: "Strategy unlocked! Five moves ahead!",
  },
  {
    name: "Cloud & Security Expertise",
    icon: "☁️🔐",
    message: "Cloud security fortified! Data is safe!",
  },
  {
    name: "Finance",
    icon: "💸",
    message: "Financial acumen gained! Budgets optimized!",
  },
  {
    name: "Fast Learner",
    icon: "⚡",
    message: "Learning speed doubled! Knowledge expanding!",
  },
  {
    name: "Initiative taker",
    icon: "🚀",
    message: "Initiative engaged! Leading the charge!",
  },
  {
    name: "IT Project Coordinator",
    icon: "🗃️",
    message: "Projects aligned! Deadlines will be met!",
  },
  {
    name: "ICT Infrastructure",
    icon: "🖧",
    message: "Infrastructure secured! Systems running smoothly!",
  },
];

// Game state for Level 2
let professionalSkillsCollected = 0;
let cloudsTouched = [];

// Make the function available globally
export const createLevel2 = function (bgRepeat) {
  alert();
  // Function implementation stays the same
  // 1. Setup groups and physics
  this.platforms = this.physics.add.staticGroup();
  this.clouds = this.physics.add.staticGroup();
  this.skills = this.physics.add.group();
  this.endOfSky = this.physics.add.staticGroup();
  this.skillsRevealed = 0;

  // 2. Set world bounds and scrollable area
  const levelWidth = this.scale.width * bgRepeat;
  const levelHeight = this.scale.height;
  this.physics.world.setBounds(0, 0, levelWidth, levelHeight);

  // 3. Set up camera to follow player
  this.cameras.main.setBounds(0, 0, levelWidth, levelHeight);
  this.cameras.main.startFollow(this.player);

  // 4. Create skills UI
  createSkillsUI.call(this);

  // 5. Create cloud platforms
  createCloudPlatforms.call(this);

  // 6. Setup collisions
  setupCollisions.call(this);

  // 7. Add instruction text
  createInstructionText.call(this);

  // 8. Create end-level marker
  createLevelEnd.call(this, levelWidth);

  // 9. Additional sky decoration
  addSkyDecoration.call(this, levelWidth);

  // Debug info - show world bounds
  if (this.physics.config.debug) {
    const debugGraphics = this.add.graphics();
    debugGraphics.lineStyle(2, 0xff0000, 1);
    debugGraphics.strokeRect(0, 0, levelWidth, levelHeight);
  }
};

// Add other functions as needed
window.createSkillsUI = function () {
  // Create panel for skills
  this.skillsPanel = this.add.graphics();
  this.skillsPanel.fillStyle(0x000000, 0.7);
  this.skillsPanel.fillRect(10, 10, 200, 40);
  this.skillsPanel.lineStyle(2, 0xffffff, 1);
  this.skillsPanel.strokeRect(10, 10, 200, 40);
  this.skillsPanel.setScrollFactor(0);

  // Add text to show skills count
  this.skillsCounter = this.add
    .text(20, 20, "Professional Skills: 0/" + professionalSkills.length, {
      fontSize: "16px",
      fill: "#ffffff",
    })
    .setScrollFactor(0);

  // Add collapsible skills list (initially collapsed)
  this.skillsList = this.add.container(10, 50);
  this.skillsList.setScrollFactor(0);

  // Background for expanded skills list
  const expandedPanel = this.add.graphics();
  expandedPanel.fillStyle(0x000000, 0.7);
  expandedPanel.fillRect(0, 0, 200, professionalSkills.length * 25 + 10);
  expandedPanel.lineStyle(2, 0xffffff, 1);
  expandedPanel.strokeRect(0, 0, 200, professionalSkills.length * 25 + 10);
  this.skillsList.add(expandedPanel);

  // Add skill rows (initially invisible)
  this.skillTexts = [];
  for (let i = 0; i < professionalSkills.length; i++) {
    const skillText = this.add.text(10, i * 25 + 10, "❓ ???", {
      fontSize: "14px",
      fill: "#aaaaaa",
    });
    this.skillsList.add(skillText);
    this.skillTexts.push(skillText);
  }

  // Collapse skills list by default
  this.skillsList.setVisible(false);

  // Toggle skills list when clicking on the counter
  this.skillsPanel.setInteractive(
    new Phaser.Geom.Rectangle(10, 10, 200, 40),
    Phaser.Geom.Rectangle.Contains
  );

  this.skillsPanel.on("pointerdown", () => {
    this.skillsList.setVisible(!this.skillsList.visible);
  });
};

// Create cloud platforms
function createCloudPlatforms() {
  // Define screen layout proportions
  const screenWidth = this.scale.width;
  const screenHeight = this.scale.height;
  const levelWidth = this.physics.world.bounds.width;

  // Create array of indices and shuffle for random skill order
  const skillIndices = Array.from(
    { length: professionalSkills.length },
    (_, i) => i
  );
  Phaser.Math.RND.shuffle(skillIndices);

  // Calculate platform distribution
  const cloudsCount = professionalSkills.length + 3; // Add extra non-skill clouds
  const segmentWidth = levelWidth / (cloudsCount * 1.2); // Leave some space at edges

  // Track cloud positions to ensure jumps are possible
  let prevX = 150;
  let prevY = screenHeight * 0.7;
  const jumpHeight = 150; // Estimated max jump height

  // Create clouds - inspired by structures.js patterns but with clouds
  for (let i = 0; i < cloudsCount; i++) {
    // Calculate position with some variation, ensuring it's reachable
    const x =
      prevX + Phaser.Math.Between(segmentWidth * 0.8, segmentWidth * 1.2);

    // Y position varies but ensures jump is possible
    let y;
    if (i % 3 === 0) {
      // Lower cloud - easier to jump to
      y = Phaser.Math.Between(prevY - jumpHeight * 0.6, prevY + 30);
    } else if (i % 3 === 1) {
      // Higher cloud - challenging jump
      y = Phaser.Math.Between(
        prevY - jumpHeight * 0.9,
        prevY - jumpHeight * 0.5
      );
    } else {
      // Mid-level cloud
      y = Phaser.Math.Between(
        prevY - jumpHeight * 0.7,
        prevY - jumpHeight * 0.3
      );
    }

    // Ensure cloud is not too high or too low
    y = Phaser.Math.Clamp(y, screenHeight * 0.2, screenHeight * 0.8);

    // Create cloud platform
    const isSkillCloud = i < professionalSkills.length;
    const skillIndex = isSkillCloud ? skillIndices[i] : -1;

    // Create cloud with appropriate scale
    const cloud = this.clouds
      .create(x, y, "cloud")
      .setScale(0.3)
      .setData("skillIndex", skillIndex)
      .setData("revealed", false);

    // Adjust cloud physics body
    cloud.body.setSize(cloud.width * 0.8, cloud.height * 0.5);
    cloud.body.setOffset(cloud.width * 0.1, cloud.height * 0.4);

    // Add animation to cloud
    this.tweens.add({
      targets: cloud,
      y: y - 5,
      duration: 2000 + i * 200, // Different timing per cloud
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // For skill clouds, add subtle glow
    if (isSkillCloud) {
      const glow = this.add
        .sprite(x, y, "cloud")
        .setScale(0.35)
        .setAlpha(0.3)
        .setTint(0xffffff);

      this.tweens.add({
        targets: glow,
        scale: 0.4,
        alpha: 0.1,
        duration: 1500,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });

      // Link glow to cloud for later removal
      cloud.setData("glow", glow);
    }

    // Update previous position for next cloud
    prevX = x;
    prevY = y;
  }
}

// Create clouds collision handlers
export function setupCollisions() {
  // Add collision with clouds - only from above (custom handler)
  this.physics.add.collider(this.player, this.clouds, (player, cloud) => {
    // Only trigger if player is landing on top of cloud
    if (player.body.velocity.y > 0 && player.y < cloud.y - cloud.height * 0.3) {
      revealSkill.call(this, player, cloud);
    }
  });

  // Add collision with end of level
  this.physics.add.overlap(this.player, this.endOfSky, fallDown, null, this);
}

// Handle revealing skills when landing on clouds
export function revealSkill(player, cloud) {
  // Get skill index
  const skillIndex = cloud.getData("skillIndex");

  // Skip if no skill or already revealed
  if (skillIndex === -1 || cloud.getData("revealed")) return;

  // Mark as revealed
  cloud.setData("revealed", true);

  // Update counters
  this.skillsRevealed++;
  this.skillsCounter.setText(
    `Professional Skills: ${this.skillsRevealed}/${professionalSkills.length}`
  );

  // Update skills list
  if (skillIndex >= 0 && skillIndex < this.skillTexts.length) {
    const skill = professionalSkills[skillIndex];
    this.skillTexts[skillIndex].setText(`${skill.icon} ${skill.name}`);
    this.skillTexts[skillIndex].setFill("#ffffff");
  }

  // Make cloud semi-transparent and reveal skill
  this.tweens.add({
    targets: cloud,
    alpha: 0.7,
    scale: 0.25,
    duration: 500,
    ease: "Power2",
  });

  // Remove glow
  const glow = cloud.getData("glow");
  if (glow) {
    this.tweens.add({
      targets: glow,
      alpha: 0,
      duration: 300,
      onComplete: () => glow.destroy(),
    });
  }

  // Create skill text that rises from cloud
  const skill = professionalSkills[skillIndex];

  // Reveal skill icon and label
  const skillContainer = this.add.container(cloud.x, cloud.y - 20);

  // Icon
  const skillIcon = this.add
    .text(0, 0, skill.icon, {
      fontSize: "32px",
    })
    .setOrigin(0.5);

  // Text
  const skillName = this.add
    .text(0, 30, skill.name, {
      fontSize: "16px",
      fontStyle: "bold",
      fill: "#fff",
      stroke: "#000",
      strokeThickness: 3,
      align: "center",
    })
    .setOrigin(0.5);

  // Add to container and animate
  skillContainer.add([skillIcon, skillName]);

  // Animate skill icon bouncing up
  this.tweens.add({
    targets: skillIcon,
    y: -20,
    duration: 800,
    ease: "Bounce",
  });

  // Animate skill text fading in
  this.tweens.add({
    targets: skillName,
    alpha: { from: 0, to: 1 },
    duration: 500,
  });

  // Show message
  showSpeechBubble.call(this, player, skill.message, 3000);

  // Fade out and destroy after delay
  this.time.delayedCall(3000, () => {
    this.tweens.add({
      targets: skillContainer,
      y: "-=50",
      alpha: 0,
      duration: 800,
      onComplete: () => skillContainer.destroy(),
    });
  });

  // Check if all skills collected
  if (this.skillsRevealed >= professionalSkills.length) {
    // Show completion message
    const completionMessage = this.add
      .text(
        this.scale.width / 2,
        100,
        "All professional skills collected!\nHead to the right to finish the level!",
        {
          fontSize: "20px",
          fill: "#ffffff",
          stroke: "#000000",
          strokeThickness: 4,
          align: "center",
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0);

    // Fade out after delay
    this.time.delayedCall(5000, () => {
      this.tweens.add({
        targets: completionMessage,
        alpha: 0,
        duration: 1000,
      });
    });

    // Activate end flag
    this.levelEndFlag.setVisible(true);
    this.tweens.add({
      targets: this.levelEndFlag,
      alpha: { from: 0, to: 1 },
      duration: 1000,
    });
  }
}

// Create end of level marker
export function createLevelEnd(levelWidth) {
  // Create flag at end of level
  this.levelEndFlag = this.physics.add
    .sprite(levelWidth - 200, this.scale.height - 100, "checkpoint")
    .setScale(0.5)
    .setVisible(false);

  // Add physics interaction
  this.physics.add.overlap(
    this.player,
    this.levelEndFlag,
    finishLevel2,
    null,
    this
  );

  // Add flag animation
  this.tweens.add({
    targets: this.levelEndFlag,
    angle: { from: -5, to: 5 },
    duration: 1000,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut",
  });
}

// Add sky decoration - distant clouds
export function addSkyDecoration(levelWidth) {
  // Add some background clouds for decoration
  for (let i = 0; i < 20; i++) {
    const x = Phaser.Math.Between(0, levelWidth);
    const y = Phaser.Math.Between(50, this.scale.height * 0.5);
    const scale = Phaser.Math.FloatBetween(0.1, 0.2);

    const bgCloud = this.add
      .image(x, y, "cloud")
      .setScale(scale)
      .setAlpha(0.3)
      .setDepth(-1);

    // Slow drift animation
    this.tweens.add({
      targets: bgCloud,
      x: bgCloud.x + Phaser.Math.Between(-100, 100),
      duration: Phaser.Math.Between(20000, 40000),
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }
}

// Create instruction text
export function createInstructionText() {
  const text = this.add
    .text(
      this.scale.width / 2,
      80,
      "Jump on clouds to reveal your professional skills!",
      {
        fontSize: "20px",
        fill: "#ffffff",
        stroke: "#000000",
        strokeThickness: 3,
      }
    )
    .setOrigin(0.5)
    .setScrollFactor(0);

  // Fade out after delay
  this.time.delayedCall(5000, () => {
    this.tweens.add({
      targets: text,
      alpha: 0,
      duration: 1000,
    });
  });
}
