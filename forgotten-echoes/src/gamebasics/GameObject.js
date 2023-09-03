import gameEngine from "./GameEngine";

export default class GameObject {
    constructor(onLoad = ()=>{}){
        console.log("GameObject iniciado");
        gameEngine.start(this)
        this.onLoad = onLoad
        this.enabled = true
        this.mesh
    }
    
    start(){
        
    }

    async update() {

    }

    async destroy(){
        this.mesh.removeFromParent()
        delete this
        delete gameEngine.getUpdateQueue()[gameEngine.getUpdateQueue().indexOf(this)]
    }

    async dispose() {
            console.log(this.mesh.children[0]);
            this.mesh.children[0].material.dispose()
            this.mesh.children[0].geometry.dispose()
            // this.mesh.traverse((object)=>{
            //     console.log(object);
            //     if(object.geometry) {
            //         object.geometry.dispose()
            //     }
            //     if(object.material) {
            //         if(object.material.lenght) {
            //             for(let i = 0; i < object.material.lenght; i++) {
            //                 obj.material.dispose()
            //             }
            //         }
            //     }
            // })
            
        
    }


}