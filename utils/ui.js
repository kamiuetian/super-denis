// UI-related utilities

// Game win handler
function gameWin() {
  // Victory dialog
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

  // Title text
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

  // Congratulations text
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

  // Next level info
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

  // Progress indicator
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

  // Continue to video
  this.time.delayedCall(5000, () => {
    window.location.href = "video1.html";
  });
}

// Manager dialog handler
function talkToTheManager(player, manager) {
  if (this.endOfGame) return;

  this.endOfGame = true;
  this.player.setVelocityX(0);
  this.player.anims.play("stand");
  manager.body.setSize(1, 1);

  const texts = [
    "Congratulations!\n you've reached the Commerzbank tower",
    "You are hired!",
  ];

  this.currentDialogIndex = 0;

  // Create dialog box
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

  // Set up dialog timer
  this.dialogTimer = this.time.addEvent({
    delay: 5000,
    callback: showNextDialog,
    callbackScope: this,
    loop: true,
    args: [texts, manager],
  });
}

// Show next dialog in sequence
function showNextDialog(texts, manager) {
  this.currentDialogIndex++;

  if (this.currentDialogIndex >= texts.length) {
    this.dialogText.setText("Please come on in!");
    manager.disableBody(true, false);

    // Stop the timer
    this.dialogTimer.remove();

    // Redirect after delay
    this.time.delayedCall(5000, () => {
      window.location.href = "video3.html";
    });
    return;
  }

  // Update text
  this.dialogText.setText(texts[this.currentDialogIndex]);
}

// UI-related functions for Super Denis game

