class StartScene extends Phaser.Scene {
    constructor(){
        super('start scene')
        
    }

    preload(){
        this.load.image("background", "assets/start.jpg")
        this.load.image("button", "assets/startbutton.jpg")
    }

    create(){
        let { width, height } = this.sys.game.canvas;
        this.width = width
        this.height = height

        this.background = this.add.image(0, 0, "background")
        this.background.setOrigin(0, 0)

        this.add.text(20, 20, 'loading game')
        this.startButton = this.add.image(this.width / 2, this.height / 2, "button")
        this.startButton.setScale(0.3)
            .setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                this.startButton.setTint(0xdedede)
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                this.startButton.setTint(0xffffff)
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                this.startButton.setTint(0x8afbff)
                this.scene.start('the le')
            })
        this.direction = 0;
    }
    hover(){
        if(this.direction == 1) 
            this.startButton.y += 0.2
        else
            this.startButton.y -= 0.2
    }
    update(){
        if(this.startButton.y < this.height / 2 - 30 || this.startButton.y > this.height / 2 + 30)
            this.direction = !this.direction
        this.hover()
    }
}