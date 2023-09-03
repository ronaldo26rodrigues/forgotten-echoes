import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import GameObject from "../gamebasics/GameObject";
import loadingInstance from "../gamebasics/Loading";
import * as THREE from 'three'

export default class Tuqui extends GameObject {
    constructor(onLoad=()=>{}, scene) {
        super(onLoad)
        this.scene = scene
        this.mesh

        this.health = 5
        
    }

    start() {
        const loader = new GLTFLoader(loadingInstance)
        loader.load("/tuqui.glb", (tuqui)=>{
            tuqui.scene.traverse((child)=>{
                child.name = "tuqui"
                child.tags = ['enemy']
                child.obj = this
            })
            this.scene.add(tuqui.scene)
            this.mesh = tuqui.scene
            tuqui.scene.scale.set(0.1, 0.1, 0.1)

            const light = new THREE.PointLight(0x0cfaf6, 0.6, 2)
            light.position.y += 4
            tuqui.scene.add(light)

            this.onLoad(this)
        })
    }

    async takeDamage(amount) {
        this.health -= amount
        this.destroy()
        this.dispose()
    }

    action(obj) {
        this.takeDamage(obj.damage)
    }

    update(){

    }
}