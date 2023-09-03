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
        console.log(update_queue);
    }

    

    async update() {
        requestAnimationFrame(async ()=>{this.update()})
        update_queue.forEach(async (e)=>{
            if(e.enabled) await e.update()
        })
    }
    getStartQueue() {
        return start_queue
    }
    
    getUpdateQueue() {
        return update_queue
    }

    clear() {
        start_queue = []
        update_queue = []
    }
}


let gameEngineInstance = Object.freeze(new GameEngine())
export default gameEngineInstance;