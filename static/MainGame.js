const BASE_DEPTH = 10;
const INITIAL_VELOCITY = 180
const MAX_VELOCITY = 600
let VELOCITY = INITIAL_VELOCITY;

class MainGame extends Phaser.Scene{
    constructor(){
        super('main game')
        
    }

    preload(){
        this.load.image("city", "assets/cityskylinelong.png")
        this.load.image("xe", "assets/xe.png")
        this.load.image("banh xe", "assets/banhxe.png")
        this.load.spritesheet('scooter', "assets/scooter_cropped_flipped.png", {
            frameWidth: 505,
            frameHeight: 399,
        })
        this.load.image("line", "assets/streetline.png")
        this.load.image("up", "assets/up.png")
        this.load.image("down", "assets/down.png")
        for(let i = 1; i <= 7; i++){
            this.load.image(`rock${i}`, `assets/rock${i}.png`)
        }
        for(let i = 1; i <= 6; i++){
            this.load.image(`building${i}`, `assets/building${i}.png`)
        }
        this.load.image('buildings2', 'assets/buildings2.png')
        this.load.image("roadTexture", "assets/roadtexturelongseamless3.png")
        this.load.image("heart", "assets/heart.png")
        for(let i = 1; i <= 7; i++){
            this.load.image(`TH${i}`, `assets/TH${i}.png`)
        }
        for(let i = 1; i <= 7; i++){
            this.load.image(`TH${i}_pass`, `assets/TH${i}_pass.png`)
        }
        this.load.image("homeButton", "assets/home.png")
    }

    create(){
        this.plugin = new Phaser.Scenes.ScenePlugin(this)
        window.phaserPlugin = this.plugin //update the global phaserPlugin every scene
        /**
         * Instantiate variables
         */
        this.lives = 3;
        this.currentTinhHuong = 1;
        VELOCITY = INITIAL_VELOCITY // reset velocity

        let { width, height } = this.sys.game.canvas;
        this.width = width;
        this.height = height;

        this.background = this.add.image(0, 0, "city")
            .setOrigin(0, 0)
            .setDisplaySize(this.width + 100, this.height)
            .setDepth(-100)
        // this.physics.world.enableBody(this.background)
        // this.background.body.velocity.x = -1

        /**
         * Add hearts
         */
        this.hearts = []
        for(let i = 0; i < 3; i++){
            const heart = this.add.image(this.width - 250 + 70 * i, 50, "heart")
            heart.setDisplaySize(50, 60)
                .setDepth(1000)
            this.hearts.push(heart)
        }

        /**
         * Add and animate scooter
         */
        this.xe = this.add.sprite(200, height - 200, "scooter")
            .setOrigin(0, 0)
            .setScale(0.45, 0.45)

        this.anims.create({ 
            key: "scooter_anim",
            frames: this.anims.generateFrameNumbers("scooter"),
            frameRate: 6,
            repeat: -1
        })
        this.xe.play("scooter_anim")
            .setTint(0xffdfd9)
        this.physics.world.enableBody(this.xe)
        this.xe.body.width = 150
        this.xe.body.setOffset(120, 0)
        if(window.lane == 0) this.goDown(); else this.goUp();

        
        /**
         * Control buttons
         */
        this.up = this.add.image(width - 100, height - 200, "up")
            .setScale(0.4)
            .setDepth(100)
            .setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                this.up.setTint(0xdedede)
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                this.up.setTint(0xffffff)
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                this.up.setTint(0x8afbff)
                this.goUp()
            })

        this.down = this.add.image(width - 100, height - 100, "down")
            .setScale(0.4)
            .setDepth(100)
            .setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                this.down.setTint(0xdedede)
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                this.down.setTint(0xffffff)
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                this.down.setTint(0x8afbff)
                this.goDown()
            })
        this.homeButton = this.add.image(60, 60, "homeButton")
        this.homeButton.setScale(0.15)
                .setDepth(999)
                .setInteractive()
                .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                    this.homeButton.setTint(0xdedede)
                })
                .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                    this.homeButton.setTint(0xffffff)
                })
                .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                    this.homeButton.setTint(0x8afbff)
                    // this.scene.start('start')
                    window.setHomeScene();
                })
        /**
         * Create updateList
         */
        this.updateList = this.add.group()
        
        /**
         * Create initial instances and loops
         */
        this.createRock()
        for(let i = 0; (145 * 3 - 1) * (i - 1) < this.width; i++){
            this.createRoadTexture((145 * 3 - 1) * i, this.height)
        }
        this.createBuilding()
        this.createBackgroundBuilding()
        // this.createTinhHuong()
        
        this.time.addEvent({ delay: 1000, callback: () => { if(VELOCITY < MAX_VELOCITY) VELOCITY += 7; }, repeat: -1 })
        this.time.addEvent({ delay: 12000, callback: () => { this.createTinhHuong()}, repeat: -1 })

        this.rockTimer = new Timer({
            lapCondition: _timer => { return _timer > 2500 * INITIAL_VELOCITY / VELOCITY},
            callback: () => {this.createRock()}
        })

        this.roadTimer = new Timer({
            /** Lap condition is based on the time the road texture "runs out" */
            lapCondition: _timer => { return _timer > (145 * 3 - 30)/VELOCITY * 1000},
            callback: () => {this.createRoadTexture()}
        })

        this.buildingTimer = new Timer({
            lapCondition: _timer => { return _timer > 6000 * INITIAL_VELOCITY / VELOCITY},
            callback: () => {this.createBuilding()}
        })

        this.backgroundBuildingTimer = new Timer({
            lapCondition: _timer => { return _timer > 4000 * INITIAL_VELOCITY / VELOCITY},
            callback: () => {this.createBackgroundBuilding()}
        })
        
    }
    rotateBanhxe(){
        this.banhxe.rotation += 0.05
    }
    
    goUp(){
        this.xe.y = this.height - 280
        this.xe.currentLane = 1 // 1 is top
        this.xe.setDepth(BASE_DEPTH)
        window.lane = 1;
    }
    goDown(){
        this.xe.y = this.height - 210
        this.xe.currentLane = 0; // 0 is bottom
        this.xe.setDepth(BASE_DEPTH + 2)
        window.lane = 0;
    }
    createRock(){
        /** Generate a number between 0 and 1 */
        const lane =  Math.floor(Math.random() * 2)
        let y = this.height - 30 - 60 * lane
        let rock = new Rock(this, this.width + VELOCITY, y, lane)
        
        /** Create over lap detector */
        const overlap = this.physics.add.overlap(this.xe, rock, (_xe, _rock) => {
            /** If collide on the same lane */
            if(_xe.currentLane == _rock.getCurrentLane()){
                overlap.destroy()
                this.flicker([_xe, _rock])
                this.lives -= 1;
                const heart = this.hearts.shift()
                if(heart)
                    this.flicker([heart])
                setTimeout(() => {
                    _rock.destroy()
                    heart.destroy()
                    if(this.lives == 0){
                        // this.scene.sleep('main game')
                        window.setGameOver()
                    }
                }, 300)
            }
        })

        this.updateList.add(rock)
    }
    createStreetLine(x = this.width + 50, y = this.height - 70){
        const line = new StreetLine(this, x, y)
        this.updateList.add(line)
    }
    createRoadTexture(x = this.width + 50, y = this.height){
        const texture = new RoadTexture(this, x, y)
        this.updateList.add(texture)
    }
    createBuilding(x = this.width + VELOCITY, y = this.height - 145){
        const randomCostume = Math.floor(Math.random() * 5) + 1
        const building = new Building(this, x, y, {
            costume: randomCostume,
            scale: 0.4,
            speedPercentage: 0.97,
            depth: 0,
            tint: 0xffd6dc
        })
        this.updateList.add(building)
    }
    createBackgroundBuilding(x = this.width + VELOCITY, y = this.height - 165){
        const building = new Building(this, x, y, {
            costume: 's2', 
            scale: 0.2, 
            speedPercentage: 0.87,
            depth: -1,
            tint: 0xd3afb2,
            darken: 10
        })
        this.updateList.add(building)
    }
    createTinhHuong(x = this.width + VELOCITY, y = this.height - 145){
        const tinhHuong = new TinhHuong(this, x, y, {
            current: this.currentTinhHuong,
            onQuestion: this.startQuestion.bind(this)
        })
        this.updateList.add(tinhHuong)
    }
    startQuestion(){
        console.log(this)
        window.setCurrentQuestion(this.currentTinhHuong)
        this.currentTinhHuong += 1
        this.scene.pause();
    }
    flicker(objects){
        objects.forEach(obj => {
            obj.setTintFill(0xfdfdfd)
            setTimeout(() => {obj.clearTint()}, 50)
    
            setTimeout(() => {obj.setTintFill(0xfdfdfd)}, 100)
            setTimeout(() => {obj.clearTint(false);}, 150)
    
            setTimeout(() => {obj.setTintFill(0xfdfdfd)}, 200)
            setTimeout(() => {obj.clearTint(false)}, 250)

            setTimeout(() => {obj.setTint(0xffdfd9)}, 300)
        })
    }
    update(time, delta){
        this.rockTimer.update(delta)
        this.roadTimer.update(delta)
        this.buildingTimer.update(delta)
        this.backgroundBuildingTimer.update(delta)
        /** Update sprites */
        this.updateList.getChildren().forEach(sprite => {
            sprite.update()
        })
    }
}

