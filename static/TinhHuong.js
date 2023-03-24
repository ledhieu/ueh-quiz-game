class TinhHuong extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, options){
        const { current, onQuestion } = options
        const config = configs[current - 1]
  
        super(scene, config.x ?? x, config.y ?? y, `TH${current}`)
        
        this.current = current;
        this.onQuestion = onQuestion
        this.config = config;
        this.asked = false
        this.changedToPass = false;

        scene.add.existing(this)
        scene.physics.world.enableBody(this)
        this.body.velocity.x = -150
        this.setScale(config.scale, config.scale)
            .setTint(0xffd6dc)
            .setDepth(this.config.depth ?? BASE_DEPTH - 1)
            .setOrigin(config.originX ?? 0, config.originY ?? 1)
    }

    update(){
        if(this.x < (this.config.distance ?? 500)){
            if(!this.asked){
                this.onQuestion()
                this.asked = true
            } else {
                if(!this.changedToPass){
                    this.passed()
                }
            }
        }
    }

    passed(){
        this.setTexture(`TH${this.current}_pass`)
        this.y = this.config.passY ?? this.y;
        this.setDepth(this.config.passDepth ?? BASE_DEPTH - 1)
        this.changedToPass = true
    }
}

const configs = [
    {
        scale: 0.5
    },
    {
        scale: 0.16,
        y: 642,
        distance: 550
    },
    {
        scale: 0.35,
        distance: 300, 
    },
    {
        scale: 0.3,
        y: 580,
        passY: 510,
        depth: BASE_DEPTH + 1
    },
    {
        scale: 0.5,
        y: 650,
        depth: BASE_DEPTH + 3,
        passDepth: BASE_DEPTH + 3
    },
    {
        scale: 0.5
    },
    {
        scale: 0.5
    }
]