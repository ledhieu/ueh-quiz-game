class Rock extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, lane){
        let randomCostume = Math.floor(Math.random() * 7) + 1
        super(scene, x, y, `rock${randomCostume}`)

        this.lane = lane;
        this.collided = false;

        /** Add to scene */
        this.setScale(1)
            .setOrigin(0.5, 1)
            .setDepth(BASE_DEPTH + 2 - lane)
            .setTint(0xfcccce)
        scene.add.existing(this)

        scene.physics.world.enableBody(this)
        this.body.velocity.x = -VELOCITY;
        // this.body.height = 10
        
        // this.body.setOffset(0, this.height)
    }

    getCurrentLane(){
        return this.lane
    }
    update(){
        this.body.velocity.x = - VELOCITY
        if(this.x < -500){
            this.destroy()
        }
    }
}