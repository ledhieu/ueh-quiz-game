let hearts = 3;
let currentTinhHuong = 1;
const BASE_DEPTH = 10;

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
        for(let i = 1; i <= 5; i++){
            this.load.image(`building${i}`, `assets/building${i}.png`)
        }
        this.load.image('buildings2', 'assets/buildings2.png')
        this.load.image("roadTexture", "assets/roadtexturelongseamless3.png")
        this.load.image("heart", "assets/heart.png")
        for(let i = 1; i <= 5; i++){
            this.load.image(`TH${i}`, `assets/TH${i}.png`)
        }
        for(let i = 1; i <= 5; i++){
            this.load.image(`TH${i}_pass`, `assets/TH${i}_pass.png`)
        }
    }

    create(){
        this.plugin = new Phaser.Scenes.ScenePlugin(this)
        window.phaserPlugin = this.plugin

        let { width, height } = this.sys.game.canvas;
        this.width = width;
        this.height = height;

        this.background = this.add.image(0, 0, "city")
            .setOrigin(0, 0)
            .setDisplaySize(this.width + 100, this.height)
            .setDepth(-100)
        this.physics.world.enableBody(this.background)
        this.background.body.velocity.x = -2

        this.hearts = []
        for(let i = 0; i < 3; i++){
            const heart = this.add.image(this.width - 250 + 70 * i, 50, "heart")
            heart.setDisplaySize(50, 60)
                .setDepth(1000)
            this.hearts.push(heart)
        }

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
        this.goDown();

        
        /**
         * Controls
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

        /**
         * updateList
         */
        this.updateList = this.add.group()
        
        this.createRock()
        // this.createStreetLine()
        this.createRoadTexture(0, this.height)
        this.createRoadTexture(145 * 3 -1, this.height)
        this.createRoadTexture(145 * 6 -2, this.height)
        this.createRoadTexture(145 * 9 -3, this.height)
        this.createBuilding()
        this.createBackgroundBuilding()
        this.createTinhHuong()
        // setInterval(() => {this.createRock()}, 3000)
        // // setInterval(() => {this.createStreetLine()}, 500)
        // setTimeout(() => {
        //     setInterval(() => {
        //         this.createRoadTexture()
        //     }, (145 * 3 - 2)/150 * 1000)
        // }, (145 * 9 - 9 - this.width)/150 )
        // setInterval(() => {this.createBuilding()}, 8000)
        // setInterval(() => {this.createBackgroundBuilding()}, 8000)
        // setInterval(() => {this.createTinhHuong()}, 12000)
        this.time.addEvent({ delay: 3500, callback: () => {this.createRock()}, repeat: -1})
        setTimeout(() => {
            this.time.addEvent({ 
                delay: (145 * 3 - 2)/150 * 1000, 
                callback: () => {this.createRoadTexture()}, repeat: -1
            })
        },(145 * 9 - 9 - this.width)/150)
        this.time.addEvent({ delay: 8000, callback: () => {this.createBuilding()}, repeat: -1})
        this.time.addEvent({ delay: 8000, callback: () => {this.createBackgroundBuilding()}, repeat: -1})
        this.time.addEvent({ delay: 12000, callback: () => {this.createTinhHuong()}, repeat: -1})

    }
    rotateBanhxe(){
        this.banhxe.rotation += 0.05
    }
    
    goUp(){
        this.xe.y = this.height - 280
        this.xe.currentLane = 1 // 1 is top
        this.xe.setDepth(BASE_DEPTH)
    }
    goDown(){
        this.xe.y = this.height - 210
        this.xe.currentLane = 0; // 0 is bottom
        this.xe.setDepth(BASE_DEPTH + 2)
    }
    createRock(){
        /** Generate a number between 0 and 1 */
        const lane =  Math.floor(Math.random() * 2)
        let y = this.height - 30 - 60 * lane
        let rock = new Rock(this, this.width + 150, y, lane)
        
        /** Create over lap detector */
        const overlap = this.physics.add.overlap(this.xe, rock, (_xe, _rock) => {
            /** If collide on the same lane */
            if(_xe.currentLane == _rock.getCurrentLane()){
                overlap.destroy()
                this.flicker([_xe, _rock])
                hearts -= 1;
                const heart = this.hearts.shift()
                this.flicker([heart])
                setTimeout(() => {
                    _rock.destroy()
                    heart.destroy()
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
    createBuilding(x = this.width + 150, y = this.height - 145){
        const randomCostume = Math.floor(Math.random() * 5) + 1
        const building = new Building(this, x, y, {
            costume: randomCostume,
            scale: 0.4,
            speed: -145,
            depth: 0,
            tint: 0xffd6dc
        })
        this.updateList.add(building)
    }
    createBackgroundBuilding(x = this.width + 150, y = this.height - 165){
        const building = new Building(this, x, y, {
            costume: 's2', 
            scale: 0.2, 
            speed: -130,
            depth: -1,
            tint: 0xd3afb2,
            darken: 10
        })
        this.updateList.add(building)
    }
    createTinhHuong(x = this.width + 150, y = this.height - 145){
        const tinhHuong = new TinhHuong(this, x, y, {
            current: currentTinhHuong,
            onQuestion: this.startQuestion.bind(this)
        })
        this.updateList.add(tinhHuong)
    }
    startQuestion(){
        console.log(this)
        window.setCurrentQuestion(currentTinhHuong)
        currentTinhHuong += 1
        this.plugin.pause(this)
    }
    flicker(objects){
        objects.forEach(obj => {
            obj.setTintFill(0xffffff)
            setTimeout(() => {obj.clearTint()}, 50)
    
            setTimeout(() => {obj.setTintFill(0xffffff)}, 100)
            setTimeout(() => {obj.clearTint(false)}, 150)
    
            setTimeout(() => {obj.setTintFill(0xffffff)}, 200)
            setTimeout(() => {obj.clearTint(false)}, 250)

            setTimeout(() => {obj.setTint(0xffdfd9)}, 300)
        })
    }
    update(time, delta){

        /** Update sprites */
        this.updateList.getChildren().forEach(sprite => {
            sprite.update()
        })
    }
}

class StreetLine extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y){
        super(scene, x, y, 'line')

        this.setDisplaySize(50, 5)
        scene.add.existing(this)
        scene.physics.world.enableBody(this)
        this.body.velocity.x = -150
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
        this.body.velocity.x = -150
    }
    update(){
        if(this.x < -1000){
            this.destroy()
        }
    }
}

class Building extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, options){
        const { costume, scale, speed, depth, tint } = options
        super(scene, x, y, `building${costume}`)

        this.setOrigin(0, 1)
            .setDepth(depth)
            .setTint(tint)
            .setScale(scale)

        scene.add.existing(this)
        scene.physics.world.enableBody(this)
        this.body.velocity.x = speed;
    }
    update(){
        if(this.x < -1500){
            this.destroy();
        }
    }
}