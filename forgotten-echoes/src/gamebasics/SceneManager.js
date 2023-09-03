import * as THREE from 'three'
import gameEngineInstance from './GameEngine';
import GameScene from './GameScene';
import gameInstance, { Game } from './Game';

let instance

class SceneManager {
    constructor() {
        if(instance) {
            throw new Error("Já existe uma intância desta classe")
        }
        instance = this;

        this.currentScene = new GameScene()
    }

    loadScene(scene) {
        this.currentScene.disposeScene();
        this.currentScene.clear()
        this.currentScene.enabled = false
        // gameEngineInstance.clear()
        gameEngineInstance.getUpdateQueue().forEach((a)=>{
            if(!(a instanceof Game)) delete gameEngineInstance.getUpdateQueue()[gameEngineInstance.getUpdateQueue().indexOf(a)]
        })
        this.currentScene = null

        this.currentScene = new scene()
    }


    disposeScene(scene) {
        console.log(scene);
        scene.traverse((object)=>{
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

let sceneManagerInstance = new SceneManager();
export default sceneManagerInstance;