// Show a speech bubble above a character
function showSpeechBubble(character, text, duration = Infinity) {
  // Create speech bubble container
  console.log("FUNCTION CALLED: showSpeechBubble #1");
  console.log("Parameters:", { target, text, duration });
  console.log("Call stack:", new Error().stack);

  duration = Infinity;
  console.log("Creating speech bubble for text:", text);
  const bubbleContainer = this.add.container(0, 0);
  bubbleContainer.setDepth(1000); // Ensure it's on top

  const bubblePadding = 10;
  const bubbleWidth = Math.min(text.length * 7 + bubblePadding * 2, 200);
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

  // Position bubble above character
  bubbleContainer.x = character.x - bubbleWidth / 2;
  bubbleContainer.y = character.y - bubbleHeight - 50;

  // Make bubble follow character
  const updateBubblePosition = () => {
    if (character.active) {
      bubbleContainer.x = character.x - bubbleWidth / 2;
      bubbleContainer.y = character.y - bubbleHeight - 50;
    }
  };

  // Add update function to scene
  const updateKey = this.events.on("update", updateBubblePosition);

  // Remove bubble after duration
  this.time.delayedCall(duration, () => {
    this.events.off("update", updateBubblePosition, null, false);

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

// Show boss dialogue
function showBossDialogue(text) {
  // Create a dialogue box for the boss
  const dialogueBox = this.add.graphics();
  dialogueBox.fillStyle(0x000000, 0.8);
  dialogueBox.fillRect(
    this.scale.width / 2 - 250,
    this.scale.height / 2 - 100,
    500,
    100
  );
  dialogueBox.lineStyle(3, 0xff0000, 1);
  dialogueBox.strokeRect(
    this.scale.width / 2 - 250,
    this.scale.height / 2 - 100,
    500,
    100
  );
  dialogueBox.setScrollFactor(0);

  // Add boss name
  const bossName = this.add
    .text(this.scale.width / 2 - 230, this.scale.height / 2 - 90, "JOHANN:", {
      fontSize: "18px",
      fontFamily: "Arial",
      color: "#FF0000",
      fontStyle: "bold",
    })
    .setScrollFactor(0);

  // Add boss dialogue text
  const dialogueText = this.add
    .text(this.scale.width / 2, this.scale.height / 2 - 50, text, {
      fontSize: "16px",
      fontFamily: "Arial",
      color: "#FFFFFF",
      align: "center",
      wordWrap: { width: 450 },
    })
    .setScrollFactor(0)
    .setOrigin(0.5, 0.5);

  // Add player response
  this.time.delayedCall(2000, () => {
    const playerResponse = this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 + 20,
        "Challenge accepted!",
        {
          fontSize: "16px",
          fontFamily: "Arial",
          color: "#00FF00",
          align: "center",
        }
      )
      .setScrollFactor(0)
      .setOrigin(0.5, 0.5);

    // Remove dialogue after delay
    this.time.delayedCall(2000, () => {
      this.tweens.add({
        targets: [dialogueBox, bossName, dialogueText, playerResponse],
        alpha: 0,
        duration: 500,
        onComplete: () => {
          dialogueBox.destroy();
          bossName.destroy();
          dialogueText.destroy();
          playerResponse.destroy();
        },
      });
    });
  });
}

// Create particle effect for skill collection
function createSkillCollectionEffect(x, y, skillIndex) {
  // Create a particle emitter
  const particles = this.add.particles(x, y, "sparkle", {
    speed: { min: 50, max: 150 },
    scale: { start: 0.6, end: 0 },
    lifespan: 800,
    blendMode: "ADD",
    emitting: false,
  });

  // Emit particles once
  particles.emitParticleAt(x, y, 20);

  // Create skill icon effect
  const icon = skills[skillIndex].icon;
  const iconText = this.add.text(x, y, icon, { fontSize: "32px" });
  iconText.setOrigin(0.5, 0.5);

  // Animate the icon
  this.tweens.add({
    targets: iconText,
    y: y - 100,
    alpha: { from: 1, to: 0 },
    duration: 1000,
    ease: "Cubic.easeOut",
    onComplete: () => iconText.destroy(),
  });

  // Destroy particles after animation completes
  this.time.delayedCall(1000, () => {
    particles.destroy();
  });
}

// Create explosion effect
function createExplosion(x, y, scale = 1) {
  // Create explosion sprite
  const explosion = this.add.sprite(x, y, "explosion");
  explosion.setScale(scale);

  // Play explosion animation
  explosion.anims.play("explode");

  // Remove after animation completes
  explosion.on("animationcomplete", () => {
    explosion.destroy();
  });
}

// Function to shoot a tennis ball with improved physics
function shootTennisBall() {
  // Create tennis ball at player position
  const ball = this.tennisBalls.create(
    this.player.x,
    this.player.y - 20,
    "tennis" // Changed from "tennisBall" to use the tennis.jpeg image
  );

  ball.setScale(0.25); // Adjusted scale to match tennis ball size

  // Enable physics and set bounce properties
  ball.setBounce(0.7); // High bounce factor
  ball.setCollideWorldBounds(false); // Allow going off-screen
  ball.setFriction(0.3); // Add some friction for realistic bouncing

  // Set velocity based on player direction with random variation
  const baseSpeed = Phaser.Math.Between(350, 450); // Random base speed
  const direction = this.player.flipX ? -1 : 1;

  // Create a more varied angle of projection
  const angleVariation = Phaser.Math.Between(-15, 15); // -15 to 15 degrees variation
  const angle = direction < 0 ? 180 + angleVariation : angleVariation;

  // Convert angle to radians and calculate velocity components
  const radians = Phaser.Math.DegToRad(angle);
  const xVelocity = Math.cos(radians) * baseSpeed;
  const yVelocity = Math.sin(radians) * baseSpeed;

  ball.setVelocity(xVelocity, yVelocity);

  // Add gravity for a nice arc
  ball.setGravityY(300);

  // Add rotation to the ball for visual effect
  ball.setAngularVelocity(direction * 300);

  // Add a green tennis ball trail effect
  const trail = this.add.particles(ball.x, ball.y, "sparkle", {
    follow: ball,
    scale: { start: 0.2, end: 0 },
    alpha: { start: 0.5, end: 0 },
    speed: 20,
    lifespan: 300,
    frequency: 60,
    blendMode: "ADD",
    tint: 0x99ff00, // Added green tint for tennis ball trail
  });

  // Play sound effect
  if (this.sound.get("shootSound")) {
    this.sound.play("shootSound");
  }

  // Create a collision handler for bouncing off platforms
  this.physics.add.collider(ball, this.platforms, (ball, platform) => {
    // Play bounce sound
    if (this.sound.get("hitSound")) {
      this.sound.play("hitSound", { volume: 0.3 });
    }

    // Add bounce particles
    const particles = this.add.particles(ball.x, ball.y, "sparkle", {
      speed: { min: 30, max: 100 },
      scale: { start: 0.2, end: 0 },
      quantity: 5,
      lifespan: 300,
      emitting: false,
    });

    particles.emitParticleAt(ball.x, ball.y);

    // Destroy particles after animation completes
    this.time.delayedCall(300, () => {
      particles.destroy();
    });
  });

  // Check if ball is off screen
  const checkOffScreen = () => {
    const isOffLeft = ball.x < -50;
    const isOffRight = ball.x > this.cameras.main.getBounds().right + 50;
    const isOffTop = ball.y < -50;
    const isOffBottom = ball.y > this.cameras.main.getBounds().bottom + 50;

    if (isOffLeft || isOffRight || isOffTop || isOffBottom) {
      trail.destroy();
      ball.destroy();
    } else if (ball.active) {
      // Continue checking if ball is still active
      this.time.delayedCall(200, checkOffScreen);
    }
  };

  // Start checking if ball goes off screen
  this.time.delayedCall(200, checkOffScreen);
}
