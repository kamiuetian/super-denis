const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 600,
        height: 600
    },
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 250 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game;
let gameStarted = false;
let playerState = 'small';
let selectedLevel = 1;

function startGame(level) {
    document.getElementsByClassName('bg')[0].style.display = 'none';

    selectedLevel = level;
    if (!game) {
        game = new Phaser.Game(config);
    }
    gameStarted = true;
}


function preload() {
    if (!gameStarted) return;

    this.load.image('background11', 'assets/Level 1 - Image 1.png');
    this.load.image('background12', 'assets/Level 1 - Image 2.png');
    this.load.image('background13', 'assets/Level 1 - Image 3.png');
    this.load.image('background31', 'assets/Level 3 - Image 1.png');
    this.load.image('background32', 'assets/Level 3 - Image 2.png');
    this.load.image('background33', 'assets/Level 3 - Image 3.png');
    this.load.image('background21', 'assets/Level 2 - Image 1.png');
    this.load.image('background22', 'assets/Level 2 - Image 2.png');
    this.load.image('background23', 'assets/Level 2 - Image 3.png');    
    this.load.image('commerz', 'assets/commerz.png');
    this.load.spritesheet('mario', 'assets/mario-sprite-sheet.png', {frameWidth: 16, frameHeight: 16, spacing: 3});
    this.load.spritesheet('terrain', 'assets/Terrain.png', {frameWidth: 48, frameHeight: 16});
    this.load.spritesheet('clouds', 'assets/misc-sprite-sheet.png', {frameWidth: 20, frameHeight: 18, spacing: 1});
    this.load.image('cloud', 'assets/cloud.png');
    this.load.image('coin', 'assets/coin.png');
    this.load.image('enemy', 'assets/enemy.png');
    this.load.image('kebab', 'assets/kebab.png');
    this.load.image('toad', 'assets/toad.png');
}

function create() {
    if (!gameStarted) return;

    this.endOfGame = false;

    const bgRepeat = 3;
    let background = 'background1'
    if (selectedLevel == 2) background = 'background2';
    else if (selectedLevel == 3) background = 'background3';

    console.log('scale ', this.scale.width, ' ', this.scale.height);

    this.background = this.add.image(300, 300, background + '1').setDisplaySize(600, 600);
    this.add.image(900, 300, background + '2').setDisplaySize(600, 600);
    this.add.image(1500, 300, background + '3').setDisplaySize(600, 600);

    this.physics.world.setBounds(0, 0, bgRepeat * this.scale.width, this.scale.height);


    this.player = this.physics.add.sprite(100, 300, 'mario');
    this.player.setScale(3);
    this.player.setVisible(true);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('mario', {start: 1, end: 3}),
        frameRate: 13,
        repeat: -1,
    });

    this.anims.create({
        key: 'stand',
        frames: [{key: 'mario', frame: 0}],
        frameRate: 13,
    });

    this.anims.create({
        key: 'jump',
        frames: [{key: 'mario', frame: 5}],
        frameRate: 13,
    });

    switch(selectedLevel) {
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

    this.cursors = this.input.keyboard.createCursorKeys();
}

function createLevel1(bgRepeat) {
    // Create groups
    this.platforms = this.physics.add.staticGroup();
    this.coins = this.physics.add.staticGroup();
    this.kebabs = this.physics.add.staticGroup();
    this.enemies = this.physics.add.group({collideWorldBounds: true, bounceX: 1, bounceY: 0});

    const groundHeight = 40;
    ground = this.platforms.create(bgRepeat * this.scale.width / 2, this.scale.height - groundHeight, null);
    //ground.setOrigin(0, this.scale.height - groundHeight);
    ground.setDisplaySize(bgRepeat * this.scale.width, groundHeight);
    ground.setVisible(false);
    ground.refreshBody();

    this.platforms.create(1500, 565, 'terrain', 2).setDisplaySize(600, 50).refreshBody();

    this.coinCount = 0;
    this.coinText = this.add.text(20, 20, 'Coins: 0', {fontSize: '24px', fill: '#ffffff'}).setScrollFactor(0);

    for (let i = 0; i < 10; i++) {
        const x = 200 + 170 * i;
        const y = this.scale.height - 200 - Phaser.Math.Between(0, 100);
        this.platforms.create(x, y, 'terrain', 4).setOrigin(0, 0).setVisible(true).refreshBody();
        this.coins.create(x + 10, y - 40, 'coin').setOrigin(0, 0).setScale(0.03).refreshBody();
        this.enemies.create(x + 200, 400, 'enemy').setScale(0.1).setVelocityX(-100).refreshBody();
    }

    this.kebabCount = 0;
    for (let i = 0; i < 5; i++) {
        const x = 100 + 200 * i + Phaser.Math.Between(0, 100);
        const y = this.scale.height - 150
        this.kebabs.create(x + 10, y - 40, 'kebab').setOrigin(0, 0).setScale(0.1).refreshBody();
    }

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.collider(this.enemies, this.enemies);
    this.physics.add.collider(this.player, this.enemies, hitEnemy, null, this);
    this.physics.add.overlap(this.player, this.coins, collectCoin, null, this);
    this.physics.add.overlap(this.player, this.kebabs, eatKebab, null, this);

    this.cameras.main.setBounds(0, 0, bgRepeat * this.scale.width, this.scale.height);
    this.cameras.main.startFollow(this.player);
}

