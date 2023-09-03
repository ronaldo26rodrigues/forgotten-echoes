import GameObject from "../gamebasics/GameObject";
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import gameInstance from "../gamebasics/Game";
import loadingInstance from "../gamebasics/Loading";
import Bullet from "./Bullet";

let character, clips, mixer, clock
// let this.canShoot = true
// let this.currentWeapon = 1
// let this.weaponModel=[];

const AttackMode = {
    sword: 1,
    spell: 2    
}

export default class Girl extends GameObject {
    constructor(onLoad=()=>{}, scene, pathfinding) {
        super(onLoad)
        this.scene = scene
        this.pathfinding = pathfinding
        this.rotationMatrix, this.targetQuaternion
        this.atk_target
        this.atk_mode = 0
        this.damage = 5
        this.canShoot = true
        this.currentWeapon = 1
        this.weaponModel=[];
        this.actionwalk
        this.actionidle
        this.currentidle
        this.mao
        this.actionslash
        this.actionSpell
    }

    start() {
        clock = new THREE.Clock()
        const loader = new GLTFLoader(loadingInstance)
        loader.load('/character.glb', (char)=>{
            this.mesh = char.scene
            character = char.scene
            this.mixer = new THREE.AnimationMixer( character );
            
            // const helper = new THREE.SkeletonHelper( character );
            // this.scene.add( helper );
            // this.add(char.scene)
            char.scene.scale.set(.06,.06,.06)
            char.scene.traverse( child => {
                
                if ( child.material ) child.material.metalness = 0;
                if(child.isMesh) {
                    child.castShadow = true
                }
                if(child.name === 'mixamorigRightHandSword') {
                    this.mao = child
                    loader.load('gauntlet_sword.glb', (sword)=>{
                        this.mao.add(sword.scene)
                        this.weaponModel.push(sword.scene)
                    })
                    loader.load('gauntlet_spell.glb', (spell)=>{
                        this.mao.add(spell.scene)
                        spell.scene.visible = false
                        this.weaponModel.push(spell.scene)
                    })
                    const weapon_light = new THREE.PointLight(0x0cfaf6, 0.6, 2)
                    this.mao.add(weapon_light)
                    weapon_light.position.set(0,0,0)
                    
                }
                
            } );
            clips = char.animations;
            console.log(clips);
            const idle = THREE.AnimationClip.findByName( clips, 'idle' );
            const idle2 = THREE.AnimationClip.findByName( clips, 'idle2' );
            
            const idle3 = THREE.AnimationClip.findByName( clips, 'idle3' );
            const idle4 = THREE.AnimationClip.findByName( clips, 'idle4' );
            const slash = THREE.AnimationClip.findByName( clips, 'slash' );
            const spell = THREE.AnimationClip.findByName( clips, 'spell' );
            
            const actionidle1 = this.mixer.clipAction(idle)
            const actionidle2 = this.mixer.clipAction(idle2)
            const actionidle3 = this.mixer.clipAction(idle3)
            const actionidle4 = this.mixer.clipAction(idle4)
            
            this.actionSpell = this.mixer.clipAction(spell)
            this.actionSpell.loop = THREE.LoopOnce
            
            this.actionslash = this.mixer.clipAction(slash)
            this.mixer.addEventListener('loop', (e)=>{
                // console.log(e.action._clip);
                if(e.action._clip.name=='slash') {
                    
                }
            })
            this.mixer.addEventListener('finished', (e)=>{
                console.log(e.action._clip);
                if(e.action._clip.name=='spell') {
                    this.actionidle.reset()
                    this.actionidle.play();
                    this.getActionWalk().reset()
                    this.canShoot=true
                }
            })
            
            // this.actionslash.loop = THREE.LoopOnce
            this.actionslash.timeScale = 1.6

            actionidle1.loop = THREE.LoopOnce
            actionidle2.loop = THREE.LoopOnce
            actionidle3.loop = THREE.LoopOnce
            
            const idleClips = [actionidle1, actionidle2, actionidle3, actionidle4]
            const walk = THREE.AnimationClip.findByName( clips, 'run' );
            this.actionidle = this.mixer.clipAction( idle4 );
            this.actionwalk = this.mixer.clipAction( walk );
            

            this.setRandomTimeOut(()=>{
                if(!this.actionwalk.isRunning()) this.currentidle = this.playRandomAnimation(idleClips)
                
            })
            // action.timeScale = 2
            this.actionidle.fadeIn(3)
            this.actionidle.play();
            character.castShadow = true
            // this.actionwalk.fadeOut(1)
            this.actionwalk.timeScale = 1.2
            this.character = character
            
            this.onLoad(this.character)

            this.rotationMatrix = new THREE.Matrix4()
            this.targetQuaternion = new THREE.Quaternion()
            
        })
        const raycaster = new THREE.Raycaster();
        const mouseClick = new THREE.Vector2()

        window.addEventListener('mousedown', event => {
            this.atk_target = null
            mouseClick.x = (event.clientX / window.innerWidth) * 2 - 1
            mouseClick.y = -(event.clientY / window.innerHeight) * 2 + 1
            this.actionslash.stop()

            
            
            raycaster.setFromCamera(mouseClick, gameInstance.getCamera())
            const found = raycaster.intersectObjects(this.scene.children)
            let target
            console.log(this.scene);
            found.forEach(child => {
                if(child.object.tags && child.object.tags.includes('enemy')) {
                    this.atk_target = child.object
                    console.log(this.atk_target);
                }
            });
            if((!this.navpath || (this.navpath && this.navpath.length == 0)) && (!this.atk_target || this.currentWeapon==AttackMode.sword)){
                this.getActionWalk().reset()
                this.getActionWalk().play()
                this.getActionIdle().fadeOut(0.1)
                if(this.currentidle) this.currentidle.fadeOut(0.4)
            }
            
            if(found.length>0 && !(this.atk_target && this.currentWeapon == AttackMode.spell)) {
                // console.log(found);
                target = found[0].point;
                found.forEach(f => {
                    console.log(f);
                    if(f.object.name=='navmesh_object') target=f.point
                });
                const groupId = this.pathfinding.pathfinding.getGroup(this.pathfinding.ZONE, this.character.position)
                const closest = this.pathfinding.pathfinding.getClosestNode(this.character.position, this.pathfinding.ZONE, groupId)
                this.navpath = this.pathfinding.pathfinding.findPath(closest.centroid, target, this.pathfinding.ZONE, groupId)
            }

            if(this.atk_target && this.currentWeapon == AttackMode.spell && this.canShoot) {
                this.canShoot=false
                this.getActionWalk().stop()
                this.actionSpell.reset()
                this.actionSpell.play()

                const distance = this.atk_target.obj.mesh.position.clone().sub(this.character.position)

                this.rotationMatrix.setPosition(this.character.position)
                const eye = new THREE.Vector3(this.character.position.x+distance.x, this.character.position.y+distance.y, this.character.position.z+distance.z)

                this.rotationMatrix.lookAt(eye, this.character.position, this.character.up)
                this.targetQuaternion.setFromRotationMatrix(this.rotationMatrix)
                this.character.quaternion.rotateTowards(this.targetQuaternion, this.character.quaternion.angleTo(this.targetQuaternion))
                
                setTimeout(()=>{
                    const a = new THREE.Vector3(0,0,0)
                    this.weaponModel[0].getWorldPosition(a)
                    a.y=0
                    const ball = new Bullet(0.02, a, this.atk_target.obj.mesh)
                    console.log(ball.mesh);
                    this.scene.add(ball.mesh)
                    this.atk_target = null
                }, 400)
            }
        })

        window.addEventListener('keypress', event => {
            if(event.key=='z') {
                this.currentWeapon += 1
                if(this.currentWeapon > Object.keys(AttackMode).length) this.currentWeapon = 1
                for (let i = 1; i <= this.weaponModel.length; i++) {
                    const weapon = this.weaponModel[i-1];
                    console.log(this.currentWeapon);
                    if(i==this.currentWeapon) weapon.visible = true; else weapon.visible = false;
                }
            }
        })
    }