function Timer(options){
    let { lapCondition, callback } = options
    let _timer = 0;
    return {
        update: delta => {
            _timer += delta
            if(lapCondition(_timer)){
                _timer = 0;
                callback();
            }
        }
    }
}

class StreetLine extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y){
        super(scene, x, y, 'line')

        this.setDisplaySize(50, 5)
        scene.add.existing(this)
        scene.physics.world.enableBody(this)
        this.body.velocity.x = -VELOCITY
    }
    update(){
        if(this.x < -100){
            this.destroy()
        }
    }
}

class RoadTexture extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y){
        super(scene, x, y, 'roadTexture')

        this.setDisplaySize(145 * 3, 145)
            .setOrigin(0, 1)
            .setAlpha(1)
            .setDepth(0)
        scene.add.existing(this)
        scene.physics.world.enableBody(this)
        this.body.velocity.x = -VELOCITY
    }
    update(){
        this.body.velocity.x = - VELOCITY
        if(this.x < -1000){
            this.destroy()
        }
    }
}

class Building extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, options){
        const { costume, scale, speedPercentage, depth, tint } = options
        super(scene, x, y, `building${costume}`)

        this.setOrigin(0, 1)
            .setDepth(depth)
            .setTint(tint)
            .setScale(scale)

        scene.add.existing(this)
        scene.physics.world.enableBody(this)
        this.speedPercentage = speedPercentage
        this.body.velocity.x = - VELOCITY * speedPercentage;
    }
    update(){
        this.body.velocity.x = - VELOCITY  * this.speedPercentage
        if(this.x < -1500){
            this.destroy();
        }
    }
}