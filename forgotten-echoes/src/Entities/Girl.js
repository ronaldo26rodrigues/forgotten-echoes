import GameObject from "../gamebasics/GameObject";
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import gameInstance from "../gamebasics/Game";

let character, clips, mixer, clock, actionwalk, actionidle

export default class Girl extends GameObject {
    constructor(onLoad=()=>{}, scene, pathfinding) {
        super(onLoad)
        this.scene = scene
        this.pathfinding = pathfinding
    }

    start() {
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
            const walk = THREE.AnimationClip.findByName( clips, 'run' );
            actionidle = this.mixer.clipAction( idle );
            actionwalk = this.mixer.clipAction( walk );
            // action.timeScale = 2
            actionidle.fadeIn(3)
            actionidle.play();
            character.castShadow = true
            // actionwalk.fadeOut(1)
            actionwalk.timeScale = 1.2
            this.character = character
            
            this.onLoad(this.character)
        })
        const raycaster = new THREE.Raycaster();
        const mouseClick = new THREE.Vector2()

        window.addEventListener('mousedown', event => {
            mouseClick.x = (event.clientX / window.innerWidth) * 2 - 1
            mouseClick.y = -(event.clientY / window.innerHeight) * 2 + 1
            if(!this.navpath || (this.navpath && this.navpath.length == 0)){this.getActionWalk().reset()
            this.getActionWalk().play()
            this.getActionIdle().fadeOut(0.1)}

            raycaster.setFromCamera(mouseClick, gameInstance.getCamera())
            const found = raycaster.intersectObjects(this.scene.children)
            if(found.length>0) {
                let target = found[0].point;
                const groupId = this.pathfinding.pathfinding.getGroup(this.pathfinding.ZONE, this.character.position)
                const closest = this.pathfinding.pathfinding.getClosestNode(this.character.position, this.pathfinding.ZONE, groupId)
                this.navpath = this.pathfinding.pathfinding.findPath(closest.centroid, target, this.pathfinding.ZONE, groupId)

                if(this.navpath) {
                    // pathfindinghelper.reset()
                    // pathfindinghelper.setPlayerPosition(girl.character.position)
                    // pathfindinghelper.setTargetPosition(target)
                    // pathfindinghelper.setPath(navpath)
                }
            }
        })
    }

    getActionWalk() {
        return actionwalk
    }
    
    getActionIdle() {
        return actionidle
    }

    async move(delta) {
        if(!this.navpath || this.navpath.length <= 0) return

        let targetPosition = this.navpath[0]
        const distance = targetPosition.clone().sub(this.character.position)

        if(distance.lengthSq() > 0.025) {
            distance.normalize()
            this.character.position.add(distance.multiplyScalar(delta * 8))
            gameInstance.getCamera().position.x =this.character.position.x+2
            gameInstance.getCamera().position.z= this.character.position.z+2
            if(this.getActionWalk().enabled == false) {
                // this.getActionWalk().reset()
                // this.getActionWalk().fadeIn(1)
                // console.log(this.getActionWalk());
            }
            this.character.lookAt(this.character.position.x+distance.x, this.character.position.y+distance.y, this.character.position.z+distance.z)
            // this.getActionWalk().play()
            // this.getActionIdle().pause()

        } else {
            this.navpath.shift()
            if(this.navpath.length==0){ 
            this.getActionWalk().fadeOut(.1)
            this.getActionIdle().reset()
            this.getActionIdle().play()
            this.getActionIdle().warp(0, 1, 8)}
        }
    }

    update() {
        
        const d = clock.getDelta()
        if(this.mixer) this.mixer.update(d)
        this.move(0.01)
    }

}