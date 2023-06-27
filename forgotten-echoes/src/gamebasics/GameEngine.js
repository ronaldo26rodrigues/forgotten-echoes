let instance;

let start_queue = []
let update_queue = []

class GameEngine {
    constructor() {
        if(instance) {
            throw new Error("Já existe uma instância desta classe")
        }
        instance = this;
        this.update()
    }

    async start(object) {
        object.start()
        update_queue.push(object.update)
    }

    update() {
        requestAnimationFrame(()=>{this.update()})
        update_queue.forEach((e)=>{
            e()
        })
    }
}

let gameEngineInstance = Object.freeze(new GameEngine())

export default gameEngineInstance;