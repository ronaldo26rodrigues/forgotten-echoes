import * as THREE from 'three'

let instance

class SceneManager {
    constructor() {
        if(instance) {
            throw new Error("Já existe uma intância desta classe")
        }
        instance = this;

        this.currentScene = new THREE.Scene()
    }

    loadScene(scene) {
        this.disposeScene(this.currentScene);
        this.currentScene = scene
    }


    disposeScene(scene) {
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