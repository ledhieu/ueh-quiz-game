class TheLeScene extends Phaser.Scene {
    constructor(){
        super('the le')
    }
    
    preload(){ 
        this.load.image("thele", "assets/thele.png")    
        this.load.image("skip", "assets/skip.png")
    }

    create(){
        let { width, height } = this.sys.game.canvas;

        this.background = this.add.image(0, 0, "thele")
        this.background.setOrigin(0, 0)

        setTimeout(() => {
            let skip = this.add.image(width / 2, height - 50, "skip")
            skip.setScale(0.3)

            skip.setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                skip.setTint(0xdedede)
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                skip.setTint(0xffffff)
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                skip.setTint(0x8afbff)
                this.scene.start('main game')
            })
        })
    }
}