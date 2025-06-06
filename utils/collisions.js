// Collision utilities

// Coin collection handler
function collectCoin(player, coin) {
  // Store position before disabling
  const coinX = coin.x;
  const coinY = coin.y;

  // Disable the coin
  coin.disableBody(true, true);

  // Find and remove glow effects
  this.children.list.forEach((child) => {
    if (
      child.type === "Sprite" &&
      Math.abs(child.x - coinX) < 5 &&
      Math.abs(child.y - coinY) < 5 &&
      child.alpha < 1
    ) {
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

  // Create particle effect
  createCoinParticles.call(this, coinX, coinY);

  // Update counters
  this.coinCount += 1;
  this.skillsCounter.setText("Skills: " + this.coinCount + "/7");
  this.smallCounter.setText("Skills: " + this.coinCount + "/7");

  // Reveal skill text
  if (this.coinCount > 0 && this.coinCount <= 7) {
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

  // Check for level completion
  if (this.coinCount == 7) {
    this.time.delayedCall(500, () => {
      this.physics.pause();
      gameWin.call(this);
    });
  }
}

// Create particle effect for coin collection
function createCoinParticles(x, y) {
  const particles = this.add.particles(x, y, "coin", {
    speed: { min: 50, max: 100 },
    scale: { start: 0.05, end: 0.01 },
    lifespan: 500,
    quantity: 10,
    blendMode: "ADD",
    emitting: false,
  });

  // Emit once
  particles.emitParticleAt(x, y, 10);

  // Clean up
  this.time.delayedCall(500, () => {
    particles.destroy();
  });
}

// Enemy collision handler
function hitEnemy(player, enemy) {
  // Player is jumping on the enemy
  if (player.body.touching.down && enemy.body.touching.up) {
    // Create squash effect
    const squash = this.add
      .sprite(enemy.x, enemy.y, "enemySquash")
      .setScale(0.5);

    this.tweens.add({
      targets: squash,
      alpha: { from: 1, to: 0 },
      scale: { from: 0.5, to: 0.7 },
      duration: 300,
      onComplete: () => squash.destroy(),
    });

    // Bounce the player
    player.setVelocityY(-250);

    // Remove the enemy
    enemy.destroy();

    // Remove from update list
    const index = this.updateList.indexOf(enemy);
    if (index !== -1) {
      this.updateList.splice(index, 1);
    }

    // Play squash sound
    if (this.sound.get("squashSound")) {
      this.sound.play("squashSound");
    }
  } else {
    // Player is hit from the side or below
    playerDeath.call(this, "Ouch! Watch out for enemies!");
  }
}

// Kebab collection handler
function eatKebab(player, kebab) {
  kebab.disableBody(true, true);
  this.kebabCount += 1;

  // After collecting 3 kebabs, player becomes big
  if (this.kebabCount == 3) {
    playerState = "big";
    player.setScale(5);
  }
}

// Fall down handler
function fallDown(player, sky) {
  this.physics.pause();
  player.setTint(0xff0000);

  this.add
    .text(
      this.scale.width / 2,
      this.scale.height / 2 - 100,
      "Game Over\nWhen reaching for the clouds, remember to stay focused and give it your best!",
      {
        fontSize: "16px",
        fill: "#ff0000",
      }
    )
    .setScrollFactor(0)
    .setAlign("center")
    .setOrigin(0.5, 0);

  // Restart after delay
  this.time.delayedCall(5000, () => {
    this.scene.restart();
  });
}

// Collision handling functions for Super Denis game

// Collect a skill item
function collectSkill(player, skillItem) {
  // Get the skill index
  const skillIndex = skillItem.getData("skillIndex");
  const skill = skills[skillIndex];

  // Show the message
  showSpeechBubble.call(this, player, skill.message, 2000);

  // Update UI
  this.skillsCollected++;
  this.skillsCounter.setText(`${this.skillsCollected}/6`);
  this.skillBoxes[skillIndex].visible = true;

  // Special handling for tennis racket
  if (skillIndex === 5) {
    // Tennis racket is the last skill
    this.hasTennisRacket = true;
  }

  // Create a particle effect
  createSkillCollectionEffect.call(this, skillItem.x, skillItem.y, skillIndex);

  // Remove the skill item
  skillItem.disableBody(true, true);

  // Check if all skills collected
  if (this.skillsCollected === 6) {
    const completionText = this.add
      .text(
        this.scale.width / 2,
        100,
        "All skills collected! Proceed to the checkpoint!",
        {
          fontSize: "20px",
          fill: "#ffffff",
          stroke: "#000000",
          strokeThickness: 4,
        }
      )
      .setScrollFactor(0)
      .setOrigin(0.5, 0.5);

    // Fade out after a few seconds
    this.tweens.add({
      targets: completionText,
      alpha: { from: 1, to: 0 },
      delay: 4000,
      duration: 1000,
    });
  }
}

// Hit an enemy with a tennis ball
function hitEnemyWithBall(ball, enemy) {
  // Create explosion effect
  createExplosion.call(this, enemy.x, enemy.y);

  // Remove the enemy
  enemy.destroy();

  // Remove the ball
  ball.destroy();

  // Remove from update list
  const index = this.updateList.indexOf(enemy);
  if (index !== -1) {
    this.updateList.splice(index, 1);
  }
}

// Hit boss with tennis ball
function hitBoss(ball, boss) {
  // Only if boss is active
  if (!boss.active) return;

  // Create hit effect
  createExplosion.call(this, ball.x, ball.y);

  // Remove the ball
  ball.destroy();

  // Reduce boss health
  boss.health--;

  // Flash the boss
  this.tweens.add({
    targets: boss,
    alpha: { from: 0.3, to: 1 },
    duration: 200,
  });

  // Check if boss is defeated
  if (boss.health <= 0) {
    bossDeath.call(this);
  }
}

// Player is hit by boss's tennis ball
function hitByBossBall(player, ball) {
  // Remove the ball
  ball.destroy();

  // Kill the player
  playerDeath.call(this, "Ouch! Watch out for Johann's tennis balls!");
}

// Destroy tennis ball when hitting platforms
function destroyTennisBall(ball, platform) {
  ball.destroy();
}

// Player reaches checkpoint
function reachCheckpoint(player, checkpoint) {
  // Only trigger once
  if (this.hasReachedCheckpoint) return;

  this.hasReachedCheckpoint = true;
  this.checkpoint = { x: checkpoint.x, y: checkpoint.y - 50 };

  // Visual feedback
  checkpoint.setTint(0x00ff00);

  // Show message
  showSpeechBubble.call(this, player, "Checkpoint reached!", 2000);

  // Add a checkpoint indicator
  const checkpointText = this.add
    .text(this.scale.width / 2, 100, "Checkpoint Reached! Boss fight ahead!", {
      fontSize: "20px",
      fill: "#ffffff",
      stroke: "#000000",
      strokeThickness: 4,
    })
    .setScrollFactor(0)
    .setOrigin(0.5, 0.5);

  // Fade out after a few seconds
  this.tweens.add({
    targets: checkpointText,
    alpha: { from: 1, to: 0 },
    delay: 3000,
    duration: 1000,
  });
}

// Trigger boss fight when player enters boss area
function triggerBossFight(player, trigger) {
  // Only trigger once
  if (this.boss.active) return;

  // Disable the trigger zone
  trigger.destroy();

  // Activate the boss
  this.boss.setActive(true).setVisible(true);
  this.boss.active = true;

  // Show boss intro dialogue
  const bossDialogOptions = [
    "Well, Denis, let's see who's serving aces today. Show me what you've got!",
    "Denis! Thought you'd never show up. Ready to see who's serving aces today?",
    "Let's see if your skills are really that impressive!",
  ];

  // Select a random dialogue
  const randomDialog =
    bossDialogOptions[Math.floor(Math.random() * bossDialogOptions.length)];

  // Show the dialogue
  showBossDialogue.call(this, randomDialog);
}

// Player death handler
function playerDeath(message = "Game Over!") {
  // Pause physics
  this.physics.pause();

  // Tint the player red
  this.player.setTint(0xff0000);

  // Show death message
  const deathText = this.add
    .text(this.scale.width / 2, this.scale.height / 2 - 50, message, {
      fontSize: "24px",
      fill: "#ff0000",
      stroke: "#000000",
      strokeThickness: 4,
      align: "center",
    })
    .setScrollFactor(0)
    .setOrigin(0.5, 0.5);

  // Show respawn message
  let respawnMessage = "Restarting level...";
  if (this.hasReachedCheckpoint) {
    respawnMessage = "Respawning at checkpoint...";
  }

  const respawnText = this.add
    .text(this.scale.width / 2, this.scale.height / 2, respawnMessage, {
      fontSize: "18px",
      fill: "#ffffff",
      stroke: "#000000",
      strokeThickness: 3,
      align: "center",
    })
    .setScrollFactor(0)
    .setOrigin(0.5, 0.5);

  // Respawn after delay
  this.time.delayedCall(3000, () => {
    if (this.hasReachedCheckpoint) {
      // Respawn at checkpoint
      respawnAtCheckpoint.call(this);
    } else {
      // Restart level
      this.scene.restart();
    }
  });
}

// Respawn at checkpoint
function respawnAtCheckpoint() {
  // Reset player
  this.player.clearTint();
  this.player.setPosition(this.checkpoint.x, this.checkpoint.y);

  // Resume physics
  this.physics.resume();

  // Make sure tennis racket ability is still enabled
  this.hasTennisRacket = true;
}

// Boss death handler
function bossDeath() {
  // Pause boss movement
  this.boss.active = false;

  // Create explosion effect
  createExplosion.call(this, this.boss.x, this.boss.y, 2);

  // Show victory message
  const victoryOptions = [
    "That's how it's done! But this was just the warm-up!",
    "That was just the beginning—ready for what's next!",
  ];

  // Select a random victory message
  const victoryMessage =
    victoryOptions[Math.floor(Math.random() * victoryOptions.length)];

  // Show player victory dialogue
  showSpeechBubble.call(this, this.player, victoryMessage, 3000);

  // Show level completion message
  const completionText = this.add
    .text(
      this.scale.width / 2,
      this.scale.height / 2 - 50,
      "Level 1 Completed!",
      {
        fontSize: "32px",
        fill: "#00ff00",
        stroke: "#000000",
        strokeThickness: 5,
        align: "center",
      }
    )
    .setScrollFactor(0)
    .setOrigin(0.5, 0.5);

  // Add subtitle
  const subtitleText = this.add
    .text(
      this.scale.width / 2,
      this.scale.height / 2,
      "Moving to Level 2 where you will learn\nabout my professional experience",
      {
        fontSize: "18px",
        fill: "#ffffff",
        stroke: "#000000",
        strokeThickness: 3,
        align: "center",
      }
    )
    .setScrollFactor(0)
    .setOrigin(0.5, 0.5);

  // Proceed to next level after delay
  this.time.delayedCall(5000, () => {
    window.location.href = "video1.html";
  });
}
