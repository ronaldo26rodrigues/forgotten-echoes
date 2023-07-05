import { AmbientLight, DirectionalLight, PointLight, Scene, SpotLight } from "three";
import Box from '../Entities/Box';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three'
import {Pathfinding, PathfindingHelper} from 'three-pathfinding';
import gameInstance from "../gamebasics/Game";
import gameEngineInstance from "../gamebasics/GameEngine";
import Girl from "../Entities/Girl";

let box, clock, girl, pl, d

let navmesh;
let groupId;
let navpath;

export default class Level extends Scene {

    constructor() {
        super()
        gameEngineInstance.start(this)
        d=0
    }

    start() {
        clock = new THREE.Clock()
        

        const loader = new GLTFLoader()

        box = new Box(1, 1, 1)
        const light = new AmbientLight(0xCCD5FF, 0.2)
        // const light = new AmbientLight(0x635d44, 1)
        // this.add(girl.character)
        this.add(light)

        // const l2 = new DirectionalLight(0xffffff, 1)
        const l2 = new DirectionalLight(0xE1FEA4, 0.5)
        l2.position.set(200, 200, 200)
        this.add(l2)

        
        girl = new Girl((char)=>{this.add(char)})
        
        loader.load('/bosque1.glb', (bosque)=>{
            this.add(bosque.scene)
            bosque.scene.receiveShadow = true
            
            
            bosque.scene.traverse( child => {
                
                if ( child.material ) child.material.metalness = 0;
                if(child.isMesh) {
                    child.castShadow = true
                    child.receiveShadow = true
                }
            } );
        })
        pl = new PointLight(0x0000ff, 10, 5)
        loader.load('/aranha.glb', (aranha)=>{
            aranha.scene.add(pl)
            pl.position.y = 8
            pl.position.x = -3
            this.add(aranha.scene)
            aranha.scene.scale.set(0.3, 0.3, 0.3)
            aranha.scene.position.set(0, -.5, 0)
            // aranha.scene.traverse( child => {

            //     if ( child.material ) child.material.metalness = 0;
                
            // } );
        },undefined,  (error)=>{console.log(error);})

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
            if(!navpath || (navpath && navpath.length == 0)){girl.getActionWalk().reset()
            girl.getActionWalk().play()
            girl.getActionIdle().fadeOut(0.1)}

            raycaster.setFromCamera(mouseClick, gameInstance.getCamera())
            const found = raycaster.intersectObjects(this.children)
            if(found.length>0) {
                let target = found[0].point;
                groupId = pathfinding.getGroup(ZONE, girl.character.position)
                const closest = pathfinding.getClosestNode(girl.character.position, ZONE, groupId)
                navpath = pathfinding.findPath(closest.centroid, target, ZONE, groupId)

                if(navpath) {
                    // pathfindinghelper.reset()
                    // pathfindinghelper.setPlayerPosition(girl.character.position)
                    // pathfindinghelper.setTargetPosition(target)
                    // pathfindinghelper.setPath(navpath)
                }
            }
            // console.log(girl.getActionWalk());
            // console.log(girl.getActionWalk());
        })

    }

    async move(delta) {
        if(!navpath || navpath.length <= 0) return

        let targetPosition = navpath[0]
        const distance = targetPosition.clone().sub(girl.character.position)

        if(distance.lengthSq() > 0.025) {
            distance.normalize()
            girl.character.position.add(distance.multiplyScalar(delta * 8))
            gameInstance.getCamera().position.x =girl.character.position.x+2
            gameInstance.getCamera().position.z= girl.character.position.z+2
            if(girl.getActionWalk().enabled == false) {
                // girl.getActionWalk().reset()
                // girl.getActionWalk().fadeIn(1)
                // console.log(girl.getActionWalk());
            }
            girl.character.lookAt(girl.character.position.x+distance.x, girl.character.position.y+distance.y, girl.character.position.z+distance.z)
            // girl.getActionWalk().play()
            // girl.getActionIdle().pause()

        } else {
            navpath.shift()
            if(navpath.length==0){ 
            girl.getActionWalk().fadeOut(.1)
            girl.getActionIdle().reset()
            girl.getActionIdle().play()
            girl.getActionIdle().warp(0, 1, 8)}
        }
    }

    async update() {
        d += 1
        await this.move(0.01)
        // pl.intensity += Math.sin(d/10)
        pl.intensity -=0.1
        
    }

}