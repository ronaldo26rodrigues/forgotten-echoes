import { AmbientLight, DirectionalLight, PointLight, Scene, SpotLight } from "three";
import Box from '../Entities/Box';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three'
import {Pathfinding, PathfindingHelper} from 'three-pathfinding';
import gameInstance from "../gamebasics/Game";
import gameEngineInstance from "../gamebasics/GameEngine";

let box, clock, mixer, character, clips

let navmesh;
let groupId;
let navpath;

export default class Level extends Scene {

    constructor() {
        super()
        gameEngineInstance.start(this)
    }

    start() {
        clock = new THREE.Clock()
        

        const loader = new GLTFLoader()

        box = new Box(1, 1, 1)
        // const light = new AmbientLight(0x635d44, 1)
        const light = new AmbientLight(0x635d44, 1)
        // this.add(box.mesh)
        this.add(light)

        const l2 = new DirectionalLight(0xffffff, .5)
        // const l2 = new DirectionalLight(0xb85d44, .5)
        this.add(l2)
        loader.load('/character.glb', (char)=>{
            character = char.scene
            
            mixer = new THREE.AnimationMixer( character );
            this.add(char.scene)
            char.scene.scale.set(.1,.1,.1)
            char.scene.position.y = .15
            char.scene.position.x =1
            char.scene.position.z =-1.5
            char.scene.rotation.y = 1
            char.scene.traverse( child => {
                
                if ( child.material ) child.material.metalness = 0;
                
            } );
            clips = char.animations;
            console.log(char.animations);
            const idle = THREE.AnimationClip.findByName( clips, 'idle' );
            const tpose = THREE.AnimationClip.findByName( clips, 'walk' );
            const actionidle = mixer.clipAction( idle );
            const actiontpose = mixer.clipAction( tpose );
            // action.timeScale = 2
            actiontpose.fadeOut(5)
            actionidle.fadeIn(6)
            actiontpose.play()
            actionidle.play();
        })

        loader.load('/bosque1.glb', (bosque)=>{
            this.add(bosque.scene)
            bosque.scene.receiveShadow = false
            bosque.scene.traverse( child => {

                if ( child.material ) child.material.metalness = 0;
            
            } );
        })
        const pathfinding = new Pathfinding()
        const pathfindinghelper = new PathfindingHelper()
        this.add(pathfindinghelper)
        const ZONE = 'bosque'

        loader.load('/bosque1navmesh.glb', (bosque_navmesh)=>{
            // this.add(bosque_navmesh.scene)
            bosque_navmesh.scene.traverse(node=>{
                if(!navmesh && node.isObject3D && node.children && node.children.length > 0) {
                    navmesh = node.children[0]
                    pathfinding.setZoneData(ZONE, Pathfinding.createZone(navmesh.geometry))
                }
            })
            
        })

        const raycaster = new THREE.Raycaster();
        const mouseClick = new THREE.Vector2()

        window.addEventListener('mousedown', event => {
            mouseClick.x = (event.clientX / window.innerWidth) * 2 - 1
            mouseClick.y = -(event.clientY / window.innerHeight) * 2 + 1

            raycaster.setFromCamera(mouseClick, gameInstance.getCamera())
            const found = raycaster.intersectObjects(this.children)
            if(found.length>0) {
                let target = found[0].point;
                groupId = pathfinding.getGroup(ZONE, box.mesh.position)
                const closest = pathfinding.getClosestNode(box.mesh.position, ZONE, groupId)
                navpath = pathfinding.findPath(closest.centroid, target, ZONE, groupId)

                if(navpath) {
                    // pathfindinghelper.reset()
                    // pathfindinghelper.setPlayerPosition(box.mesh.position)
                    // pathfindinghelper.setTargetPosition(target)
                    // pathfindinghelper.setPath(navpath)
                }
            }
        })

    }

    async move(delta) {
        if(!navpath || navpath.length <= 0) return

        let targetPosition = navpath[0]
        const distance = targetPosition.clone().sub(box.mesh.position)

        if(distance.lengthSq() > 0.025) {
            distance.normalize()
            box.mesh.position.add(distance.multiplyScalar(delta * 4))
            gameInstance.getCamera().position.x = box.mesh.position.x+4
            gameInstance.getCamera().position.z= box.mesh.position.z+4
        } else {
            navpath.shift()
        }
    }

    async update() {
        const d = clock.getDelta()
        await this.move(0.01)
        mixer.update(d)
    }

}