function createLevel2(bgRepeat) {
    this.platforms = this.physics.add.staticGroup();
    this.endOfSky = this.physics.add.staticGroup();
    this.kebabs = this.physics.add.staticGroup();
    
    let ground = this.endOfSky.create(bgRepeat * this.scale.width / 2, this.scale.height, null);
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
            console.log('Creating cloud at ', x, ' ,', y);
            this.platforms.create(x + j * 55, y, 'cloud').setOrigin(0, 0).setScale(0.15).setVisible(true).refreshBody();
        }
        repeat = Phaser.Math.Between(1, 2);
    }
    console.log('Creating kebab at ', x, ' ,', y);
    this.kebabs.create(x + 10, y - 50, 'kebab').setOrigin(0, 0).setScale(0.1).refreshBody();
    this.platforms.create(80, 100, 'cloud').setOrigin(0, 0).setScale(0.2).setVisible(true).refreshBody();
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.endOfSky, fallDown, null, this);
    this.physics.add.overlap(this.player, this.kebabs, finishLevel2, null, this);

    this.cameras.main.setBounds(0, 0, bgRepeat * this.scale.width, this.scale.height);
    this.cameras.main.startFollow(this.player);
}

function createLevel3(bgRepeat) {
    this.player.setScale(4);
    this.platforms = this.physics.add.staticGroup();
    // this.bank = this.physics.add.staticGroup();
    this.manager = this.physics.add.staticGroup();

    const endOfWindow = this.scale.width * bgRepeat
    const groundHeight = 1;
    ground = this.platforms.create(bgRepeat * this.scale.width / 2, this.scale.height, null);
    ground.setDisplaySize(bgRepeat * this.scale.width, groundHeight);
    ground.setVisible(false);
    ground.refreshBody();

    //const tower = this.bank.create(endOfWindow - 200, this.scale.height - 255 - groundHeight, 'commerz').setScale(0.4).refreshBody();
    // tower.body.setSize(5, 550);
    const npc = this.manager.create(endOfWindow - 350, this.scale.height - 95, 'toad').setOrigin(0, 0).setScale(0.04).refreshBody();
    npc.body.setSize(150, 150);

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.overlap(this.player, this.manager, talkToTheManager, null, this);
    // this.physics.add.overlap(this.player, this.bank, enterTower, null, this);

    this.cameras.main.setBounds(0, 0, bgRepeat * this.scale.width, this.scale.height);
    this.cameras.main.startFollow(this.player);
}

function update() {
    if (!gameStarted || this.endOfGame) return;

    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-250);
        this.player.setFlipX(true);
        this.player.anims.play('right', true);
    }
    else if (this.cursors.right.isDown) {
        this.player.setVelocityX(250);
        this.player.setFlipX(false);
        this.player.anims.play('right', true);
    } else {
        this.player.setVelocityX(0);
        this.player.anims.play('stand');
    }

    if (!this.player.body.touching.down) {
        this.player.anims.play('jump');
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
        this.player.setVelocityY(-250);
    }
}

function collectCoin(player, coin) {
    coin.disableBody(true, true);
    this.coinCount += 1;
    this.coinText.setText('Coins: ' + this.coinCount);

    if (this.coinCount == 10) {
        this.physics.pause();
        gameWin.call(this);
    }
}

function eatKebab(player, kebab) {
    kebab.disableBody(true, true);
    this.kebabCount += 1;

    if (this.kebabCount == 3) {
        playerState = 'big';
        player.setScale(5);
    }
}

