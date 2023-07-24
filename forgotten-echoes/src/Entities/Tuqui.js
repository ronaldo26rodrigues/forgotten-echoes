import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import GameObject from "../gamebasics/GameObject";

export default class Tuqui extends GameObject {
    constructor(onLoad=()=>{}, scene) {
        super(onLoad)
        this.scene = scene
        this.mesh

        this.health = 5
        
    }

    start() {
        const loader = new GLTFLoader()
        loader.load("/tuqui.glb", (tuqui)=>{
            tuqui.scene.traverse((child)=>{
                child.name = "tuqui"
                child.obj = this
            })
            this.scene.add(tuqui.scene)
            this.mesh = tuqui.scene
            tuqui.scene.scale.set(0.1, 0.1, 0.1)

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

    update(){

    }
}