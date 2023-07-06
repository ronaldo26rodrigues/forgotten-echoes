import gameEngine from "./GameEngine";

export default class GameObject {
    constructor(onLoad = ()=>{}){
        console.log("GameObject iniciado");
        gameEngine.start(this)
        this.onLoad = onLoad
        this.enabled = true
    }
    
    start(){
        
    }

    async update() {

    }
}