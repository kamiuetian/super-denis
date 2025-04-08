class PlayerController {
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;
    this.cursors = scene.cursors;
    this.moveSpeed = 250;
    this.jumpForce = -250;
  }

  update(time, delta) {
    if (!this.player || !this.player.body || !this.player.active) {
      return;
    }

    // Don't move if dialogue is active
    if (this.scene.dialogueActive) {
      this.player.setVelocityX(0);
      this.player.anims.play("stand");
      return;
    }

    // Handle movement
    this.handleMovement();
    
    // Handle jumping
    this.handleJumping();
  }

  handleMovement() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-this.moveSpeed);
      this.player.setFlipX(true);
      this.player.anims.play("right", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(this.moveSpeed);
      this.player.setFlipX(false);
      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("stand");
    }
  }

  handleJumping() {
    if (!this.player.body.touching.down) {
      this.player.anims.play("jump");
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(this.jumpForce);
    }
  }
}

class Level1Controller extends PlayerController {
  constructor(scene, player) {
    super(scene, player);
    this.moveSpeed = 250; // Normal speed for level 1
  }
}

class Level2Controller extends PlayerController {
  constructor(scene, player) {
    super(scene, player);
    this.moveSpeed = 300; // Faster movement for level 2 (cloud jumping)
    this.jumpForce = -300; // Higher jumps for level 2
  }
}

class Level3Controller extends PlayerController {
  constructor(scene, player) {
    super(scene, player);
    this.moveSpeed = 270; // Balanced speed for level 3
    this.jumpForce = -270; // Medium jump height for level 3
  }

  // Custom movement for level 3 (for example, slippery platforms)
  handleMovement() {
    super.handleMovement();
    
    // Add any level-specific movement logic here
    // For example, slow deceleration when stopping
    if (!this.cursors.left.isDown && !this.cursors.right.isDown && this.player.body.velocity.x !== 0) {
      // Apply gradual deceleration
      const deceleration = 10;
      if (Math.abs(this.player.body.velocity.x) < deceleration) {
        this.player.setVelocityX(0);
      } else if (this.player.body.velocity.x > 0) {
        this.player.setVelocityX(this.player.body.velocity.x - deceleration);
      } else {
        this.player.setVelocityX(this.player.body.velocity.x + deceleration);
      }
    }
  }
}

// Factory function to create the right controller for the current level
function createPlayerController(scene, player, level) {
  switch(level) {
    case 1:
      return new Level1Controller(scene, player);
    case 2:
      return new Level2Controller(scene, player);
    case 3:
      return new Level3Controller(scene, player);
    default:
      return new PlayerController(scene, player);
  }
}

// Export the factory function
export { createPlayerController };