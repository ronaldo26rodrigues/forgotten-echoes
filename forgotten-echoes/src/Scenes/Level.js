import { AmbientLight, DirectionalLight, PointLight, Scene, SpotLight } from "three";
import Box from '../Entities/Box';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three'

export default class Level extends Scene {

    constructor() {
        super()
        this.start()
    }

    start() {
        const loader = new GLTFLoader()

        const box = new Box(1, 1, 1)
        const light = new AmbientLight(0x635d44, 1)
        this.add(box.mesh)
        this.add(light)

        const l2 = new DirectionalLight(0xb85d44, .5)
        this.add(l2)
        

        loader.load('/bosque1.glb', (bosque)=>{
            this.add(bosque.scene)
            bosque.scene.receiveShadow = false
            bosque.scene.traverse( child => {

                if ( child.material ) child.material.metalness = 0;
            
            } );
        })
        loader.load('/aranha.glb', (aranha)=>{
            this.add(aranha.scene)
            aranha.scene.receiveShadow = false
            aranha.scene.traverse( child => {
                
                if ( child.material ) child.material.metalness = 0;
                const aranha_light = new THREE.DirectionalLight(0x0033ff, 1)
                // aranha_light.position.set(aranha.scene.position.x, , aranha.scene.position.z)
                // aranha_light.lookAt(aranha.scene.position)
                
                aranha_light.target = aranha.scene
                
                this.add(aranha_light)
            } );
        })

    }

}