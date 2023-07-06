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
        update_queue.push(object)
    }

    

    async update() {
        requestAnimationFrame(async ()=>{this.update()})
        update_queue.forEach(async (e)=>{
            if(e.enabled) await e.update()
        })
    }
}

let gameEngineInstance = Object.freeze(new GameEngine())
export default gameEngineInstance;