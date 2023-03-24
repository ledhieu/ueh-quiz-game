class QuestionScene extends Phaser.Scene{
    constructor(){
        super('question')
    }

    preload(){

    }
    
    create(){
        setTimeout(() => {
            this.scene.switch('main game')
        }, 2000)
    }

    update(){

    }
}