    playRandomAnimation(animations) {
        var animation = animations[Math.floor(Math.random()*animations.length)];
        animation.reset()
        animation.play()
        return animation
    }

    setRandomTimeOut(f) {
        var rand = Math.round(Math.random() * (20000)) + 20000;
        setTimeout(()=>{
                f();
                this.setRandomTimeOut(f);  
        }, rand);
    }

    getActionWalk() {
        return this.actionwalk
    }
    
    getActionIdle() {
        return this.actionidle
    }

    
    async move(delta) {
        if(!this.navpath || this.navpath.length <= 0 || (this.atk_target && this.currentWeapon == AttackMode.spell) ) return

        let targetPosition = this.navpath[0]
        const distance = targetPosition.clone().sub(this.character.position)
        let distance_from_atktgt = 999

        if(this.atk_target){    
            distance_from_atktgt = this.atk_target.position.clone().sub(this.character.position)
            console.log(distance_from_atktgt);
        }

        const minDistance = this.atk_target ? 0.7 : 0.025

        if(distance.lengthSq() > minDistance) {
            distance.normalize()
            this.character.position.add(distance.multiplyScalar(delta * 10))

            gameInstance.getCamera().position.x =this.character.position.x+3
            gameInstance.getCamera().position.z = this.character.position.z+3

            this.rotationMatrix.setPosition(this.character.position)
            const eye = new THREE.Vector3(this.character.position.x+distance.x, this.character.position.y+distance.y, this.character.position.z+distance.z)

            this.rotationMatrix.lookAt(eye, this.character.position, this.character.up)
            this.targetQuaternion.setFromRotationMatrix(this.rotationMatrix)
            this.character.quaternion.rotateTowards(this.targetQuaternion, 0.4*this.character.quaternion.angleTo(this.targetQuaternion))

            } else {
                if(this.atk_target){
                    this.actionslash.reset()
                    console.log(this.atk_target);
                    setTimeout(()=>{
                        this.atk_target.obj.action(this)
                        this.atk_target = null
                    }, 500);
                    this.actionslash.play()
                    
                }
                this.navpath.shift()
                if(this.navpath.length==0){ 
                    this.getActionWalk().fadeOut(.1)
                    this.getActionIdle().reset()
                    this.getActionIdle().play()
                }
            }   
    }

    attack() {

    }

    switchWeapon() {

    }

    update() {
        
        const d = clock.getDelta()
        if(this.mixer) this.mixer.update(d)
        this.move(0.01)
        const a = new THREE.Vector3(0,0,0)
        this.mao.getWorldPosition(a)
    }

}