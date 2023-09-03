import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import GameObject from "../gamebasics/GameObject";
import loadingInstance from "../gamebasics/Loading";
import * as THREE from 'three'
import sceneManagerInstance from "../gamebasics/SceneManager";
import Level2 from "../Scenes/Level2";
import Level from "../Scenes/Level";
let pl
let d=0;
export default class Aranha extends GameObject {
    constructor(onLoad=()=>{}, scene) {
        super(onLoad)
        this.scene = scene
        this.mesh

        this.health = 15
        
    }

    start() {
        const loader = new GLTFLoader(loadingInstance)
        loader.load("/aranha.glb", (aranha)=>{
            aranha.scene.traverse((child)=>{
                child.name = "aranha"
                child.tags = ['enemy']
                child.obj = this
            })
            this.scene.add(aranha.scene)
            this.mesh = aranha.scene
            aranha.scene.scale.set(0.1, 0.1, 0.1)

            pl = new THREE.PointLight(0x0000ff, .1, 5)
            aranha.scene.add(pl)
            aranha.scene.scale.set(0.3, 0.3, 0.3)
            aranha.scene.position.set(0, -.5, 0)
            this.onLoad(this)
        })
    }

    takeDamage(amount) {
        this.health -= amount

        if (this.health<=0) {
            this.mesh.traverse((child)=>{
                child.removeFromParent()
            })
        }
    }

    action(obj) {
        document.getElementById('speaker').innerHTML = '???: '
        document.getElementById('dialog_panel').innerHTML = 'Estamos próximos de encontrar uma forma de manter eles energizados por muito tempo. Esta será a maior descoberta da história!'
        setTimeout(() => {
            document.getElementById('speaker').innerHTML = ''
            document.getElementById('dialog_panel').innerHTML = ''
        }, 5000);
        setTimeout(() => {
            sceneManagerInstance.loadScene(Level2)
        }, 8000);
    }

    update(){
        d += 1
        if(pl) pl.intensity += Math.sin(d/10)*0.1
    }
}