import gameEngine from "./GameEngine";

export default class GameObject {
    constructor(onLoad = ()=>{}){
        console.log("GameObject iniciado");
        gameEngine.start(this)
        this.onLoad = onLoad
    }
    
    start(){
        
    }

    async update() {

    }
}