class TinhHuong extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, options){
        const { current, onQuestion } = options
        super(scene, 1000, 1000, `TH${current}`)
        
        
        this.current = current;
        this.onQuestion = onQuestion
        this.asked = false
        this.changedToPass = false;
        this.scene = scene
        
        let { width, height } = this.scene.sys.game.canvas;
        this.gameWidth = width
        this.gameHeight = height

        this.configs = [
            {
                scale: 0.5
            },
            {
                scale: 0.16,
                y: this.gameHeight + 10,
                distance: 550
            },
            {
                scale: 0.35,
                distance: 300, 
            },
            {
                scale: 0.3,
                y: this.gameHeight - 70,
                passY: 510,
                depth: BASE_DEPTH + 1
            },
            {
                scale: 0.5,
                y: this.gameHeight - 70,
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
        this.config = this.configs[this.current - 1]
        this.setPosition(this.config.x ?? x, this.config.y ?? y)

        this.setScale(this.config.scale, this.config.scale)
            .setTint(0xffd6dc)
            .setDepth(this.config.depth ?? BASE_DEPTH - 1)
            .setOrigin(this.config.originX ?? 0, this.config.originY ?? 1)
        this.scene.add.existing(this)
        this.scene.physics.world.enableBody(this)
        this.body.velocity.x = - VELOCITY
        
    }

    update(){
        this.body.velocity.x = - VELOCITY
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