function gameWin() {
    this.add.text(this.scale.width / 2, this.scale.height / 2 - 100, 'Level 1 completed', {
        fontSize: '16px',
        fill: '#00ff00',
    }).setScrollFactor(0).setAlign('center').setOrigin(0.5, 0);

    this.time.delayedCall(5000, () => {
        window.location.href = 'video1.html';
    }, [], this);
}

function hitEnemy(player, enemy) {
    if (player.body.touching.down && enemy.body.touching.up) {
        enemy.disableBody(true, true);
        return;
    }


    if (playerState == 'big') {
        player.setScale(3);
        playerState = 'small';
        return;
    } 

    this.physics.pause();
    player.setTint(0xff0000);
    this.add.text(this.scale.width / 2, this.scale.height / 2 - 100, 'Game Over\nKilling applicants is againsts HR rules!\nPlease be mindful', {
        fontSize: '16px',
        fill: '#ff0000',
        backgroundColor: '#000000',
    }).setScrollFactor(0).setAlign('center').setOrigin(0.5, 0);

    this.time.delayedCall(5000, () => {
        this.scene.restart();
    }, [], this);
}

function fallDown(player, sky) {
    console.log('fallDown');
    this.physics.pause();
    player.setTint(0xff0000);
    this.add.text(this.scale.width / 2, this.scale.height / 2 - 100, 'Game Over\nKilling applicants is againsts HR rules!\nPlease be mindful', {
        fontSize: '16px',
        fill: '#ff0000',
    }).setScrollFactor(0).setAlign('center').setOrigin(0.5, 0);

    this.time.delayedCall(5000, () => {
        this.scene.restart();
    }, [], this);
} 

function finishLevel2(player, kebab) {
    kebab.disableBody(true, true);
 
    this.add.text(this.scale.width / 2, this.scale.height / 2 - 100, 'Level 2 completed', {
        fontSize: '16px',
        fill: '#00ff00',
    }).setScrollFactor(0).setAlign('center').setOrigin(0.5, 0);

    this.time.delayedCall(5000, () => {
        window.location.href = 'video2.html';
    }, [], this);
}

function enterTower(player, tower) {
    this.player.setVelocityX(0);
    this.player.anims.play('stand');
    player.disableBody(true, true);
}

function talkToTheManager(player, manager) {
    console.log('Managing collision');
    if (this.endOfGame) return;
    this.endOfGame = true;
    this.player.setVelocityX(0);
    this.player.anims.play('stand');
    manager.body.setSize(1, 1);
    texts = [
        'Congratulations!\n you\'ve reached the Commerzbank tower',
        'You are hired!',
    ];

    this.currentDialogIndex = 0;

    // Display the first dialog text
    this.dialogText = this.add.text(this.scale.width / 2, this.scale.height / 2 - 100, texts[this.currentDialogIndex], {
        fontSize: '16px',
        fill: '#00ff00',
        backgroundColor: '#000000',
        padding: { x: 10, y: 5 }
    }).setScrollFactor(0).setAlign('center').setOrigin(0.5, 0);

    // Set up the timed event to change dialog every 5 seconds
    this.dialogTimer = this.time.addEvent({
        delay: 5000, // 5 seconds
        callback: showNextDialog,
        callbackScope: this,
        loop: true,
        args: [texts, manager]
    });
}

function showNextDialog(texts, manager) {
    console.log('Showing next dialog ...', this.currentDialogIndex);
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
            window.location.href = 'video3.html';
        });
        return;
    }

    // Update the displayed text
    this.dialogText.setText(texts[this.currentDialogIndex]);
}

// Add this resize function to your existing game code
window.addEventListener('resize', resizeGame);

function resizeGame() {
    const gameContainer = document.querySelector('.game-container');
    const canvas = document.querySelector('canvas'); // Or your game element
    
    if (!gameContainer || !canvas) return;
    
    // Get the viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Determine game's aspect ratio
    const gameAspectRatio = canvas.width / canvas.height;
    const viewportAspectRatio = viewportWidth / viewportHeight;
    
    if (viewportAspectRatio > gameAspectRatio) {
        // Viewport is wider than the game
        const newWidth = viewportHeight * gameAspectRatio;
        canvas.style.width = `${newWidth}px`;
        canvas.style.height = `${viewportHeight}px`;
    } else {
        // Viewport is taller than the game
        const newHeight = viewportWidth / gameAspectRatio;
        canvas.style.width = `${viewportWidth}px`;
        canvas.style.height = `${newHeight}px`;
    }
}

// Call once at startup to set initial size
document.addEventListener('DOMContentLoaded', resizeGame);
