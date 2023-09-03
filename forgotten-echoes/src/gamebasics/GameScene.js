import * as THREE from 'three'
import gameEngineInstance from './GameEngine'

export default class GameScene extends THREE.Scene {
    constructor() {
        super()
        gameEngineInstance.start(this)
        this.enabled = true
        
    }

    start() {

    }
    update(){

    }
    disposeScene() {
        console.log(this);
        this.traverse((object)=>{
            if(object.geometry) {
                object.geometry.dispose()
            }
            if(object.material) {
                if(object.material.lenght) {
                    for(let i = 0; i < object.material.lenght; i++) {
                        obj.material.dispose()
                    }
                }
            }
        })
        
    }
}