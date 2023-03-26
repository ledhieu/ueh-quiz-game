class GameOver extends Phaser.Scene{
    constructor(){
        super('game over')
        
    }

    preload(){
        this.load.image("citynight", "assets/citynight.png")
        this.load.spritesheet('scooter', "assets/scooter_cropped_flipped.png", {
            frameWidth: 505,
            frameHeight: 399,
        })
        this.load.image("line", "assets/streetline.png")
        for(let i = 1; i <= 6; i++){
            this.load.image(`building${i}`, `assets/building${i}.png`)
        }
        for(let i = 1; i <= 7; i++){
            this.load.image(`rock${i}`, `assets/rock${i}.png`)
        }
        this.load.image('buildings2', 'assets/buildings2.png')
        this.load.image("roadTexture", "assets/roadtexturelongseamless3.png")
        this.load.image("gameOverText", "assets/gameovertext2.png")
        this.load.image("beam", "assets/beam3.png")
        this.load.image("restartButton", "assets/replay.png")
        this.load.image("homeButton", "assets/home.png")
    }

    create(){
        this.plugin = new Phaser.Scenes.ScenePlugin(this)
        window.phaserPlugin = this.plugin //update the global phaserPlugin every scene

        let { width, height } = this.sys.game.canvas;
        this.width = width;
        this.height = height;

        this.background = this.add.image(0, 0, "citynight")
            .setOrigin(0, 0)
            .setDisplaySize(this.width + 100, this.height)
            .setDepth(-100)
        // this.physics.world.enableBody(this.background)
        // this.background.body.velocity.x = -1

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
            .setTint(0x5a4f75)
        this.physics.world.enableBody(this.xe)
        this.xe.body.width = 150
        this.xe.body.setOffset(120, 0)
        

        this.beam = this.add.image(380, this.height - 43, "beam")
        this.beam.setOrigin(0, 1)
            .setScale(0.35, 0.35)
            .setAlpha(0.8)
            .setDepth(10 + 2)
        if(window.lane == 0) this.goDown(); else this.goUp();

        this.replayButton = this.add.image(this.width / 2 - 60, this. height / 2 + 70, "restartButton")
        this.replayButton.setScale(0.25)
            .setDepth(999)
            .setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                this.replayButton.setTint(0xdedede)
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                this.replayButton.setTint(0xffffff)
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                this.replayButton.setTint(0x8afbff)
                this.scene.start('main game')
            })

        this.homeButton = this.add.image(this.width / 2 + 60, this. height / 2 + 70, "homeButton")
        this.homeButton.setScale(0.25)
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
                window.setHomeScene()
            })

        this.gameOverText = this.add.image(this.width / 2, this.height /2 - 50, 'gameOverText')
        this.gameOverText.setScale(0.25)
            .setDepth(10000)

        /**
         * updateList
         */
        this.updateList = this.add.group()
        
        this.createRock()
        for(let i = 0; (145 * 3 - 1) * (i - 1) < this.width; i++){
            this.createRoadTexture((145 * 3 - 1) * i, this.height)
        }
        this.time.addEvent({ delay: 1000, callback: () => { if(VELOCITY < MAX_VELOCITY) VELOCITY += 10;}, repeat: -1 })

        this.rockTimer = new Timer({
            lapCondition: _timer => { return _timer > 8000 * INITIAL_VELOCITY / VELOCITY},
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
    goDown(){
        this.xe.y = this.height - 210
        this.xe.currentLane = 0; // 0 is bottom
        this.xe.setDepth(BASE_DEPTH + 2)
        this.beam.y = this.height - 43
    }
    goUp(){
        this.xe.y = this.height - 280
        this.xe.currentLane = 1 // 1 is top
        this.xe.setDepth(BASE_DEPTH)
        this.beam.y = this.height - 113
    }
    createRock(){
        /** Generate a number between 0 and 1 */
        const lane =  Math.floor(Math.random() * 2)
        let y = this.height - 30 - 60 * lane
        let rock = new Rock(this, this.width + 150, y, lane)
        rock.setTint(0x5a4f75)
        /** Create over lap detector */
        const overlap = this.physics.add.overlap(this.xe, rock, (_xe, _rock) => {
            /** If collide on the same lane */
            if(_xe.currentLane == _rock.getCurrentLane()){
                overlap.destroy()
                this.flicker([_xe, _rock])
                setTimeout(() => {
                    _rock.destroy()
                }, 300)
            }
        })

        this.updateList.add(rock)
    }
    flicker(objects){
        objects.forEach(obj => {
            obj.setTintFill(0xfdfdfd)
            setTimeout(() => {obj.clearTint()}, 50)
    
            setTimeout(() => {obj.setTintFill(0xfdfdfd)}, 100)
            setTimeout(() => {obj.clearTint(false)}, 150)
    
            setTimeout(() => {obj.setTintFill(0xfdfdfd)}, 200)
            setTimeout(() => {obj.clearTint(false);}, 250)

            setTimeout(() => {obj.setTint(0x5a4f75)}, 300)
        })
    }
    createRoadTexture(x = this.width + 50, y = this.height){
        const texture = new RoadTexture(this, x, y)
        texture.setTint(0x1f294d)
        this.updateList.add(texture)
    }
    createBuilding(x = this.width + 150, y = this.height - 145){
        const randomCostume = Math.floor(Math.random() * 5) + 1
        const building = new Building(this, x, y, {
            costume: randomCostume,
            scale: 0.4,
            speedPercentage: 0.97,
            depth: 0,
            tint: 0x1f294d
        })
        console.log('creating building')
        this.updateList.add(building)
    }
    createBackgroundBuilding(x = this.width + 150, y = this.height - 165){
        const building = new Building(this, x, y, {
            costume: 's2', 
            scale: 0.2, 
            speedPercentage: 0.87,
            depth: -1,
            tint: 0x1f294d,
            darken: 10
        })
        this.updateList.add(building)
    }
    update(time, delta){
        this.rockTimer.update(delta)
        this.roadTimer.update(delta)
        // this.buildingTimer.update(delta)
        // this.backgroundBuildingTimer.update(delta)
        /** Update sprites */
        this.updateList.getChildren().forEach(sprite => {
            sprite.update()
        })
    }
}