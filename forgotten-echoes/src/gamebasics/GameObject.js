import gameEngine from "./GameEngine";

export default class GameObject {
    constructor(){
        console.log("GameObject iniciado");
        gameEngine.start(this)
    }
    
    start(){
        
    }

    update() {

    }
}