class Manager extends Phaser.Scene{
    constructor(){
        super('manager')
    }
    preload(){

    }
    create(){
        this.plugin = new Phaser.Scenes.ScenePlugin(this)
        window.phaserPlugin = this.plugin //update the global phaserPlugin every scene
        
        window.phaserPlugin.start('start')
    }
}