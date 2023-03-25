class Manager extends Phaser.Scene{
    constructor(){
        super('manager')
    }
    preload(){

    }
    create(){
        this.scene.start('start scene')
    }
}