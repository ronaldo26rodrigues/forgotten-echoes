import GameObject from "../gamebasics/GameObject";
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

let character, clips, mixer, clock, actionwalk, actionidle

export default class Girl extends GameObject {
    constructor(onLoad=()=>{}) {
        super(onLoad)
        clock = new THREE.Clock()
        const loader = new GLTFLoader()
        
        loader.load('/character.glb', (char)=>{
            character = char.scene
            this.mixer = new THREE.AnimationMixer( character );
            
            // this.add(char.scene)
            char.scene.scale.set(.06,.06,.06)
            char.scene.traverse( child => {
                
                if ( child.material ) child.material.metalness = 0;
                if(child.isMesh) {
                    child.castShadow = true
                }
                
            } );
            clips = char.animations;
            const idle = THREE.AnimationClip.findByName( clips, 'idle' );
            const walk = THREE.AnimationClip.findByName( clips, 'walk' );
            actionidle = this.mixer.clipAction( idle );
            actionwalk = this.mixer.clipAction( walk );
            // action.timeScale = 2
            actionidle.fadeIn(3)
            actionidle.play();
            character.castShadow = true
            // actionwalk.fadeOut(1)
            actionwalk.timeScale = 3
            this.character = character
            
            this.onLoad(this.character)
            this.start()
        })
    }

    start() {
        
    }

    getActionWalk() {
        return actionwalk
    }
    
    getActionIdle() {
        return actionidle
    }

    update() {
        
        const d = clock.getDelta()
        if(this.mixer) this.mixer.update(d)
    }

}